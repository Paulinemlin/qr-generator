import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu/[slug] - Get public menu
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get("tableId");

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        currency: true,
        stripeOnboarded: true,
        // Theme settings
        menuTheme: true,
        menuFont: true,
        primaryColor: true,
        accentColor: true,
        backgroundColor: true,
        textColor: true,
        showItemImages: true,
        // Ordering mode
        orderingMode: true,
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            items: {
              where: { isAvailable: true },
              orderBy: { sortOrder: "asc" },
              select: {
                id: true,
                name: true,
                description: true,
                priceInCents: true,
                imageUrl: true,
                allergens: true,
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant non trouve" },
        { status: 404 }
      );
    }

    // If tableId is provided, verify it exists
    let table = null;
    if (tableId) {
      table = await prisma.restaurantTable.findFirst({
        where: {
          id: tableId,
          restaurantId: restaurant.id,
        },
        select: {
          id: true,
          tableNumber: true,
        },
      });
    }

    // Check if restaurant can accept payments
    const canAcceptPayments = restaurant.stripeOnboarded;

    return NextResponse.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        description: restaurant.description,
        logoUrl: restaurant.logoUrl,
        currency: restaurant.currency,
        canAcceptPayments,
        // Theme settings
        menuTheme: restaurant.menuTheme,
        menuFont: restaurant.menuFont,
        primaryColor: restaurant.primaryColor,
        accentColor: restaurant.accentColor,
        backgroundColor: restaurant.backgroundColor,
        textColor: restaurant.textColor,
        showItemImages: restaurant.showItemImages,
        // Ordering mode
        orderingMode: restaurant.orderingMode,
      },
      categories: restaurant.categories,
      table,
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
