import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET /api/links/[id] - Obtenir les details d'un lien
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const link = await prisma.shortLink.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      clicks: {
        orderBy: { clickedAt: "desc" },
        take: 50,
      },
      _count: {
        select: { clicks: true },
      },
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Lien non trouve" }, { status: 404 });
  }

  // Construire l'URL courte
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const shortUrl = `${baseUrl}/l/${link.shortCode}`;

  return NextResponse.json({
    ...link,
    shortUrl,
  });
}

// PATCH /api/links/[id] - Mettre a jour un lien
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier que le lien appartient a l'utilisateur
  const existingLink = await prisma.shortLink.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existingLink) {
    return NextResponse.json({ error: "Lien non trouve" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const {
      title,
      targetUrl,
      isActive,
      expiresAt,
      maxClicks,
      isPasswordProtected,
      password,
      removePassword,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Recuperer le plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    const plan = user?.plan || "FREE";
    const canUseAdvanced = plan === "PRO" || plan === "BUSINESS";

    // Preparer les donnees de mise a jour
    const updateData: {
      title?: string | null;
      targetUrl?: string;
      isActive?: boolean;
      expiresAt?: Date | null;
      maxClicks?: number | null;
      isPasswordProtected?: boolean;
      passwordHash?: string | null;
      utmSource?: string | null;
      utmMedium?: string | null;
      utmCampaign?: string | null;
    } = {};

    if (title !== undefined) updateData.title = title || null;
    if (targetUrl !== undefined) updateData.targetUrl = targetUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (canUseAdvanced) {
      if (expiresAt !== undefined)
        updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      if (maxClicks !== undefined)
        updateData.maxClicks = maxClicks ? Number(maxClicks) : null;
      if (utmSource !== undefined) updateData.utmSource = utmSource || null;
      if (utmMedium !== undefined) updateData.utmMedium = utmMedium || null;
      if (utmCampaign !== undefined)
        updateData.utmCampaign = utmCampaign || null;

      // Gestion du mot de passe
      if (removePassword) {
        updateData.isPasswordProtected = false;
        updateData.passwordHash = null;
      } else if (isPasswordProtected && password) {
        updateData.isPasswordProtected = true;
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }
    }

    const link = await prisma.shortLink.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    // Construire l'URL courte
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/l/${link.shortCode}`;

    return NextResponse.json({
      ...link,
      shortUrl,
    });
  } catch (error) {
    console.error("Erreur mise a jour lien:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour" },
      { status: 500 }
    );
  }
}

// DELETE /api/links/[id] - Supprimer un lien
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier que le lien appartient a l'utilisateur
  const link = await prisma.shortLink.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Lien non trouve" }, { status: 404 });
  }

  await prisma.shortLink.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
