import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const { id: tripId, stopId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const { orderedIds } = await req.json();
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return errorResponse("VALIDATION_ERROR", "orderedIds array is required", 400);
    }

    // Wrap updates in transaction to ensure atomic reordering
    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.tripActivity.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return successResponse({ message: "Activities reordered successfully" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
