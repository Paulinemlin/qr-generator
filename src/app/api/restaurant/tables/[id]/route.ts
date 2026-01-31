import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// GET /api/restaurant/tables/[id] - Get single table
export async function GET(
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

    const table = await prisma.restaurantTable.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
      include: {
        qrcode: {
          select: {
            id: true,
            qrImageUrl: true,
            targetUrl: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table non trouvee" },
        { status: 404 }
      );
    }

    return NextResponse.json({ table });
  } catch (error) {
    console.error("Error fetching table:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/restaurant/tables/[id] - Update table number
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
    const { tableNumber } = body;

    // Verify table belongs to restaurant
    const table = await prisma.restaurantTable.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table non trouvee" },
        { status: 404 }
      );
    }

    if (tableNumber !== undefined) {
      if (!tableNumber || tableNumber.trim().length < 1) {
        return NextResponse.json(
          { error: "Le numero de table est requis" },
          { status: 400 }
        );
      }

      // Check if new table number already exists
      const existingTable = await prisma.restaurantTable.findFirst({
        where: {
          restaurantId: restaurant.id,
          tableNumber: tableNumber.trim(),
          NOT: { id },
        },
      });

      if (existingTable) {
        return NextResponse.json(
          { error: "Ce numero de table existe deja" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.restaurantTable.update({
      where: { id },
      data: {
        tableNumber: tableNumber?.trim() || table.tableNumber,
      },
      include: {
        qrcode: {
          select: { id: true, qrImageUrl: true },
        },
      },
    });

    // Update QR code name
    if (updated.qrcodeId) {
      await prisma.qRCode.update({
        where: { id: updated.qrcodeId },
        data: {
          name: `Table ${updated.tableNumber} - ${restaurant.name}`,
        },
      });
    }

    return NextResponse.json({ table: updated });
  } catch (error) {
    console.error("Error updating table:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/restaurant/tables/[id] - Delete table
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

    // Verify table belongs to restaurant
    const table = await prisma.restaurantTable.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table non trouvee" },
        { status: 404 }
      );
    }

    // Delete associated QR code first
    if (table.qrcodeId) {
      await prisma.qRCode.delete({
        where: { id: table.qrcodeId },
      });
    }

    // Delete table
    await prisma.restaurantTable.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting table:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
