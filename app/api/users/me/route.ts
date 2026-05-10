import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { updateProfileSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        bio: true,
        travelStyle: true,
        favoriteDestinations: true,
        role: true,
        createdAt: true,
      }
    });

    if (!profile) {
      return errorResponse("NOT_FOUND", "User not found", 404);
    }

    return successResponse(profile);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);
    
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, (result.error as any).errors);
    }

    // Avatar has to be handled separately as it's not in the validator for simplicity (base64 or URL)
    const dataToUpdate: any = { ...result.data };
    if (body.avatar !== undefined) {
      dataToUpdate.avatar = body.avatar;
    }

    // Check if username is already taken
    if (dataToUpdate.username) {
      const existingUser = await prisma.user.findUnique({ where: { username: dataToUpdate.username } });
      if (existingUser && existingUser.id !== user.userId) {
        return errorResponse("CONFLICT", "Username is already taken", 409);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        bio: true,
        travelStyle: true,
        favoriteDestinations: true,
        role: true,
      }
    });

    return successResponse(updatedUser);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const DELETE = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return errorResponse("VALIDATION_ERROR", "Password is required to delete account", 400);
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser) {
      return errorResponse("NOT_FOUND", "User not found", 404);
    }

    const isValid = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isValid) {
      return errorResponse("UNAUTHORIZED", "Invalid password", 401);
    }

    await prisma.user.delete({ where: { id: user.userId } });
    
    return successResponse({ deleted: true });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
