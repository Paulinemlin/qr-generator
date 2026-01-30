import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildUrlWithUtm } from "@/lib/short-code";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// POST /api/l/[code]/verify - Verifier le mot de passe d'un lien
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      );
    }

    // Rechercher le lien
    const link = await prisma.shortLink.findUnique({
      where: { shortCode: code },
    });

    if (!link) {
      return NextResponse.json({ error: "Lien non trouve" }, { status: 404 });
    }

    if (!link.isPasswordProtected || !link.passwordHash) {
      return NextResponse.json(
        { error: "Ce lien n'est pas protege" },
        { status: 400 }
      );
    }

    // Verifier le mot de passe
    const isValid = await bcrypt.compare(password, link.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Verifier si le lien est actif
    if (!link.isActive) {
      return NextResponse.json({ error: "Lien expire" }, { status: 410 });
    }

    // Verifier l'expiration
    if (link.expiresAt && new Date() > link.expiresAt) {
      await prisma.shortLink.update({
        where: { id: link.id },
        data: { isActive: false },
      });
      return NextResponse.json({ error: "Lien expire" }, { status: 410 });
    }

    // Verifier les clics max
    if (link.maxClicks) {
      const clickCount = await prisma.linkClick.count({
        where: { shortLinkId: link.id },
      });

      if (clickCount >= link.maxClicks) {
        await prisma.shortLink.update({
          where: { id: link.id },
          data: { isActive: false },
        });
        return NextResponse.json({ error: "Lien expire" }, { status: 410 });
      }
    }

    // Enregistrer le clic
    const headers = request.headers;
    const userAgent = headers.get("user-agent");
    const forwarded = headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;
    const referer = headers.get("referer");
    const cfCountry = headers.get("cf-ipcountry");

    await prisma.linkClick.create({
      data: {
        shortLinkId: link.id,
        userAgent,
        ip,
        country: cfCountry,
        referer,
      },
    });

    // Construire l'URL finale avec UTM
    const redirectUrl = buildUrlWithUtm(link.targetUrl, {
      utmSource: link.utmSource,
      utmMedium: link.utmMedium,
      utmCampaign: link.utmCampaign,
    });

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("Erreur verification mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification" },
      { status: 500 }
    );
  }
}
