import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

// GET /api/restaurant/stripe/status - Check Stripe account status
export async function GET() {
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

    if (!restaurant.stripeAccountId) {
      return NextResponse.json({
        connected: false,
        onboarded: false,
        canReceivePayments: false,
      });
    }

    const stripe = getStripe();

    try {
      const account = await stripe.accounts.retrieve(restaurant.stripeAccountId);

      const isOnboarded =
        account.details_submitted &&
        account.charges_enabled &&
        account.payouts_enabled;

      // Update restaurant if onboarding status changed
      if (isOnboarded !== restaurant.stripeOnboarded) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { stripeOnboarded: isOnboarded },
        });
      }

      return NextResponse.json({
        connected: true,
        onboarded: isOnboarded,
        canReceivePayments: account.charges_enabled,
        canReceivePayouts: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
        requirements: account.requirements,
      });
    } catch {
      // Account may have been deleted or is invalid
      return NextResponse.json({
        connected: false,
        onboarded: false,
        canReceivePayments: false,
        error: "Compte Stripe invalide",
      });
    }
  } catch (error) {
    console.error("Error checking Stripe status:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
