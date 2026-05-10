import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimiters.write(user.userId);
    
    if (!allowed) {
      return errorResponse("RATE_LIMIT_EXCEEDED", "Too many requests. Try again later.", 429);
    }

    const tripId = params.id;

    // 1. Fetch the original trip with all nested data
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          include: {
            activities: true,
          },
        },
      },
    });

    if (!existingTrip) {
      return errorResponse("NOT_FOUND", "Trip not found", 404);
    }

    if (existingTrip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "You do not have access to this trip", 403);
    }

    // 2. Clone the trip
    const clonedTrip = await prisma.trip.create({
      data: {
        userId: user.userId,
        title: `${existingTrip.title} (Copy)`,
        description: existingTrip.description,
        coverImage: existingTrip.coverImage,
        startDate: existingTrip.startDate,
        endDate: existingTrip.endDate,
        visibility: existingTrip.visibility,
        status: "PLANNING",
        tags: existingTrip.tags,
        // Clone stops and nested activities
        stops: {
          create: existingTrip.stops.map((stop) => ({
            cityId: stop.cityId,
            order: stop.order,
            arrivalDate: stop.arrivalDate,
            departureDate: stop.departureDate,
            hotelName: stop.hotelName,
            hotelAddress: stop.hotelAddress,
            hotelCostPerNight: stop.hotelCostPerNight,
            transportType: stop.transportType,
            transportNotes: stop.transportNotes,
            notes: stop.notes,
            budgetEstimate: stop.budgetEstimate,
            activities: {
              create: stop.activities.map((act) => ({
                activityId: act.activityId,
                scheduledDate: act.scheduledDate,
                scheduledTime: act.scheduledTime,
                notes: act.notes,
                status: "planned",
              })),
            },
          })),
        },
      },
      include: {
        stops: true,
      },
    });

    return successResponse(clonedTrip, { status: 201 });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
