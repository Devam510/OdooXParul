import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: (await params).id } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const share = await prisma.sharedTrip.findFirst({
      where: { tripId: (await params).id },
    });

    return successResponse(share || null);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const POST = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: (await params).id } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    let share = await prisma.sharedTrip.findFirst({
      where: { tripId: (await params).id },
    });

    if (!share) {
      share = await prisma.sharedTrip.create({
        data: {
          tripId: (await params).id,
          isActive: true,
        },
      });
    } else {
      share = await prisma.sharedTrip.update({
        where: { id: share.id },
        data: { isActive: true },
      });
    }

    return successResponse(share);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: (await params).id } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const body = await req.json();
    const isActive = body.isActive;

    const share = await prisma.sharedTrip.findFirst({
      where: { tripId: (await params).id },
    });

    if (!share) {
      return errorResponse("NOT_FOUND", "Share link not found", 404);
    }

    const updatedShare = await prisma.sharedTrip.update({
      where: { id: share.id },
      data: { isActive },
    });

    return successResponse(updatedShare);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const DELETE = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: (await params).id } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    await prisma.sharedTrip.deleteMany({
      where: { tripId: (await params).id },
    });

    return successResponse({ deleted: true });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
