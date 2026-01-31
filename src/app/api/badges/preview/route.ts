import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBadgeDataURL, parseBadgeFile, getQRCodeUrl } from "@/lib/badge-generator";
import { BadgeConfig, DEFAULT_BADGE_CONFIG, BadgePreview } from "@/types/badge";

export const dynamic = "force-dynamic";

const PREVIEW_LIMIT = 3;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Check plan
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (!user || user.plan === "FREE") {
    return NextResponse.json(
      { error: "L'import de badges est reserve aux plans Pro et Business." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const configStr = formData.get("config") as string;

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    // Parse config or use defaults
    let config: Partial<BadgeConfig> = {};
    if (configStr) {
      try {
        config = JSON.parse(configStr);
      } catch {
        // Use defaults if config parsing fails
      }
    }

    const fullConfig: BadgeConfig = {
      ...DEFAULT_BADGE_CONFIG,
      ...config,
    };

    // Parse file (CSV or Excel)
    const { rows, errors: parseErrors } = await parseBadgeFile(file);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          error: "Aucune donnee valide trouvee dans le fichier",
          parseErrors,
        },
        { status: 400 }
      );
    }

    // Generate previews for first N rows
    const previews: BadgePreview[] = [];
    const previewErrors: { row: number; error: string }[] = [];

    for (let i = 0; i < Math.min(PREVIEW_LIMIT, rows.length); i++) {
      const row = rows[i];
      try {
        const previewDataUrl = await generateBadgeDataURL(row, fullConfig);
        previews.push({
          firstName: row.firstName,
          lastName: row.lastName,
          company: row.company,
          qrUrl: getQRCodeUrl(row),
          previewDataUrl,
        });
      } catch (error) {
        previewErrors.push({
          row: i + 2, // +2 for 1-indexed and header row
          error: error instanceof Error ? error.message : "Erreur de generation",
        });
      }
    }

    return NextResponse.json({
      totalRows: rows.length,
      previews,
      parseErrors,
      previewErrors,
    });
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la generation de l'apercu" },
      { status: 500 }
    );
  }
}
