import { prisma } from "@/lib/prisma";
import { PLANS, PlanType } from "@/lib/stripe";

/**
 * Résultat d'une vérification de limite
 */
export type LimitCheckResult = {
  allowed: boolean;
  error?: string;
  currentCount?: number;
  limit?: number;
};

/**
 * Récupère l'utilisateur avec son plan et le nombre de QR codes
 */
export async function getUserWithQRCodeCount(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      _count: {
        select: { qrcodes: true },
      },
    },
  });

  return user;
}

/**
 * Vérifie si l'utilisateur peut créer un nouveau QR code
 */
export async function checkCanCreateQRCode(
  userId: string
): Promise<LimitCheckResult> {
  const user = await getUserWithQRCodeCount(userId);

  if (!user) {
    return {
      allowed: false,
      error: "Utilisateur non trouvé",
    };
  }

  const plan = user.plan as PlanType;
  const limits = PLANS[plan].limits;
  const currentCount = user._count.qrcodes;

  // -1 signifie illimité
  if (limits.qrcodes === -1) {
    return {
      allowed: true,
      currentCount,
      limit: -1,
    };
  }

  if (currentCount >= limits.qrcodes) {
    return {
      allowed: false,
      error: `Vous avez atteint la limite de ${limits.qrcodes} QR codes pour le plan ${PLANS[plan].name}. Passez à un plan supérieur pour en créer davantage.`,
      currentCount,
      limit: limits.qrcodes,
    };
  }

  return {
    allowed: true,
    currentCount,
    limit: limits.qrcodes,
  };
}

/**
 * Vérifie si l'utilisateur peut utiliser un logo personnalisé
 */
export async function checkCanUseLogo(
  userId: string
): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      error: "Utilisateur non trouvé",
    };
  }

  const plan = user.plan as PlanType;
  const limits = PLANS[plan].limits;

  if (!limits.customLogo) {
    return {
      allowed: false,
      error: `L'ajout d'un logo personnalisé n'est pas disponible avec le plan ${PLANS[plan].name}. Passez au plan Pro ou Business pour utiliser cette fonctionnalité.`,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Vérifie si l'utilisateur peut accéder aux analytics
 */
export async function checkCanViewAnalytics(
  userId: string
): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      error: "Utilisateur non trouvé",
    };
  }

  const plan = user.plan as PlanType;
  const limits = PLANS[plan].limits;

  if (!limits.analytics) {
    return {
      allowed: false,
      error: `Les analytics ne sont pas disponibles avec le plan ${PLANS[plan].name}. Passez au plan Pro ou Business pour accéder aux statistiques détaillées.`,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Vérifie si l'utilisateur peut utiliser l'API
 */
export async function checkCanUseAPI(
  userId: string
): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      error: "Utilisateur non trouvé",
    };
  }

  const plan = user.plan as PlanType;
  const limits = PLANS[plan].limits;

  if (!limits.apiAccess) {
    return {
      allowed: false,
      error: `L'accès API n'est pas disponible avec le plan ${PLANS[plan].name}. Passez au plan Business pour utiliser l'API.`,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Récupère les limites du plan de l'utilisateur
 */
export async function getUserPlanLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return null;
  }

  const plan = user.plan as PlanType;
  return {
    plan,
    planName: PLANS[plan].name,
    limits: PLANS[plan].limits,
  };
}

/**
 * Vérifie si l'utilisateur peut utiliser les fonctionnalités avancées (A/B testing, expiration)
 * Disponible uniquement pour les plans PRO et BUSINESS
 */
export async function checkCanUseAdvancedFeatures(
  userId: string
): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      error: "Utilisateur non trouvé",
    };
  }

  const plan = user.plan as PlanType;

  if (plan === "FREE") {
    return {
      allowed: false,
      error: `Les fonctionnalités avancées (A/B testing, expiration) ne sont pas disponibles avec le plan Gratuit. Passez au plan Pro ou Business pour y accéder.`,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Vérifie si l'utilisateur peut utiliser la protection par mot de passe
 * Disponible uniquement pour les plans PRO et BUSINESS
 */
export async function checkCanUsePasswordProtection(
  userId: string
): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      error: "Utilisateur non trouvé",
    };
  }

  const plan = user.plan as PlanType;

  if (plan === "FREE") {
    return {
      allowed: false,
      error: `La protection par mot de passe n'est pas disponible avec le plan Gratuit. Passez au plan Pro ou Business pour protéger vos QR codes.`,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Vérifie si l'utilisateur peut utiliser les domaines personnalisés
 * Disponible uniquement pour le plan BUSINESS
 */
export async function checkCanUseCustomDomains(
  userId: string
): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      error: "Utilisateur non trouvé",
    };
  }

  const plan = user.plan as PlanType;

  if (plan !== "BUSINESS") {
    return {
      allowed: false,
      error: `Les domaines personnalisés ne sont pas disponibles avec le plan ${PLANS[plan].name}. Passez au plan Business pour utiliser vos propres domaines.`,
    };
  }

  return {
    allowed: true,
  };
}
