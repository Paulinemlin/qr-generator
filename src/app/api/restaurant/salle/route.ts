import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Table status derived from orders
type TableStatus = "LIBRE" | "COMMANDE_EN_COURS" | "PAYE";

interface TableWithStatus {
  id: string;
  tableNumber: string;
  status: TableStatus;
  totalItems: number;
  recentItems: { name: string; quantity: number }[];
  lastOrderTime: string | null;
  activeOrderId: string | null;
}

// GET /api/restaurant/salle - Get all tables with their current status
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // Get restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant non trouve" },
        { status: 404 }
      );
    }

    // Get all tables with their recent orders
    const tables = await prisma.restaurantTable.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { tableNumber: "asc" },
      include: {
        orders: {
          where: {
            // Only orders from today or still active
            OR: [
              { status: { in: ["PENDING", "PREPARING", "READY"] } },
              {
                status: "PAID",
                paidAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // Paid in last 2 hours
              },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 1, // Get most recent relevant order
          include: {
            items: {
              orderBy: { id: "desc" },
              include: {
                menuItem: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    // Transform to response format
    const tablesWithStatus: TableWithStatus[] = tables.map((table) => {
      const activeOrder = table.orders[0] || null;

      // Determine status
      let status: TableStatus = "LIBRE";
      if (activeOrder) {
        if (activeOrder.status === "PAID") {
          status = "PAYE";
        } else if (["PENDING", "PREPARING", "READY"].includes(activeOrder.status)) {
          status = "COMMANDE_EN_COURS";
        }
      }

      // Calculate total items and get recent items
      let totalItems = 0;
      const recentItems: { name: string; quantity: number }[] = [];

      if (activeOrder) {
        activeOrder.items.forEach((item) => {
          totalItems += item.quantity;
        });

        // Get 3 most recent items
        activeOrder.items.slice(0, 3).forEach((item) => {
          recentItems.push({
            name: item.menuItem.name,
            quantity: item.quantity,
          });
        });
      }

      return {
        id: table.id,
        tableNumber: table.tableNumber,
        status,
        totalItems,
        recentItems,
        lastOrderTime: activeOrder?.createdAt.toISOString() || null,
        activeOrderId: activeOrder?.id || null,
      };
    });

    // Stats summary
    const stats = {
      total: tablesWithStatus.length,
      libre: tablesWithStatus.filter((t) => t.status === "LIBRE").length,
      enCours: tablesWithStatus.filter((t) => t.status === "COMMANDE_EN_COURS").length,
      paye: tablesWithStatus.filter((t) => t.status === "PAYE").length,
    };

    return NextResponse.json({
      tables: tablesWithStatus,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching salle data:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
