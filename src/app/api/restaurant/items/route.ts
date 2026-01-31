import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// GET /api/restaurant/items - List all items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const restaurant = await getRestaurant(session.user.id);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant non trouve" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const items = await prisma.menuItem.findMany({
      where: {
        category: {
          restaurantId: restaurant.id,
        },
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: { sortOrder: "asc" },
      include: {
        category: {
          select: { id: true, name: true },
        },
        tags: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/restaurant/items - Create item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const restaurant = await getRestaurant(session.user.id);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant non trouve" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, priceInCents, categoryId, imageUrl, tagIds } = body;

    if (!name || name.trim().length < 1) {
      return NextResponse.json(
        { error: "Le nom du plat est requis" },
        { status: 400 }
      );
    }

    if (priceInCents === undefined || priceInCents < 0) {
      return NextResponse.json(
        { error: "Le prix est requis et doit etre positif" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "La categorie est requise" },
        { status: 400 }
      );
    }

    // Verify category belongs to restaurant
    const category = await prisma.menuCategory.findFirst({
      where: {
        id: categoryId,
        restaurantId: restaurant.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categorie non trouvee" },
        { status: 404 }
      );
    }

    // Get max sortOrder for new item
    const lastItem = await prisma.menuItem.findFirst({
      where: { categoryId },
      orderBy: { sortOrder: "desc" },
    });

    const item = await prisma.menuItem.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        priceInCents: Math.round(priceInCents),
        imageUrl: imageUrl || null,
        sortOrder: (lastItem?.sortOrder ?? -1) + 1,
        categoryId,
        ...(tagIds && Array.isArray(tagIds) && tagIds.length > 0
          ? { tags: { connect: tagIds.map((id: string) => ({ id })) } }
          : {}),
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
        tags: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
