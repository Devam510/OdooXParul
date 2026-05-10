import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { errorResponse, successResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const refreshTokenCookie = req.cookies.get("refresh_token")?.value;

    if (!refreshTokenCookie) {
      return errorResponse("UNAUTHORIZED", "No refresh token provided", 401);
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenCookie);
    } catch {
      return errorResponse("UNAUTHORIZED", "Invalid or expired refresh token", 401);
    }

    // Verify token exists in DB and is not revoked
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenCookie },
    });

    if (!dbToken || dbToken.isRevoked || dbToken.expiresAt < new Date()) {
      return errorResponse("UNAUTHORIZED", "Token has been revoked or expired", 401);
    }

    // Generate new tokens
    const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    // Revoke old, create new
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: dbToken.id },
        data: { isRevoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          userId: payload.userId,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      }),
    ]);

    const response = successResponse({ accessToken: newAccessToken });

    const cookieStore = await cookies();
    cookieStore.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Something went wrong", 500);
  }
}
