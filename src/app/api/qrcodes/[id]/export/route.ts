import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQRCodeInFormat, ExportFormat } from "@/lib/qr-generator";
import { canExportSVG, canExportPDF, ModuleShape, EyeShape } from "@/lib/qr-templates";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const format = (searchParams.get("format") || "png") as ExportFormat;
  const size = parseInt(searchParams.get("size") || "400", 10);

  // Options premium
  const moduleShape = (searchParams.get("moduleShape") || "square") as ModuleShape;
  const eyeShape = (searchParams.get("eyeShape") || "square") as EyeShape;
  const useGradient = searchParams.get("useGradient") === "true";
  const gradientColor1 = searchParams.get("gradientColor1") || "#667eea";
  const gradientColor2 = searchParams.get("gradientColor2") || "#764ba2";
  const gradientDirection = (searchParams.get("gradientDirection") || "diagonal") as "horizontal" | "vertical" | "diagonal";

  // Validate format
  if (!["png", "svg", "jpeg", "pdf"].includes(format)) {
    return NextResponse.json(
      { error: "Format invalide. Utilisez png, svg, jpeg ou pdf." },
      { status: 400 }
    );
  }

  try {
    // Recuperer l'utilisateur avec son plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });
    }

    const userPlan = user.plan as "FREE" | "PRO" | "BUSINESS";

    // Verifier les permissions pour les formats premium
    if (format === "svg" && !canExportSVG(userPlan)) {
      return NextResponse.json(
        { error: "L'export SVG est reserve aux plans Pro et Business." },
        { status: 403 }
      );
    }

    if (format === "pdf" && !canExportPDF(userPlan)) {
      return NextResponse.json(
        { error: "L'export PDF est reserve au plan Business." },
        { status: 403 }
      );
    }

    const qrcode = await prisma.qRCode.findUnique({
      where: { id },
    });

    if (!qrcode) {
      return NextResponse.json(
        { error: "QR code non trouve" },
        { status: 404 }
      );
    }

    if (qrcode.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
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
        // Options premium
        moduleShape,
        eyeShape,
        useGradient,
        gradientColors: [gradientColor1, gradientColor2],
        gradientDirection,
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
