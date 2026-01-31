import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_CONNECT_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        // Find restaurant by Stripe account ID
        const restaurant = await prisma.restaurant.findFirst({
          where: { stripeAccountId: account.id },
        });

        if (restaurant) {
          const isOnboarded =
            account.details_submitted &&
            account.charges_enabled &&
            account.payouts_enabled;

          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: { stripeOnboarded: isOnboarded },
          });

          console.log(
            `Restaurant ${restaurant.id} Stripe status updated: onboarded=${isOnboarded}`
          );
        }
        break;
      }

      case "account.application.deauthorized": {
        const application = event.data.object as { id: string; account?: string };
        const accountId = application.account || application.id;

        // Restaurant disconnected their Stripe account
        const restaurant = await prisma.restaurant.findFirst({
          where: { stripeAccountId: accountId },
        });

        if (restaurant) {
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
              stripeAccountId: null,
              stripeOnboarded: false,
            },
          });

          console.log(
            `Restaurant ${restaurant.id} disconnected Stripe account`
          );
        }
        break;
      }

      default:
        console.log(`Unhandled Connect event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
