import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// PUT /api/restaurant/tags/[id] - Update tag
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
    const { name, color } = body;

    // Verify tag belongs to restaurant
    const tag = await prisma.menuTag.findFirst({
      where: { id, restaurantId: restaurant.id },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag non trouve" }, { status: 404 });
    }

    // Check for duplicate name
    if (name && name.trim() !== tag.name) {
      const existing = await prisma.menuTag.findFirst({
        where: {
          restaurantId: restaurant.id,
          name: { equals: name.trim(), mode: "insensitive" },
          id: { not: id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Un tag avec ce nom existe deja" },
          { status: 409 }
        );
      }
    }

    const updatedTag = await prisma.menuTag.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(color && { color }),
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({ tag: updatedTag });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/restaurant/tags/[id] - Delete tag
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

    // Verify tag belongs to restaurant
    const tag = await prisma.menuTag.findFirst({
      where: { id, restaurantId: restaurant.id },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag non trouve" }, { status: 404 });
    }

    await prisma.menuTag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
