import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const qrcode = await prisma.qRCode.findUnique({
    where: { id },
  });

  if (!qrcode) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userAgent = request.headers.get("user-agent") || undefined;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : undefined;

  await prisma.scan.create({
    data: {
      qrcodeId: qrcode.id,
      userAgent,
      ip,
    },
  });

  return NextResponse.redirect(qrcode.targetUrl);
}
