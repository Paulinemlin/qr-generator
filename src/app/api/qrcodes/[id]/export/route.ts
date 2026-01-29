import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQRCodeInFormat, ExportFormat } from "@/lib/qr-generator";

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
  const searchParams = request.nextUrl.searchParams;
  const format = (searchParams.get("format") || "png") as ExportFormat;
  const size = parseInt(searchParams.get("size") || "400", 10);

  // Validate format
  if (!["png", "svg", "jpeg"].includes(format)) {
    return NextResponse.json(
      { error: "Format invalide. Utilisez png, svg ou jpeg." },
      { status: 400 }
    );
  }

  try {
    const qrcode = await prisma.qRCode.findUnique({
      where: { id },
    });

    if (!qrcode) {
      return NextResponse.json(
        { error: "QR code non trouvé" },
        { status: 404 }
      );
    }

    if (qrcode.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/r/${qrcode.id}`;

    const validSize = Math.min(Math.max(size, 100), 2000);

    const { buffer, mimeType, extension } = await generateQRCodeInFormat(
      {
        url: redirectUrl,
        logoPath: qrcode.logoUrl || undefined,
        size: validSize,
        foregroundColor: qrcode.foregroundColor,
        backgroundColor: qrcode.backgroundColor,
        cornerStyle: qrcode.cornerStyle as "square" | "rounded",
      },
      format
    );

    const filename = `${qrcode.name.replace(/[^a-zA-Z0-9]/g, "_")}.${extension}`;

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'export" },
      { status: 500 }
    );
  }
}
