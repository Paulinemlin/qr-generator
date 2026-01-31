import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  checkPublicRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";

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

/**
 * GET /api/redirect
 * Route de redirection pour les domaines personnalises
 * Parametres: domain (domaine personnalise), code (shortCode)
 */
export async function GET(request: NextRequest) {
  // Rate limiting for public redirect endpoint
  const ip = getClientIp(request);
  const rateLimit = await checkPublicRateLimit(ip);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit);
  }

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");
  const shortCode = searchParams.get("code");

  // Si pas de domaine ou de shortCode, rediriger vers l'accueil
  if (!domain || !shortCode) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Rechercher le domaine personnalise
    const customDomain = await prisma.customDomain.findUnique({
      where: { domain },
    });

    if (!customDomain || !customDomain.verified) {
      // Domaine non trouve ou non verifie
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Rechercher le QR code par shortCode et domaine
    const qrcode = await prisma.qRCode.findFirst({
      where: {
        shortCode,
        customDomainId: customDomain.id,
      },
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
      // QR code non trouve
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
        where: { id: qrcode.id },
        data: { isActive: false },
      });
      return NextResponse.redirect(new URL("/expired", request.url));
    }

    // 3. Verifier le nombre maximum de scans
    if (qrcode.maxScans && qrcode._count.scans >= qrcode.maxScans) {
      // Desactiver le QR code pour les prochaines requetes
      await prisma.qRCode.update({
        where: { id: qrcode.id },
        data: { isActive: false },
      });
      return NextResponse.redirect(new URL("/expired", request.url));
    }

    // 4. Verifier si le QR code est protege par mot de passe
    if (qrcode.isPasswordProtected && qrcode.passwordHash) {
      // Rediriger vers la page de verification de mot de passe
      const passwordUrl = new URL("/r/password", request.url);
      passwordUrl.searchParams.set("id", qrcode.id);
      return NextResponse.redirect(passwordUrl);
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

    // Enregistrer le scan
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

    // S'assurer que l'URL a un protocole valide
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    // Retourner une redirection 302 avec des headers anti-cache
    try {
      const url = new URL(targetUrl);
      const response = NextResponse.redirect(url.toString(), 302);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    } catch {
      // Si le parsing de l'URL echoue, essayer de rediriger quand meme
      const response = NextResponse.redirect(targetUrl, 302);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    }
  } catch (error) {
    console.error("Error in redirect:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
