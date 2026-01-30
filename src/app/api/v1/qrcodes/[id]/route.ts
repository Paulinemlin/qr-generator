import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey, apiError, apiSuccess } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/qrcodes/[id] - Get details of a specific QR code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateApiKey(request);

  if (!auth.success) {
    return apiError(auth.error!, auth.statusCode);
  }

  const { id } = await params;

  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: auth.userId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      targetUrl: true,
      qrContent: true,
      logoUrl: true,
      qrImageUrl: true,
      foregroundColor: true,
      backgroundColor: true,
      size: true,
      cornerStyle: true,
      createdAt: true,
      _count: {
        select: { scans: true },
      },
    },
  });

  if (!qrcode) {
    return apiError("QR code not found.", 404);
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return apiSuccess({
    id: qrcode.id,
    name: qrcode.name,
    type: qrcode.type,
    targetUrl: qrcode.targetUrl,
    qrContent: qrcode.qrContent,
    logoUrl: qrcode.logoUrl,
    qrImageUrl: qrcode.qrImageUrl,
    foregroundColor: qrcode.foregroundColor,
    backgroundColor: qrcode.backgroundColor,
    size: qrcode.size,
    cornerStyle: qrcode.cornerStyle,
    redirectUrl: `${baseUrl}/r/${qrcode.id}`,
    createdAt: qrcode.createdAt.toISOString(),
    scanCount: qrcode._count.scans,
  });
}

/**
 * DELETE /api/v1/qrcodes/[id] - Delete a QR code
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateApiKey(request);

  if (!auth.success) {
    return apiError(auth.error!, auth.statusCode);
  }

  const { id } = await params;

  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: auth.userId,
    },
  });

  if (!qrcode) {
    return apiError("QR code not found.", 404);
  }

  await prisma.qRCode.delete({
    where: { id },
  });

  return apiSuccess({ success: true, message: "QR code deleted successfully." });
}
