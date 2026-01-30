import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TeamRole } from "@prisma/client";
import {
  checkTeamPermission,
  checkCanChangeRole,
  checkCanRemoveMember,
  checkHasBusinessPlan,
  INVITABLE_ROLES,
} from "@/lib/team-permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/teams/[id]/members
 * Liste les membres d'une equipe
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id: teamId } = await params;

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
    teamId,
    "view_team"
  );

  if (!permissionCheck.allowed) {
    return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
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
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Equipe non trouvee" }, { status: 404 });
    }

    // Ajouter le proprietaire en tete de liste
    const allMembers = [
      {
        id: "owner",
        userId: team.owner.id,
        user: team.owner,
        role: "OWNER" as TeamRole,
        isOwner: true,
        createdAt: team.createdAt,
      },
      ...team.members.map((m) => ({
        ...m,
        isOwner: false,
      })),
    ];

    return NextResponse.json({ members: allMembers });
  } catch (error) {
    console.error("Erreur lors de la recuperation des membres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des membres" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/teams/[id]/members
 * Modifie le role d'un membre
 * Body: { userId: string, role: TeamRole }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id: teamId } = await params;

  // Verifier le plan BUSINESS
  const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
  if (!hasBusinessPlan) {
    return NextResponse.json(
      { error: "La gestion des equipes est reservee au plan Business" },
      { status: 403 }
    );
  }

  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "L'identifiant du membre et le role sont requis" },
        { status: 400 }
      );
    }

    if (!INVITABLE_ROLES.includes(role) && role !== "OWNER") {
      return NextResponse.json(
        { error: "Role invalide" },
        { status: 400 }
      );
    }

    // Verifier les permissions
    const permissionCheck = await checkCanChangeRole(
      session.user.id,
      teamId,
      userId,
      role
    );

    if (!permissionCheck.allowed) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Mettre a jour le role
    const member = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Erreur lors de la modification du role:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du role" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[id]/members
 * Retire un membre de l'equipe
 * Body: { userId: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id: teamId } = await params;

  // Verifier le plan BUSINESS
  const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
  if (!hasBusinessPlan) {
    return NextResponse.json(
      { error: "La gestion des equipes est reservee au plan Business" },
      { status: 403 }
    );
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "L'identifiant du membre est requis" },
        { status: 400 }
      );
    }

    // Si l'utilisateur se retire lui-meme, c'est toujours autorise (sauf proprietaire)
    const isSelfRemoval = userId === session.user.id;

    if (isSelfRemoval) {
      // Verifier que ce n'est pas le proprietaire
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { ownerId: true },
      });

      if (team?.ownerId === userId) {
        return NextResponse.json(
          { error: "Le proprietaire ne peut pas quitter son equipe. Transferez la propriete ou supprimez l'equipe." },
          { status: 403 }
        );
      }
    } else {
      // Verifier les permissions pour retirer un autre membre
      const permissionCheck = await checkCanRemoveMember(
        session.user.id,
        teamId,
        userId
      );

      if (!permissionCheck.allowed) {
        return NextResponse.json(
          { error: permissionCheck.error },
          { status: 403 }
        );
      }
    }

    // Supprimer le membre
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du membre:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du membre" },
      { status: 500 }
    );
  }
}
