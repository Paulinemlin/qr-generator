import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/invite/[token]
 * Recupere les details d'une invitation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvee" },
        { status: 404 }
      );
    }

    // Verifier si l'invitation a expire
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Cette invitation a expire" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        team: invitation.team,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la recuperation de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de l'invitation" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invite/[token]
 * Accepte une invitation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { token } = await params;

  try {
    // Recuperer l'invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvee" },
        { status: 404 }
      );
    }

    // Verifier si l'invitation a expire
    if (invitation.expiresAt < new Date()) {
      // Supprimer l'invitation expiree
      await prisma.teamInvitation.delete({
        where: { id: invitation.id },
      });
      return NextResponse.json(
        { error: "Cette invitation a expire" },
        { status: 410 }
      );
    }

    // Recuperer l'email de l'utilisateur connecte
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    // Verifier que l'email correspond (optionnel mais recommande)
    if (user?.email?.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        {
          error: `Cette invitation est destinee a ${invitation.email}. Veuillez vous connecter avec ce compte.`,
        },
        { status: 403 }
      );
    }

    // Verifier si l'utilisateur n'est pas deja membre
    if (invitation.team.ownerId === session.user.id) {
      return NextResponse.json(
        { error: "Vous etes deja proprietaire de cette equipe" },
        { status: 400 }
      );
    }

    const existingMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: invitation.teamId,
          userId: session.user.id,
        },
      },
    });

    if (existingMembership) {
      // Supprimer l'invitation car l'utilisateur est deja membre
      await prisma.teamInvitation.delete({
        where: { id: invitation.id },
      });
      return NextResponse.json(
        { error: "Vous etes deja membre de cette equipe" },
        { status: 400 }
      );
    }

    // Ajouter l'utilisateur comme membre
    await prisma.$transaction([
      prisma.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId: session.user.id,
          role: invitation.role,
        },
      }),
      prisma.teamInvitation.delete({
        where: { id: invitation.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      teamId: invitation.teamId,
      teamName: invitation.team.name,
      role: invitation.role,
      message: `Vous avez rejoint l'equipe "${invitation.team.name}"`,
    });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'acceptation de l'invitation" },
      { status: 500 }
    );
  }
}
