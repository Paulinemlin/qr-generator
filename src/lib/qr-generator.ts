import QRCode from "qrcode";
import sharp from "sharp";
import path from "path";
import {
  TemplateId,
  ModuleShape,
  EyeShape,
  QR_TEMPLATES,
} from "./qr-templates";

export interface QRCodeOptions {
  url: string;
  logoPath?: string;
  size?: number;
  logoSizePercent?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  margin?: number;
  cornerStyle?: "square" | "rounded";
  // Options premium
  template?: TemplateId;
  moduleShape?: ModuleShape;
  eyeShape?: EyeShape;
  useGradient?: boolean;
  gradientColors?: [string, string];
  gradientDirection?: "horizontal" | "vertical" | "diagonal";
}

export type ExportFormat = "png" | "svg" | "jpeg" | "pdf";

async function getLogoBuffer(logoPath: string): Promise<Buffer> {
  // Handle HTTP/HTTPS URLs
  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    const response = await fetch(logoPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const fs = await import("fs/promises");

  // Handle local uploads (URLs starting with /uploads/)
  if (logoPath.startsWith("/uploads/") || logoPath.startsWith("/")) {
    const publicPath = path.join(process.cwd(), "public", logoPath);
    return fs.readFile(publicPath);
  }

  // Handle absolute filesystem paths
  return fs.readFile(logoPath);
}

// Genere le chemin SVG pour un module selon sa forme
function getModulePath(
  x: number,
  y: number,
  size: number,
  shape: ModuleShape
): string {
  switch (shape) {
    case "circle":
      const r = size / 2;
      const cx = x + r;
      const cy = y + r;
      return `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,0 ${size},0 a ${r},${r} 0 1,0 -${size},0`;
    case "diamond":
      const half = size / 2;
      return `M ${x + half},${y} L ${x + size},${y + half} L ${x + half},${y + size} L ${x},${y + half} Z`;
    case "square":
    default:
      return `M ${x},${y} h ${size} v ${size} h -${size} Z`;
  }
}

// Genere le chemin SVG pour un oeil (finder pattern) selon sa forme
function getEyePath(
  x: number,
  y: number,
  size: number,
  shape: EyeShape,
  isOuter: boolean
): string {
  const moduleSize = size / 7;

  if (isOuter) {
    // Cadre exterieur de l'oeil
    switch (shape) {
      case "circle":
        const outerR = size / 2;
        const outerCx = x + outerR;
        const outerCy = y + outerR;
        const innerR = outerR - moduleSize;
        return `
          M ${outerCx},${y}
          a ${outerR},${outerR} 0 1,1 0,${size}
          a ${outerR},${outerR} 0 1,1 0,-${size}
          M ${outerCx},${y + moduleSize}
          a ${innerR},${innerR} 0 1,0 0,${size - 2 * moduleSize}
          a ${innerR},${innerR} 0 1,0 0,-${size - 2 * moduleSize}
        `;
      case "leaf":
        const leafR = moduleSize * 1.5;
        return `
          M ${x + leafR},${y}
          H ${x + size - leafR}
          Q ${x + size},${y} ${x + size},${y + leafR}
          V ${y + size - leafR}
          Q ${x + size},${y + size} ${x + size - leafR},${y + size}
          H ${x + leafR}
          Q ${x},${y + size} ${x},${y + size - leafR}
          V ${y + leafR}
          Q ${x},${y} ${x + leafR},${y}
          Z
          M ${x + moduleSize + leafR * 0.7},${y + moduleSize}
          H ${x + size - moduleSize - leafR * 0.7}
          Q ${x + size - moduleSize},${y + moduleSize} ${x + size - moduleSize},${y + moduleSize + leafR * 0.7}
          V ${y + size - moduleSize - leafR * 0.7}
          Q ${x + size - moduleSize},${y + size - moduleSize} ${x + size - moduleSize - leafR * 0.7},${y + size - moduleSize}
          H ${x + moduleSize + leafR * 0.7}
          Q ${x + moduleSize},${y + size - moduleSize} ${x + moduleSize},${y + size - moduleSize - leafR * 0.7}
          V ${y + moduleSize + leafR * 0.7}
          Q ${x + moduleSize},${y + moduleSize} ${x + moduleSize + leafR * 0.7},${y + moduleSize}
          Z
        `;
      case "square":
      default:
        return `
          M ${x},${y} h ${size} v ${size} h -${size} Z
          M ${x + moduleSize},${y + moduleSize}
          v ${size - 2 * moduleSize}
          h ${size - 2 * moduleSize}
          v -${size - 2 * moduleSize} Z
        `;
    }
  } else {
    // Centre de l'oeil
    const innerSize = moduleSize * 3;
    const innerX = x + moduleSize * 2;
    const innerY = y + moduleSize * 2;

    switch (shape) {
      case "circle":
        const r = innerSize / 2;
        const cx = innerX + r;
        const cy = innerY + r;
        return `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,0 ${innerSize},0 a ${r},${r} 0 1,0 -${innerSize},0`;
      case "leaf":
        const lr = moduleSize * 0.8;
        return `
          M ${innerX + lr},${innerY}
          H ${innerX + innerSize - lr}
          Q ${innerX + innerSize},${innerY} ${innerX + innerSize},${innerY + lr}
          V ${innerY + innerSize - lr}
          Q ${innerX + innerSize},${innerY + innerSize} ${innerX + innerSize - lr},${innerY + innerSize}
          H ${innerX + lr}
          Q ${innerX},${innerY + innerSize} ${innerX},${innerY + innerSize - lr}
          V ${innerY + lr}
          Q ${innerX},${innerY} ${innerX + lr},${innerY}
          Z
        `;
      case "square":
      default:
        return `M ${innerX},${innerY} h ${innerSize} v ${innerSize} h -${innerSize} Z`;
    }
  }
}

// Genere la definition du gradient SVG
function getGradientDef(
  id: string,
  colors: [string, string],
  direction: "horizontal" | "vertical" | "diagonal"
): string {
  let x1 = "0%", y1 = "0%", x2 = "100%", y2 = "0%";

  switch (direction) {
    case "vertical":
      x2 = "0%";
      y2 = "100%";
      break;
    case "diagonal":
      y2 = "100%";
      break;
    case "horizontal":
    default:
      break;
  }

  return `
    <linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="100%" stop-color="${colors[1]}" />
    </linearGradient>
  `;
}

// Genere un QR code SVG avance avec styles personnalises
export async function generateAdvancedQRCodeSVG({
  url,
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  margin = 2,
  moduleShape = "square",
  eyeShape = "square",
  useGradient = false,
  gradientColors = ["#667eea", "#764ba2"],
  gradientDirection = "diagonal",
  logoPath,
  logoSizePercent = 20,
  size = 400,
  borderWidth = 0,
  borderColor = "#000000",
  borderRadius = 0,
}: {
  url: string;
  foregroundColor?: string;
  backgroundColor?: string;
  margin?: number;
  moduleShape?: ModuleShape;
  eyeShape?: EyeShape;
  useGradient?: boolean;
  gradientColors?: [string, string];
  gradientDirection?: "horizontal" | "vertical" | "diagonal";
  logoPath?: string;
  logoSizePercent?: number;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}): Promise<string> {
  // Obtenir la matrice QR
  const qrData = await QRCode.create(url, {
    errorCorrectionLevel: "H",
  });

  const modules = qrData.modules;
  const moduleCount = modules.size;
  const moduleSize = (size - margin * 2 * (size / moduleCount)) / moduleCount;
  const totalSize = size + (borderWidth * 2);
  const offset = margin * moduleSize + borderWidth;

  // Positions des finder patterns (yeux)
  const eyePositions = [
    { x: 0, y: 0 },           // Top-left
    { x: moduleCount - 7, y: 0 }, // Top-right
    { x: 0, y: moduleCount - 7 }, // Bottom-left
  ];

  // Construire le chemin pour tous les modules (sauf les yeux)
  let modulePath = "";
  let eyeOuterPath = "";
  let eyeInnerPath = "";

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!modules.get(row, col)) continue;

      const x = offset + col * moduleSize;
      const y = offset + row * moduleSize;

      // Verifier si ce module fait partie d'un oeil
      let isEye = false;
      let isEyeCenter = false;

      for (const eye of eyePositions) {
        if (row >= eye.y && row < eye.y + 7 && col >= eye.x && col < eye.x + 7) {
          isEye = true;
          if (row >= eye.y + 2 && row < eye.y + 5 && col >= eye.x + 2 && col < eye.x + 5) {
            isEyeCenter = true;
          }
          break;
        }
      }

      if (isEye) continue; // Les yeux sont geres separement

      modulePath += getModulePath(x, y, moduleSize * 0.9, moduleShape) + " ";
    }
  }

  // Generer les yeux
  for (const eye of eyePositions) {
    const eyeX = offset + eye.x * moduleSize;
    const eyeY = offset + eye.y * moduleSize;
    const eyeSize = moduleSize * 7;

    eyeOuterPath += getEyePath(eyeX, eyeY, eyeSize, eyeShape, true) + " ";
    eyeInnerPath += getEyePath(eyeX, eyeY, eyeSize, eyeShape, false) + " ";
  }

  const gradientId = "qr-gradient";
  const fillColor = useGradient ? `url(#${gradientId})` : foregroundColor;

  // Generer le logo en base64 si fourni
  let logoSvg = "";
  if (logoPath) {
    try {
      const logoBuffer = await getLogoBuffer(logoPath);
      const logoSize = Math.floor(size * (logoSizePercent / 100));
      const logoPosition = (totalSize - logoSize) / 2;
      const padding = Math.floor(logoSize * 0.15);
      const bgSize = logoSize + padding * 2;
      const bgPosition = logoPosition - padding;

      // Convertir le logo en base64
      const resizedLogo = await sharp(logoBuffer)
        .resize(logoSize, logoSize, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer();
      const logoBase64 = resizedLogo.toString("base64");

      const bgRadius = Math.floor(bgSize * 0.1);
      logoSvg = `
        <rect x="${bgPosition}" y="${bgPosition}" width="${bgSize}" height="${bgSize}" rx="${bgRadius}" ry="${bgRadius}" fill="white"/>
        <image x="${logoPosition}" y="${logoPosition}" width="${logoSize}" height="${logoSize}" href="data:image/png;base64,${logoBase64}" preserveAspectRatio="xMidYMid meet"/>
      `;
    } catch (error) {
      console.error("Error adding logo to SVG:", error);
    }
  }

  // Bordure optionnelle
  let borderSvg = "";
  if (borderWidth > 0) {
    borderSvg = `
      <rect x="${borderWidth / 2}" y="${borderWidth / 2}"
            width="${totalSize - borderWidth}" height="${totalSize - borderWidth}"
            rx="${borderRadius}" ry="${borderRadius}"
            fill="none" stroke="${borderColor}" stroke-width="${borderWidth}"/>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">
  <defs>
    ${useGradient ? getGradientDef(gradientId, gradientColors, gradientDirection) : ""}
  </defs>
  <rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="${backgroundColor}" rx="${borderRadius}" ry="${borderRadius}"/>
  ${borderSvg}
  <path d="${modulePath}" fill="${fillColor}" fill-rule="evenodd"/>
  <path d="${eyeOuterPath}" fill="${fillColor}" fill-rule="evenodd"/>
  <path d="${eyeInnerPath}" fill="${fillColor}"/>
  ${logoSvg}
</svg>`;
}

export async function generateQRCodeSVG({
  url,
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  margin = 5,
}: Omit<QRCodeOptions, "logoPath" | "size" | "logoSizePercent" | "cornerStyle">): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin,
    color: {
      dark: foregroundColor,
      light: backgroundColor,
    },
  });
}

export async function generateQRCode({
  url,
  logoPath,
  size = 400,
  logoSizePercent = 20,
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  margin = 5,
  cornerStyle = "square",
  template,
  moduleShape = "square",
  eyeShape = "square",
  useGradient = false,
  gradientColors,
  gradientDirection = "diagonal",
}: QRCodeOptions): Promise<Buffer> {
  // Si un template est specifie, appliquer ses parametres
  if (template && template !== "classic") {
    const templateConfig = QR_TEMPLATES[template];
    moduleShape = templateConfig.moduleShape;
    eyeShape = templateConfig.eyeShape;
    useGradient = templateConfig.useGradient;
    if (templateConfig.gradientColors) {
      gradientColors = templateConfig.gradientColors;
    }
    if (templateConfig.gradientDirection) {
      gradientDirection = templateConfig.gradientDirection;
    }
  }

  // Utiliser la generation SVG avancee si des styles premium sont actifs
  const hasPremiumStyles = moduleShape !== "square" || eyeShape !== "square" || useGradient;

  if (hasPremiumStyles) {
    const svg = await generateAdvancedQRCodeSVG({
      url,
      foregroundColor,
      backgroundColor,
      margin: Math.ceil(margin / 2),
      moduleShape,
      eyeShape,
      useGradient,
      gradientColors: gradientColors || ["#667eea", "#764ba2"],
      gradientDirection,
      logoPath,
      logoSizePercent,
      size,
      borderWidth: template ? QR_TEMPLATES[template]?.borderWidth : 0,
      borderColor: template ? QR_TEMPLATES[template]?.borderColor : "#000000",
      borderRadius: template ? QR_TEMPLATES[template]?.borderRadius : 0,
    });

    // Convertir le SVG en PNG
    const buffer = await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toBuffer();

    return buffer;
  }

  // Generation standard pour les styles de base
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    type: "png",
    width: size,
    margin,
    color: {
      dark: foregroundColor,
      light: backgroundColor,
    },
  });

  // Apply rounded corners if requested
  let processedQR = qrBuffer;
  if (cornerStyle === "rounded") {
    const cornerRadius = Math.floor(size * 0.02);
    const mask = Buffer.from(
      `<svg width="${size}" height="${size}">
        <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="white"/>
      </svg>`
    );

    processedQR = await sharp(qrBuffer)
      .composite([{
        input: mask,
        blend: "dest-in",
      }])
      .png()
      .toBuffer();
  }

  if (!logoPath) {
    return processedQR;
  }

  const logoSize = Math.floor(size * (logoSizePercent / 100));
  const padding = Math.floor(logoSize * 0.12);
  const totalLogoSize = logoSize + padding * 2;
  const logoPosition = Math.floor((size - totalLogoSize) / 2);

  try {
    const logoBuffer = await getLogoBuffer(logoPath);

    const resizedLogo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer();

    const backgroundSize = totalLogoSize;
    const cornerRadius = Math.floor(backgroundSize * 0.1);

    const roundedBackground = Buffer.from(
      `<svg width="${backgroundSize}" height="${backgroundSize}">
        <rect x="0" y="0" width="${backgroundSize}" height="${backgroundSize}" rx="${cornerRadius}" ry="${cornerRadius}" fill="white"/>
      </svg>`
    );

    const logoWithBackground = await sharp(roundedBackground)
      .composite([
        {
          input: resizedLogo,
          top: padding,
          left: padding,
        },
      ])
      .png()
      .toBuffer();

    const qrWithLogo = await sharp(processedQR)
      .composite([
        {
          input: logoWithBackground,
          top: logoPosition,
          left: logoPosition,
        },
      ])
      .png()
      .toBuffer();

    return qrWithLogo;
  } catch (error) {
    console.error("Error adding logo to QR code:", error);
    return processedQR;
  }
}

export async function generateQRCodeInFormat(
  options: QRCodeOptions,
  format: ExportFormat,
  quality: number = 90
): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
  // Export SVG vectoriel pur
  if (format === "svg") {
    const hasPremiumStyles =
      (options.moduleShape && options.moduleShape !== "square") ||
      (options.eyeShape && options.eyeShape !== "square") ||
      options.useGradient;

    const svg = hasPremiumStyles
      ? await generateAdvancedQRCodeSVG({
          url: options.url,
          foregroundColor: options.foregroundColor,
          backgroundColor: options.backgroundColor,
          margin: options.margin ? Math.ceil(options.margin / 2) : 2,
          moduleShape: options.moduleShape || "square",
          eyeShape: options.eyeShape || "square",
          useGradient: options.useGradient,
          gradientColors: options.gradientColors,
          gradientDirection: options.gradientDirection,
          logoPath: options.logoPath,
          logoSizePercent: options.logoSizePercent,
          size: options.size,
        })
      : await generateQRCodeSVG({
          url: options.url,
          foregroundColor: options.foregroundColor,
          backgroundColor: options.backgroundColor,
          margin: options.margin,
        });

    return {
      buffer: Buffer.from(svg),
      mimeType: "image/svg+xml",
      extension: "svg",
    };
  }

  // Export PDF (via SVG)
  if (format === "pdf") {
    const svg = await generateAdvancedQRCodeSVG({
      url: options.url,
      foregroundColor: options.foregroundColor,
      backgroundColor: options.backgroundColor,
      margin: options.margin ? Math.ceil(options.margin / 2) : 2,
      moduleShape: options.moduleShape || "square",
      eyeShape: options.eyeShape || "square",
      useGradient: options.useGradient,
      gradientColors: options.gradientColors,
      gradientDirection: options.gradientDirection,
      logoPath: options.logoPath,
      logoSizePercent: options.logoSizePercent,
      size: options.size || 400,
    });

    // Generer un PDF simple avec le SVG embarque
    const size = options.size || 400;
    const pdfContent = generateSimplePDF(svg, size);

    return {
      buffer: Buffer.from(pdfContent),
      mimeType: "application/pdf",
      extension: "pdf",
    };
  }

  const pngBuffer = await generateQRCode(options);

  switch (format) {
    case "jpeg":
      const jpegBuffer = await sharp(pngBuffer)
        .flatten({ background: options.backgroundColor || "#ffffff" })
        .jpeg({ quality })
        .toBuffer();
      return {
        buffer: jpegBuffer,
        mimeType: "image/jpeg",
        extension: "jpg",
      };

    case "png":
    default:
      return {
        buffer: pngBuffer,
        mimeType: "image/png",
        extension: "png",
      };
  }
}

// Genere un PDF simple contenant le SVG
function generateSimplePDF(svgContent: string, size: number): string {
  // Dimensions en points (1 point = 1/72 inch)
  const pageWidth = size + 100; // Marges de 50pt de chaque cote
  const pageHeight = size + 100;
  const imageX = 50;
  const imageY = 50;

  // Encoder le SVG en base64
  const svgBase64 = Buffer.from(svgContent).toString("base64");

  // Structure PDF minimale
  const objects: string[] = [];
  let objectCount = 0;

  const addObject = (content: string): number => {
    objectCount++;
    objects.push(`${objectCount} 0 obj\n${content}\nendobj\n`);
    return objectCount;
  };

  // Catalog
  const catalogId = addObject(`<< /Type /Catalog /Pages 2 0 R >>`);

  // Pages
  const pagesId = addObject(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`);

  // Page
  const pageId = addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /XObject << /Img 5 0 R >> >> >>`);

  // Content stream
  const contentStream = `q ${size} 0 0 ${size} ${imageX} ${imageY} cm /Img Do Q`;
  const contentId = addObject(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);

  // Image XObject (SVG as PNG fallback)
  // Note: PDF natif ne supporte pas SVG, donc on convertit en PNG via sharp
  // Pour simplifier, on cree une image PNG en memoire
  const imageId = addObject(`<< /Type /XObject /Subtype /Form /BBox [0 0 ${size} ${size}] /Resources << >> /Length ${svgBase64.length} /Filter /ASCIIHexDecode >>\nstream\n${Buffer.from(svgContent).toString("hex")}\nendstream`);

  // Cross-reference table
  let xref = `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
  let offset = 9; // %PDF-1.4\n

  for (let i = 0; i < objects.length; i++) {
    xref += `${offset.toString().padStart(10, "0")} 00000 n \n`;
    offset += objects[i].length;
  }

  // Trailer
  const trailer = `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;

  return `%PDF-1.4\n${objects.join("")}${xref}${trailer}`;
}

export async function generateQRCodeDataURL({
  url,
  logoPath,
  size = 400,
  logoSizePercent = 20,
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  margin = 5,
  cornerStyle = "square",
  template,
  moduleShape = "square",
  eyeShape = "square",
  useGradient = false,
  gradientColors,
  gradientDirection = "diagonal",
}: QRCodeOptions): Promise<string> {
  // Pour les QR codes avec styles premium ou logo, utiliser la generation avancee
  const hasPremiumStyles =
    (moduleShape && moduleShape !== "square") ||
    (eyeShape && eyeShape !== "square") ||
    useGradient ||
    template !== undefined && template !== "classic";

  // For simple QR codes (no logo, square corners, no premium), use qrcode.toDataURL directly
  // This avoids sharp dependencies which can fail on serverless environments
  if (!logoPath && cornerStyle === "square" && !hasPremiumStyles) {
    return QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: size,
      margin,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    });
  }

  // For complex QR codes (with logo, rounded corners, or premium styles), use sharp
  const buffer = await generateQRCode({
    url,
    logoPath,
    size,
    logoSizePercent,
    foregroundColor,
    backgroundColor,
    margin,
    cornerStyle,
    template,
    moduleShape,
    eyeShape,
    useGradient,
    gradientColors,
    gradientDirection,
  });
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Preset sizes for common use cases
export const SIZE_PRESETS = {
  small: { size: 200, label: "Petit (200px)" },
  medium: { size: 400, label: "Moyen (400px)" },
  large: { size: 800, label: "Grand (800px)" },
  xlarge: { size: 1200, label: "Tres grand (1200px)" },
} as const;

// Preset color schemes
export const COLOR_PRESETS = [
  { name: "Classique", foreground: "#000000", background: "#ffffff" },
  { name: "Bleu", foreground: "#1e40af", background: "#ffffff" },
  { name: "Vert", foreground: "#166534", background: "#ffffff" },
  { name: "Rouge", foreground: "#991b1b", background: "#ffffff" },
  { name: "Violet", foreground: "#6b21a8", background: "#ffffff" },
  { name: "Orange", foreground: "#c2410c", background: "#ffffff" },
  { name: "Inverse", foreground: "#ffffff", background: "#000000" },
  { name: "Bleu fonce", foreground: "#60a5fa", background: "#1e3a5f" },
] as const;
