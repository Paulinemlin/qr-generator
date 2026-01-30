import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  const subscriptionId = session.subscription as string;

  if (!userId || !plan) {
    console.error("Missing userId or plan in session metadata");
    return;
  }

  // Get subscription details with items expanded
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data"],
  });

  // Get current_period_end from the first subscription item
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: plan as "FREE" | "PRO" | "BUSINESS",
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "ACTIVE",
      subscriptionEndDate: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
    },
  });

  console.log(`User ${userId} upgraded to ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Try to find user by subscription ID
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!user) {
      console.error("User not found for subscription:", subscription.id);
      return;
    }

    await updateUserSubscription(user.id, subscription);
  } else {
    await updateUserSubscription(userId, subscription);
  }
}

async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription
) {
  const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING"> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    past_due: "PAST_DUE",
    trialing: "TRIALING",
  };

  const status = statusMap[subscription.status] || "ACTIVE";
  const plan = subscription.metadata?.plan as "FREE" | "PRO" | "BUSINESS" | undefined;

  // Get current_period_end from the first subscription item
  const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: status,
      subscriptionEndDate: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      ...(plan && { plan }),
    },
  });

  console.log(`Subscription updated for user ${userId}: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!user) {
    console.error("User not found for deleted subscription:", subscription.id);
    return;
  }

  // Downgrade to free plan
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "FREE",
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      subscriptionEndDate: null,
    },
  });

  console.log(`User ${user.id} downgraded to FREE plan`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error("User not found for customer:", customerId);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "PAST_DUE",
    },
  });

  console.log(`Payment failed for user ${user.id}`);
}
