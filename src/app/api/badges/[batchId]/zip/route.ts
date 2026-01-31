import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import archiver from "archiver";
import path from "path";
import { readFile } from "fs/promises";
import https from "https";

/**
 * Fetch URL using native https module
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

  // If ZIP already generated, redirect to it
  if (batch.zipUrl) {
    return NextResponse.redirect(batch.zipUrl);
  }

  try {
    // Create ZIP archive
    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    archive.on("data", (chunk: Buffer) => chunks.push(chunk));

    // Add each badge image to archive
    for (const badge of batch.badges) {
      let buffer: Buffer | null = null;

      if (badge.imageUrl?.startsWith("https://")) {
        // Use native https for better reliability
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            buffer = await fetchBuffer(badge.imageUrl);
            break;
          } catch (err) {
            console.warn(`ZIP fetch attempt ${attempt + 1} failed for ${badge.firstName}:`, err);
            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      } else if (badge.imageUrl?.startsWith("http://")) {
        // Fallback to fetch for http URLs
        const response = await fetch(badge.imageUrl);
        if (response.ok) {
          buffer = Buffer.from(await response.arrayBuffer());
        }
      } else if (badge.imageUrl) {
        // Local file
        const filepath = path.join(process.cwd(), "public", badge.imageUrl);
        buffer = await readFile(filepath);
      }

      if (!buffer) {
        continue; // Skip badges without images
      }

      // Create safe filename
      const filename = `${badge.firstName}_${badge.lastName}_${badge.company}.png`
        .replace(/[^a-zA-Z0-9_.-]/g, "_");

      archive.append(buffer, { name: filename });
    }

    await archive.finalize();

    const zipBuffer = Buffer.concat(chunks);

    // Store ZIP for future requests
    if (useVercelBlob) {
      const blob = await put(`badges/${batchId}/badges.zip`, zipBuffer, {
        access: "public",
        contentType: "application/zip",
      });

      // Update batch
      await prisma.badgeBatch.update({
        where: { id: batchId },
        data: { zipUrl: blob.url },
      });
    }

    const safeFilename = batch.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    return new Response(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="badges_${safeFilename}.zip"`,
      },
    });
  } catch (error) {
    console.error("ZIP generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la generation du ZIP" },
      { status: 500 }
    );
  }
}
