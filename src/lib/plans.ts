// Client-safe plan configuration (no server-side dependencies)

export const PLANS = {
  FREE: {
    name: "Gratuit",
    price: 0,
    limits: {
      qrcodes: 3,
      scansPerMonth: 100,
      customLogo: false,
      analytics: false,
      apiAccess: false,
      // Fonctionnalites de design premium
      premiumTemplates: false,
      customModuleShapes: false,
      customEyeShapes: false,
      gradients: false,
      svgExport: false,
      pdfExport: false,
      mockupPreview: false,
    },
  },
  PRO: {
    name: "Pro",
    price: 9,
    limits: {
      qrcodes: -1, // unlimited
      scansPerMonth: -1,
      customLogo: true,
      analytics: true,
      apiAccess: false,
      // Fonctionnalites de design premium
      premiumTemplates: true,
      customModuleShapes: true,
      customEyeShapes: true,
      gradients: true,
      svgExport: true,
      pdfExport: false,
      mockupPreview: true,
    },
  },
  BUSINESS: {
    name: "Business",
    price: 29,
    limits: {
      qrcodes: -1,
      scansPerMonth: -1,
      customLogo: true,
      analytics: true,
      apiAccess: true,
      // Fonctionnalites de design premium
      premiumTemplates: true,
      customModuleShapes: true,
      customEyeShapes: true,
      gradients: true,
      svgExport: true,
      pdfExport: true,
      mockupPreview: true,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanLimits(plan: PlanType) {
  return PLANS[plan].limits;
}

export function canCreateQRCode(plan: PlanType, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  if (limits.qrcodes === -1) return true;
  return currentCount < limits.qrcodes;
}

export function canUseLogo(plan: PlanType): boolean {
  return getPlanLimits(plan).customLogo;
}

export function canViewAnalytics(plan: PlanType): boolean {
  return getPlanLimits(plan).analytics;
}

// Nouvelles fonctions pour les fonctionnalites premium de design
export function canUsePremiumTemplates(plan: PlanType): boolean {
  return getPlanLimits(plan).premiumTemplates;
}

export function canUseCustomModuleShapes(plan: PlanType): boolean {
  return getPlanLimits(plan).customModuleShapes;
}

export function canUseCustomEyeShapes(plan: PlanType): boolean {
  return getPlanLimits(plan).customEyeShapes;
}

export function canUseGradients(plan: PlanType): boolean {
  return getPlanLimits(plan).gradients;
}

export function canExportSVG(plan: PlanType): boolean {
  return getPlanLimits(plan).svgExport;
}

export function canExportPDF(plan: PlanType): boolean {
  return getPlanLimits(plan).pdfExport;
}

export function canUseMockupPreview(plan: PlanType): boolean {
  return getPlanLimits(plan).mockupPreview;
}
