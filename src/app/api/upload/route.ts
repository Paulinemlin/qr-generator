import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// Check if Vercel Blob is configured (production)
const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non supporté. Utilisez PNG, JPG ou WebP." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 5MB)" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "png";
    const filename = `${session.user.id}-${Date.now()}.${ext}`;

    let url: string;

    if (useVercelBlob) {
      // Production: Use Vercel Blob
      const blob = await put(`logos/${filename}`, file, {
        access: "public",
      });
      url = blob.url;
    } else {
      // Development: Use local storage
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const filepath = path.join(uploadsDir, filename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      url = `/uploads/${filename}`;
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
