import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const qrcode = await prisma.qRCode.findUnique({
      where: { id },
    });

    if (!qrcode) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : undefined;

    // Record the scan
    try {
      await prisma.scan.create({
        data: {
          qrcodeId: qrcode.id,
          userAgent,
          ip,
        },
      });
    } catch (scanError) {
      console.error("Error recording scan:", scanError);
    }

    // Add cache-busting parameter to target URL
    const targetUrl = new URL(qrcode.targetUrl);
    targetUrl.searchParams.set("_t", Date.now().toString());

    // Use 302 (temporary) redirect instead of 307 to avoid caching
    const response = NextResponse.redirect(targetUrl.toString(), { status: 302 });
    response.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Error in redirect route:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
