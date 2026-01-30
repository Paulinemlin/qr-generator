import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildUrlWithUtm } from "@/lib/short-code";

export const dynamic = "force-dynamic";

// GET /l/[code] - Redirection vers l'URL cible
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  // Rechercher le lien court
  const link = await prisma.shortLink.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    // Rediriger vers une page 404 ou la page d'accueil
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // Verifier si le lien est actif
  if (!link.isActive) {
    return NextResponse.redirect(
      new URL("/link-expired?reason=inactive", request.url)
    );
  }

  // Verifier l'expiration par date
  if (link.expiresAt && new Date() > link.expiresAt) {
    // Desactiver le lien
    await prisma.shortLink.update({
      where: { id: link.id },
      data: { isActive: false },
    });

    return NextResponse.redirect(
      new URL("/link-expired?reason=date", request.url)
    );
  }

  // Verifier l'expiration par nombre de clics
  if (link.maxClicks) {
    const clickCount = await prisma.linkClick.count({
      where: { shortLinkId: link.id },
    });

    if (clickCount >= link.maxClicks) {
      // Desactiver le lien
      await prisma.shortLink.update({
        where: { id: link.id },
        data: { isActive: false },
      });

      return NextResponse.redirect(
        new URL("/link-expired?reason=clicks", request.url)
      );
    }
  }

  // Si protege par mot de passe, rediriger vers la page de verification
  if (link.isPasswordProtected) {
    return NextResponse.redirect(
      new URL(`/l/${code}/verify`, request.url)
    );
  }

  // Enregistrer le clic
  const headers = request.headers;
  const userAgent = headers.get("user-agent");
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;
  const referer = headers.get("referer");

  // Detecter le pays (simpliste - en production utiliser une API de geoloc)
  let country: string | null = null;
  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry) {
    country = cfCountry;
  }

  await prisma.linkClick.create({
    data: {
      shortLinkId: link.id,
      userAgent,
      ip,
      country,
      referer,
    },
  });

  // Construire l'URL finale avec UTM
  const finalUrl = buildUrlWithUtm(link.targetUrl, {
    utmSource: link.utmSource,
    utmMedium: link.utmMedium,
    utmCampaign: link.utmCampaign,
  });

  // Redirection 302 (temporaire) pour permettre les mises a jour
  return NextResponse.redirect(finalUrl, { status: 302 });
}
