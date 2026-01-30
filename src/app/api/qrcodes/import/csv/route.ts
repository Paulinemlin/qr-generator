import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, PlanType } from "@/lib/stripe";
import { generateQRCodeDataURL } from "@/lib/qr-generator";

export const dynamic = "force-dynamic";

// Limites d'import par plan
const IMPORT_LIMITS: Record<PlanType, number> = {
  FREE: 0, // Pas d'import pour FREE
  PRO: 50,
  BUSINESS: 100,
};

interface ImportError {
  line: number;
  error: string;
}

interface ImportResult {
  created: number;
  errors: ImportError[];
}

interface CSVRow {
  name?: string;
  type?: string;
  targetUrl?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  size?: string;
}

/**
 * Import de QR codes en masse via CSV
 * Fonctionnalite reservee aux plans PRO et BUSINESS
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier le plan de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      _count: { select: { qrcodes: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });
  }

  const plan = user.plan as PlanType;
  if (plan === "FREE") {
    return NextResponse.json(
      { error: "L'import CSV est reserve aux plans Pro et Business. Passez a un plan superieur pour acceder a cette fonctionnalite." },
      { status: 403 }
    );
  }

  // Recuperer le fichier CSV
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  // Verifier le type de fichier
  if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
    return NextResponse.json({ error: "Le fichier doit etre au format CSV" }, { status: 400 });
  }

  // Lire le contenu du fichier
  const content = await file.text();
  const lines = content.split(/\r?\n/).filter((line) => line.trim());

  if (lines.length < 2) {
    return NextResponse.json({ error: "Le fichier CSV doit contenir au moins une ligne de donnees (en plus de l'en-tete)" }, { status: 400 });
  }

  // Parser l'en-tete
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().trim());

  // Verifier les colonnes requises
  const requiredColumns = ["name", "type", "targeturl"];
  const missingColumns = requiredColumns.filter((col) => !headers.includes(col));
  if (missingColumns.length > 0) {
    return NextResponse.json(
      { error: `Colonnes manquantes: ${missingColumns.join(", ")}. Les colonnes requises sont: name, type, targetUrl` },
      { status: 400 }
    );
  }

  // Verifier la limite d'import
  const dataLines = lines.slice(1);
  const importLimit = IMPORT_LIMITS[plan];
  if (dataLines.length > importLimit) {
    return NextResponse.json(
      { error: `Limite d'import depassee. Votre plan ${PLANS[plan].name} permet d'importer jusqu'a ${importLimit} QR codes a la fois. Vous essayez d'en importer ${dataLines.length}.` },
      { status: 400 }
    );
  }

  // Verifier la limite de QR codes totale (pour les plans avec limite)
  const planLimits = PLANS[plan].limits;
  if (planLimits.qrcodes !== -1) {
    const remainingSlots = planLimits.qrcodes - user._count.qrcodes;
    if (dataLines.length > remainingSlots) {
      return NextResponse.json(
        { error: `Vous n'avez que ${remainingSlots} emplacement(s) disponible(s) sur votre plan. Reduisez le nombre de QR codes a importer ou passez a un plan superieur.` },
        { status: 400 }
      );
    }
  }

  // Traiter chaque ligne
  const result: ImportResult = { created: 0, errors: [] };
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  for (let i = 0; i < dataLines.length; i++) {
    const lineNumber = i + 2; // +2 car on commence a 1 et on saute l'en-tete
    const line = dataLines[i].trim();

    if (!line) continue;

    try {
      const values = parseCSVLine(line);
      const row: CSVRow = {};

      // Mapper les valeurs aux colonnes
      headers.forEach((header, index) => {
        if (values[index] !== undefined) {
          (row as Record<string, string>)[header] = values[index];
        }
      });

      // Valider les donnees
      if (!row.name || row.name.trim() === "") {
        result.errors.push({ line: lineNumber, error: "Le nom est requis" });
        continue;
      }

      if (!row.targetUrl && !(row as Record<string, string>).targeturl) {
        result.errors.push({ line: lineNumber, error: "L'URL cible est requise" });
        continue;
      }

      const targetUrl = row.targetUrl || (row as Record<string, string>).targeturl;

      // Valider l'URL
      try {
        new URL(targetUrl);
      } catch {
        result.errors.push({ line: lineNumber, error: `URL invalide: ${targetUrl}` });
        continue;
      }

      // Valider et nettoyer les options
      const type = row.type || "url";
      const validTypes = ["url", "wifi", "vcard", "email", "sms", "phone"];
      if (!validTypes.includes(type.toLowerCase())) {
        result.errors.push({ line: lineNumber, error: `Type invalide: ${type}. Types valides: ${validTypes.join(", ")}` });
        continue;
      }

      // Couleurs (validation)
      const colorRegex = /^#[0-9A-Fa-f]{6}$/;
      const foregroundColor = row.foregroundColor || (row as Record<string, string>).foregroundcolor || "#000000";
      const backgroundColor = row.backgroundColor || (row as Record<string, string>).backgroundcolor || "#ffffff";

      if (!colorRegex.test(foregroundColor)) {
        result.errors.push({ line: lineNumber, error: `Couleur de premier plan invalide: ${foregroundColor}. Format attendu: #RRGGBB` });
        continue;
      }
      if (!colorRegex.test(backgroundColor)) {
        result.errors.push({ line: lineNumber, error: `Couleur d'arriere-plan invalide: ${backgroundColor}. Format attendu: #RRGGBB` });
        continue;
      }

      // Taille
      let size = 400;
      if (row.size) {
        const parsedSize = parseInt(row.size, 10);
        if (isNaN(parsedSize) || parsedSize < 100 || parsedSize > 2000) {
          result.errors.push({ line: lineNumber, error: `Taille invalide: ${row.size}. La taille doit etre entre 100 et 2000` });
          continue;
        }
        size = parsedSize;
      }

      // Creer le QR code
      const qrcode = await prisma.qRCode.create({
        data: {
          name: row.name.trim(),
          type: type.toLowerCase(),
          targetUrl,
          qrContent: targetUrl,
          foregroundColor,
          backgroundColor,
          size,
          cornerStyle: "square",
          userId: session.user.id,
        },
      });

      // Generer l'image QR
      const qrImageContent = type.toLowerCase() === "url"
        ? `${baseUrl}/r/${qrcode.id}`
        : targetUrl;

      const qrImageUrl = await generateQRCodeDataURL({
        url: qrImageContent,
        size,
        foregroundColor,
        backgroundColor,
        cornerStyle: "square",
      });

      await prisma.qRCode.update({
        where: { id: qrcode.id },
        data: { qrImageUrl },
      });

      result.created++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      result.errors.push({ line: lineNumber, error: errorMessage });
    }
  }

  return NextResponse.json(result);
}

/**
 * Parse une ligne CSV en tenant compte des guillemets
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Guillemet echappe
        current += '"';
        i++;
      } else {
        // Debut ou fin de champ entre guillemets
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}
