import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkCanUseAdvancedFeatures } from "@/lib/plan-limits";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface ABVariant {
  id: string;
  url: string;
  weight: number;
  name: string;
}

// GET - Recuperer le test A/B actif pour un QR code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  // Verifier que le QR code appartient a l'utilisateur
  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      abTests: true,
    },
  });

  if (!qrcode) {
    return NextResponse.json({ error: "QR code non trouve" }, { status: 404 });
  }

  // Recuperer les statistiques des variantes
  const abTest = qrcode.abTests[0] || null;

  if (!abTest) {
    return NextResponse.json({ abTest: null, stats: null });
  }

  // Calculer les stats par variante
  const variants = abTest.variants as unknown as ABVariant[];
  const variantStats = await Promise.all(
    variants.map(async (variant) => {
      const scanCount = await prisma.scan.count({
        where: {
          qrcodeId: id,
          variantId: variant.id,
        },
      });
      return {
        ...variant,
        scans: scanCount,
      };
    })
  );

  const totalScans = variantStats.reduce((sum, v) => sum + v.scans, 0);

  return NextResponse.json({
    abTest: {
      ...abTest,
      variants: variantStats.map((v) => ({
        ...v,
        pourcentage: totalScans > 0 ? Math.round((v.scans / totalScans) * 100) : 0,
      })),
    },
    stats: {
      totalScans,
      variantStats,
    },
  });
}

// POST - Creer ou mettre a jour un test A/B
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier le plan
  const canUse = await checkCanUseAdvancedFeatures(session.user.id);
  if (!canUse.allowed) {
    return NextResponse.json(
      { error: canUse.error, requiresUpgrade: true },
      { status: 403 }
    );
  }

  const { id } = await params;

  // Verifier que le QR code appartient a l'utilisateur
  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!qrcode) {
    return NextResponse.json({ error: "QR code non trouve" }, { status: 404 });
  }

  try {
    const { variants, isActive = true } = await request.json();

    // Valider les variantes
    if (!Array.isArray(variants) || variants.length < 2) {
      return NextResponse.json(
        { error: "Au moins 2 variantes sont requises" },
        { status: 400 }
      );
    }

    // Valider chaque variante
    for (const variant of variants) {
      if (!variant.url || !variant.name) {
        return NextResponse.json(
          { error: "Chaque variante doit avoir une URL et un nom" },
          { status: 400 }
        );
      }
      if (typeof variant.weight !== "number" || variant.weight < 0 || variant.weight > 100) {
        return NextResponse.json(
          { error: "Le poids doit etre un nombre entre 0 et 100" },
          { status: 400 }
        );
      }
    }

    // Generer des IDs pour les nouvelles variantes
    const variantsWithIds: ABVariant[] = variants.map((v: Partial<ABVariant>) => ({
      id: v.id || `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: v.url!,
      weight: v.weight!,
      name: v.name!,
    }));

    // Creer ou mettre a jour le test A/B
    const abTest = await prisma.aBTest.upsert({
      where: {
        qrcodeId: id,
      },
      create: {
        qrcodeId: id,
        variants: variantsWithIds as unknown as Prisma.InputJsonValue,
        isActive,
      },
      update: {
        variants: variantsWithIds as unknown as Prisma.InputJsonValue,
        isActive,
      },
    });

    return NextResponse.json(abTest);
  } catch (error) {
    console.error("A/B test creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du test A/B" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un test A/B
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  // Verifier que le QR code appartient a l'utilisateur
  const qrcode = await prisma.qRCode.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!qrcode) {
    return NextResponse.json({ error: "QR code non trouve" }, { status: 404 });
  }

  try {
    await prisma.aBTest.deleteMany({
      where: {
        qrcodeId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("A/B test deletion error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du test A/B" },
      { status: 500 }
    );
  }
}
