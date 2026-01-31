import sharp from "sharp";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { BadgeData, BadgeConfig, DEFAULT_BADGE_CONFIG, BADGE_FORMATS, BorderPattern, LogoPosition, FONT_PRESETS } from "@/types/badge";

/**
 * Generate border SVG based on pattern
 */
function generateBorderSVG(
  width: number,
  height: number,
  borderWidth: number,
  borderColor: string,
  borderSecondaryColor: string | undefined,
  pattern: BorderPattern
): string {
  const x = borderWidth / 2;
  const y = borderWidth / 2;
  const w = width - borderWidth;
  const h = height - borderWidth;
  const rx = 8;

  // Generate unique IDs for gradients/patterns
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const patternId = `pattern-${Math.random().toString(36).substr(2, 9)}`;

  let defs = "";
  let strokeAttr = `stroke="${borderColor}"`;
  let extraElements = "";

  switch (pattern) {
    case "dashed":
      return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"
          stroke="${borderColor}" stroke-width="${borderWidth}" rx="${rx}" ry="${rx}"
          stroke-dasharray="${borderWidth * 3} ${borderWidth * 2}" />
      `;

    case "dotted":
      return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"
          stroke="${borderColor}" stroke-width="${borderWidth}" rx="${rx}" ry="${rx}"
          stroke-dasharray="${borderWidth} ${borderWidth * 1.5}" stroke-linecap="round" />
      `;

    case "double":
      const innerOffset = borderWidth * 0.7;
      return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"
          stroke="${borderColor}" stroke-width="${borderWidth * 0.35}" rx="${rx}" ry="${rx}" />
        <rect x="${x + innerOffset}" y="${y + innerOffset}" width="${w - innerOffset * 2}" height="${h - innerOffset * 2}" fill="none"
          stroke="${borderColor}" stroke-width="${borderWidth * 0.35}" rx="${rx}" ry="${rx}" />
      `;

    case "gradient":
      const secondColor = borderSecondaryColor || adjustColor(borderColor, 40);
      defs = `
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${borderColor}" />
            <stop offset="50%" style="stop-color:${secondColor}" />
            <stop offset="100%" style="stop-color:${borderColor}" />
          </linearGradient>
        </defs>
      `;
      strokeAttr = `stroke="url(#${gradientId})"`;
      return `
        ${defs}
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"
          ${strokeAttr} stroke-width="${borderWidth}" rx="${rx}" ry="${rx}" />
      `;

    case "striped":
      const stripeColor = borderSecondaryColor || adjustColor(borderColor, -30);
      const stripeSize = borderWidth * 1.5;
      defs = `
        <defs>
          <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="${stripeSize * 2}" height="${stripeSize * 2}" patternTransform="rotate(45)">
            <rect width="${stripeSize}" height="${stripeSize * 2}" fill="${borderColor}" />
            <rect x="${stripeSize}" width="${stripeSize}" height="${stripeSize * 2}" fill="${stripeColor}" />
          </pattern>
        </defs>
      `;
      return `
        ${defs}
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"
          stroke="url(#${patternId})" stroke-width="${borderWidth}" rx="${rx}" ry="${rx}" />
      `;

    case "solid":
    default:
      return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"
          stroke="${borderColor}" stroke-width="${borderWidth}" rx="${rx}" ry="${rx}" />
      `;
  }
}

/**
 * Adjust color brightness (positive = lighter, negative = darker)
 */
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Get badge dimensions from config (handles orientation)
 */
function getBadgeDimensions(config: BadgeConfig): { width: number; height: number } {
  const format = BADGE_FORMATS[config.format] || BADGE_FORMATS.standard;
  // Swap dimensions for portrait orientation
  if (config.orientation === "portrait") {
    return { width: format.height, height: format.width };
  }
  return { width: format.width, height: format.height };
}

/**
 * Escape special XML characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Create SVG text overlay for badge
 */
function createBadgeTextSVG(
  data: BadgeData,
  config: BadgeConfig
): string {
  const { width, height } = getBadgeDimensions(config);
  const {
    textColor,
    qrPosition,
    qrSize,
    borderWidth = 0,
    borderColor,
    borderSecondaryColor,
    borderPattern = "solid",
    eventName,
    contentLayout = "side-by-side",
    font = "sans",
  } = config;

  // Get font family from presets
  const fontPreset = FONT_PRESETS.find(f => f.value === font) || FONT_PRESETS[0];
  const fontFamily = fontPreset.family;

  // Adjust for border
  const effectiveBorderWidth = borderWidth || 0;
  const innerWidth = width - effectiveBorderWidth * 2;
  const innerHeight = height - effectiveBorderWidth * 2;

  // Font sizes - scale based on badge format
  const scaleFactor = Math.max(width, height) / 1004; // Use max dimension for scaling

  let textX: number;
  let textY: number;
  let nameFontSize: number;
  let companyFontSize: number;

  // Adjust Y position based on whether we have logos
  const hasEventLogo = !!(config.eventLogoUrl || config.logoUrl);
  const hasCompanyLogo = !!config.companyLogoUrl;
  const eventLogoSize = config.eventLogoSize || config.logoSize || 150;
  const companyLogoSize = config.companyLogoSize || 100;
  const maxLogoSize = Math.max(
    hasEventLogo ? eventLogoSize : 0,
    hasCompanyLogo ? companyLogoSize : 0
  );
  const logoSpace = maxLogoSize > 0 ? maxLogoSize + 40 : 0;

  if (contentLayout === "centered") {
    // Centered layout: text above QR code, both centered
    textX = width / 2;
    // Text in upper portion, leaving space for QR below
    const availableHeight = innerHeight - logoSpace - qrSize - 60 * scaleFactor;
    textY = effectiveBorderWidth + logoSpace + availableHeight * 0.4;
    nameFontSize = Math.min(72 * scaleFactor, innerWidth / 10);
    companyFontSize = Math.min(40 * scaleFactor, nameFontSize * 0.55);
  } else {
    // Side-by-side layout: text on one side, QR on the other
    const qrMargin = Math.round(width * 0.04); // 4% of width
    const textAreaWidth = innerWidth - qrSize - qrMargin * 3;
    textX =
      qrPosition === "right"
        ? textAreaWidth / 2 + qrMargin + effectiveBorderWidth
        : width - textAreaWidth / 2 - qrMargin - effectiveBorderWidth;
    textY = effectiveBorderWidth + logoSpace + (innerHeight - logoSpace) * 0.35;
    nameFontSize = Math.min(64 * scaleFactor, textAreaWidth / 8);
    companyFontSize = Math.min(36 * scaleFactor, nameFontSize * 0.55);
  }

  const eventFontSize = Math.min(24 * scaleFactor, companyFontSize * 0.7);
  const fullName = `${data.firstName} ${data.lastName}`;

  // Build SVG elements
  let svgContent = "";

  // Border with pattern
  if (effectiveBorderWidth > 0 && borderColor) {
    svgContent += generateBorderSVG(
      width,
      height,
      effectiveBorderWidth,
      borderColor,
      borderSecondaryColor,
      borderPattern
    );
  }

  // Name and company text
  svgContent += `
    <text
      x="${textX}"
      y="${textY}"
      text-anchor="middle"
      class="name"
      font-size="${nameFontSize}"
      fill="${textColor}">
      ${escapeXml(fullName)}
    </text>
    <text
      x="${textX}"
      y="${textY + nameFontSize + 16 * scaleFactor}"
      text-anchor="middle"
      class="company"
      font-size="${companyFontSize}"
      fill="${textColor}"
      opacity="0.7">
      ${escapeXml(data.company)}
    </text>
  `;

  // Event name at bottom
  if (eventName) {
    svgContent += `
      <text
        x="${width / 2}"
        y="${height - effectiveBorderWidth - 20 * scaleFactor}"
        text-anchor="middle"
        class="event"
        font-size="${eventFontSize}"
        fill="${textColor}"
        opacity="0.5">
        ${escapeXml(eventName)}
      </text>
    `;
  }

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .name {
          font-family: ${fontFamily};
          font-weight: 600;
        }
        .company, .event {
          font-family: ${fontFamily};
          font-weight: 400;
        }
      </style>
      ${svgContent}
    </svg>
  `;
}

/**
 * Get QR code position based on config
 */
function getQRPosition(
  config: BadgeConfig
): { top: number; left: number } {
  const { width, height } = getBadgeDimensions(config);
  const { qrSize, qrPosition, borderWidth = 0, contentLayout = "side-by-side" } = config;
  const qrMargin = Math.round(width * 0.04); // 4% of width
  const effectiveBorderWidth = borderWidth || 0;

  if (contentLayout === "centered") {
    // Centered layout: QR code at the bottom center
    const scaleFactor = Math.max(width, height) / 1004;
    const bottomMargin = 40 * scaleFactor;
    return {
      top: height - qrSize - bottomMargin - effectiveBorderWidth,
      left: Math.floor((width - qrSize) / 2),
    };
  }

  // Side-by-side layout
  const top = Math.floor((height - qrSize) / 2);
  const left =
    qrPosition === "right"
      ? width - qrSize - qrMargin - effectiveBorderWidth
      : qrMargin + effectiveBorderWidth;

  return { top, left };
}

/**
 * Get logo position based on position setting and size, with overlap avoidance
 */
function getLogoPosition(
  config: BadgeConfig,
  position: LogoPosition,
  logoSize: number,
  otherLogoPosition?: LogoPosition,
  otherLogoSize?: number
): { top: number; left: number } {
  const { width, height } = getBadgeDimensions(config);
  const { borderWidth = 0, qrPosition = "right", qrSize = 200, contentLayout = "side-by-side" } = config;
  const margin = Math.round(width * 0.03); // 3% of width
  const effectiveBorderWidth = borderWidth || 0;
  const qrMargin = Math.round(width * 0.04);
  const scaleFactor = Math.max(width, height) / 1004;

  // Determine vertical position
  const isBottom = position.startsWith("bottom");
  let top = isBottom
    ? height - logoSize - margin - effectiveBorderWidth
    : margin + effectiveBorderWidth;

  // Determine horizontal position
  let left: number;
  if (position.endsWith("center")) {
    left = Math.floor((width - logoSize) / 2);
  } else if (position.endsWith("right")) {
    left = width - logoSize - margin - effectiveBorderWidth;
  } else {
    left = margin + effectiveBorderWidth;
  }

  // Check for QR code overlap
  const qrPadding = 10;
  if (contentLayout === "centered") {
    // QR is at bottom center
    if (isBottom) {
      const qrTop = height - qrSize - 40 * scaleFactor - effectiveBorderWidth;
      if (top + logoSize > qrTop - qrPadding) {
        top = qrTop - logoSize - qrPadding;
      }
    }
  } else {
    // Side-by-side: QR is on left or right
    const qrLeft = qrPosition === "right"
      ? width - qrSize - qrMargin - effectiveBorderWidth
      : qrMargin + effectiveBorderWidth;
    const qrRight = qrLeft + qrSize;
    const qrTop = Math.floor((height - qrSize) / 2);
    const qrBottom = qrTop + qrSize;

    // Check if logo would overlap with QR
    const logoRight = left + logoSize;
    const logoBottom = top + logoSize;
    const overlapsHorizontally = !(logoRight < qrLeft - qrPadding || left > qrRight + qrPadding);
    const overlapsVertically = !(logoBottom < qrTop - qrPadding || top > qrBottom + qrPadding);

    if (overlapsHorizontally && overlapsVertically) {
      // Move logo away from QR
      if (qrPosition === "right" && position.endsWith("right")) {
        left = qrLeft - logoSize - qrPadding;
      } else if (qrPosition === "left" && position.endsWith("left")) {
        left = qrRight + qrPadding;
      }
    }
  }

  // Check for overlap with other logo
  if (otherLogoPosition && otherLogoSize && position === otherLogoPosition) {
    // Same position - stack vertically
    const otherIsAbove = !position.startsWith("bottom");
    if (otherIsAbove) {
      top = top + otherLogoSize + margin;
    } else {
      top = top - otherLogoSize - margin;
    }
  }

  return { top, left };
}

/**
 * Fetch and process logo image
 */
async function processLogo(
  logoUrl: string,
  maxSize: number
): Promise<Buffer | null> {
  try {
    let logoBuffer: Buffer;

    if (logoUrl.startsWith("data:")) {
      // Base64 data URL
      const base64Data = logoUrl.split(",")[1];
      logoBuffer = Buffer.from(base64Data, "base64");
    } else if (logoUrl.startsWith("http")) {
      // Remote URL
      const response = await fetch(logoUrl);
      if (!response.ok) return null;
      logoBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      return null;
    }

    // Resize logo to fit max size while maintaining aspect ratio
    const resizedLogo = await sharp(logoBuffer)
      .resize(maxSize, maxSize, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    return resizedLogo;
  } catch (error) {
    console.error("Error processing logo:", error);
    return null;
  }
}

/**
 * Generate QR code buffer for badge
 */
async function generateBadgeQRCode(
  url: string,
  size: number,
  foregroundColor: string,
  backgroundColor: string
): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    type: "png",
    width: size,
    margin: 1,
    color: {
      dark: foregroundColor,
      light: backgroundColor,
    },
  });
}

/**
 * Generate a complete badge image
 */
export async function generateBadgeImage(
  data: BadgeData,
  config: Partial<BadgeConfig> = {}
): Promise<Buffer> {
  // Merge with defaults
  const fullConfig: BadgeConfig = {
    ...DEFAULT_BADGE_CONFIG,
    ...config,
  };

  const { width, height } = getBadgeDimensions(fullConfig);
  const { backgroundColor, textColor } = fullConfig;

  // Scale QR size based on format
  const scaleFactor = width / 1004;
  const scaledQrSize = Math.round((fullConfig.qrSize || 200) * scaleFactor);
  fullConfig.qrSize = scaledQrSize;

  // Scale logo sizes based on format
  if (fullConfig.eventLogoSize) {
    fullConfig.eventLogoSize = Math.round(fullConfig.eventLogoSize * scaleFactor);
  }
  if (fullConfig.companyLogoSize) {
    fullConfig.companyLogoSize = Math.round(fullConfig.companyLogoSize * scaleFactor);
  }
  // Legacy support
  if (fullConfig.logoSize) {
    fullConfig.logoSize = Math.round(fullConfig.logoSize * scaleFactor);
  }

  // Scale border width based on format
  if (fullConfig.borderWidth) {
    fullConfig.borderWidth = Math.round(fullConfig.borderWidth * scaleFactor);
  }

  // Determine QR URL (website takes priority over linkedin)
  const qrUrl = data.website || data.linkedin || "";

  if (!qrUrl) {
    throw new Error("Website ou LinkedIn requis pour generer le QR code");
  }

  // Generate QR code
  const qrBuffer = await generateBadgeQRCode(
    qrUrl,
    scaledQrSize,
    textColor,
    backgroundColor
  );

  // Create text SVG overlay
  const textSvg = createBadgeTextSVG(data, fullConfig);
  const textBuffer = Buffer.from(textSvg);

  // Get QR position
  const qrPos = getQRPosition(fullConfig);

  // Build composite layers
  const compositeLayers: sharp.OverlayOptions[] = [
    // Text layer (SVG)
    {
      input: textBuffer,
      top: 0,
      left: 0,
    },
    // QR code
    {
      input: qrBuffer,
      top: qrPos.top,
      left: qrPos.left,
    },
  ];

  // Add event logo if provided
  const eventLogoUrl = fullConfig.eventLogoUrl || fullConfig.logoUrl; // Legacy support
  const eventLogoPosition = fullConfig.eventLogoPosition || fullConfig.logoPosition || "top-left";
  const companyLogoPosition = fullConfig.companyLogoPosition || "top-right";
  const eventLogoSize = eventLogoUrl ? (fullConfig.eventLogoSize || fullConfig.logoSize || Math.round(150 * scaleFactor)) : 0;
  const companyLogoSize = fullConfig.companyLogoUrl ? (fullConfig.companyLogoSize || Math.round(100 * scaleFactor)) : 0;

  if (eventLogoUrl) {
    const eventLogoBuffer = await processLogo(eventLogoUrl, eventLogoSize);
    if (eventLogoBuffer) {
      const eventLogoPos = getLogoPosition(
        fullConfig,
        eventLogoPosition,
        eventLogoSize,
        fullConfig.companyLogoUrl ? companyLogoPosition : undefined,
        companyLogoSize
      );
      compositeLayers.unshift({
        input: eventLogoBuffer,
        top: eventLogoPos.top,
        left: eventLogoPos.left,
      });
    }
  }

  // Add company logo if provided
  if (fullConfig.companyLogoUrl) {
    const companyLogoBuffer = await processLogo(fullConfig.companyLogoUrl, companyLogoSize);
    if (companyLogoBuffer) {
      const companyLogoPos = getLogoPosition(
        fullConfig,
        companyLogoPosition,
        companyLogoSize,
        eventLogoUrl ? eventLogoPosition : undefined,
        eventLogoSize
      );
      compositeLayers.unshift({
        input: companyLogoBuffer,
        top: companyLogoPos.top,
        left: companyLogoPos.left,
      });
    }
  }

  // Create base badge and composite all layers
  const badge = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: backgroundColor,
    },
  })
    .composite(compositeLayers)
    .png()
    .toBuffer();

  return badge;
}

/**
 * Generate badge image as data URL
 */
export async function generateBadgeDataURL(
  data: BadgeData,
  config: Partial<BadgeConfig> = {}
): Promise<string> {
  const buffer = await generateBadgeImage(data, config);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

/**
 * Parse CSV content for badge import
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
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

/**
 * Parse CSV content and extract badge data
 */
export function parseBadgeCSV(content: string): {
  rows: BadgeData[];
  errors: { row: number; error: string }[];
} {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  const errors: { row: number; error: string }[] = [];
  const rows: BadgeData[] = [];

  if (lines.length < 2) {
    errors.push({ row: 1, error: "Le fichier CSV doit contenir au moins une ligne de donnees" });
    return { rows, errors };
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());

  // Validate required columns
  const requiredCols = ["firstname", "lastname", "company"];
  const missingCols = requiredCols.filter((col) => !headers.includes(col));

  if (missingCols.length > 0) {
    errors.push({ row: 1, error: `Colonnes manquantes: ${missingCols.join(", ")}` });
    return { rows, errors };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const rowData: Record<string, string> = {};

    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        rowData[header] = values[index];
      }
    });

    const badgeData: BadgeData = {
      firstName: rowData.firstname || rowData.prenom || "",
      lastName: rowData.lastname || rowData.nom || "",
      company: rowData.company || rowData.entreprise || "",
      website: rowData.website || rowData.siteweb || "",
      linkedin: rowData.linkedin || "",
    };

    // Validate row
    if (!badgeData.firstName) {
      errors.push({ row: i + 1, error: "Prenom manquant" });
      continue;
    }
    if (!badgeData.lastName) {
      errors.push({ row: i + 1, error: "Nom manquant" });
      continue;
    }
    if (!badgeData.company) {
      errors.push({ row: i + 1, error: "Entreprise manquante" });
      continue;
    }
    if (!badgeData.website && !badgeData.linkedin) {
      errors.push({ row: i + 1, error: "Website ou LinkedIn requis" });
      continue;
    }

    rows.push(badgeData);
  }

  return { rows, errors };
}

/**
 * Get QR code URL from badge data (website takes priority)
 */
export function getQRCodeUrl(data: BadgeData): string {
  return data.website || data.linkedin || "";
}

/**
 * Parse Excel file content and extract badge data
 */
export function parseBadgeExcel(buffer: ArrayBuffer): {
  rows: BadgeData[];
  errors: { row: number; error: string }[];
} {
  const errors: { row: number; error: string }[] = [];
  const rows: BadgeData[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      errors.push({ row: 1, error: "Fichier Excel vide ou invalide" });
      return { rows, errors };
    }

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });

    if (data.length === 0) {
      errors.push({ row: 1, error: "Le fichier Excel doit contenir au moins une ligne de donnees" });
      return { rows, errors };
    }

    // Get headers from first row keys (normalized to lowercase)
    const firstRow = data[0];
    const headers = Object.keys(firstRow).map((h) => h.toLowerCase().trim());

    // Validate required columns
    const requiredCols = ["firstname", "lastname", "company"];
    const missingCols = requiredCols.filter((col) => !headers.includes(col));

    if (missingCols.length > 0) {
      errors.push({ row: 1, error: `Colonnes manquantes: ${missingCols.join(", ")}` });
      return { rows, errors };
    }

    // Parse data rows
    data.forEach((row, index) => {
      // Normalize keys to lowercase
      const rowData: Record<string, string> = {};
      Object.entries(row).forEach(([key, value]) => {
        rowData[key.toLowerCase().trim()] = String(value || "").trim();
      });

      const badgeData: BadgeData = {
        firstName: rowData.firstname || rowData.prenom || "",
        lastName: rowData.lastname || rowData.nom || "",
        company: rowData.company || rowData.entreprise || "",
        website: rowData.website || rowData.siteweb || "",
        linkedin: rowData.linkedin || "",
      };

      // Validate row
      const rowNum = index + 2; // +2 for header and 0-index
      if (!badgeData.firstName) {
        errors.push({ row: rowNum, error: "Prenom manquant" });
        return;
      }
      if (!badgeData.lastName) {
        errors.push({ row: rowNum, error: "Nom manquant" });
        return;
      }
      if (!badgeData.company) {
        errors.push({ row: rowNum, error: "Entreprise manquante" });
        return;
      }
      if (!badgeData.website && !badgeData.linkedin) {
        errors.push({ row: rowNum, error: "Website ou LinkedIn requis" });
        return;
      }

      rows.push(badgeData);
    });

    return { rows, errors };
  } catch (error) {
    errors.push({
      row: 1,
      error: `Erreur de lecture du fichier Excel: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
    });
    return { rows, errors };
  }
}

/**
 * Parse file (CSV or Excel) and extract badge data
 */
export async function parseBadgeFile(
  file: File
): Promise<{
  rows: BadgeData[];
  errors: { row: number; error: string }[];
}> {
  const filename = file.name.toLowerCase();

  if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
    const buffer = await file.arrayBuffer();
    return parseBadgeExcel(buffer);
  } else if (filename.endsWith(".csv") || file.type === "text/csv") {
    const content = await file.text();
    return parseBadgeCSV(content);
  } else {
    return {
      rows: [],
      errors: [{ row: 1, error: "Format de fichier non supporte. Utilisez CSV ou Excel (.xlsx)" }],
    };
  }
}

/**
 * Generate Excel template for badge import
 */
export function generateBadgeExcelTemplate(): Buffer {
  const data = [
    {
      firstName: "Jean",
      lastName: "Dupont",
      company: "Acme Corp",
      website: "https://acme.com",
      linkedin: "https://linkedin.com/in/jeandupont",
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      company: "Tech Solutions",
      website: "https://techsolutions.fr",
      linkedin: "",
    },
    {
      firstName: "Pierre",
      lastName: "Bernard",
      company: "StartupXYZ",
      website: "",
      linkedin: "https://linkedin.com/in/pierrebernard",
    },
    {
      firstName: "Sophie",
      lastName: "Durand",
      company: "Innovation Lab",
      website: "https://innovationlab.io",
      linkedin: "https://linkedin.com/in/sophiedurand",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 15 }, // firstName
    { wch: 15 }, // lastName
    { wch: 20 }, // company
    { wch: 30 }, // website
    { wch: 40 }, // linkedin
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Badges");

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(excelBuffer);
}
