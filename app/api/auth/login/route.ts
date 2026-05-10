import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { loginSchema } from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid credentials", 400);
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

    // Generate tokens
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Track session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    // Set cookie
    const response = successResponse({
      user: { id: user.id, email: user.email, username: user.username, fullName: user.fullName, role: user.role, avatar: user.avatar },
      accessToken,
    });

    const cookieStore = await cookies();
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Something went wrong", 500);
  }
}
