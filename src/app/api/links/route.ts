import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateShortCode,
  isValidUrl,
  isValidShortCode,
  canCreateShortLink,
} from "@/lib/short-code";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET /api/links - Liste les liens courts de l'utilisateur
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const [links, user] = await Promise.all([
    prisma.shortLink.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    }),
  ]);

  return NextResponse.json({ links, plan: user?.plan || "FREE" });
}

// POST /api/links - Creer un nouveau lien court
export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      targetUrl,
      title,
      customCode,
      expiresAt,
      maxClicks,
      isPasswordProtected,
      password,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Validation de l'URL
    if (!targetUrl || !isValidUrl(targetUrl)) {
      return NextResponse.json(
        { error: "URL de destination invalide" },
        { status: 400 }
      );
    }

    // Recuperer le plan et le nombre de liens
    const [user, linkCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true },
      }),
      prisma.shortLink.count({
        where: { userId: session.user.id },
      }),
    ]);

    const plan = user?.plan || "FREE";

    // Mode test: desactiver les restrictions de plan
    const isTestMode = process.env.DISABLE_PLAN_LIMITS === "true";

    // Verifier la limite (sauf en mode test)
    if (!isTestMode && !canCreateShortLink(plan, linkCount)) {
      return NextResponse.json(
        {
          error: `Vous avez atteint la limite de 5 liens pour le plan Gratuit. Passez a un plan superieur pour en creer davantage.`,
        },
        { status: 403 }
      );
    }

    // Verifier les fonctionnalites avancees (sauf en mode test)
    const canUseAdvanced = isTestMode || plan === "PRO" || plan === "BUSINESS";

    if (!canUseAdvanced && (expiresAt || maxClicks || isPasswordProtected)) {
      return NextResponse.json(
        {
          error:
            "Les options avancees (expiration, limite de clics, mot de passe) sont reservees aux plans Pro et Business.",
        },
        { status: 403 }
      );
    }

    // Generer ou valider le code court
    let shortCode: string;

    if (customCode) {
      if (!isTestMode && !canUseAdvanced) {
        return NextResponse.json(
          {
            error:
              "Les codes personnalises sont reserves aux plans Pro et Business.",
          },
          { status: 403 }
        );
      }

      if (!isValidShortCode(customCode)) {
        return NextResponse.json(
          {
            error:
              "Code personnalise invalide. Utilisez 3 a 20 caracteres alphanumeriques.",
          },
          { status: 400 }
        );
      }

      // Verifier si le code existe deja
      const existing = await prisma.shortLink.findUnique({
        where: { shortCode: customCode },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Ce code est deja utilise. Choisissez-en un autre." },
          { status: 400 }
        );
      }

      shortCode = customCode;
    } else {
      // Generer un code unique
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        const existing = await prisma.shortLink.findUnique({
          where: { shortCode },
        });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      if (attempts >= 10) {
        return NextResponse.json(
          { error: "Impossible de generer un code unique. Reessayez." },
          { status: 500 }
        );
      }
    }

    // Hasher le mot de passe si necessaire
    let passwordHash: string | null = null;
    if (isPasswordProtected && password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    // Creer le lien
    const link = await prisma.shortLink.create({
      data: {
        shortCode,
        targetUrl,
        title: title || null,
        userId: session.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxClicks: maxClicks ? Number(maxClicks) : null,
        isPasswordProtected: isPasswordProtected && password ? true : false,
        passwordHash,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
      },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    // Construire l'URL courte
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/l/${link.shortCode}`;

    return NextResponse.json({
      ...link,
      shortUrl,
    });
  } catch (error) {
    console.error("Erreur creation lien:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du lien" },
      { status: 500 }
    );
  }
}
