import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const DELETE = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const { id: tripId, stopId } = await params;

    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!existingTrip) {
      return errorResponse("NOT_FOUND", "Trip not found", 404);
    }

    if (existingTrip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "You do not have access to this trip", 403);
    }

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
    });

    if (!stop) {
      return errorResponse("NOT_FOUND", "Stop not found", 404);
    }

    await prisma.tripStop.delete({
      where: { id: stopId },
    });

    return successResponse({ message: "Stop deleted successfully" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const { id: tripId, stopId } = await params;

    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!existingTrip) {
      return errorResponse("NOT_FOUND", "Trip not found", 404);
    }

    if (existingTrip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "You do not have access to this trip", 403);
    }

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
    });

    if (!stop) {
      return errorResponse("NOT_FOUND", "Stop not found", 404);
    }

    const body = await req.json();
    
    // Convert dates if present
    if (body.arrivalDate) body.arrivalDate = new Date(body.arrivalDate);
    if (body.departureDate) body.departureDate = new Date(body.departureDate);

    const updatedStop = await prisma.tripStop.update({
      where: { id: stopId },
      data: body,
    });

    return successResponse(updatedStop);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
