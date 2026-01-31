import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import { generateQRCodeDataURL } from "@/lib/qr-generator";
import { getBaseUrl } from "@/lib/url";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// GET /api/restaurant/tables - List tables
export async function GET() {
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

    const tables = await prisma.restaurantTable.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { tableNumber: "asc" },
      include: {
        qrcode: {
          select: {
            id: true,
            qrImageUrl: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    return NextResponse.json({ tables });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/restaurant/tables - Create table with auto-generated QR
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
    const { tableNumber } = body;

    if (!tableNumber || tableNumber.trim().length < 1) {
      return NextResponse.json(
        { error: "Le numero de table est requis" },
        { status: 400 }
      );
    }

    // Check if table number already exists
    const existingTable = await prisma.restaurantTable.findFirst({
      where: {
        restaurantId: restaurant.id,
        tableNumber: tableNumber.trim(),
      },
    });

    if (existingTable) {
      return NextResponse.json(
        { error: "Ce numero de table existe deja" },
        { status: 400 }
      );
    }

    // Generate the menu URL for this table
    const baseUrl = getBaseUrl();

    // Create table first (to get the ID)
    const table = await prisma.restaurantTable.create({
      data: {
        tableNumber: tableNumber.trim(),
        restaurantId: restaurant.id,
      },
    });

    // Generate QR code URL pointing to menu with table context
    const menuUrl = `${baseUrl}/m/${restaurant.slug}/table/${table.id}`;

    // Generate QR code image
    const qrImageUrl = await generateQRCodeDataURL({
      url: menuUrl,
      size: 400,
      margin: 2,
    });

    // Create QR code record
    const qrcode = await prisma.qRCode.create({
      data: {
        name: `Table ${tableNumber.trim()} - ${restaurant.name}`,
        type: "table",
        targetUrl: menuUrl,
        qrImageUrl,
        userId: session.user.id,
      },
    });

    // Link QR code to table
    const updatedTable = await prisma.restaurantTable.update({
      where: { id: table.id },
      data: { qrcodeId: qrcode.id },
      include: {
        qrcode: {
          select: {
            id: true,
            qrImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ table: updatedTable }, { status: 201 });
  } catch (error) {
    console.error("Error creating table:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur", details: message },
      { status: 500 }
    );
  }
}

// POST /api/restaurant/tables/bulk - Create multiple tables
export async function PUT(request: NextRequest) {
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
    const { count, prefix = "" } = body;

    if (!count || count < 1 || count > 50) {
      return NextResponse.json(
        { error: "Le nombre de tables doit etre entre 1 et 50" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();
    const tables = [];

    for (let i = 1; i <= count; i++) {
      const tableNumber = prefix ? `${prefix}${i}` : String(i);

      // Check if table number already exists
      const existingTable = await prisma.restaurantTable.findFirst({
        where: {
          restaurantId: restaurant.id,
          tableNumber,
        },
      });

      if (existingTable) {
        continue; // Skip existing tables
      }

      // Create table
      const table = await prisma.restaurantTable.create({
        data: {
          tableNumber,
          restaurantId: restaurant.id,
        },
      });

      // Generate QR code
      const menuUrl = `${baseUrl}/m/${restaurant.slug}/table/${table.id}`;
      const qrImageUrl = await generateQRCodeDataURL({
        url: menuUrl,
        size: 400,
        margin: 2,
      });

      // Create QR code record
      const qrcode = await prisma.qRCode.create({
        data: {
          name: `Table ${tableNumber} - ${restaurant.name}`,
          type: "table",
          targetUrl: menuUrl,
          qrImageUrl,
          userId: session.user.id,
        },
      });

      // Link QR code to table
      const updatedTable = await prisma.restaurantTable.update({
        where: { id: table.id },
        data: { qrcodeId: qrcode.id },
        include: {
          qrcode: {
            select: { id: true, qrImageUrl: true },
          },
        },
      });

      tables.push(updatedTable);
    }

    return NextResponse.json({ tables, created: tables.length });
  } catch (error) {
    console.error("Error creating tables:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
