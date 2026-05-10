import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { PACKING_TEMPLATES } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const tripId = params.id;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const { templateType } = await req.json();

    const templateItems = PACKING_TEMPLATES[templateType as keyof typeof PACKING_TEMPLATES];
    if (!templateItems) {
      return errorResponse("VALIDATION_ERROR", "Invalid template type", 400);
    }

    const itemsToCreate = templateItems.map((item) => ({
      tripId,
      name: item.name,
      category: item.category,
      quantity: 1,
      isPacked: false,
    }));

    await prisma.packingItem.createMany({
      data: itemsToCreate,
    });

    return successResponse({ message: `Added ${itemsToCreate.length} items from ${templateType} template` }, { status: 201 });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
