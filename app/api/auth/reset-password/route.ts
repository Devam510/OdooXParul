import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/response";
import { rateLimiters } from "@/lib/rate-limit";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimiters.forgotPassword(ip);
    
    if (!allowed) {
      return errorResponse("RATE_LIMIT_EXCEEDED", "Too many requests. Try again later.", 429);
    }

    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, (result.error as any).errors);
    }

    const { token, password } = result.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetRequest = await prisma.passwordReset.findUnique({
      where: { tokenHash },
    });

    if (!resetRequest || resetRequest.usedAt || resetRequest.expiresAt < new Date()) {
      return errorResponse("INVALID_TOKEN", "Reset token is invalid or has expired", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Run within a transaction to ensure atomicity
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRequest.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRequest.id },
        data: { usedAt: new Date() },
      }),
      // Revoke all existing refresh tokens for security
      prisma.refreshToken.updateMany({
        where: { userId: resetRequest.userId, isRevoked: false },
        data: { isRevoked: true },
      })
    ]);

    return successResponse({ message: "Password has been successfully reset" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
}
