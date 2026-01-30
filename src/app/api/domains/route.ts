import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkCanUseCustomDomains } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

/**
 * GET /api/domains
 * Recupere tous les domaines personnalises de l'utilisateur
 */
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier que l'utilisateur a le plan BUSINESS
  const canUseCheck = await checkCanUseCustomDomains(session.user.id);
  if (!canUseCheck.allowed) {
    return NextResponse.json({ error: canUseCheck.error }, { status: 403 });
  }

  try {
    const domains = await prisma.customDomain.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { qrcodes: true },
        },
      },
    });

    return NextResponse.json({ domains });
  } catch (error) {
    console.error("Erreur lors de la recuperation des domaines:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des domaines" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/domains
 * Ajoute un nouveau domaine personnalise
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier que l'utilisateur a le plan BUSINESS
  const canUseCheck = await checkCanUseCustomDomains(session.user.id);
  if (!canUseCheck.allowed) {
    return NextResponse.json({ error: canUseCheck.error }, { status: 403 });
  }

  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Le domaine est requis" },
        { status: 400 }
      );
    }

    // Nettoyer et valider le domaine
    const cleanDomain = domain
      .toLowerCase()
      .trim()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .replace(/\/.*$/, "");

    // Validation basique du format du domaine
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/;
    if (!domainRegex.test(cleanDomain)) {
      return NextResponse.json(
        { error: "Format de domaine invalide" },
        { status: 400 }
      );
    }

    // Verifier que le domaine n'existe pas deja
    const existingDomain = await prisma.customDomain.findUnique({
      where: { domain: cleanDomain },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: "Ce domaine est deja enregistre" },
        { status: 400 }
      );
    }

    // Creer le domaine
    const newDomain = await prisma.customDomain.create({
      data: {
        domain: cleanDomain,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      domain: newDomain,
      message: "Domaine ajoute avec succes. Veuillez configurer les enregistrements DNS pour le verifier.",
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du domaine:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du domaine" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/domains
 * Supprime un domaine personnalise
 */
export async function DELETE(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("id");

    if (!domainId) {
      return NextResponse.json(
        { error: "L'ID du domaine est requis" },
        { status: 400 }
      );
    }

    // Verifier que le domaine appartient a l'utilisateur
    const domain = await prisma.customDomain.findUnique({
      where: { id: domainId },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domaine non trouve" },
        { status: 404 }
      );
    }

    if (domain.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Non autorise a supprimer ce domaine" },
        { status: 403 }
      );
    }

    // Supprimer le domaine (les QR codes seront mis a jour avec customDomainId = null grace a onDelete: SetNull)
    await prisma.customDomain.delete({
      where: { id: domainId },
    });

    return NextResponse.json({ message: "Domaine supprime avec succes" });
  } catch (error) {
    console.error("Erreur lors de la suppression du domaine:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du domaine" },
      { status: 500 }
    );
  }
}
