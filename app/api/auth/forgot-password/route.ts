import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/response";
import { rateLimiters } from "@/lib/rate-limit";
import crypto from "crypto";

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
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid email", 400, (result.error as any).errors);
    }

    const { email } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
      console.log(`[DEV ONLY] Reset Password Link for ${user.email}: ${resetLink}`);
      // In production, send email here.
    }

    // Always return success even if email not found to prevent enumeration
    return successResponse({ message: "If that email is in our database, we have sent a reset link to it." });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
}
