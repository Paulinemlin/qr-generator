import PDFDocument from "pdfkit";
import { BadgeFormat, BADGE_FORMATS } from "@/types/badge";

// A4 page dimensions in points (72 dpi)
const PAGE_WIDTH = 595; // 210mm
const PAGE_HEIGHT = 842; // 297mm
const MARGIN = 36; // 0.5 inch

// Convert mm to points (1 inch = 72 points, 1 inch = 25.4mm)
const MM_TO_POINTS = 72 / 25.4;

// Badge dimensions in points for different formats
const BADGE_DIMENSIONS: Record<BadgeFormat, { width: number; height: number; cols: number; rows: number }> = {
  standard: {
    width: 85 * MM_TO_POINTS,  // 85mm = 241 points
    height: 55 * MM_TO_POINTS, // 55mm = 156 points
    cols: 2,
    rows: 4,
  },
  a5: {
    width: 148 * MM_TO_POINTS,  // 148mm = 420 points
    height: 105 * MM_TO_POINTS, // 105mm = 298 points
    cols: 1,
    rows: 2,
  },
};

export interface BadgeImageData {
  imageBuffer: Buffer;
  name: string;
}

/**
 * Calculate grid layout for a given badge format
 */
function getGridLayout(format: BadgeFormat): {
  badgeWidth: number;
  badgeHeight: number;
  cols: number;
  rows: number;
  badgesPerPage: number;
  hSpacing: number;
  vSpacing: number;
} {
  const dims = BADGE_DIMENSIONS[format] || BADGE_DIMENSIONS.standard;
  const { width: badgeWidth, height: badgeHeight, cols, rows } = dims;
  const badgesPerPage = cols * rows;

  // Calculate spacing
  const hSpacing = cols > 1
    ? (PAGE_WIDTH - 2 * MARGIN - cols * badgeWidth) / (cols - 1)
    : 0;
  const vSpacing = rows > 1
    ? (PAGE_HEIGHT - 2 * MARGIN - rows * badgeHeight) / (rows - 1)
    : 0;

  return {
    badgeWidth,
    badgeHeight,
    cols,
    rows,
    badgesPerPage,
    hSpacing,
    vSpacing,
  };
}

/**
 * Generate a PDF document containing all badges
 */
export async function generateBadgesPDF(
  badges: BadgeImageData[],
  format: BadgeFormat = "standard"
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: MARGIN,
      autoFirstPage: false,
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const layout = getGridLayout(format);

    // Process badges
    badges.forEach((badge, index) => {
      const positionOnPage = index % layout.badgesPerPage;
      const col = positionOnPage % layout.cols;
      const row = Math.floor(positionOnPage / layout.cols);

      // Add new page if needed
      if (positionOnPage === 0) {
        doc.addPage();
      }

      // Calculate position - center badges on page
      const totalBadgesWidth = layout.cols * layout.badgeWidth + (layout.cols - 1) * layout.hSpacing;
      const totalBadgesHeight = layout.rows * layout.badgeHeight + (layout.rows - 1) * layout.vSpacing;
      const startX = (PAGE_WIDTH - totalBadgesWidth) / 2;
      const startY = (PAGE_HEIGHT - totalBadgesHeight) / 2;

      const x = startX + col * (layout.badgeWidth + layout.hSpacing);
      const y = startY + row * (layout.badgeHeight + layout.vSpacing);

      // Add badge image
      try {
        doc.image(badge.imageBuffer, x, y, {
          width: layout.badgeWidth,
          height: layout.badgeHeight,
          fit: [layout.badgeWidth, layout.badgeHeight],
          align: "center",
          valign: "center",
        });

        // Add cut line (light gray dashed border)
        doc
          .save()
          .strokeColor("#cccccc")
          .lineWidth(0.5)
          .dash(3, { space: 3 })
          .rect(x, y, layout.badgeWidth, layout.badgeHeight)
          .stroke()
          .restore();
      } catch (error) {
        console.error(`Error adding badge ${badge.name} to PDF:`, error);
      }
    });

    // Add page numbers
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(10)
        .fillColor("#999999")
        .text(`Page ${i + 1} / ${pageCount}`, MARGIN, PAGE_HEIGHT - 30, {
          width: PAGE_WIDTH - 2 * MARGIN,
          align: "center",
        });
    }

    doc.end();
  });
}

/**
 * Generate a single-badge PDF (for individual download)
 */
export async function generateSingleBadgePDF(
  badge: BadgeImageData,
  format: BadgeFormat = "standard"
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const layout = getGridLayout(format);

    // Create a document with badge dimensions plus margin
    const docWidth = layout.badgeWidth + 20;
    const docHeight = layout.badgeHeight + 20;

    const doc = new PDFDocument({
      size: [docWidth, docHeight],
      margin: 10,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      doc.image(badge.imageBuffer, 10, 10, {
        width: layout.badgeWidth,
        height: layout.badgeHeight,
        fit: [layout.badgeWidth, layout.badgeHeight],
      });
    } catch (error) {
      console.error(`Error creating single badge PDF:`, error);
    }

    doc.end();
  });
}
