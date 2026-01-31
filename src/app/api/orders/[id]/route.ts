import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders/[id] - Get order status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            name: true,
            slug: true,
          },
        },
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

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalInCents: order.totalInCents,
        notes: order.notes,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
        restaurant: order.restaurant,
        table: order.table,
        items: order.items.map((item) => ({
          name: item.menuItem.name,
          imageUrl: item.menuItem.imageUrl,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.unitPrice * item.quantity,
          notes: item.notes,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
