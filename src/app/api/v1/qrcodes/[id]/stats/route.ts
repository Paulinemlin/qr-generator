import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey, apiError, apiSuccess } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/qrcodes/[id]/stats - Get statistics for a specific QR code
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
  const { searchParams } = new URL(request.url);

  // Parse date range parameters
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Verify ownership of the QR code
  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: auth.userId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  if (!qrcode) {
    return apiError("QR code not found.", 404);
  }

  // Build the date filter
  const dateFilter: { scannedAt?: { gte?: Date; lte?: Date } } = {};
  if (startDate || endDate) {
    dateFilter.scannedAt = {};
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        dateFilter.scannedAt.gte = start;
      }
    }
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        dateFilter.scannedAt.lte = end;
      }
    }
  }

  // Get total scans
  const totalScans = await prisma.scan.count({
    where: {
      qrcodeId: id,
      ...dateFilter,
    },
  });

  // Get scans grouped by day (last 30 days by default)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const scans = await prisma.scan.findMany({
    where: {
      qrcodeId: id,
      scannedAt: {
        gte: startDate ? new Date(startDate) : thirtyDaysAgo,
        ...(endDate && { lte: new Date(endDate) }),
      },
    },
    select: {
      scannedAt: true,
      country: true,
      userAgent: true,
    },
    orderBy: { scannedAt: "desc" },
  });

  // Group scans by day
  const scansByDay: Record<string, number> = {};
  scans.forEach((scan) => {
    const day = scan.scannedAt.toISOString().split("T")[0];
    scansByDay[day] = (scansByDay[day] || 0) + 1;
  });

  // Group scans by country
  const scansByCountry: Record<string, number> = {};
  scans.forEach((scan) => {
    const country = scan.country || "Unknown";
    scansByCountry[country] = (scansByCountry[country] || 0) + 1;
  });

  // Parse user agents for device stats
  const deviceStats = {
    mobile: 0,
    desktop: 0,
    tablet: 0,
    other: 0,
  };

  scans.forEach((scan) => {
    const ua = (scan.userAgent || "").toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      if (ua.includes("ipad") || ua.includes("tablet")) {
        deviceStats.tablet++;
      } else {
        deviceStats.mobile++;
      }
    } else if (ua.includes("windows") || ua.includes("macintosh") || ua.includes("linux")) {
      deviceStats.desktop++;
    } else {
      deviceStats.other++;
    }
  });

  // Recent scans (last 10)
  const recentScans = scans.slice(0, 10).map((scan) => ({
    scannedAt: scan.scannedAt.toISOString(),
    country: scan.country || null,
  }));

  return apiSuccess({
    qrCodeId: qrcode.id,
    qrCodeName: qrcode.name,
    totalScans,
    scansByDay: Object.entries(scansByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    scansByCountry: Object.entries(scansByCountry)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count),
    deviceStats,
    recentScans,
  });
}
