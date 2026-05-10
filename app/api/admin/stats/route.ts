import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    // Basic role check - ideally handled by a withAdmin middleware
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (dbUser?.role !== "ADMIN") {
      return errorResponse("FORBIDDEN", "Admin access required", 403);
    }

    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();

    // Past 30 days trips
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTrips = await prisma.trip.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true }
    });

    // Aggregate trips by day
    const tripsPerDayMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      tripsPerDayMap[d.toISOString().split('T')[0]] = 0;
    }

    recentTrips.forEach(trip => {
      const dateStr = trip.createdAt.toISOString().split('T')[0];
      if (tripsPerDayMap[dateStr] !== undefined) {
        tripsPerDayMap[dateStr]++;
      }
    });

    const tripsPerDay = Object.entries(tripsPerDayMap).map(([date, count]) => ({ date, count }));

    // Top cities
    const topCities = await prisma.city.findMany({
      orderBy: { popularity: "desc" },
      take: 10,
      select: { name: true, popularity: true }
    });

    // Top activities
    const topActivities = await prisma.activity.findMany({
      orderBy: { rating: "desc" },
      take: 10,
      select: { name: true, rating: true, category: true }
    });

    return successResponse({
      totalUsers,
      totalTrips,
      tripsPerDay,
      topCities,
      topActivities
    });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
