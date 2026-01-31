"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BadgeConfig,
  BadgePreview,
  DEFAULT_BADGE_CONFIG,
  BADGE_FORMATS,
  BADGE_CATEGORY_COLORS,
  BORDER_PATTERNS,
  LOGO_SIZE_PRESETS,
  LOGO_POSITIONS,
  FONT_PRESETS,
  BadgeFormat,
  BadgeCategory,
  BorderPattern,
  LogoPosition,
  BadgeFont,
} from "@/types/badge";

interface UserInfo {
  plan: "FREE" | "PRO" | "BUSINESS";
}

interface ImportResult {
  batchId: string;
  totalCount: number;
  processedCount: number;
  errorCount: number;
  errors: { row: number; error: string }[];
  status: string;
}

interface PreviewResult {
  totalRows: number;
  previews: BadgePreview[];
  parseErrors: { row: number; error: string }[];
  previewErrors: { row: number; error: string }[];
}

// Sample data for live preview
const SAMPLE_BADGE = {
  firstName: "Marie",
  lastName: "Dupont",
  company: "Tech Solutions",
  website: "https://example.com",
};

// Generate live preview SVG (client-side, no API call)
function generateLivePreviewSVG(config: BadgeConfig): string {
  const format = BADGE_FORMATS[config.format] || BADGE_FORMATS.standard;
  // Swap dimensions for portrait orientation
  const width = config.orientation === "portrait" ? format.height : format.width;
  const height = config.orientation === "portrait" ? format.width : format.height;
  const scaleFactor = Math.max(width, height) / 1004;

  const {
    backgroundColor,
    textColor,
    qrPosition,
    qrSize = 200,
    borderWidth = 0,
    borderColor,
    borderSecondaryColor,
    borderPattern = "solid",
    eventName,
    eventLogoUrl,
    eventLogoPosition = "top-left",
    eventLogoSize = 150,
    companyLogoUrl,
    companyLogoPosition = "top-right",
    companyLogoSize = 100,
    contentLayout = "side-by-side",
    font = "sans",
  } = config;

  // Get font family from presets
  const fontFamily = FONT_PRESETS.find(f => f.value === font)?.family || FONT_PRESETS[0].family;

  const effectiveBorderWidth = borderWidth * scaleFactor;
  const scaledQrSize = qrSize * scaleFactor;
  const qrMargin = Math.round(width * 0.04);

  // Calculate logo space based on largest logo
  const hasEventLogo = !!eventLogoUrl;
  const hasCompanyLogo = !!companyLogoUrl;
  const maxLogoSize = Math.max(
    hasEventLogo ? eventLogoSize : 0,
    hasCompanyLogo ? companyLogoSize : 0
  );
  const logoSpace = maxLogoSize > 0 ? maxLogoSize * scaleFactor * 0.5 + 20 : 0;

  let textX: number;
  let textY: number;
  let nameFontSize: number;
  let qrX: number;
  let qrY: number;

  if (contentLayout === "centered") {
    // Centered layout: text centered, QR at bottom center
    textX = width / 2;
    const availableHeight = height - effectiveBorderWidth * 2 - logoSpace - scaledQrSize - 60 * scaleFactor;
    textY = effectiveBorderWidth + logoSpace + availableHeight * 0.4;
    nameFontSize = Math.min(72 * scaleFactor, (width - effectiveBorderWidth * 2) / 10);
    qrX = (width - scaledQrSize) / 2;
    qrY = height - scaledQrSize - 40 * scaleFactor - effectiveBorderWidth;
  } else {
    // Side-by-side layout
    const textAreaWidth = width - scaledQrSize - qrMargin * 3 - effectiveBorderWidth * 2;
    textX = qrPosition === "right"
      ? textAreaWidth / 2 + qrMargin + effectiveBorderWidth
      : width - textAreaWidth / 2 - qrMargin - effectiveBorderWidth;
    textY = effectiveBorderWidth + logoSpace + (height - effectiveBorderWidth * 2 - logoSpace) * 0.35;
    nameFontSize = Math.min(64 * scaleFactor, textAreaWidth / 8);
    qrX = qrPosition === "right"
      ? width - scaledQrSize - qrMargin - effectiveBorderWidth
      : qrMargin + effectiveBorderWidth;
    qrY = (height - scaledQrSize) / 2;
  }

  const companyFontSize = nameFontSize * 0.55;
  const eventFontSize = companyFontSize * 0.7;

  // Generate border SVG based on pattern
  let borderSvg = "";
  if (effectiveBorderWidth > 0 && borderColor) {
    const x = effectiveBorderWidth / 2;
    const y = effectiveBorderWidth / 2;
    const w = width - effectiveBorderWidth;
    const h = height - effectiveBorderWidth;
    const rx = 8;
    const gradientId = `grad-${Math.random().toString(36).substring(2, 7)}`;
    const patternId = `pat-${Math.random().toString(36).substring(2, 7)}`;

    switch (borderPattern) {
      case "dashed":
        borderSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${borderColor}" stroke-width="${effectiveBorderWidth}" rx="${rx}" stroke-dasharray="${effectiveBorderWidth * 3} ${effectiveBorderWidth * 2}"/>`;
        break;
      case "dotted":
        borderSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${borderColor}" stroke-width="${effectiveBorderWidth}" rx="${rx}" stroke-dasharray="${effectiveBorderWidth} ${effectiveBorderWidth * 1.5}" stroke-linecap="round"/>`;
        break;
      case "double":
        const innerOffset = effectiveBorderWidth * 0.7;
        borderSvg = `
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${borderColor}" stroke-width="${effectiveBorderWidth * 0.35}" rx="${rx}"/>
          <rect x="${x + innerOffset}" y="${y + innerOffset}" width="${w - innerOffset * 2}" height="${h - innerOffset * 2}" fill="none" stroke="${borderColor}" stroke-width="${effectiveBorderWidth * 0.35}" rx="${rx}"/>
        `;
        break;
      case "gradient":
        const secondColor = borderSecondaryColor || adjustColorBrightness(borderColor, 40);
        borderSvg = `
          <defs>
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${borderColor}"/>
              <stop offset="50%" style="stop-color:${secondColor}"/>
              <stop offset="100%" style="stop-color:${borderColor}"/>
            </linearGradient>
          </defs>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="url(#${gradientId})" stroke-width="${effectiveBorderWidth}" rx="${rx}"/>
        `;
        break;
      case "striped":
        const stripeColor = borderSecondaryColor || adjustColorBrightness(borderColor, -30);
        const stripeSize = effectiveBorderWidth * 1.5;
        borderSvg = `
          <defs>
            <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="${stripeSize * 2}" height="${stripeSize * 2}" patternTransform="rotate(45)">
              <rect width="${stripeSize}" height="${stripeSize * 2}" fill="${borderColor}"/>
              <rect x="${stripeSize}" width="${stripeSize}" height="${stripeSize * 2}" fill="${stripeColor}"/>
            </pattern>
          </defs>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="url(#${patternId})" stroke-width="${effectiveBorderWidth}" rx="${rx}"/>
        `;
        break;
      default:
        borderSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${borderColor}" stroke-width="${effectiveBorderWidth}" rx="${rx}"/>`;
    }
  }

  // Logo position helper function with overlap avoidance
  const getLogoCoords = (
    position: string,
    size: number,
    otherLogoPosition?: string,
    otherLogoSize?: number
  ): { x: number; y: number } => {
    const logoMargin = Math.round(width * 0.03);
    const isBottom = position.startsWith("bottom");

    // Vertical position
    let y = isBottom
      ? height - size - logoMargin - effectiveBorderWidth
      : logoMargin + effectiveBorderWidth;

    // Horizontal position
    let x: number;
    if (position.endsWith("center")) {
      x = (width - size) / 2;
    } else if (position.endsWith("right")) {
      x = width - size - logoMargin - effectiveBorderWidth;
    } else {
      x = logoMargin + effectiveBorderWidth;
    }

    // Check for QR code overlap
    const qrPadding = 10;
    if (contentLayout === "centered") {
      // QR is at bottom center
      if (isBottom) {
        // Move logo above QR code if it would overlap
        const qrTop = height - scaledQrSize - 40 * scaleFactor - effectiveBorderWidth;
        if (y + size > qrTop - qrPadding) {
          y = qrTop - size - qrPadding;
        }
      }
    } else {
      // Side-by-side: QR is on left or right
      const qrLeft = qrPosition === "right"
        ? width - scaledQrSize - qrMargin - effectiveBorderWidth
        : qrMargin + effectiveBorderWidth;
      const qrRight = qrLeft + scaledQrSize;
      const qrTop = (height - scaledQrSize) / 2;
      const qrBottom = qrTop + scaledQrSize;

      // Check if logo would overlap with QR
      const logoRight = x + size;
      const logoBottom = y + size;
      const overlapsHorizontally = !(logoRight < qrLeft - qrPadding || x > qrRight + qrPadding);
      const overlapsVertically = !(logoBottom < qrTop - qrPadding || y > qrBottom + qrPadding);

      if (overlapsHorizontally && overlapsVertically) {
        // Move logo away from QR
        if (qrPosition === "right" && position.endsWith("right")) {
          x = qrLeft - size - qrPadding;
        } else if (qrPosition === "left" && position.endsWith("left")) {
          x = qrRight + qrPadding;
        }
      }
    }

    // Check for overlap with other logo
    if (otherLogoPosition && otherLogoSize && position === otherLogoPosition) {
      // Same position - stack vertically
      const otherIsAbove = !position.startsWith("bottom");
      if (otherIsAbove) {
        y = y + otherLogoSize + logoMargin;
      } else {
        y = y - otherLogoSize - logoMargin;
      }
    }

    return { x, y };
  };

  // Calculate logo sizes
  const scaledEventLogoSize = eventLogoUrl ? eventLogoSize * scaleFactor * 0.5 : 0;
  const scaledCompanyLogoSize = companyLogoUrl ? companyLogoSize * scaleFactor * 0.5 : 0;

  // Event logo
  let eventLogoSvg = "";
  if (eventLogoUrl) {
    const { x: logoX, y: logoY } = getLogoCoords(
      eventLogoPosition,
      scaledEventLogoSize,
      companyLogoUrl ? companyLogoPosition : undefined,
      scaledCompanyLogoSize
    );
    eventLogoSvg = `<image href="${eventLogoUrl}" x="${logoX}" y="${logoY}" width="${scaledEventLogoSize}" height="${scaledEventLogoSize}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  // Company logo
  let companyLogoSvg = "";
  if (companyLogoUrl) {
    const { x: logoX, y: logoY } = getLogoCoords(
      companyLogoPosition,
      scaledCompanyLogoSize,
      eventLogoUrl ? eventLogoPosition : undefined,
      scaledEventLogoSize
    );
    companyLogoSvg = `<image href="${companyLogoUrl}" x="${logoX}" y="${logoY}" width="${scaledCompanyLogoSize}" height="${scaledCompanyLogoSize}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${backgroundColor}" rx="8"/>
      ${borderSvg}
      ${eventLogoSvg}
      ${companyLogoSvg}
      <text x="${textX}" y="${textY}" text-anchor="middle" font-family="${fontFamily}" font-weight="600" font-size="${nameFontSize}" fill="${textColor}">
        ${SAMPLE_BADGE.firstName} ${SAMPLE_BADGE.lastName}
      </text>
      <text x="${textX}" y="${textY + nameFontSize + 16 * scaleFactor}" text-anchor="middle" font-family="${fontFamily}" font-size="${companyFontSize}" fill="${textColor}" opacity="0.7">
        ${SAMPLE_BADGE.company}
      </text>
      ${eventName ? `<text x="${width / 2}" y="${height - effectiveBorderWidth - 20 * scaleFactor}" text-anchor="middle" font-family="${fontFamily}" font-size="${eventFontSize}" fill="${textColor}" opacity="0.5">${eventName}</text>` : ""}
      <rect x="${qrX}" y="${qrY}" width="${scaledQrSize}" height="${scaledQrSize}" fill="${backgroundColor}" stroke="${textColor}" stroke-width="2" rx="4"/>
      <text x="${qrX + scaledQrSize / 2}" y="${qrY + scaledQrSize / 2 + 8}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${scaledQrSize * 0.12}" fill="${textColor}" opacity="0.3">QR Code</text>
    </svg>
  `;
}

function adjustColorBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function BadgeImportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Configuration state
  const [batchName, setBatchName] = useState("");
  const [config, setConfig] = useState<BadgeConfig>(DEFAULT_BADGE_CONFIG);

  // Preview state
  const [previewing, setPreviewing] = useState(false);
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const configVersionRef = useRef(0);

  // Import state
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<"format" | "style" | "logos">("format");

  // Generate live preview SVG
  const livePreviewSvg = useMemo(() => generateLivePreviewSVG(config), [config]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  // Auto-refresh preview when config changes (debounced)
  useEffect(() => {
    if (file && previewResult) {
      // Increment version to track latest config
      configVersionRef.current += 1;
      const currentVersion = configVersionRef.current;

      // Clear existing timeout
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }

      // Debounce preview refresh
      previewTimeoutRef.current = setTimeout(async () => {
        // Only refresh if this is still the latest version
        if (currentVersion === configVersionRef.current) {
          await generatePreview(file);
        }
      }, 800);
    }

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [config, file]);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/user/plan", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Erreur lors de la recuperation du plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setPreviewResult(null);
    setImportResult(null);

    // Auto-generate batch name from filename
    if (!batchName) {
      const name = selectedFile.name
        .replace(/\.(csv|xlsx|xls)$/i, "")
        .replace(/_/g, " ");
      setBatchName(name);
    }

    // Automatically generate preview
    await generatePreview(selectedFile);
  }, [batchName, config]);

  const generatePreview = async (fileToPreview: File) => {
    setPreviewing(true);
    setParseError(null);

    try {
      const formData = new FormData();
      formData.append("file", fileToPreview);
      formData.append("config", JSON.stringify(config));

      const res = await fetch("/api/badges/preview", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setParseError(data.error || "Erreur lors de la generation de l'apercu");
        return;
      }

      setPreviewResult(data);
    } catch (error) {
      setParseError("Erreur lors de la generation de l'apercu");
    } finally {
      setPreviewing(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const filename = droppedFile.name.toLowerCase();
      if (
        filename.endsWith(".csv") ||
        filename.endsWith(".xlsx") ||
        filename.endsWith(".xls") ||
        droppedFile.type === "text/csv" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.type === "application/vnd.ms-excel"
      ) {
        handleFile(droppedFile);
      } else {
        setParseError("Veuillez deposer un fichier CSV ou Excel (.xlsx)");
      }
    }
  }, [handleFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("config", JSON.stringify(config));
      formData.append("name", batchName || "Badge Batch");

      const res = await fetch("/api/badges/import", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setParseError(data.error || "Erreur lors de l'import");
        return;
      }

      setImportResult(data);
    } catch (error) {
      setParseError("Erreur lors de l'import");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = (format: "xlsx" | "csv" = "xlsx") => {
    window.location.href = `/api/badges/template?format=${format}`;
  };

  const downloadPDF = () => {
    if (importResult?.batchId) {
      window.location.href = `/api/badges/${importResult.batchId}/pdf`;
    }
  };

  const downloadZIP = () => {
    if (importResult?.batchId) {
      window.location.href = `/api/badges/${importResult.batchId}/zip`;
    }
  };

  const updateConfig = (updates: Partial<BadgeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };


  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-foreground" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!session) return null;

  // Check if user has access
  if (userInfo?.plan === "FREE") {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">QR Generator</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Retour au dashboard</Button>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-6 py-12">
          <Card className="border-0 bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Fonctionnalite Premium</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                L'import de badges evenement est reserve aux plans Pro et Business.
              </p>
              <Link href="/pricing">
                <Button>Passer au plan Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Template download bar */}
      <div className="border-b bg-background/80">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Import de badges</h1>
          <Button variant="outline" size="sm" onClick={() => downloadTemplate("xlsx")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Template
          </Button>
        </div>
      </div>

      {/* Success Result Banner */}
      {importResult && importResult.status === "completed" && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {importResult.processedCount} badge(s) genere(s)
                  </p>
                  {importResult.errorCount > 0 && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {importResult.errorCount} erreur(s)
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={downloadPDF}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={downloadZIP}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  ZIP
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Preview Panel */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Apercu en direct</CardTitle>
                  {previewing && (
                    <Badge variant="secondary" className="animate-pulse">
                      Mise a jour...
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Les modifications s'appliquent en temps reel
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div
                  className="bg-muted/50 rounded-lg p-3 flex items-center justify-center"
                  style={{
                    minHeight: config.orientation === "portrait"
                      ? (config.format === "a5" ? "280px" : "220px")
                      : (config.format === "a5" ? "180px" : "140px")
                  }}
                >
                  <div
                    className="shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                      maxWidth: config.orientation === "portrait"
                        ? (config.format === "a5" ? "180px" : "150px")
                        : (config.format === "a5" ? "280px" : "240px"),
                      width: "100%"
                    }}
                    dangerouslySetInnerHTML={{ __html: livePreviewSvg }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Exemple avec "{SAMPLE_BADGE.firstName} {SAMPLE_BADGE.lastName}" de {SAMPLE_BADGE.company}
                </p>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragActive
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : file
                        ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {previewResult ? `${previewResult.totalRows} invite(s)` : "Analyse en cours..."}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                          setPreviewResult(null);
                          setBatchName("");
                        }}
                        className="ml-auto text-muted-foreground hover:text-destructive p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                      <p className="font-medium">Deposez votre fichier</p>
                      <p className="text-sm text-muted-foreground">Excel (.xlsx) ou CSV</p>
                    </div>
                  )}
                </div>

                {parseError && (
                  <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{parseError}</p>
                  </div>
                )}

                {file && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      placeholder="Nom du lot (ex: Congres Tech 2024)"
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    />
                    <Button
                      onClick={handleImport}
                      disabled={importing || !previewResult || previewResult.totalRows === 0}
                      className="w-full"
                      size="lg"
                    >
                      {importing ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generation en cours...
                        </>
                      ) : (
                        <>
                          Generer {previewResult?.totalRows || 0} badge(s)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Real badges preview */}
            {previewResult && previewResult.previews.length > 0 && !previewing && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Badges generes</CardTitle>
                  <CardDescription>
                    Apercu des {previewResult.previews.length} premiers sur {previewResult.totalRows}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-3 grid-cols-1">
                    {previewResult.previews.map((preview, i) => (
                      <div key={i} className="border rounded-lg overflow-hidden bg-background">
                        <Image
                          src={preview.previewDataUrl}
                          alt={`Badge ${preview.firstName} ${preview.lastName}`}
                          width={600}
                          height={390}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Configuration Panel */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Tabbed Configuration */}
            <Card className="border-0 shadow-sm overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b bg-muted/30">
                <button
                  onClick={() => setActiveTab("format")}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-all relative flex items-center justify-center gap-2 ${
                    activeTab === "format"
                      ? "text-primary bg-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                  </svg>
                  Format
                  {activeTab === "format" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("style")}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-all relative flex items-center justify-center gap-2 ${
                    activeTab === "style"
                      ? "text-primary bg-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                  </svg>
                  Style
                  {activeTab === "style" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("logos")}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-all relative flex items-center justify-center gap-2 ${
                    activeTab === "logos"
                      ? "text-primary bg-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  Logos
                  {(config.eventLogoUrl || config.companyLogoUrl) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                  )}
                  {activeTab === "logos" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <CardContent className="p-4 space-y-5">
                {/* Format Tab */}
                {activeTab === "format" && (
                  <>
                    {/* Format presets */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Taille</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(BADGE_FORMATS) as [BadgeFormat, { label: string; width: number; height: number }][]).map(
                          ([key, { label }]) => (
                            <button
                              key={key}
                              onClick={() => updateConfig({ format: key })}
                              className={`py-3 px-4 rounded-xl border-2 text-sm transition-all ${
                                config.format === key
                                  ? "bg-primary/10 border-primary text-primary font-medium"
                                  : "bg-background hover:bg-muted border-transparent"
                              }`}
                            >
                              {label}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Orientation */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Orientation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateConfig({ orientation: "landscape" })}
                          className={`py-3 px-4 rounded-xl border-2 text-sm transition-all flex items-center justify-center gap-2 ${
                            config.orientation !== "portrait"
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-background hover:bg-muted border-transparent"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="6" width="18" height="12" rx="2" />
                          </svg>
                          Paysage
                        </button>
                        <button
                          onClick={() => updateConfig({ orientation: "portrait" })}
                          className={`py-3 px-4 rounded-xl border-2 text-sm transition-all flex items-center justify-center gap-2 ${
                            config.orientation === "portrait"
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-background hover:bg-muted border-transparent"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="6" y="3" width="12" height="18" rx="2" />
                          </svg>
                          Portrait
                        </button>
                      </div>
                    </div>

                    {/* Layout */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Disposition</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateConfig({ contentLayout: "side-by-side" })}
                          className={`py-3 px-4 rounded-xl border-2 text-sm transition-all flex flex-col items-center gap-2 ${
                            config.contentLayout !== "centered"
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-background hover:bg-muted border-transparent"
                          }`}
                        >
                          <div className="flex gap-1.5">
                            <div className="w-6 h-8 rounded bg-current opacity-30" />
                            <div className="w-4 h-4 rounded bg-current opacity-60" />
                          </div>
                          Cote a cote
                        </button>
                        <button
                          onClick={() => updateConfig({ contentLayout: "centered" })}
                          className={`py-3 px-4 rounded-xl border-2 text-sm transition-all flex flex-col items-center gap-2 ${
                            config.contentLayout === "centered"
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-background hover:bg-muted border-transparent"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-3 rounded bg-current opacity-30" />
                            <div className="w-4 h-4 rounded bg-current opacity-60" />
                          </div>
                          Centre
                        </button>
                      </div>
                    </div>

                    {/* QR Position - only show for side-by-side layout */}
                    {config.contentLayout !== "centered" && (
                      <div>
                        <label className="text-sm font-medium mb-3 block">Position QR code</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => updateConfig({ qrPosition: "left" })}
                            className={`py-3 px-4 rounded-xl border-2 text-sm transition-all flex items-center justify-center gap-2 ${
                              config.qrPosition === "left"
                                ? "bg-primary/10 border-primary text-primary font-medium"
                                : "bg-background hover:bg-muted border-transparent"
                            }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Gauche
                          </button>
                          <button
                            onClick={() => updateConfig({ qrPosition: "right" })}
                            className={`py-3 px-4 rounded-xl border-2 text-sm transition-all flex items-center justify-center gap-2 ${
                              config.qrPosition === "right"
                                ? "bg-primary/10 border-primary text-primary font-medium"
                                : "bg-background hover:bg-muted border-transparent"
                            }`}
                          >
                            Droite
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Style Tab */}
                {activeTab === "style" && (
                  <>
                    {/* Event Name */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nom de l'evenement</label>
                      <input
                        type="text"
                        value={config.eventName || ""}
                        onChange={(e) => updateConfig({ eventName: e.target.value || undefined })}
                        placeholder="Ex: Tech Summit 2024"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Affiche en bas du badge</p>
                    </div>

                    {/* Font selector */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Police</label>
                      <div className="grid grid-cols-4 gap-2">
                        {FONT_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            onClick={() => updateConfig({ font: preset.value as BadgeFont })}
                            className={`py-2.5 px-3 rounded-lg border text-sm transition-all ${
                              config.font === preset.value || (!config.font && preset.value === "sans")
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted border-muted"
                            }`}
                            style={{ fontFamily: preset.family }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Presets rapides</label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => updateConfig({
                            backgroundColor: "#ffffff",
                            textColor: "#1a1a1a",
                            badgeCategory: undefined,
                            borderWidth: 0,
                          })}
                          className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-transparent hover:border-muted transition-all"
                          title="Classique"
                        >
                          <div className="w-10 h-6 rounded bg-white border shadow-sm" />
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">Classique</span>
                        </button>
                        <button
                          onClick={() => updateConfig({
                            backgroundColor: "#1a1a1a",
                            textColor: "#ffffff",
                            badgeCategory: undefined,
                            borderWidth: 0,
                          })}
                          className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-transparent hover:border-muted transition-all"
                          title="Sombre"
                        >
                          <div className="w-10 h-6 rounded bg-gray-900 border shadow-sm" />
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">Sombre</span>
                        </button>
                        <button
                          onClick={() => updateConfig({
                            backgroundColor: "#ffffff",
                            textColor: "#1a1a1a",
                            badgeCategory: "vip",
                            borderColor: "#D4AF37",
                            borderWidth: 12,
                            borderPattern: "solid",
                          })}
                          className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-transparent hover:border-muted transition-all"
                          title="VIP Or"
                        >
                          <div className="w-10 h-6 rounded bg-white border-2 border-yellow-500 shadow-sm" />
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">VIP</span>
                        </button>
                        <button
                          onClick={() => updateConfig({
                            backgroundColor: "#EFF6FF",
                            textColor: "#1E40AF",
                            badgeCategory: "custom",
                            borderColor: "#3B82F6",
                            borderWidth: 8,
                            borderPattern: "solid",
                          })}
                          className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-transparent hover:border-muted transition-all"
                          title="Moderne"
                        >
                          <div className="w-10 h-6 rounded bg-blue-50 border-2 border-blue-500 shadow-sm" />
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">Moderne</span>
                        </button>
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Fond</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                            className="w-12 h-10 rounded-lg border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Texte</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.textColor}
                            onChange={(e) => updateConfig({ textColor: e.target.value })}
                            className="w-12 h-10 rounded-lg border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.textColor}
                            onChange={(e) => updateConfig({ textColor: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Border section */}
                    <div className="pt-2 border-t">
                      <label className="text-sm font-medium mb-3 block">Bordure</label>
                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        <button
                          onClick={() => updateConfig({ badgeCategory: undefined, borderWidth: 0, borderColor: undefined })}
                          className={`py-2 px-2 rounded-lg border text-xs transition-all ${
                            !config.badgeCategory
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          Aucune
                        </button>
                        {(Object.entries(BADGE_CATEGORY_COLORS) as [BadgeCategory, { color: string; label: string }][])
                          .filter(([key]) => key !== "custom")
                          .map(([key, { color, label }]) => (
                            <button
                              key={key}
                              onClick={() => updateConfig({
                                badgeCategory: key,
                                borderColor: color,
                                borderWidth: config.borderWidth || 8,
                              })}
                              className={`py-2 px-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-all ${
                                config.badgeCategory === key
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full shrink-0 ring-1 ring-inset ring-black/10"
                                style={{ backgroundColor: color }}
                              />
                              <span className="truncate">{label.split(" ")[0]}</span>
                            </button>
                          ))}
                        <button
                          onClick={() => updateConfig({
                            badgeCategory: "custom",
                            borderWidth: config.borderWidth || 8,
                          })}
                          className={`py-2 px-2 rounded-lg border text-xs transition-all ${
                            config.badgeCategory === "custom"
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          Autre...
                        </button>
                      </div>

                      {config.badgeCategory && (
                        <div className="space-y-3 p-3 bg-muted/50 rounded-xl">
                          {/* Custom color */}
                          {config.badgeCategory === "custom" && (
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={config.borderColor || "#000000"}
                                onChange={(e) => updateConfig({ borderColor: e.target.value })}
                                className="w-10 h-8 rounded border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={config.borderColor || "#000000"}
                                onChange={(e) => updateConfig({ borderColor: e.target.value })}
                                className="flex-1 px-2 py-1 border rounded-lg bg-background text-sm font-mono"
                              />
                            </div>
                          )}

                          {/* Width slider */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Epaisseur</span>
                              <span className="text-xs font-medium tabular-nums">{config.borderWidth || 8}px</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="64"
                              step="2"
                              value={config.borderWidth || 8}
                              onChange={(e) => updateConfig({ borderWidth: parseInt(e.target.value) })}
                              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          {/* Pattern */}
                          <div className="flex gap-1">
                            {(Object.entries(BORDER_PATTERNS) as [BorderPattern, { label: string; icon: string }][]).map(
                              ([key, { label, icon }]) => (
                                <button
                                  key={key}
                                  onClick={() => updateConfig({ borderPattern: key })}
                                  className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                                    config.borderPattern === key
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background hover:bg-muted"
                                  }`}
                                  title={label}
                                >
                                  <span className="font-mono">{icon}</span>
                                </button>
                              )
                            )}
                          </div>

                          {/* Secondary color for gradient/striped */}
                          {(config.borderPattern === "gradient" || config.borderPattern === "striped") && (
                            <div className="flex gap-2 items-center">
                              <span className="text-xs text-muted-foreground">2e couleur:</span>
                              <input
                                type="color"
                                value={config.borderSecondaryColor || config.borderColor || "#666666"}
                                onChange={(e) => updateConfig({ borderSecondaryColor: e.target.value })}
                                className="w-8 h-6 rounded border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={config.borderSecondaryColor || ""}
                                onChange={(e) => updateConfig({ borderSecondaryColor: e.target.value || undefined })}
                                className="flex-1 px-2 py-1 border rounded-lg bg-background text-xs font-mono"
                                placeholder="Auto"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </>
                )}

                {/* Logos Tab */}
                {activeTab === "logos" && (
                  <div className="space-y-4">
                    {/* Event Logo */}
                    <div className="p-4 border-2 border-dashed rounded-xl hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {config.eventLogoUrl ? (
                            <img
                              src={config.eventLogoUrl}
                              alt="Logo evenement"
                              className="w-8 h-8 object-contain rounded"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <path d="M15 8h.01" />
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="m3 16 5-5c.928-.893 2.072-.893 3 0l5 5" />
                              <path d="m14 14 1-1c.928-.893 2.072-.893 3 0l3 3" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Logo evenement</p>
                          <p className="text-xs text-muted-foreground">Apparait sur tous les badges</p>
                        </div>
                        {config.eventLogoUrl && (
                          <button
                            onClick={() => updateConfig({ eventLogoUrl: undefined })}
                            className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {!config.eventLogoUrl ? (
                        <label className="block cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const logoFile = e.target.files?.[0];
                              if (logoFile) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  updateConfig({ eventLogoUrl: event.target?.result as string });
                                };
                                reader.readAsDataURL(logoFile);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-muted/50 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                            Choisir une image
                          </div>
                        </label>
                      ) : (
                        <div className="space-y-3">
                          {/* Visual position selector */}
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Position</label>
                            <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1.5 rounded-lg">
                              {LOGO_POSITIONS.map((pos) => (
                                <button
                                  key={pos.value}
                                  onClick={() => updateConfig({ eventLogoPosition: pos.value as LogoPosition })}
                                  className={`py-2 rounded-md text-sm transition-all ${
                                    config.eventLogoPosition === pos.value
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "hover:bg-muted"
                                  }`}
                                  title={pos.label}
                                >
                                  {pos.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Size */}
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Taille</label>
                            <div className="flex gap-1">
                              {LOGO_SIZE_PRESETS.map((preset) => (
                                <button
                                  key={preset.value}
                                  onClick={() => updateConfig({ eventLogoSize: preset.value })}
                                  className={`flex-1 py-1.5 rounded-md border text-xs transition-all ${
                                    config.eventLogoSize === preset.value
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background hover:bg-muted"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Company Logo */}
                    <div className="p-4 border-2 border-dashed rounded-xl hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {config.companyLogoUrl ? (
                            <img
                              src={config.companyLogoUrl}
                              alt="Logo entreprise"
                              className="w-8 h-8 object-contain rounded"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                              <path d="M10 6h4" />
                              <path d="M10 10h4" />
                              <path d="M10 14h4" />
                              <path d="M10 18h4" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Logo entreprise</p>
                          <p className="text-xs text-muted-foreground">Logo de votre societe</p>
                        </div>
                        {config.companyLogoUrl && (
                          <button
                            onClick={() => updateConfig({ companyLogoUrl: undefined })}
                            className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {!config.companyLogoUrl ? (
                        <label className="block cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const logoFile = e.target.files?.[0];
                              if (logoFile) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  updateConfig({ companyLogoUrl: event.target?.result as string });
                                };
                                reader.readAsDataURL(logoFile);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-muted/50 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                            Choisir une image
                          </div>
                        </label>
                      ) : (
                        <div className="space-y-3">
                          {/* Visual position selector */}
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Position</label>
                            <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1.5 rounded-lg">
                              {LOGO_POSITIONS.map((pos) => (
                                <button
                                  key={pos.value}
                                  onClick={() => updateConfig({ companyLogoPosition: pos.value as LogoPosition })}
                                  className={`py-2 rounded-md text-sm transition-all ${
                                    config.companyLogoPosition === pos.value
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "hover:bg-muted"
                                  }`}
                                  title={pos.label}
                                >
                                  {pos.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Size */}
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">Taille</label>
                            <div className="flex gap-1">
                              {LOGO_SIZE_PRESETS.map((preset) => (
                                <button
                                  key={preset.value}
                                  onClick={() => updateConfig({ companyLogoSize: preset.value })}
                                  className={`flex-1 py-1.5 rounded-md border text-xs transition-all ${
                                    config.companyLogoSize === preset.value
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background hover:bg-muted"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tip */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      <p>Utilisez des images PNG avec fond transparent pour un meilleur rendu.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl text-xs text-muted-foreground">
              <div className="flex-1 space-y-0.5">
                <p><span className="font-medium text-foreground">Colonnes:</span> firstName, lastName, company</p>
                <p><span className="font-medium text-foreground">QR:</span> website ou linkedin</p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {userInfo?.plan === "PRO" ? "50" : "200"} max
              </Badge>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
