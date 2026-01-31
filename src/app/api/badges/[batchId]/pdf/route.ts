import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { generateBadgesPDF } from "@/lib/badge-pdf";
import { BadgeConfig, BadgeFormat } from "@/types/badge";
import path from "path";
import { readFile } from "fs/promises";
import https from "https";

/**
 * Fetch URL using native https module (more reliable in Next.js server)
 */
async function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    });

    request.on("error", reject);
    request.on("timeout", () => {
      request.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

export const dynamic = "force-dynamic";

// Check if Vercel Blob is configured (production)
const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { batchId } = await params;

  // Get batch with badges
  const batch = await prisma.badgeBatch.findUnique({
    where: { id: batchId },
    include: { badges: true },
  });

  if (!batch) {
    return NextResponse.json({ error: "Batch non trouve" }, { status: 404 });
  }

  if (batch.userId !== session.user.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }

  // If PDF already generated, redirect to it
  if (batch.pdfUrl) {
    return NextResponse.redirect(batch.pdfUrl);
  }

  try {
    if (batch.badges.length === 0) {
      return NextResponse.json(
        { error: "Aucun badge dans ce batch" },
        { status: 400 }
      );
    }

    // Fetch badge images sequentially to avoid connection issues
    const badgeImages: { imageBuffer: Buffer; name: string }[] = [];

    for (const badge of batch.badges) {
      let buffer: Buffer;

      try {
        if (badge.imageUrl?.startsWith("https://")) {
          // Use native https for better reliability
          let lastError: Error | null = null;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              buffer = await fetchBuffer(badge.imageUrl);
              lastError = null;
              break;
            } catch (fetchErr) {
              lastError = fetchErr instanceof Error ? fetchErr : new Error(String(fetchErr));
              console.warn(`Attempt ${attempt + 1} failed for ${badge.firstName} ${badge.lastName}:`, lastError.message);
              if (attempt < 2) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          if (lastError) {
            throw lastError;
          }
        } else if (badge.imageUrl?.startsWith("http://")) {
          // Fallback to fetch for http URLs
          const response = await fetch(badge.imageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }
          buffer = Buffer.from(await response.arrayBuffer());
        } else if (badge.imageUrl) {
          // Local file
          const filepath = path.join(process.cwd(), "public", badge.imageUrl);
          buffer = await readFile(filepath);
        } else {
          throw new Error(`Badge ${badge.id} has no image URL`);
        }

        badgeImages.push({
          imageBuffer: buffer!,
          name: `${badge.firstName}_${badge.lastName}`,
        });
      } catch (err) {
        console.error(`Error fetching badge image for ${badge.firstName} ${badge.lastName}:`, err);
        throw err;
      }
    }

    // Get format from batch config
    const badgeConfig = batch.badgeConfig as Partial<BadgeConfig> | null;
    const format: BadgeFormat = badgeConfig?.format || "standard";

    // Generate PDF
    const pdfBuffer = await generateBadgesPDF(badgeImages, format);

    // Store PDF for future requests
    let pdfUrl: string | null = null;

    if (useVercelBlob) {
      const blob = await put(`badges/${batchId}/badges.pdf`, pdfBuffer, {
        access: "public",
        contentType: "application/pdf",
      });
      pdfUrl = blob.url;

      // Update batch with PDF URL
      await prisma.badgeBatch.update({
        where: { id: batchId },
        data: { pdfUrl: blob.url },
      });
    }

    // Return PDF
    const safeFilename = batch.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="badges_${safeFilename}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    return NextResponse.json(
      {
        error: "Erreur lors de la generation du PDF",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
