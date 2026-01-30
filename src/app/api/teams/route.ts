import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkHasBusinessPlan } from "@/lib/team-permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/teams
 * Liste toutes les equipes dont l'utilisateur est membre ou proprietaire
 */
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier le plan BUSINESS
  const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
  if (!hasBusinessPlan) {
    return NextResponse.json(
      { error: "La gestion des equipes est reservee au plan Business" },
      { status: 403 }
    );
  }

  try {
    // Recuperer les equipes dont l'utilisateur est proprietaire
    const ownedTeams = await prisma.team.findMany({
      where: { ownerId: session.user.id },
      include: {
        _count: {
          select: {
            members: true,
            qrcodes: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Recuperer les equipes dont l'utilisateur est membre
    const memberTeams = await prisma.team.findMany({
      where: {
        members: {
          some: { userId: session.user.id },
        },
        NOT: { ownerId: session.user.id },
      },
      include: {
        _count: {
          select: {
            members: true,
            qrcodes: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          where: { userId: session.user.id },
          select: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Formater les resultats
    const teams = [
      ...ownedTeams.map((team) => ({
        ...team,
        role: "OWNER" as const,
        isOwner: true,
      })),
      ...memberTeams.map((team) => ({
        ...team,
        role: team.members[0]?.role || "VIEWER",
        isOwner: false,
        members: undefined,
      })),
    ];

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Erreur lors de la recuperation des equipes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des equipes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teams
 * Cree une nouvelle equipe
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier le plan BUSINESS
  const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
  if (!hasBusinessPlan) {
    return NextResponse.json(
      { error: "La gestion des equipes est reservee au plan Business" },
      { status: 403 }
    );
  }

  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom de l'equipe est requis" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Le nom de l'equipe ne peut pas depasser 100 caracteres" },
        { status: 400 }
      );
    }

    // Creer l'equipe
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        ownerId: session.user.id,
      },
      include: {
        _count: {
          select: {
            members: true,
            qrcodes: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...team,
      role: "OWNER",
      isOwner: true,
    });
  } catch (error) {
    console.error("Erreur lors de la creation de l'equipe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'equipe" },
      { status: 500 }
    );
  }
}
