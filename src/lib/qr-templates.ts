// Templates de QR codes artistiques
// Fonctionnalites premium pour les plans PRO et BUSINESS

export type TemplateId = "classic" | "gradient" | "dots" | "rounded" | "elegant";

export type ModuleShape = "square" | "circle" | "diamond";

export type EyeShape = "square" | "circle" | "leaf";

export interface QRTemplate {
  id: TemplateId;
  name: string;
  description: string;
  isPremium: boolean;
  moduleShape: ModuleShape;
  eyeShape: EyeShape;
  useGradient: boolean;
  gradientColors?: [string, string];
  gradientDirection?: "horizontal" | "vertical" | "diagonal";
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}

export const QR_TEMPLATES: Record<TemplateId, QRTemplate> = {
  classic: {
    id: "classic",
    name: "Classique",
    description: "Style standard avec modules carres",
    isPremium: false,
    moduleShape: "square",
    eyeShape: "square",
    useGradient: false,
  },
  gradient: {
    id: "gradient",
    name: "Degrade",
    description: "Degrade de couleurs moderne",
    isPremium: true,
    moduleShape: "square",
    eyeShape: "square",
    useGradient: true,
    gradientColors: ["#667eea", "#764ba2"],
    gradientDirection: "diagonal",
  },
  dots: {
    id: "dots",
    name: "Points",
    description: "Modules ronds pour un look moderne",
    isPremium: true,
    moduleShape: "circle",
    eyeShape: "circle",
    useGradient: false,
  },
  rounded: {
    id: "rounded",
    name: "Arrondi",
    description: "Modules avec coins tres arrondis",
    isPremium: true,
    moduleShape: "square",
    eyeShape: "circle",
    useGradient: false,
    borderRadius: 40,
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Style minimaliste avec bordure",
    isPremium: true,
    moduleShape: "square",
    eyeShape: "leaf",
    useGradient: false,
    borderWidth: 4,
    borderColor: "#000000",
    borderRadius: 12,
  },
};

// Options de forme des modules
export const MODULE_SHAPES: { value: ModuleShape; label: string; isPremium: boolean }[] = [
  { value: "square", label: "Carre", isPremium: false },
  { value: "circle", label: "Rond", isPremium: true },
  { value: "diamond", label: "Losange", isPremium: true },
];

// Options de forme des yeux (coins)
export const EYE_SHAPES: { value: EyeShape; label: string; isPremium: boolean }[] = [
  { value: "square", label: "Carre", isPremium: false },
  { value: "circle", label: "Rond", isPremium: true },
  { value: "leaf", label: "Feuille", isPremium: true },
];

// Presets de gradients
export const GRADIENT_PRESETS: { name: string; colors: [string, string] }[] = [
  { name: "Violet", colors: ["#667eea", "#764ba2"] },
  { name: "Ocean", colors: ["#2193b0", "#6dd5ed"] },
  { name: "Coucher de soleil", colors: ["#ff512f", "#f09819"] },
  { name: "Foret", colors: ["#134e5e", "#71b280"] },
  { name: "Rose", colors: ["#ee9ca7", "#ffdde1"] },
  { name: "Minuit", colors: ["#232526", "#414345"] },
];

// Verifier si une fonctionnalite est disponible pour un plan
export function canUseTemplate(templateId: TemplateId, plan: "FREE" | "PRO" | "BUSINESS"): boolean {
  const template = QR_TEMPLATES[templateId];
  if (!template.isPremium) return true;
  return plan === "PRO" || plan === "BUSINESS";
}

export function canUseModuleShape(shape: ModuleShape, plan: "FREE" | "PRO" | "BUSINESS"): boolean {
  const shapeConfig = MODULE_SHAPES.find((s) => s.value === shape);
  if (!shapeConfig?.isPremium) return true;
  return plan === "PRO" || plan === "BUSINESS";
}

export function canUseEyeShape(shape: EyeShape, plan: "FREE" | "PRO" | "BUSINESS"): boolean {
  const shapeConfig = EYE_SHAPES.find((s) => s.value === shape);
  if (!shapeConfig?.isPremium) return true;
  return plan === "PRO" || plan === "BUSINESS";
}

export function canUseGradient(plan: "FREE" | "PRO" | "BUSINESS"): boolean {
  return plan === "PRO" || plan === "BUSINESS";
}

export function canExportSVG(plan: "FREE" | "PRO" | "BUSINESS"): boolean {
  return plan === "PRO" || plan === "BUSINESS";
}

export function canExportPDF(plan: "FREE" | "PRO" | "BUSINESS"): boolean {
  return plan === "BUSINESS";
}

export function canUseMockups(plan: "FREE" | "PRO" | "BUSINESS"): boolean {
  return plan === "PRO" || plan === "BUSINESS";
}
