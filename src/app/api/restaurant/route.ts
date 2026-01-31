import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/restaurant - Get current user's restaurant
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
      include: {
        categories: {
          orderBy: { sortOrder: "asc" },
          include: {
            items: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
        tables: {
          orderBy: { tableNumber: "asc" },
        },
        _count: {
          select: {
            orders: true,
            tables: true,
            categories: true,
          },
        },
      },
    });

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/restaurant - Create restaurant
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // Check if user already has a restaurant
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    });

    if (existingRestaurant) {
      return NextResponse.json(
        { error: "Vous avez deja un restaurant" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, currency } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Le nom du restaurant est requis (min 2 caracteres)" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(name);
    let slugSuffix = 0;
    let slugExists = true;

    while (slugExists) {
      const checkSlug = slugSuffix === 0 ? slug : `${slug}-${slugSuffix}`;
      const existing = await prisma.restaurant.findUnique({
        where: { slug: checkSlug },
      });
      if (!existing) {
        slug = checkSlug;
        slugExists = false;
      } else {
        slugSuffix++;
      }
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        currency: currency || "EUR",
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur", details: message },
      { status: 500 }
    );
  }
}

// PUT /api/restaurant - Update restaurant
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant non trouve" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      currency,
      logoUrl,
      menuTheme,
      menuFont,
      primaryColor,
      accentColor,
      backgroundColor,
      textColor,
      showItemImages,
      orderingMode,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return NextResponse.json(
          { error: "Le nom doit contenir au moins 2 caracteres" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (currency !== undefined) {
      updateData.currency = currency;
    }

    if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl || null;
    }

    // Theme settings
    if (menuTheme !== undefined) {
      updateData.menuTheme = menuTheme;
    }

    if (menuFont !== undefined) {
      updateData.menuFont = menuFont;
    }

    if (primaryColor !== undefined) {
      updateData.primaryColor = primaryColor;
    }

    if (accentColor !== undefined) {
      updateData.accentColor = accentColor;
    }

    if (backgroundColor !== undefined) {
      updateData.backgroundColor = backgroundColor;
    }

    if (textColor !== undefined) {
      updateData.textColor = textColor;
    }

    if (showItemImages !== undefined) {
      updateData.showItemImages = showItemImages;
    }

    // Ordering mode
    if (orderingMode !== undefined) {
      updateData.orderingMode = orderingMode;
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: updateData,
    });

    return NextResponse.json({ restaurant: updated });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
