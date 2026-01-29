import QRCode from "qrcode";
import sharp from "sharp";

export interface QRCodeOptions {
  url: string;
  logoPath?: string;
  size?: number;
  logoSizePercent?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  margin?: number;
  cornerStyle?: "square" | "rounded";
}

export type ExportFormat = "png" | "svg" | "jpeg";

async function getLogoBuffer(logoPath: string): Promise<Buffer> {
  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    const response = await fetch(logoPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const fs = await import("fs/promises");
  return fs.readFile(logoPath);
}

export async function generateQRCodeSVG({
  url,
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  margin = 3,
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
  margin = 3,
  cornerStyle = "square",
}: QRCodeOptions): Promise<Buffer> {
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
  if (format === "svg" && !options.logoPath) {
    const svg = await generateQRCodeSVG({
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

    case "svg":
      // For SVG with logo, we return PNG (SVG with embedded logo is complex)
      return {
        buffer: pngBuffer,
        mimeType: "image/png",
        extension: "png",
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

export async function generateQRCodeDataURL({
  url,
  logoPath,
  size = 400,
  logoSizePercent = 20,
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  margin = 3,
  cornerStyle = "square",
}: QRCodeOptions): Promise<string> {
  const buffer = await generateQRCode({
    url,
    logoPath,
    size,
    logoSizePercent,
    foregroundColor,
    backgroundColor,
    margin,
    cornerStyle,
  });
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Preset sizes for common use cases
export const SIZE_PRESETS = {
  small: { size: 200, label: "Petit (200px)" },
  medium: { size: 400, label: "Moyen (400px)" },
  large: { size: 800, label: "Grand (800px)" },
  xlarge: { size: 1200, label: "Très grand (1200px)" },
} as const;

// Preset color schemes
export const COLOR_PRESETS = [
  { name: "Classique", foreground: "#000000", background: "#ffffff" },
  { name: "Bleu", foreground: "#1e40af", background: "#ffffff" },
  { name: "Vert", foreground: "#166534", background: "#ffffff" },
  { name: "Rouge", foreground: "#991b1b", background: "#ffffff" },
  { name: "Violet", foreground: "#6b21a8", background: "#ffffff" },
  { name: "Orange", foreground: "#c2410c", background: "#ffffff" },
  { name: "Inversé", foreground: "#ffffff", background: "#000000" },
  { name: "Bleu foncé", foreground: "#60a5fa", background: "#1e3a5f" },
] as const;
