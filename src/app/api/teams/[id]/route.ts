import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  checkTeamPermission,
  checkHasBusinessPlan,
} from "@/lib/team-permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/teams/[id]
 * Recupere les details d'une equipe
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  // Verifier le plan BUSINESS
  const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
  if (!hasBusinessPlan) {
    return NextResponse.json(
      { error: "La gestion des equipes est reservee au plan Business" },
      { status: 403 }
    );
  }

  // Verifier les permissions
  const permissionCheck = await checkTeamPermission(
    session.user.id,
    id,
    "view_team"
  );

  if (!permissionCheck.allowed) {
    return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        invitations: {
          where: {
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            members: true,
            qrcodes: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Equipe non trouvee" }, { status: 404 });
    }

    return NextResponse.json({
      ...team,
      role: permissionCheck.role,
      isOwner: permissionCheck.isOwner,
    });
  } catch (error) {
    console.error("Erreur lors de la recuperation de l'equipe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de l'equipe" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/teams/[id]
 * Met a jour une equipe
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  // Verifier le plan BUSINESS
  const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
  if (!hasBusinessPlan) {
    return NextResponse.json(
      { error: "La gestion des equipes est reservee au plan Business" },
      { status: 403 }
    );
  }

  // Verifier les permissions
  const permissionCheck = await checkTeamPermission(
    session.user.id,
    id,
    "edit_team"
  );

  if (!permissionCheck.allowed) {
    return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
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

    const team = await prisma.team.update({
      where: { id },
      data: { name: name.trim() },
      include: {
        _count: {
          select: {
            members: true,
            qrcodes: true,
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Erreur lors de la mise a jour de l'equipe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de l'equipe" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[id]
 * Supprime une equipe
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  // Verifier le plan BUSINESS
  const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
  if (!hasBusinessPlan) {
    return NextResponse.json(
      { error: "La gestion des equipes est reservee au plan Business" },
      { status: 403 }
    );
  }

  // Verifier les permissions (seul le proprietaire peut supprimer)
  const permissionCheck = await checkTeamPermission(
    session.user.id,
    id,
    "delete_team"
  );

  if (!permissionCheck.allowed) {
    return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
  }

  try {
    // Dissocier les QR codes de l'equipe avant suppression
    await prisma.qRCode.updateMany({
      where: { teamId: id },
      data: { teamId: null },
    });

    // Supprimer l'equipe (les membres et invitations seront supprimes en cascade)
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'equipe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'equipe" },
      { status: 500 }
    );
  }
}
