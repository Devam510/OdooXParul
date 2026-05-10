import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { tripStopSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/trips/:id/stops — Add a stop to a trip
export const POST = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
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
    const result = tripStopSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, (result.error as any).errors);
    }

    const data: any = { ...result.data };
    if (data.arrivalDate) data.arrivalDate = new Date(data.arrivalDate);
    if (data.departureDate) data.departureDate = new Date(data.departureDate);

    // Verify city exists
    const cityExists = await prisma.city.findUnique({ where: { id: data.cityId } });
    if (!cityExists) {
      return errorResponse("NOT_FOUND", "City not found", 404);
    }

    const stop = await prisma.tripStop.create({
      data: {
        ...data,
        tripId,
      },
    });

    return successResponse(stop, { status: 201 });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
