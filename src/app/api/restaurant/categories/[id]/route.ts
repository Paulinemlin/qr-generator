import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// PUT /api/restaurant/categories/[id] - Update category
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
    const { name, description, isActive } = body;

    // Verify category belongs to restaurant
    const category = await prisma.menuCategory.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categorie non trouvee" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (name.trim().length < 1) {
        return NextResponse.json(
          { error: "Le nom de la categorie est requis" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const updated = await prisma.menuCategory.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/restaurant/categories/[id] - Delete category
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

    // Verify category belongs to restaurant
    const category = await prisma.menuCategory.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categorie non trouvee" },
        { status: 404 }
      );
    }

    // Delete category (items will cascade delete)
    await prisma.menuCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
