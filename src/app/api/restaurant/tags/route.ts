import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

// Couleurs predefinies pour les tags
const TAG_COLORS = [
  "#ef4444", // rouge
  "#f97316", // orange
  "#eab308", // jaune
  "#22c55e", // vert
  "#14b8a6", // teal
  "#3b82f6", // bleu
  "#8b5cf6", // violet
  "#ec4899", // rose
  "#6366f1", // indigo
  "#64748b", // gris
];

// GET /api/restaurant/tags - List tags
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

    const tags = await prisma.menuTag.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({ tags, colors: TAG_COLORS });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/restaurant/tags - Create tag
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
    const { name, color } = body;

    if (!name || name.trim().length < 1) {
      return NextResponse.json(
        { error: "Le nom du tag est requis" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existing = await prisma.menuTag.findFirst({
      where: {
        restaurantId: restaurant.id,
        name: { equals: name.trim(), mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ce tag existe deja", tag: existing },
        { status: 409 }
      );
    }

    // Select random color if not provided
    const tagColor = color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

    const tag = await prisma.menuTag.create({
      data: {
        name: name.trim(),
        color: tagColor,
        restaurantId: restaurant.id,
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/restaurant/tags/batch - Create multiple tags at once
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
    const { names } = body;

    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json(
        { error: "Liste de noms requise" },
        { status: 400 }
      );
    }

    // Filter unique names
    const uniqueNames = [...new Set(names.map((n: string) => n.trim().toLowerCase()))];

    // Get existing tags
    const existingTags = await prisma.menuTag.findMany({
      where: {
        restaurantId: restaurant.id,
        name: { in: uniqueNames, mode: "insensitive" },
      },
    });

    const existingNames = new Set(existingTags.map(t => t.name.toLowerCase()));

    // Create new tags only
    const newNames = uniqueNames.filter(n => !existingNames.has(n));

    if (newNames.length > 0) {
      await prisma.menuTag.createMany({
        data: newNames.map((name, i) => ({
          name,
          color: TAG_COLORS[i % TAG_COLORS.length],
          restaurantId: restaurant.id,
        })),
        skipDuplicates: true,
      });
    }

    // Fetch all tags
    const allTags = await prisma.menuTag.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({
      tags: allTags,
      created: newNames.length,
      existing: existingTags.length,
    });
  } catch (error) {
    console.error("Error batch creating tags:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
