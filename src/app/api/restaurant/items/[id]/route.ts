import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// PUT /api/restaurant/items/[id] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { name, description, priceInCents, imageUrl, isAvailable, categoryId, tagIds, allergens } = body;

    // Verify item belongs to restaurant
    const item = await prisma.menuItem.findFirst({
      where: {
        id,
        category: {
          restaurantId: restaurant.id,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Plat non trouve" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (name.trim().length < 1) {
        return NextResponse.json(
          { error: "Le nom du plat est requis" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (priceInCents !== undefined) {
      if (priceInCents < 0) {
        return NextResponse.json(
          { error: "Le prix doit etre positif" },
          { status: 400 }
        );
      }
      updateData.priceInCents = Math.round(priceInCents);
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl || null;
    }

    if (isAvailable !== undefined) {
      updateData.isAvailable = Boolean(isAvailable);
    }

    if (categoryId !== undefined) {
      // Verify new category belongs to restaurant
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
      updateData.categoryId = categoryId;
    }

    // Handle allergens
    if (allergens !== undefined && Array.isArray(allergens)) {
      updateData.allergens = allergens;
    }

    // Handle tag updates
    if (tagIds !== undefined && Array.isArray(tagIds)) {
      updateData.tags = {
        set: tagIds.map((tagId: string) => ({ id: tagId })),
      };
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true },
        },
        tags: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/restaurant/items/[id] - Toggle availability
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify item belongs to restaurant
    const item = await prisma.menuItem.findFirst({
      where: {
        id,
        category: {
          restaurantId: restaurant.id,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Plat non trouve" },
        { status: 404 }
      );
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item.isAvailable },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("Error toggling item availability:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/restaurant/items/[id] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify item belongs to restaurant
    const item = await prisma.menuItem.findFirst({
      where: {
        id,
        category: {
          restaurantId: restaurant.id,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Plat non trouve" },
        { status: 404 }
      );
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
