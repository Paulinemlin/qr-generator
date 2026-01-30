import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, PlanType } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Export tous les QR codes de l'utilisateur en CSV
 * Fonctionnalite reservee aux plans PRO et BUSINESS
 */
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier le plan de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });
  }

  const plan = user.plan as PlanType;
  if (plan === "FREE") {
    return NextResponse.json(
      { error: "L'export CSV est reserve aux plans Pro et Business. Passez a un plan superieur pour acceder a cette fonctionnalite." },
      { status: 403 }
    );
  }

  // Recuperer tous les QR codes de l'utilisateur avec leurs stats
  const qrcodes = await prisma.qRCode.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { scans: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Generer le contenu CSV
  const headers = ["name", "type", "targetUrl", "scans", "createdAt", "qrImageUrl"];
  const csvLines: string[] = [headers.join(",")];

  for (const qr of qrcodes) {
    const row = [
      escapeCSV(qr.name),
      escapeCSV(qr.type),
      escapeCSV(qr.targetUrl),
      qr._count.scans.toString(),
      qr.createdAt.toISOString(),
      escapeCSV(qr.qrImageUrl || ""),
    ];
    csvLines.push(row.join(","));
  }

  const csvContent = csvLines.join("\n");

  // Retourner le fichier CSV
  const response = new NextResponse(csvContent);
  response.headers.set("Content-Type", "text/csv; charset=utf-8");
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="qrcodes_export_${new Date().toISOString().split("T")[0]}.csv"`
  );

  return response;
}

/**
 * Echappe une valeur pour le format CSV
 */
function escapeCSV(value: string): string {
  if (!value) return '""';
  // Si la valeur contient des virgules, guillemets ou sauts de ligne, l'entourer de guillemets
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    // Doubler les guillemets existants
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
