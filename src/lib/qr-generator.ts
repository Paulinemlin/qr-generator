import QRCode from "qrcode";
import sharp from "sharp";

interface GenerateQROptions {
  url: string;
  logoPath?: string;
  size?: number;
  logoSizePercent?: number;
}

async function getLogoBuffer(logoPath: string): Promise<Buffer> {
  // If it's a URL, fetch it
  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    const response = await fetch(logoPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // Otherwise, read from local file system (for local development)
  const fs = await import("fs/promises");
  return fs.readFile(logoPath);
}

export async function generateQRCode({
  url,
  logoPath,
  size = 400,
  logoSizePercent = 20,
}: GenerateQROptions): Promise<Buffer> {
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    type: "png",
    width: size,
    margin: 3,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  if (!logoPath) {
    return qrBuffer;
  }

  const logoSize = Math.floor(size * (logoSizePercent / 100));
  const padding = Math.floor(logoSize * 0.12);
  const totalLogoSize = logoSize + padding * 2;
  const logoPosition = Math.floor((size - totalLogoSize) / 2);

  try {
    // Get the logo buffer (from URL or file path)
    const logoBuffer = await getLogoBuffer(logoPath);

    // Resize the logo
    const resizedLogo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer();

    // Create a white background with rounded corners
    const backgroundSize = totalLogoSize;
    const cornerRadius = Math.floor(backgroundSize * 0.1);

    const roundedBackground = Buffer.from(
      `<svg width="${backgroundSize}" height="${backgroundSize}">
        <rect x="0" y="0" width="${backgroundSize}" height="${backgroundSize}" rx="${cornerRadius}" ry="${cornerRadius}" fill="white"/>
      </svg>`
    );

    // Create logo with white background
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

    // Composite logo onto QR code
    const qrWithLogo = await sharp(qrBuffer)
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
    return qrBuffer;
  }
}

export async function generateQRCodeDataURL({
  url,
  logoPath,
  size = 400,
  logoSizePercent = 20,
}: GenerateQROptions): Promise<string> {
  const buffer = await generateQRCode({ url, logoPath, size, logoSizePercent });
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
