import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { tripId: string } }) => {
  try {
    const tripId = params.tripId;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: {
            city: true,
            activities: {
              include: {
                activity: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!trip) {
      return errorResponse("NOT_FOUND", "Trip not found", 404);
    }

    if (trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "You do not have access to this trip", 403);
    }

    return successResponse(trip);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
