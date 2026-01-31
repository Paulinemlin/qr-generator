import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { sendPasswordResetEmail } from "@/lib/email";
import {
  checkPasswordResetRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Rate limiting by IP and email
    const ip = getClientIp(request);
    const rateLimit = await checkPasswordResetRateLimit(`${ip}:${email}`);
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    // Find user (but don't reveal if email exists)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si cet email existe, vous recevrez un lien de réinitialisation.",
      });
    }

    // Generate reset token
    const passwordResetToken = randomUUID();
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Send reset email
    sendPasswordResetEmail(
      user.email,
      passwordResetToken,
      user.name || undefined
    ).catch((err) => {
      logger.error(err instanceof Error ? err : new Error(String(err)), {
        action: "send_password_reset_email",
        userId: user.id,
      });
    });

    return NextResponse.json({
      success: true,
      message: "Si cet email existe, vous recevrez un lien de réinitialisation.",
    });
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), {
      action: "forgot_password",
    });
    return NextResponse.json(
      { error: "Erreur lors de la demande" },
      { status: 500 }
    );
  }
}
