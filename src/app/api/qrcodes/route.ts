import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQRCodeDataURL } from "@/lib/qr-generator";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const qrcodes = await prisma.qRCode.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { scans: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(qrcodes);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const {
      name,
      targetUrl,
      logoUrl,
      foregroundColor = "#000000",
      backgroundColor = "#ffffff",
      size = 400,
      cornerStyle = "square",
    } = await request.json();

    if (!name || !targetUrl) {
      return NextResponse.json(
        { error: "Nom et URL requis" },
        { status: 400 }
      );
    }

    // Validate color format
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(foregroundColor) || !colorRegex.test(backgroundColor)) {
      return NextResponse.json(
        { error: "Format de couleur invalide" },
        { status: 400 }
      );
    }

    // Validate size
    const validSize = Math.min(Math.max(Number(size) || 400, 100), 2000);

    // Validate corner style
    const validCornerStyle = cornerStyle === "rounded" ? "rounded" : "square";

    const qrcode = await prisma.qRCode.create({
      data: {
        name,
        targetUrl,
        logoUrl,
        foregroundColor,
        backgroundColor,
        size: validSize,
        cornerStyle: validCornerStyle,
        userId: session.user.id,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/r/${qrcode.id}`;

    const qrImageUrl = await generateQRCodeDataURL({
      url: redirectUrl,
      logoPath: logoUrl || undefined,
      size: validSize,
      foregroundColor,
      backgroundColor,
      cornerStyle: validCornerStyle as "square" | "rounded",
    });

    const updatedQrcode = await prisma.qRCode.update({
      where: { id: qrcode.id },
      data: { qrImageUrl },
    });

    return NextResponse.json(updatedQrcode);
  } catch (error) {
    console.error("QR code creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du QR code" },
      { status: 500 }
    );
  }
}
