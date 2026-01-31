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

  const webhookSecret = process.env.STRIPE_ORDERS_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_ORDERS_WEBHOOK_SECRET is not set");
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
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Find order by PaymentIntent ID
        const order = await prisma.order.findUnique({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              stripePaymentStatus: "succeeded",
              paidAt: new Date(),
            },
          });

          console.log(`Order ${order.orderNumber} marked as PAID`);
        } else {
          console.warn(
            `No order found for PaymentIntent ${paymentIntent.id}`
          );
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const order = await prisma.order.findUnique({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              stripePaymentStatus: "failed",
            },
          });

          console.log(`Order ${order.orderNumber} payment failed`);
        }
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const order = await prisma.order.findUnique({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (order && order.status === "PENDING") {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "CANCELLED",
              stripePaymentStatus: "canceled",
            },
          });

          console.log(`Order ${order.orderNumber} cancelled`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
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
