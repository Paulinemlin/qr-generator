import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      scans: {
        orderBy: { scannedAt: "desc" },
        take: 100,
      },
      _count: {
        select: { scans: true },
      },
    },
  });

  if (!qrcode) {
    return NextResponse.json({ error: "QR code non trouvé" }, { status: 404 });
  }

  return NextResponse.json(qrcode);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!qrcode) {
    return NextResponse.json({ error: "QR code non trouvé" }, { status: 404 });
  }

  await prisma.qRCode.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
