import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface ABVariant {
  id: string;
  url: string;
  weight: number;
  name: string;
}

/**
 * Selectionne une variante basee sur les poids
 * Utilise un algorithme de selection aleatoire ponderee
 */
function selectVariant(variants: ABVariant[]): ABVariant | null {
  if (!variants || variants.length === 0) return null;

  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight === 0) return variants[0];

  let random = Math.random() * totalWeight;

  for (const variant of variants) {
    random -= variant.weight;
    if (random <= 0) {
      return variant;
    }
  }

  return variants[variants.length - 1];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const qrcode = await prisma.qRCode.findUnique({
    where: { id },
    include: {
      abTests: {
        where: { isActive: true },
        take: 1,
      },
      _count: {
        select: { scans: true },
      },
    },
  });

  if (!qrcode) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verification de l'expiration
  // 1. Verifier si le QR code est desactive
  if (!qrcode.isActive) {
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  // 2. Verifier la date d'expiration
  if (qrcode.expiresAt && new Date() > qrcode.expiresAt) {
    // Desactiver le QR code pour les prochaines requetes
    await prisma.qRCode.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  // 3. Verifier le nombre maximum de scans
  if (qrcode.maxScans && qrcode._count.scans >= qrcode.maxScans) {
    // Desactiver le QR code pour les prochaines requetes
    await prisma.qRCode.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  // 4. Verifier la protection par mot de passe
  if (qrcode.isPasswordProtected && qrcode.passwordHash) {
    // Verifier si l'utilisateur a deja deverrouille ce QR code
    const cookieStore = await cookies();
    const unlockCookie = cookieStore.get(`qr_unlock_${id}`);

    if (!unlockCookie) {
      // Rediriger vers la page de deverrouillage
      return NextResponse.redirect(new URL(`/r/${id}/unlock`, request.url));
    }
  }

  // Determiner l'URL cible (A/B testing ou URL par defaut)
  let targetUrl = qrcode.targetUrl.trim();
  let variantId: string | null = null;

  // Verifier s'il y a un A/B test actif
  const activeABTest = qrcode.abTests[0];
  if (activeABTest) {
    const variants = activeABTest.variants as unknown as ABVariant[];
    const selectedVariant = selectVariant(variants);

    if (selectedVariant) {
      targetUrl = selectedVariant.url;
      variantId = selectedVariant.id;
    }
  }

  // Record the scan
  const userAgent = request.headers.get("user-agent") || undefined;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : undefined;

  try {
    await prisma.scan.create({
      data: {
        qrcodeId: qrcode.id,
        userAgent,
        ip,
        variantId,
      },
    });
  } catch (error) {
    console.error("Error recording scan:", error);
  }

  // Ensure URL has a valid protocol
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "https://" + targetUrl;
  }

  // Return a 302 redirect with properly constructed URL
  // Add aggressive no-cache headers to prevent iOS caching issues
  try {
    const url = new URL(targetUrl);
    const response = NextResponse.redirect(url.toString(), 302);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  } catch {
    // If URL parsing fails, try redirecting as-is
    const response = NextResponse.redirect(targetUrl, 302);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }
}
