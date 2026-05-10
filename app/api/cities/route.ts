import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("q");
    const country = url.searchParams.get("country");
    const maxCost = url.searchParams.get("maxCost");
    const minPopularity = url.searchParams.get("minPopularity");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const where: any = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (country) where.country = { equals: country, mode: "insensitive" };
    if (maxCost) where.costIndex = { lte: parseInt(maxCost) };
    if (minPopularity) where.popularity = { gte: parseFloat(minPopularity) };

    const [total, cities] = await Promise.all([
      prisma.city.count({ where }),
      prisma.city.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
      }),
    ]);

    return successResponse(cities, {
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
