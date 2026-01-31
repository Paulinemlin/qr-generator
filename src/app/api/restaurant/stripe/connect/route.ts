import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

// POST /api/restaurant/stripe/connect - Start Stripe Connect onboarding
export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant non trouve" },
        { status: 404 }
      );
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    let accountId = restaurant.stripeAccountId;

    // Create Stripe Connect account if not exists
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "FR",
        email: session.user.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          restaurantId: restaurant.id,
          userId: session.user.id,
        },
      });

      accountId = account.id;

      // Save account ID to restaurant
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { stripeAccountId: accountId },
      });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/restaurant/settings?stripe=refresh`,
      return_url: `${baseUrl}/restaurant/settings?stripe=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion Stripe" },
      { status: 500 }
    );
  }
}
