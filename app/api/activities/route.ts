import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("q");
    const cityId = url.searchParams.get("cityId");
    const category = url.searchParams.get("category");
    const minRating = url.searchParams.get("minRating");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const where: any = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (cityId) where.cityId = cityId;
    if (category) where.category = category;
    if (minRating) where.rating = { gte: parseFloat(minRating) };

    const [total, activities] = await Promise.all([
      prisma.activity.count({ where }),
      prisma.activity.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
        include: { city: true }
      }),
    ]);

    return successResponse(activities, {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
};
