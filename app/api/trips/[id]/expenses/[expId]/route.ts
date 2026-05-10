import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const PATCH = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string; expId: string } }) => {
  try {
    const { id: tripId, expId } = params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const expense = await prisma.expense.findFirst({ where: { id: expId, tripId } });
    if (!expense) {
      return errorResponse("NOT_FOUND", "Expense not found", 404);
    }

    const body = await req.json();
    const result = expenseSchema.partial().safeParse(body);
    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid input", 400, result.error.errors);
    }

    const data: any = { ...result.data };
    if (data.date) data.date = new Date(data.date);

    const updatedExpense = await prisma.expense.update({
      where: { id: expId },
      data,
    });

    return successResponse(updatedExpense);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

export const DELETE = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string; expId: string } }) => {
  try {
    const { id: tripId, expId } = params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.userId) {
      return errorResponse("FORBIDDEN", "Trip not found or access denied", 403);
    }

    const expense = await prisma.expense.findFirst({ where: { id: expId, tripId } });
    if (!expense) {
      return errorResponse("NOT_FOUND", "Expense not found", 404);
    }

    await prisma.expense.delete({
      where: { id: expId },
    });

    return successResponse({ message: "Expense deleted successfully" });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
