import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { tripSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/trips/:id — Fetch a specific trip with its stops
export const GET = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const tripId = params.id;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: { city: true },
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

// PATCH /api/trips/:id — Update a trip
export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const tripId = params.id;

    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!existingTrip) {
      return errorResponse("NOT_FOUND", "Trip not found", 404);
    }

    if (existingTrip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "You do not have access to this trip", 403);
    }

    const body = await req.json();
    const result = tripSchema.partial().safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, result.error.errors);
    }

    const data: any = { ...result.data };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data,
    });

    return successResponse(updatedTrip);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

// DELETE /api/trips/:id — Delete a trip
export const DELETE = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const tripId = params.id;

    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!existingTrip) {
      return errorResponse("NOT_FOUND", "Trip not found", 404);
    }

    if (existingTrip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "You do not have access to this trip", 403);
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return successResponse({ message: "Trip deleted successfully" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
