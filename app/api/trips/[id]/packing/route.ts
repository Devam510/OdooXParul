import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { packingSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const tripId = params.id;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const items = await prisma.packingItem.findMany({
      where: { tripId },
      orderBy: { createdAt: "asc" },
    });

    return successResponse(items);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const POST = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const tripId = params.id;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const body = await req.json();
    const result = packingSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, result.error.errors);
    }

    const { name, category, quantity, isPacked } = result.data;

    const item = await prisma.packingItem.create({
      data: {
        tripId,
        name,
        category,
        quantity: quantity || 1,
        isPacked: isPacked || false,
      },
    });

    return successResponse(item, { status: 201 });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
