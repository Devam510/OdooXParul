import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest, user: JWTPayload, { params }: { params: { id: string } }) => {
  try {
    const city = await prisma.city.findUnique({
      where: { id: params.id },
      include: {
        activities: {
          orderBy: { rating: "desc" },
          take: 20
        }
      }
    });

    if (!city) {
      return errorResponse("NOT_FOUND", "City not found", 404);
    }

    return successResponse(city);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
