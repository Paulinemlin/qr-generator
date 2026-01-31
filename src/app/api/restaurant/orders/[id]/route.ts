import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// GET /api/restaurant/orders/[id] - Get single order
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

    const order = await prisma.order.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
      include: {
        table: {
          select: {
            tableNumber: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvee" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/restaurant/orders/[id] - Update order status
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
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses: OrderStatus[] = [
      "PAID",
      "PREPARING",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Verify order belongs to restaurant
    const order = await prisma.order.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvee" },
        { status: 404 }
      );
    }

    // Validate status transition
    const invalidTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [], // Can go to any status
      PAID: ["PENDING"], // Can't go back to pending
      PREPARING: ["PENDING", "PAID"], // Can't go back
      READY: ["PENDING", "PAID", "PREPARING"], // Can't go back
      COMPLETED: ["PENDING", "PAID", "PREPARING", "READY"], // Terminal state
      CANCELLED: ["PENDING", "PAID", "PREPARING", "READY", "COMPLETED"], // Terminal state
    };

    if (invalidTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        { error: "Transition de statut invalide" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        table: {
          select: { tableNumber: true },
        },
      },
    });

    return NextResponse.json({
      order: {
        id: updated.id,
        orderNumber: updated.orderNumber,
        status: updated.status,
        tableNumber: updated.table.tableNumber,
      },
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
