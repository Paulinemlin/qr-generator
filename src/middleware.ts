import { NextRequest, NextResponse } from "next/server";

/**
 * Liste des domaines de l'application principale
 * Ces domaines ne sont pas consideres comme des domaines personnalises
 */
const APP_DOMAINS = [
  "localhost",
  "localhost:3000",
  "127.0.0.1",
  "127.0.0.1:3000",
  // Ajouter ici les domaines de production
  // "qr-generator.com",
  // "www.qr-generator.com",
];

/**
 * Verifie si l'URL de l'hote est un domaine personnalise
 */
function isCustomDomain(host: string): boolean {
  // Retirer le port si present pour la comparaison
  const hostWithoutPort = host.split(":")[0];

  // Verifier si c'est un domaine de l'application
  const isAppDomain = APP_DOMAINS.some((appDomain) => {
    const appDomainWithoutPort = appDomain.split(":")[0];
    return (
      host === appDomain ||
      hostWithoutPort === appDomainWithoutPort ||
      host.endsWith(`.${appDomainWithoutPort}`)
    );
  });

  // Verifier aussi si c'est un domaine Vercel
  if (
    host.includes(".vercel.app") ||
    host.includes(".vercel.sh")
  ) {
    return false;
  }

  return !isAppDomain;
}

/**
 * Middleware pour detecter les domaines personnalises et rediriger les requetes
 */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Ne pas traiter les requetes pour les assets statiques, API, ou routes internes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/r/") ||
    pathname.includes(".") || // Fichiers statiques (images, favicon, etc.)
    pathname === "/" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Verifier si c'est un domaine personnalise
  if (isCustomDomain(host)) {
    // Extraire le shortCode du chemin (ex: /abc123 -> abc123)
    const shortCode = pathname.replace(/^\//, "");

    if (shortCode && shortCode.length > 0) {
      // Rediriger vers la route de redirection interne avec le domaine et le shortCode
      const url = request.nextUrl.clone();
      url.pathname = `/api/redirect`;
      url.searchParams.set("domain", host.split(":")[0]); // Domaine sans port
      url.searchParams.set("code", shortCode);

      // Utiliser une rewrite pour garder l'URL originale visible
      return NextResponse.rewrite(url);
    }

    // Si pas de shortCode, rediriger vers la page d'accueil de l'application
    // ou afficher une page 404 personnalisee
    const url = request.nextUrl.clone();
    url.pathname = "/api/redirect";
    url.searchParams.set("domain", host.split(":")[0]);
    url.searchParams.set("code", "");

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

/**
 * Configuration du middleware
 * Appliquer le middleware a toutes les routes sauf celles exclues
 */
export const config = {
  matcher: [
    /*
     * Correspond a toutes les routes sauf:
     * - _next (fichiers Next.js internes)
     * - api (routes API)
     * - r (routes de redirection standard)
     * - Fichiers statiques avec extensions
     */
    "/((?!_next|api|r|.*\\..*).*)",
  ],
};
