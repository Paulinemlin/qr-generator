import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { Plan } from "@prisma/client";

// Create Redis client - returns null if not configured
function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

const redis = createRedis();

// Rate limiters by type
const limiters = redis
  ? {
      // Public endpoints: 100 requests/minute per IP
      public: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 m"),
        prefix: "ratelimit:public",
        analytics: true,
      }),

      // Registration: 5 requests/hour per IP (anti-spam)
      register: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        prefix: "ratelimit:register",
        analytics: true,
      }),

      // Authenticated - FREE: 60 requests/minute
      authFree: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, "1 m"),
        prefix: "ratelimit:auth:free",
        analytics: true,
      }),

      // Authenticated - PRO: 300 requests/minute
      authPro: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(300, "1 m"),
        prefix: "ratelimit:auth:pro",
        analytics: true,
      }),

      // Authenticated - BUSINESS: 1000 requests/minute
      authBusiness: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1000, "1 m"),
        prefix: "ratelimit:auth:business",
        analytics: true,
      }),

      // API v1: 1000 requests/minute per API key
      apiV1: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1000, "1 m"),
        prefix: "ratelimit:api:v1",
        analytics: true,
      }),

      // Email verification resend: 1 request/2 minutes
      emailResend: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1, "2 m"),
        prefix: "ratelimit:email:resend",
        analytics: true,
      }),

      // Password reset: 3 requests/hour per email
      passwordReset: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        prefix: "ratelimit:password:reset",
        analytics: true,
      }),
    }
  : null;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for public endpoints (by IP)
 */
export async function checkPublicRateLimit(
  ip: string
): Promise<RateLimitResult> {
  if (!limiters) {
    return { success: true, limit: 100, remaining: 100, reset: 0 };
  }

  const result = await limiters.public.limit(ip);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Check rate limit for registration endpoint (by IP)
 */
export async function checkRegisterRateLimit(
  ip: string
): Promise<RateLimitResult> {
  if (!limiters) {
    return { success: true, limit: 5, remaining: 5, reset: 0 };
  }

  const result = await limiters.register.limit(ip);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Check rate limit for authenticated endpoints (by user ID and plan)
 */
export async function checkAuthRateLimit(
  userId: string,
  plan: Plan
): Promise<RateLimitResult> {
  if (!limiters) {
    const limit = plan === "BUSINESS" ? 1000 : plan === "PRO" ? 300 : 60;
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  const limiter =
    plan === "BUSINESS"
      ? limiters.authBusiness
      : plan === "PRO"
        ? limiters.authPro
        : limiters.authFree;

  const result = await limiter.limit(userId);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Check rate limit for API v1 endpoints (by API key)
 */
export async function checkApiV1RateLimit(
  apiKey: string
): Promise<RateLimitResult> {
  if (!limiters) {
    return { success: true, limit: 1000, remaining: 1000, reset: 0 };
  }

  const result = await limiters.apiV1.limit(apiKey);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Check rate limit for email resend (by user ID)
 */
export async function checkEmailResendRateLimit(
  userId: string
): Promise<RateLimitResult> {
  if (!limiters) {
    return { success: true, limit: 1, remaining: 1, reset: 0 };
  }

  const result = await limiters.emailResend.limit(userId);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Check rate limit for password reset (by email)
 */
export async function checkPasswordResetRateLimit(
  email: string
): Promise<RateLimitResult> {
  if (!limiters) {
    return { success: true, limit: 3, remaining: 3, reset: 0 };
  }

  const result = await limiters.passwordReset.limit(email);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Create a rate limit exceeded response with proper headers
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

  return NextResponse.json(
    {
      error: "Trop de requêtes. Veuillez réessayer plus tard.",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.reset.toString(),
        "Retry-After": retryAfter.toString(),
      },
    }
  );
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.reset.toString());
  return response;
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}
