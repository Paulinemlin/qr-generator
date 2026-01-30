import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCodeDataURL } from "@/lib/qr-generator";
import { validateApiKey, apiError, apiSuccess } from "@/lib/api-auth";
import { checkCanCreateQRCode, checkCanUseLogo } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/qrcodes - List all QR codes for the authenticated API user
 */
export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request);

  if (!auth.success) {
    return apiError(auth.error!, auth.statusCode);
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const [qrcodes, total] = await Promise.all([
    prisma.qRCode.findMany({
      where: { userId: auth.userId },
      select: {
        id: true,
        name: true,
        type: true,
        targetUrl: true,
        qrContent: true,
        foregroundColor: true,
        backgroundColor: true,
        size: true,
        cornerStyle: true,
        createdAt: true,
        _count: {
          select: { scans: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.qRCode.count({
      where: { userId: auth.userId },
    }),
  ]);

  const formattedQrcodes = qrcodes.map((qr) => ({
    id: qr.id,
    name: qr.name,
    type: qr.type,
    targetUrl: qr.targetUrl,
    qrContent: qr.qrContent,
    foregroundColor: qr.foregroundColor,
    backgroundColor: qr.backgroundColor,
    size: qr.size,
    cornerStyle: qr.cornerStyle,
    createdAt: qr.createdAt.toISOString(),
    scanCount: qr._count.scans,
  }));

  return apiSuccess({
    data: formattedQrcodes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/**
 * POST /api/v1/qrcodes - Create a new QR code
 */
export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request);

  if (!auth.success) {
    return apiError(auth.error!, auth.statusCode);
  }

  try {
    const body = await request.json();
    const {
      name,
      targetUrl,
      type = "url",
      qrContent,
      logoUrl,
      foregroundColor = "#000000",
      backgroundColor = "#ffffff",
      size = 400,
      cornerStyle = "square",
    } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return apiError("Field 'name' is required.", 400);
    }

    if (!targetUrl || typeof targetUrl !== "string" || targetUrl.trim().length === 0) {
      return apiError("Field 'targetUrl' is required.", 400);
    }

    // Check QR code creation limit
    const canCreateCheck = await checkCanCreateQRCode(auth.userId!);
    if (!canCreateCheck.allowed) {
      return apiError("QR code limit reached for your plan. Please upgrade to create more.", 403);
    }

    // Check logo permission
    if (logoUrl) {
      const canUseLogoCheck = await checkCanUseLogo(auth.userId!);
      if (!canUseLogoCheck.allowed) {
        return apiError("Custom logo requires a Pro or Business plan.", 403);
      }
    }

    // Validate color format
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(foregroundColor)) {
      return apiError("Invalid foregroundColor format. Use hex format (e.g., #000000).", 400);
    }
    if (!colorRegex.test(backgroundColor)) {
      return apiError("Invalid backgroundColor format. Use hex format (e.g., #ffffff).", 400);
    }

    // Validate size
    const validSize = Math.min(Math.max(Number(size) || 400, 100), 2000);

    // Validate corner style
    const validCornerStyle = cornerStyle === "rounded" ? "rounded" : "square";

    // Create the QR code
    const qrcode = await prisma.qRCode.create({
      data: {
        name: name.trim(),
        type,
        targetUrl: targetUrl.trim(),
        qrContent: qrContent || null,
        logoUrl: logoUrl || null,
        foregroundColor,
        backgroundColor,
        size: validSize,
        cornerStyle: validCornerStyle,
        userId: auth.userId!,
      },
    });

    // Generate QR code image
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

    // Update with the generated image
    const updatedQrcode = await prisma.qRCode.update({
      where: { id: qrcode.id },
      data: { qrImageUrl },
      select: {
        id: true,
        name: true,
        type: true,
        targetUrl: true,
        qrContent: true,
        foregroundColor: true,
        backgroundColor: true,
        size: true,
        cornerStyle: true,
        qrImageUrl: true,
        createdAt: true,
      },
    });

    return apiSuccess(
      {
        id: updatedQrcode.id,
        name: updatedQrcode.name,
        type: updatedQrcode.type,
        targetUrl: updatedQrcode.targetUrl,
        qrContent: updatedQrcode.qrContent,
        foregroundColor: updatedQrcode.foregroundColor,
        backgroundColor: updatedQrcode.backgroundColor,
        size: updatedQrcode.size,
        cornerStyle: updatedQrcode.cornerStyle,
        qrImageUrl: updatedQrcode.qrImageUrl,
        redirectUrl,
        createdAt: updatedQrcode.createdAt.toISOString(),
      },
      201
    );
  } catch (error) {
    console.error("API v1 QR code creation error:", error);
    return apiError("Failed to create QR code.", 500);
  }
}
