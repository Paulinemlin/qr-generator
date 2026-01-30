import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQRCodeDataURL } from "@/lib/qr-generator";
import { checkCanCreateQRCode, checkCanUseLogo, checkCanUsePasswordProtection, checkCanUseAdvancedFeatures, checkCanUseCustomDomains } from "@/lib/plan-limits";
import { QRCodeType, generateQRContent, validateQRData, QRCodeData } from "@/lib/qr-types";
import { checkTeamPermission, checkHasBusinessPlan } from "@/lib/team-permissions";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

const VALID_QR_TYPES: QRCodeType[] = ["url", "wifi", "vcard", "email", "sms", "phone"];

/**
 * Genere un shortCode unique pour les redirections personnalisees
 */
async function generateUniqueShortCode(): Promise<string> {
  let shortCode: string;
  let exists = true;

  // Generer un shortCode de 8 caracteres et verifier qu'il n'existe pas deja
  while (exists) {
    shortCode = nanoid(8);
    const existing = await prisma.qRCode.findUnique({
      where: { shortCode },
    });
    exists = !!existing;
  }

  return shortCode!;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Recuperer le parametre team pour filtrer par equipe
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("team");

  // Construire le filtre where
  let whereClause: { userId?: string; teamId?: string | null; OR?: Array<{ userId: string } | { teamId: string }> } = {};

  if (teamId === "personal") {
    // QR codes personnels uniquement (sans equipe)
    whereClause = {
      userId: session.user.id,
      teamId: null,
    };
  } else if (teamId) {
    // QR codes d'une equipe specifique
    // Verifier que l'utilisateur a acces a cette equipe
    const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
    if (!hasBusinessPlan) {
      return NextResponse.json(
        { error: "La gestion des equipes est reservee au plan Business" },
        { status: 403 }
      );
    }

    const permissionCheck = await checkTeamPermission(session.user.id, teamId, "view_qrcodes");
    if (!permissionCheck.allowed) {
      return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
    }

    whereClause = { teamId };
  } else {
    // Tous les QR codes de l'utilisateur (personnels + equipes)
    // On recupere aussi ceux des equipes dont il est membre
    const userTeamIds = await prisma.teamMember.findMany({
      where: { userId: session.user.id },
      select: { teamId: true },
    });

    const ownedTeamIds = await prisma.team.findMany({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    const allTeamIds = [
      ...userTeamIds.map((t) => t.teamId),
      ...ownedTeamIds.map((t) => t.id),
    ];

    if (allTeamIds.length > 0) {
      whereClause = {
        OR: [
          { userId: session.user.id },
          ...allTeamIds.map((tid) => ({ teamId: tid })),
        ],
      };
    } else {
      whereClause = { userId: session.user.id };
    }
  }

  const [qrcodes, user, customDomains, teams] = await Promise.all([
    prisma.qRCode.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { scans: true },
        },
        customDomain: {
          select: {
            id: true,
            domain: true,
            verified: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
        stripeCustomerId: true,
      },
    }),
    // Recuperer les domaines verifies de l'utilisateur (pour le plan BUSINESS)
    prisma.customDomain.findMany({
      where: {
        userId: session.user.id,
        verified: true,
      },
      select: {
        id: true,
        domain: true,
      },
    }),
    // Recuperer les equipes de l'utilisateur pour le selecteur
    (async () => {
      const ownedTeams = await prisma.team.findMany({
        where: { ownerId: session.user.id },
        select: { id: true, name: true },
      });
      const memberTeams = await prisma.team.findMany({
        where: {
          members: { some: { userId: session.user.id } },
          NOT: { ownerId: session.user.id },
        },
        select: { id: true, name: true },
      });
      return [...ownedTeams, ...memberTeams];
    })(),
  ]);

  // Filtrer les equipes selon le plan (BUSINESS uniquement)
  const filteredTeams = user?.plan === "BUSINESS" ? teams : [];

  return NextResponse.json({ qrcodes, user, customDomains, teams: filteredTeams });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const {
      name,
      type = "url",
      targetUrl,
      qrContent,
      qrData,
      logoUrl,
      foregroundColor = "#000000",
      backgroundColor = "#ffffff",
      size = 400,
      cornerStyle = "square",
      password,
      isPasswordProtected = false,
      expiresAt,
      maxScans,
      customDomainId,
      teamId,
    } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Le nom est requis" },
        { status: 400 }
      );
    }

    // Valider le type de QR code
    const validType = VALID_QR_TYPES.includes(type) ? type : "url";

    // Valider les donnees selon le type
    if (qrData) {
      const validation = validateQRData(validType, qrData as QRCodeData);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }

    // Verifier la limite de QR codes pour le plan de l'utilisateur
    const canCreateCheck = await checkCanCreateQRCode(session.user.id);
    if (!canCreateCheck.allowed) {
      return NextResponse.json(
        { error: canCreateCheck.error },
        { status: 403 }
      );
    }

    // Si un teamId est fourni, verifier les permissions
    let validTeamId: string | null = null;
    if (teamId) {
      const hasBusinessPlan = await checkHasBusinessPlan(session.user.id);
      if (!hasBusinessPlan) {
        return NextResponse.json(
          { error: "La gestion des equipes est reservee au plan Business" },
          { status: 403 }
        );
      }

      const permissionCheck = await checkTeamPermission(session.user.id, teamId, "create_qrcode");
      if (!permissionCheck.allowed) {
        return NextResponse.json({ error: permissionCheck.error }, { status: 403 });
      }

      validTeamId = teamId;
    }

    // Verifier si l'utilisateur peut utiliser un logo
    if (logoUrl) {
      const canUseLogoCheck = await checkCanUseLogo(session.user.id);
      if (!canUseLogoCheck.allowed) {
        return NextResponse.json(
          { error: canUseLogoCheck.error },
          { status: 403 }
        );
      }
    }

    // Verifier si l'utilisateur peut utiliser la protection par mot de passe
    let passwordHash: string | null = null;
    if (isPasswordProtected && password) {
      const canUsePasswordCheck = await checkCanUsePasswordProtection(session.user.id);
      if (!canUsePasswordCheck.allowed) {
        return NextResponse.json(
          { error: canUsePasswordCheck.error },
          { status: 403 }
        );
      }
      // Hasher le mot de passe
      passwordHash = await bcrypt.hash(password, 12);
    }

    // Verifier si l'utilisateur peut utiliser les options d'expiration
    let validExpiresAt: Date | null = null;
    let validMaxScans: number | null = null;

    if (expiresAt || maxScans) {
      const canUseAdvancedCheck = await checkCanUseAdvancedFeatures(session.user.id);
      if (!canUseAdvancedCheck.allowed) {
        return NextResponse.json(
          { error: canUseAdvancedCheck.error },
          { status: 403 }
        );
      }

      if (expiresAt) {
        const parsedDate = new Date(expiresAt);
        if (!isNaN(parsedDate.getTime()) && parsedDate > new Date()) {
          validExpiresAt = parsedDate;
        }
      }

      if (maxScans && typeof maxScans === "number" && maxScans > 0) {
        validMaxScans = maxScans;
      }
    }

    // Verifier si l'utilisateur peut utiliser un domaine personnalise
    let validCustomDomainId: string | null = null;
    let shortCode: string | null = null;

    if (customDomainId) {
      const canUseCustomDomainsCheck = await checkCanUseCustomDomains(session.user.id);
      if (!canUseCustomDomainsCheck.allowed) {
        return NextResponse.json(
          { error: canUseCustomDomainsCheck.error },
          { status: 403 }
        );
      }

      // Verifier que le domaine appartient a l'utilisateur et est verifie
      const customDomain = await prisma.customDomain.findUnique({
        where: { id: customDomainId },
      });

      if (!customDomain || customDomain.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Domaine personnalise invalide" },
          { status: 400 }
        );
      }

      if (!customDomain.verified) {
        return NextResponse.json(
          { error: "Le domaine personnalise doit etre verifie avant utilisation" },
          { status: 400 }
        );
      }

      validCustomDomainId = customDomainId;
      // Generer un shortCode unique pour les redirections personnalisees
      shortCode = await generateUniqueShortCode();
    }

    // Validate color format
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(foregroundColor) || !colorRegex.test(backgroundColor)) {
      return NextResponse.json(
        { error: "Format de couleur invalide" },
        { status: 400 }
      );
    }

    // Validate size
    const validSize = Math.min(Math.max(Number(size) || 400, 100), 2000);

    // Validate corner style
    const validCornerStyle = cornerStyle === "rounded" ? "rounded" : "square";

    // Determiner le contenu final du QR code
    let finalQrContent: string;
    let finalTargetUrl: string;

    if (validType === "url") {
      // Pour les URLs, on utilise la redirection
      finalTargetUrl = targetUrl;
      finalQrContent = targetUrl;
    } else {
      // Pour les autres types, on genere le contenu a partir des donnees
      if (qrData) {
        finalQrContent = generateQRContent(validType, qrData as QRCodeData);
      } else if (qrContent) {
        finalQrContent = qrContent;
      } else {
        return NextResponse.json(
          { error: "Donnees du QR code requises" },
          { status: 400 }
        );
      }
      finalTargetUrl = finalQrContent;
    }

    const qrcode = await prisma.qRCode.create({
      data: {
        name,
        type: validType,
        targetUrl: finalTargetUrl,
        qrContent: finalQrContent,
        logoUrl,
        foregroundColor,
        backgroundColor,
        size: validSize,
        cornerStyle: validCornerStyle,
        userId: session.user.id,
        teamId: validTeamId,
        isPasswordProtected: isPasswordProtected && !!passwordHash,
        passwordHash,
        expiresAt: validExpiresAt,
        maxScans: validMaxScans,
        customDomainId: validCustomDomainId,
        shortCode,
      },
    });

    // Determiner l'URL du QR code
    let qrImageContent: string;
    if (validType === "url") {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

      if (validCustomDomainId && shortCode) {
        // Utiliser le domaine personnalise
        const customDomain = await prisma.customDomain.findUnique({
          where: { id: validCustomDomainId },
        });
        if (customDomain) {
          qrImageContent = `https://${customDomain.domain}/${shortCode}`;
        } else {
          qrImageContent = `${baseUrl}/r/${qrcode.id}`;
        }
      } else {
        // Utiliser l'URL de redirection standard
        qrImageContent = `${baseUrl}/r/${qrcode.id}`;
      }
    } else {
      qrImageContent = finalQrContent;
    }

    const qrImageUrl = await generateQRCodeDataURL({
      url: qrImageContent,
      logoPath: logoUrl || undefined,
      size: validSize,
      foregroundColor,
      backgroundColor,
      cornerStyle: validCornerStyle as "square" | "rounded",
    });

    const updatedQrcode = await prisma.qRCode.update({
      where: { id: qrcode.id },
      data: { qrImageUrl },
      include: {
        customDomain: {
          select: {
            id: true,
            domain: true,
            verified: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedQrcode);
  } catch (error) {
    console.error("QR code creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du QR code" },
      { status: 500 }
    );
  }
}
