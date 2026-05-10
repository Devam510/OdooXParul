import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const tripId = (await params).id;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: "desc" },
    });

    const tripData = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { stops: { include: { city: true } } },
    });

    return successResponse({ expenses, stops: tripData?.stops || [] });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const POST = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: Promise<any> }) => {
  try {
    const tripId = (await params).id;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const body = await req.json();
    const result = expenseSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, (result.error as any).errors);
    }

    const { amount, currency, category, description, date, tripStopId } = result.data;

    const expense = await prisma.expense.create({
      data: {
        tripId,
        amount,
        currency,
        category,
        description,
        date: new Date(date),
        tripStopId,
      },
    });

    return successResponse(expense, { status: 201 });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
