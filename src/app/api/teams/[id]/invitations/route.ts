import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TeamRole } from "@prisma/client";
import crypto from "crypto";
import {
  checkTeamPermission,
  checkHasBusinessPlan,
  INVITABLE_ROLES,
} from "@/lib/team-permissions";

export const dynamic = "force-dynamic";

/**
 * GET /api/teams/[id]/invitations
 * Liste les invitations en attente d'une equipe
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
    const invitations = await prisma.teamInvitation.findMany({
      where: {
        teamId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Erreur lors de la recuperation des invitations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des invitations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teams/[id]/invitations
 * Cree une nouvelle invitation
 * Body: { email: string, role?: TeamRole }
 */
export async function POST(
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
    "invite_member"
  );

  if (!permissionCheck.allowed) {
    return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
  }

  try {
    const { email, role = "MEMBER" } = await request.json();

    // Valider l'email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "L'adresse email n'est pas valide" },
        { status: 400 }
      );
    }

    // Valider le role
    if (!INVITABLE_ROLES.includes(role as TeamRole)) {
      return NextResponse.json(
        { error: "Role invalide" },
        { status: 400 }
      );
    }

    // Un ADMIN ne peut pas inviter avec le role ADMIN
    if (permissionCheck.role === "ADMIN" && role === "ADMIN") {
      return NextResponse.json(
        { error: "Seul le proprietaire peut inviter des administrateurs" },
        { status: 403 }
      );
    }

    // Verifier si l'utilisateur est deja membre
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      // Verifier si deja membre de l'equipe
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
          ownerId: true,
          members: {
            where: { userId: existingUser.id },
          },
        },
      });

      if (team?.ownerId === existingUser.id || (team?.members && team.members.length > 0)) {
        return NextResponse.json(
          { error: "Cet utilisateur est deja membre de l'equipe" },
          { status: 400 }
        );
      }
    }

    // Verifier s'il y a deja une invitation en attente pour cet email
    const existingInvitation = await prisma.teamInvitation.findFirst({
      where: {
        teamId,
        email: email.toLowerCase(),
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "Une invitation est deja en attente pour cette adresse email" },
        { status: 400 }
      );
    }

    // Generer un token unique
    const token = crypto.randomBytes(32).toString("hex");

    // L'invitation expire dans 7 jours
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Creer l'invitation
    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        email: email.toLowerCase(),
        token,
        role: role as TeamRole,
        expiresAt,
      },
    });

    // Generer le lien d'invitation
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/invite/${token}`;

    return NextResponse.json({
      invitation,
      inviteLink,
      message: `Invitation envoyee a ${email}. Partagez ce lien avec l'utilisateur.`,
    });
  } catch (error) {
    console.error("Erreur lors de la creation de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'invitation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[id]/invitations
 * Annule une invitation
 * Body: { invitationId: string }
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

  // Verifier les permissions
  const permissionCheck = await checkTeamPermission(
    session.user.id,
    teamId,
    "invite_member"
  );

  if (!permissionCheck.allowed) {
    return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
  }

  try {
    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json(
        { error: "L'identifiant de l'invitation est requis" },
        { status: 400 }
      );
    }

    // Verifier que l'invitation appartient bien a cette equipe
    const invitation = await prisma.teamInvitation.findFirst({
      where: {
        id: invitationId,
        teamId,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvee" },
        { status: 404 }
      );
    }

    // Supprimer l'invitation
    await prisma.teamInvitation.delete({
      where: { id: invitationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'invitation" },
      { status: 500 }
    );
  }
}
