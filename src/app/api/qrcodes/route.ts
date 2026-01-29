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
    const { name, targetUrl, logoUrl } = await request.json();

    if (!name || !targetUrl) {
      return NextResponse.json(
        { error: "Nom et URL requis" },
        { status: 400 }
      );
    }

    const qrcode = await prisma.qRCode.create({
      data: {
        name,
        targetUrl,
        logoUrl,
        userId: session.user.id,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/r/${qrcode.id}`;

    // logoUrl is now a full URL from Vercel Blob
    const qrImageUrl = await generateQRCodeDataURL({
      url: redirectUrl,
      logoPath: logoUrl || undefined,
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
