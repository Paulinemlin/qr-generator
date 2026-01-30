import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkCanViewAnalytics } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

/**
 * Detecte le type d'appareil a partir du user agent
 */
function detecterAppareil(userAgent: string | null): "mobile" | "tablet" | "desktop" | "inconnu" {
  if (!userAgent) return "inconnu";

  const ua = userAgent.toLowerCase();

  // Detection tablette (avant mobile car certains user agents tablette contiennent "mobile")
  if (/ipad|android(?!.*mobile)|tablet|kindle|silk|playbook/i.test(ua)) {
    return "tablet";
  }

  // Detection mobile
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|opera mobi/i.test(ua)) {
    return "mobile";
  }

  return "desktop";
}

/**
 * Detecte le navigateur a partir du user agent
 */
function detecterNavigateur(userAgent: string | null): string {
  if (!userAgent) return "Inconnu";

  const ua = userAgent.toLowerCase();

  // Ordre important : les navigateurs bases sur Chromium se declarent aussi comme Chrome
  if (/edg/i.test(ua)) return "Edge";
  if (/opr|opera/i.test(ua)) return "Opera";
  if (/brave/i.test(ua)) return "Brave";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/msie|trident/i.test(ua)) return "Internet Explorer";
  if (/samsung/i.test(ua)) return "Samsung Internet";

  return "Autre";
}

/**
 * Genere les dates des N derniers jours
 */
function genererDatesJours(nombreJours: number): Date[] {
  const dates: Date[] = [];
  const aujourdHui = new Date();
  aujourdHui.setHours(0, 0, 0, 0);

  for (let i = nombreJours - 1; i >= 0; i--) {
    const date = new Date(aujourdHui);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
}

/**
 * Formate une date en YYYY-MM-DD
 */
function formaterDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export interface AnalyticsData {
  // Scans par jour (30 derniers jours)
  scansParJour: {
    date: string;
    label: string;
    scans: number;
  }[];

  // Scans par heure de la journee (0-23)
  scansParHeure: {
    heure: number;
    label: string;
    scans: number;
  }[];

  // Top pays
  topPays: {
    pays: string;
    scans: number;
    pourcentage: number;
  }[];

  // Repartition par appareil
  appareils: {
    type: string;
    scans: number;
    pourcentage: number;
  }[];

  // Repartition par navigateur
  navigateurs: {
    navigateur: string;
    scans: number;
    pourcentage: number;
  }[];

  // Totaux
  totalScans: number;
  scans7Jours: number;
  scans30Jours: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier si l'utilisateur peut voir les analytics
  const canView = await checkCanViewAnalytics(session.user.id);
  if (!canView.allowed) {
    return NextResponse.json(
      { error: canView.error, requiresUpgrade: true },
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

  // Recuperer tous les scans pour ce QR code
  const scans = await prisma.scan.findMany({
    where: {
      qrcodeId: id,
    },
    select: {
      userAgent: true,
      country: true,
      scannedAt: true,
    },
  });

  const totalScans = scans.length;

  // Calculer les dates limites
  const aujourdHui = new Date();
  aujourdHui.setHours(23, 59, 59, 999);

  const il7Jours = new Date();
  il7Jours.setDate(il7Jours.getDate() - 7);
  il7Jours.setHours(0, 0, 0, 0);

  const il30Jours = new Date();
  il30Jours.setDate(il30Jours.getDate() - 30);
  il30Jours.setHours(0, 0, 0, 0);

  // Scans des 7 et 30 derniers jours
  const scans7Jours = scans.filter(s => new Date(s.scannedAt) >= il7Jours).length;
  const scans30Jours = scans.filter(s => new Date(s.scannedAt) >= il30Jours).length;

  // --- Scans par jour (30 derniers jours) ---
  const dates30Jours = genererDatesJours(30);
  const scansParDateMap = new Map<string, number>();

  // Initialiser toutes les dates a 0
  dates30Jours.forEach(date => {
    scansParDateMap.set(formaterDate(date), 0);
  });

  // Compter les scans par date
  scans.forEach(scan => {
    const dateScan = new Date(scan.scannedAt);
    if (dateScan >= il30Jours) {
      const dateKey = formaterDate(dateScan);
      const count = scansParDateMap.get(dateKey) || 0;
      scansParDateMap.set(dateKey, count + 1);
    }
  });

  const scansParJour = dates30Jours.map(date => ({
    date: formaterDate(date),
    label: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    scans: scansParDateMap.get(formaterDate(date)) || 0,
  }));

  // --- Scans par heure de la journee ---
  const scansParHeureMap = new Map<number, number>();

  // Initialiser toutes les heures a 0
  for (let h = 0; h < 24; h++) {
    scansParHeureMap.set(h, 0);
  }

  // Compter les scans par heure
  scans.forEach(scan => {
    const heure = new Date(scan.scannedAt).getHours();
    const count = scansParHeureMap.get(heure) || 0;
    scansParHeureMap.set(heure, count + 1);
  });

  const scansParHeure = Array.from({ length: 24 }, (_, h) => ({
    heure: h,
    label: `${h}h`,
    scans: scansParHeureMap.get(h) || 0,
  }));

  // --- Top pays ---
  const paysMap = new Map<string, number>();
  scans.forEach(scan => {
    const pays = scan.country || "Inconnu";
    const count = paysMap.get(pays) || 0;
    paysMap.set(pays, count + 1);
  });

  const topPays = Array.from(paysMap.entries())
    .map(([pays, scanCount]) => ({
      pays,
      scans: scanCount,
      pourcentage: totalScans > 0 ? Math.round((scanCount / totalScans) * 100) : 0,
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5);

  // --- Repartition par appareil ---
  const appareilsMap = new Map<string, number>();
  scans.forEach(scan => {
    const appareil = detecterAppareil(scan.userAgent);
    const label = appareil === "mobile" ? "Mobile"
      : appareil === "tablet" ? "Tablette"
      : appareil === "desktop" ? "Desktop"
      : "Inconnu";
    const count = appareilsMap.get(label) || 0;
    appareilsMap.set(label, count + 1);
  });

  const appareils = Array.from(appareilsMap.entries())
    .map(([type, scanCount]) => ({
      type,
      scans: scanCount,
      pourcentage: totalScans > 0 ? Math.round((scanCount / totalScans) * 100) : 0,
    }))
    .sort((a, b) => b.scans - a.scans);

  // --- Repartition par navigateur ---
  const navigateursMap = new Map<string, number>();
  scans.forEach(scan => {
    const navigateur = detecterNavigateur(scan.userAgent);
    const count = navigateursMap.get(navigateur) || 0;
    navigateursMap.set(navigateur, count + 1);
  });

  const navigateurs = Array.from(navigateursMap.entries())
    .map(([navigateur, scanCount]) => ({
      navigateur,
      scans: scanCount,
      pourcentage: totalScans > 0 ? Math.round((scanCount / totalScans) * 100) : 0,
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5);

  const analyticsData: AnalyticsData = {
    scansParJour,
    scansParHeure,
    topPays,
    appareils,
    navigateurs,
    totalScans,
    scans7Jours,
    scans30Jours,
  };

  return NextResponse.json(analyticsData);
}
