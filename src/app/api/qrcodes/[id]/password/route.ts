import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkCanUsePasswordProtection } from "@/lib/plan-limits";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { action, password } = await request.json();

    if (!action || !["set", "remove"].includes(action)) {
      return NextResponse.json(
        { error: "Action invalide" },
        { status: 400 }
      );
    }

    // Verifier que le QR code appartient a l'utilisateur
    const qrcode = await prisma.qRCode.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!qrcode) {
      return NextResponse.json(
        { error: "QR code non trouve" },
        { status: 404 }
      );
    }

    // Verifier que l'utilisateur a le droit d'utiliser la protection par mot de passe
    const canUsePassword = await checkCanUsePasswordProtection(session.user.id);
    if (!canUsePassword.allowed) {
      return NextResponse.json(
        { error: canUsePassword.error },
        { status: 403 }
      );
    }

    if (action === "set") {
      // Configurer ou changer le mot de passe
      if (!password || password.length < 4) {
        return NextResponse.json(
          { error: "Le mot de passe doit contenir au moins 4 caracteres" },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 12);

      await prisma.qRCode.update({
        where: { id },
        data: {
          isPasswordProtected: true,
          passwordHash,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Mot de passe configure avec succes",
      });
    } else if (action === "remove") {
      // Supprimer la protection par mot de passe
      await prisma.qRCode.update({
        where: { id },
        data: {
          isPasswordProtected: false,
          passwordHash: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Protection par mot de passe desactivee",
      });
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  } catch (error) {
    console.error("Erreur lors de la gestion du mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du mot de passe" },
      { status: 500 }
    );
  }
}
