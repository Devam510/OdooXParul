import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const tripId = (await params).id;

    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!existingTrip) {
      return errorResponse("NOT_FOUND", "Trip not found", 404);
    }

    if (existingTrip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "You do not have access to this trip", 403);
    }

    const newStatus = existingTrip.status === "ARCHIVED" ? "PLANNING" : "ARCHIVED";

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: { status: newStatus },
    });

    return successResponse(updatedTrip);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
