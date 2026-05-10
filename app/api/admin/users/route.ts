import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (dbUser?.role !== "ADMIN") {
      return errorResponse("FORBIDDEN", "Admin access required", 403);
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // limit to max 50
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          role: true,
          createdAt: true,
          _count: {
            select: { trips: true }
          }
        }
      }),
      prisma.user.count()
    ]);

    return successResponse({
      users: users.map(u => ({
        ...u,
        tripsCount: u._count.trips
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
