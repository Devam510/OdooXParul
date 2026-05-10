import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { packingSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string; itemId: string } }) => {
  try {
    const { id: tripId, itemId } = params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const item = await prisma.packingItem.findFirst({ where: { id: itemId, tripId } });
    if (!item) {
      return errorResponse("NOT_FOUND", "Item not found", 404);
    }

    const body = await req.json();
    const result = packingSchema.partial().safeParse(body);
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, result.error.errors);
    }

    const updatedItem = await prisma.packingItem.update({
      where: { id: itemId },
      data: result.data,
    });

    return successResponse(updatedItem);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const DELETE = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string; itemId: string } }) => {
  try {
    const { id: tripId, itemId } = params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const item = await prisma.packingItem.findFirst({ where: { id: itemId, tripId } });
    if (!item) {
      return errorResponse("NOT_FOUND", "Item not found", 404);
    }

    await prisma.packingItem.delete({
      where: { id: itemId },
    });

    return successResponse({ message: "Item deleted successfully" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
