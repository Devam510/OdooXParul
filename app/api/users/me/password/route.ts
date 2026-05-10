import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { changePasswordSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const body = await req.json();
    const result = changePasswordSchema.safeParse(body);
    
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, result.error.errors);
    }

    const { currentPassword, newPassword } = result.data;

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser) {
      return errorResponse("NOT_FOUND", "User not found", 404);
    }

    const isValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!isValid) {
      return errorResponse("UNAUTHORIZED", "Incorrect current password", 401);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { id: user.userId },
      data: { passwordHash },
    });

    return successResponse({ updated: true });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
