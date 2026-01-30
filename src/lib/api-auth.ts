import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";
import { PLANS, PlanType } from "@/lib/plans";

export interface ApiAuthResult {
  success: boolean;
  userId?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Generate a new API key with prefix
 */
export function generateApiKey(): { key: string; prefix: string } {
  const prefix = "qr_";
  const randomPart = randomBytes(32).toString("hex");
  const key = `${prefix}${randomPart}`;
  return { key, prefix };
}

/**
 * Validate an API key from request headers
 * Returns the user ID if valid, or an error response
 */
export async function validateApiKey(
  request: NextRequest
): Promise<ApiAuthResult> {
  const apiKey = request.headers.get("X-API-Key");

  if (!apiKey) {
    return {
      success: false,
      error: "Missing API key. Please provide X-API-Key header.",
      statusCode: 401,
    };
  }

  const hashedKey = hashApiKey(apiKey);

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    include: {
      user: {
        select: {
          id: true,
          plan: true,
        },
      },
    },
  });

  if (!apiKeyRecord) {
    return {
      success: false,
      error: "Invalid API key.",
      statusCode: 401,
    };
  }

  // Check if the key has expired
  if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
    return {
      success: false,
      error: "API key has expired.",
      statusCode: 401,
    };
  }

  // Check if the user has API access (Business plan)
  const plan = apiKeyRecord.user.plan as PlanType;
  const limits = PLANS[plan].limits;

  if (!limits.apiAccess) {
    return {
      success: false,
      error: "API access requires a Business plan subscription.",
      statusCode: 403,
    };
  }

  // Update last used timestamp (fire and forget)
  prisma.apiKey
    .update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {
      // Silently ignore errors updating last used
    });

  return {
    success: true,
    userId: apiKeyRecord.user.id,
  };
}

/**
 * Create a standard API error response
 */
export function apiError(message: string, statusCode: number = 400) {
  return Response.json(
    { error: message },
    { status: statusCode }
  );
}

/**
 * Create a standard API success response
 */
export function apiSuccess<T>(data: T, statusCode: number = 200) {
  return Response.json(data, { status: statusCode });
}
