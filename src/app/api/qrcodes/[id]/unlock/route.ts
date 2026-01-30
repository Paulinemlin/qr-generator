import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Rate limiting simple en memoire (pour la production, utiliser Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }

  record.count++;
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.count };
}

// Nettoyer periodiquement les anciennes entrees
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Recuperer l'IP pour le rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  // Verifier le rate limit
  const rateLimit = checkRateLimit(`${ip}:${id}`);
  if (!rateLimit.allowed) {
    console.log(`[UNLOCK] Rate limit atteint pour IP ${ip} sur QR code ${id}`);
    return NextResponse.json(
      {
        error: "Trop de tentatives. Veuillez reessayer dans une minute.",
        retryAfter: 60,
      },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
        },
      }
    );
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      );
    }

    // Recuperer le QR code
    const qrcode = await prisma.qRCode.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isPasswordProtected: true,
        passwordHash: true,
        targetUrl: true,
        isActive: true,
      },
    });

    if (!qrcode) {
      return NextResponse.json(
        { error: "QR code non trouve" },
        { status: 404 }
      );
    }

    if (!qrcode.isPasswordProtected || !qrcode.passwordHash) {
      return NextResponse.json(
        { error: "Ce QR code n'est pas protege par mot de passe" },
        { status: 400 }
      );
    }

    if (!qrcode.isActive) {
      return NextResponse.json(
        { error: "Ce QR code n'est plus actif" },
        { status: 410 }
      );
    }

    // Verifier le mot de passe
    const isValid = await bcrypt.compare(password, qrcode.passwordHash);

    if (!isValid) {
      console.log(`[UNLOCK] Tentative echouee pour QR code ${id} depuis IP ${ip}`);
      return NextResponse.json(
        {
          error: "Mot de passe incorrect",
          remainingAttempts: rateLimit.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Creer un token de session pour ce QR code (valide 24h)
    const unlockToken = Buffer.from(`${id}:${Date.now()}:${Math.random()}`).toString("base64");

    // Stocker le cookie
    const cookieStore = await cookies();
    cookieStore.set(`qr_unlock_${id}`, unlockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 heures
      path: "/",
    });

    console.log(`[UNLOCK] Deverrouillage reussi pour QR code ${id} depuis IP ${ip}`);

    return NextResponse.json({
      success: true,
      targetUrl: qrcode.targetUrl,
    });
  } catch (error) {
    console.error("Erreur lors du deverrouillage:", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification du mot de passe" },
      { status: 500 }
    );
  }
}

// Endpoint pour verifier si l'utilisateur est deja deverrouille
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const qrcode = await prisma.qRCode.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isPasswordProtected: true,
        isActive: true,
      },
    });

    if (!qrcode) {
      return NextResponse.json(
        { error: "QR code non trouve" },
        { status: 404 }
      );
    }

    // Verifier si deja deverrouille via cookie
    const cookieStore = await cookies();
    const unlockCookie = cookieStore.get(`qr_unlock_${id}`);
    const isUnlocked = !!unlockCookie;

    return NextResponse.json({
      id: qrcode.id,
      name: qrcode.name,
      isPasswordProtected: qrcode.isPasswordProtected,
      isActive: qrcode.isActive,
      isUnlocked,
    });
  } catch (error) {
    console.error("Erreur lors de la verification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification" },
      { status: 500 }
    );
  }
}
