import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const updateActivitySchema = z.object({
  scheduledDate: z.string().optional().nullable(),
  scheduledTime: z.string().optional().nullable(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const { id: tripId, stopId, actId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const activity = await prisma.tripActivity.findFirst({
      where: { id: actId, tripStopId: stopId },
    });
    if (!activity) {
      return errorResponse("NOT_FOUND", "Activity not found", 404);
    }

    const body = await req.json();
    const result = updateActivitySchema.safeParse(body);
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, (result.error as any).errors);
    }

    const { scheduledDate, scheduledTime, notes, status } = result.data;

    const updatedActivity = await prisma.tripActivity.update({
      where: { id: actId },
      data: {
        scheduledDate: scheduledDate ? new Date(scheduledDate) : scheduledDate === null ? null : undefined,
        scheduledTime: scheduledTime !== undefined ? scheduledTime : undefined,
        notes: notes !== undefined ? notes : undefined,
        status: status !== undefined ? status : undefined,
      },
    });

    return successResponse(updatedActivity);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const DELETE = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const { id: tripId, stopId, actId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const activity = await prisma.tripActivity.findFirst({
      where: { id: actId, tripStopId: stopId },
    });
    if (!activity) {
      return errorResponse("NOT_FOUND", "Activity not found", 404);
    }

    await prisma.tripActivity.delete({
      where: { id: actId },
    });

    return successResponse({ message: "Activity deleted successfully" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
