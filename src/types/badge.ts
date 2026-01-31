export interface BadgeData {
  firstName: string;
  lastName: string;
  company: string;
  website?: string;
  linkedin?: string;
}

export type BadgeFormat = "standard" | "a5";

export type BadgeCategory = "vip" | "speaker" | "staff" | "visitor" | "custom";

export type BorderPattern = "solid" | "dashed" | "dotted" | "double" | "gradient" | "striped";

export type BadgeOrientation = "landscape" | "portrait";

export type ContentLayout = "side-by-side" | "centered";

export type LogoPosition =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

export type BadgeFont = "sans" | "serif" | "mono" | "display";

export interface BadgeConfig {
  // Format
  format: BadgeFormat;
  orientation?: BadgeOrientation;
  contentLayout?: ContentLayout;

  // Colors
  backgroundColor: string;
  textColor: string;

  // QR Code
  qrSize: number;
  qrPosition: "left" | "right";

  // Optional event branding
  eventName?: string;

  // Font
  font?: BadgeFont;

  // Event Logo (base64 data URL or URL)
  eventLogoUrl?: string;
  eventLogoPosition?: LogoPosition;
  eventLogoSize?: number; // max width/height in pixels (50-300)

  // Company Logo (base64 data URL or URL)
  companyLogoUrl?: string;
  companyLogoPosition?: LogoPosition;
  companyLogoSize?: number; // max width/height in pixels (50-300)

  // Legacy support (maps to eventLogo)
  logoUrl?: string;
  logoPosition?: LogoPosition;
  logoSize?: number;

  // Border
  borderColor?: string;
  borderSecondaryColor?: string; // For gradient/striped patterns
  borderWidth?: number;
  borderPattern?: BorderPattern;
  badgeCategory?: BadgeCategory;
}

// Logo size presets
export const LOGO_SIZE_PRESETS = [
  { value: 60, label: "XS" },
  { value: 100, label: "S" },
  { value: 150, label: "M" },
  { value: 200, label: "L" },
  { value: 250, label: "XL" },
];

// Logo position options
export const LOGO_POSITIONS: { value: LogoPosition; label: string; icon: string }[] = [
  { value: "top-left", label: "Haut gauche", icon: "↖" },
  { value: "top-center", label: "Haut centre", icon: "↑" },
  { value: "top-right", label: "Haut droite", icon: "↗" },
  { value: "bottom-left", label: "Bas gauche", icon: "↙" },
  { value: "bottom-center", label: "Bas centre", icon: "↓" },
  { value: "bottom-right", label: "Bas droite", icon: "↘" },
];

// Font presets - using standard fonts available in server-side rendering
export const FONT_PRESETS: { value: BadgeFont; label: string; family: string }[] = [
  { value: "sans", label: "Sans-serif", family: "Arial, Helvetica, sans-serif" },
  { value: "serif", label: "Serif", family: "Georgia, Times New Roman, serif" },
  { value: "mono", label: "Mono", family: "Courier New, Courier, monospace" },
  { value: "display", label: "Display", family: "Georgia, serif" },
];

// Border width presets
export const BORDER_WIDTH_PRESETS = [
  { value: 4, label: "Fin" },
  { value: 8, label: "Normal" },
  { value: 12, label: "Moyen" },
  { value: 16, label: "Epais" },
  { value: 24, label: "Tres epais" },
];

// Border pattern options
export const BORDER_PATTERNS: Record<BorderPattern, { label: string; icon: string }> = {
  solid: { label: "Uni", icon: "━━━" },
  dashed: { label: "Tirets", icon: "┅┅┅" },
  dotted: { label: "Pointilles", icon: "···" },
  double: { label: "Double", icon: "═══" },
  gradient: { label: "Degrade", icon: "▓▒░" },
  striped: { label: "Rayures", icon: "///" },
};

// Badge format dimensions at 300dpi
export const BADGE_FORMATS: Record<BadgeFormat, { width: number; height: number; label: string }> = {
  standard: { width: 1004, height: 650, label: "Standard (85×55mm)" },
  a5: { width: 1748, height: 1240, label: "A5 (148×105mm)" },
};

// Predefined category colors
export const BADGE_CATEGORY_COLORS: Record<BadgeCategory, { color: string; label: string }> = {
  vip: { color: "#D4AF37", label: "VIP (Or)" },
  speaker: { color: "#9333EA", label: "Speaker (Violet)" },
  staff: { color: "#2563EB", label: "Staff (Bleu)" },
  visitor: { color: "#16A34A", label: "Visiteur (Vert)" },
  custom: { color: "#000000", label: "Personnalisé" },
};

export interface BadgePreview {
  firstName: string;
  lastName: string;
  company: string;
  qrUrl: string;
  previewDataUrl: string;
}

export interface BadgeBatchResult {
  batchId: string;
  totalCount: number;
  processedCount: number;
  errorCount: number;
  errors: { row: number; error: string }[];
  status: "pending" | "processing" | "completed" | "failed";
}

export interface CSVParseResult {
  rows: BadgeData[];
  errors: { row: number; error: string }[];
}

export const DEFAULT_BADGE_CONFIG: BadgeConfig = {
  format: "standard",
  orientation: "landscape",
  contentLayout: "side-by-side",
  backgroundColor: "#ffffff",
  textColor: "#1a1a1a",
  qrSize: 200,
  qrPosition: "right",
  font: "sans",
  eventLogoPosition: "top-left",
  eventLogoSize: 150,
  companyLogoPosition: "top-right",
  companyLogoSize: 100,
  borderWidth: 0,
  borderPattern: "solid",
};
