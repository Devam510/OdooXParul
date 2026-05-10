import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { tripSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/trips — List user's trips
export const GET = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "upcoming";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const where: any = { userId: user.userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const orderBy: any = sort === "recent" 
      ? { createdAt: "desc" } 
      : { startDate: "asc" };

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: { select: { stops: true } },
        },
      }),
      prisma.trip.count({ where }),
    ]);

    return successResponse(trips, { 
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});

// POST /api/trips — Create new trip
export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const body = await req.json();
    const result = tripSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid trip data", 400, result.error.errors);
    }

    const { title, description, startDate, endDate, visibility, tags } = result.data;

    const trip = await prisma.trip.create({
      data: {
        userId: user.userId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        visibility: visibility as any,
        tags,
        status: "PLANNING",
      },
    });

    return successResponse(trip, { status: 201 });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
