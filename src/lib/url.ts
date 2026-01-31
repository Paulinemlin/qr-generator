/**
 * Get the base URL for the application
 * Works in all environments: local, Vercel preview, production
 */
export function getBaseUrl(): string {
  // 1. Explicit NEXTAUTH_URL (production or custom)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // 2. Vercel production deployment
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // 3. Vercel preview deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 4. Fallback to localhost
  return "http://localhost:3000";
}

/**
 * Get the base URL from request headers
 * Useful for generating URLs that match the current request
 */
export function getBaseUrlFromRequest(request: Request): string {
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return getBaseUrl();
}
