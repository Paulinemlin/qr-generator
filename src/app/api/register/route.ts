import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  checkRegisterRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { sendVerificationEmail } from "@/lib/email";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for registration
    const ip = getClientIp(request);
    const rateLimit = await checkRegisterRateLimit(ip);
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = randomUUID();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerified: false,
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Send verification email (fire and forget)
    sendVerificationEmail(email, emailVerificationToken, name).catch((err) => {
      logger.error(err instanceof Error ? err : new Error(String(err)), {
        action: "send_verification_email",
        userId: user.id,
      });
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: false,
    });
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), {
      action: "register",
    });
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
