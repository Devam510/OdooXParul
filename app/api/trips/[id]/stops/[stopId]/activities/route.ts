import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const addActivitySchema = z.object({
  activityId: z.string(),
  scheduledDate: z.string().optional().nullable(),
  scheduledTime: z.string().optional().nullable(),
  notes: z.string().optional(),
});

export const POST = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string; stopId: string } }) => {
  try {
    const { id: tripId, stopId } = params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const stop = await prisma.tripStop.findFirst({ where: { id: stopId, tripId } });
    if (!stop) {
      return errorResponse("NOT_FOUND", "Stop not found", 404);
    }

    const body = await req.json();
    const result = addActivitySchema.safeParse(body);
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, result.error.errors);
    }

    const { activityId, scheduledDate, scheduledTime, notes } = result.data;

    // Verify activity exists
    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) {
      return errorResponse("NOT_FOUND", "Activity not found", 404);
    }

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripStopId: stopId,
        activityId,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        scheduledTime,
        notes,
        status: "planned",
      },
      include: {
        activity: true,
      },
    });

    return successResponse(tripActivity, { status: 201 });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
