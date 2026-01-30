// Utilitaires pour la generation de codes courts

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Genere un code court aleatoire
 * @param length Longueur du code (par defaut 6)
 * @returns Code court unique
 */
export function generateShortCode(length: number = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

/**
 * Verifie si un code court est valide (alphanumerique)
 * @param code Code a verifier
 * @returns true si valide
 */
export function isValidShortCode(code: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(code) && code.length >= 3 && code.length <= 20;
}

/**
 * Verifie si une URL est valide
 * @param url URL a verifier
 * @returns true si valide
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Construit l'URL complete avec parametres UTM
 * @param targetUrl URL de destination
 * @param utmParams Parametres UTM
 * @returns URL avec UTM
 */
export function buildUrlWithUtm(
  targetUrl: string,
  utmParams: {
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
  }
): string {
  try {
    const url = new URL(targetUrl);

    if (utmParams.utmSource) {
      url.searchParams.set("utm_source", utmParams.utmSource);
    }
    if (utmParams.utmMedium) {
      url.searchParams.set("utm_medium", utmParams.utmMedium);
    }
    if (utmParams.utmCampaign) {
      url.searchParams.set("utm_campaign", utmParams.utmCampaign);
    }

    return url.toString();
  } catch {
    return targetUrl;
  }
}

/**
 * Limites de liens courts par plan
 */
export const SHORT_LINK_LIMITS = {
  FREE: 5,
  PRO: -1, // illimite
  BUSINESS: -1,
} as const;

/**
 * Verifie si l'utilisateur peut creer un nouveau lien court
 * @param plan Plan de l'utilisateur
 * @param currentCount Nombre actuel de liens
 * @returns true si autorise
 */
export function canCreateShortLink(
  plan: "FREE" | "PRO" | "BUSINESS",
  currentCount: number
): boolean {
  const limit = SHORT_LINK_LIMITS[plan];
  if (limit === -1) return true;
  return currentCount < limit;
}
