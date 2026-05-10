import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { errorResponse, successResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const refreshTokenCookie = req.cookies.get("refresh_token")?.value;

    if (refreshTokenCookie) {
      // Revoke token in DB
      await prisma.refreshToken.updateMany({
        where: { token: refreshTokenCookie },
        data: { isRevoked: true },
      });
    }

    const response = successResponse({ success: true });

    // Clear cookie
    const cookieStore = await cookies();
    cookieStore.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Something went wrong", 500);
  }
}
