import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkCanUseAPI } from "@/lib/plan-limits";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/keys - List all API keys for the authenticated user
 */
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Check if user has API access
  const canUseApi = await checkCanUseAPI(session.user.id);
  if (!canUseApi.allowed) {
    return NextResponse.json({ error: canUseApi.error }, { status: 403 });
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      lastUsedAt: true,
      expiresAt: true,
      // Note: we don't return the hashed key for security
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ apiKeys });
}

/**
 * POST /api/keys - Create a new API key
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Check if user has API access
  const canUseApi = await checkCanUseAPI(session.user.id);
  if (!canUseApi.allowed) {
    return NextResponse.json({ error: canUseApi.error }, { status: 403 });
  }

  try {
    const { name, expiresAt } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom de la clé est requis" },
        { status: 400 }
      );
    }

    // Limit number of API keys per user
    const existingKeysCount = await prisma.apiKey.count({
      where: { userId: session.user.id },
    });

    if (existingKeysCount >= 10) {
      return NextResponse.json(
        { error: "Vous avez atteint la limite de 10 clés API" },
        { status: 400 }
      );
    }

    // Generate a new API key
    const { key } = generateApiKey();
    const hashedKey = hashApiKey(key);

    // Parse expiration date if provided
    let expirationDate: Date | null = null;
    if (expiresAt) {
      expirationDate = new Date(expiresAt);
      if (isNaN(expirationDate.getTime())) {
        return NextResponse.json(
          { error: "Date d'expiration invalide" },
          { status: 400 }
        );
      }
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        key: hashedKey,
        name: name.trim(),
        userId: session.user.id,
        expiresAt: expirationDate,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    // Return the unhashed key only on creation
    // This is the only time the user can see the full key
    return NextResponse.json({
      ...apiKey,
      key, // Include the plain key only on creation
      message: "Conservez cette clé en lieu sûr. Elle ne sera plus affichée.",
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la clé API" },
      { status: 500 }
    );
  }
}
