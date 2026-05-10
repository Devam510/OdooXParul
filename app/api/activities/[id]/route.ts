import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: (await params).id },
      include: {
        city: true
      }
    });

    if (!activity) {
      return errorResponse("NOT_FOUND", "Activity not found", 404);
    }

    return successResponse(activity);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
