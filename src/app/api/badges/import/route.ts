import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { generateBadgeImage, parseBadgeFile, getQRCodeUrl } from "@/lib/badge-generator";
import { BadgeConfig, DEFAULT_BADGE_CONFIG } from "@/types/badge";
import { Plan } from "@prisma/client";

export const dynamic = "force-dynamic";

// Check if Vercel Blob is configured (production)
const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// Import limits by plan
const BADGE_IMPORT_LIMITS: Record<Plan, number> = {
  FREE: 0,
  PRO: 50,
  BUSINESS: 200,
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });
  }

  const plan = user.plan;
  if (plan === "FREE") {
    return NextResponse.json(
      { error: "L'import de badges est reserve aux plans Pro et Business." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const configStr = formData.get("config") as string;
    const batchName = (formData.get("name") as string) || "Badge Batch";

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    // Parse config or use defaults
    let config: Partial<BadgeConfig> = {};
    if (configStr) {
      try {
        config = JSON.parse(configStr);
      } catch {
        // Use defaults
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

    // Check import limit
    const importLimit = BADGE_IMPORT_LIMITS[plan];
    if (rows.length > importLimit) {
      return NextResponse.json(
        {
          error: `Limite d'import depassee. Max ${importLimit} badges pour le plan ${plan}. Vous essayez d'importer ${rows.length} badges.`,
        },
        { status: 400 }
      );
    }

    // Create batch record
    const batch = await prisma.badgeBatch.create({
      data: {
        name: batchName,
        status: "processing",
        totalCount: rows.length,
        badgeConfig: fullConfig as object,
        userId: session.user.id,
      },
    });

    // Process badges
    const processedBadges = [];
    const processingErrors: { row: number; error: string }[] = [...parseErrors];

    // Create local uploads directory if needed
    let localUploadsDir = "";
    if (!useVercelBlob) {
      localUploadsDir = path.join(process.cwd(), "public", "uploads", "badges", batch.id);
      await mkdir(localUploadsDir, { recursive: true });
    }

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        // Generate badge image
        const imageBuffer = await generateBadgeImage(row, fullConfig);

        // Generate filename
        const safeName = `${row.lastName}_${row.firstName}`
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .substring(0, 50);
        const filename = `${i}_${safeName}.png`;

        // Upload image
        let imageUrl: string;

        if (useVercelBlob) {
          const blob = await put(`badges/${batch.id}/${filename}`, imageBuffer, {
            access: "public",
            contentType: "image/png",
          });
          imageUrl = blob.url;
        } else {
          const filepath = path.join(localUploadsDir, filename);
          await writeFile(filepath, imageBuffer);
          imageUrl = `/uploads/badges/${batch.id}/${filename}`;
        }

        // Create badge record
        const badge = await prisma.badge.create({
          data: {
            firstName: row.firstName,
            lastName: row.lastName,
            company: row.company,
            website: row.website || null,
            linkedin: row.linkedin || null,
            qrCodeUrl: getQRCodeUrl(row),
            imageUrl,
            batchId: batch.id,
          },
        });

        processedBadges.push(badge);

        // Update progress
        await prisma.badgeBatch.update({
          where: { id: batch.id },
          data: { processedCount: i + 1 },
        });
      } catch (err) {
        processingErrors.push({
          row: i + 2, // +2 for 1-indexed and header row
          error: err instanceof Error ? err.message : "Erreur inconnue",
        });
      }
    }

    // Update batch status
    const finalStatus =
      processedBadges.length === 0
        ? "failed"
        : processingErrors.length > 0
        ? "completed" // partial success
        : "completed";

    await prisma.badgeBatch.update({
      where: { id: batch.id },
      data: {
        status: finalStatus,
        processedCount: processedBadges.length,
        errorCount: processingErrors.length,
        errors: processingErrors as object[],
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      batchId: batch.id,
      totalCount: rows.length,
      processedCount: processedBadges.length,
      errorCount: processingErrors.length,
      errors: processingErrors,
      status: finalStatus,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'import" },
      { status: 500 }
    );
  }
}
