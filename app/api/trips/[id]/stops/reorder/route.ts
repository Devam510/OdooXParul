import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { reorderStopsSchema } from "@/lib/validators";

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

    const body = await req.json();
    const result = reorderStopsSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, (result.error as any).errors);
    }

    const { orderedIds } = result.data;

    // Run within a transaction to ensure all updates happen or none
    await prisma.$transaction(
      orderedIds.map((stopId, index) =>
        prisma.tripStop.update({
          where: { id: stopId, tripId },
          data: { order: index },
        })
      )
    );

    return successResponse({ message: "Stops reordered successfully" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
