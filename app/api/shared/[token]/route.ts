import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const share = await prisma.sharedTrip.findUnique({
      where: { shareToken: token },
      include: {
        trip: {
          include: {
            stops: {
              include: {
                city: true,
                activities: {
                  include: {
                    activity: true
                  },
                  orderBy: { order: "asc" }
                }
              },
              orderBy: { order: "asc" }
            },
            expenses: true,
            user: {
              select: {
                fullName: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!share || !share.isActive) {
      return errorResponse("NOT_FOUND", "Shared trip not found or link has expired", 404);
    }

    if (share.expiresAt && new Date() > share.expiresAt) {
      return errorResponse("NOT_FOUND", "This shared link has expired", 404);
    }

    // Sanitize the response - remove user IDs, individual expense details, notes
    const sanitizedTrip = {
      title: share.trip.title,
      description: share.trip.description,
      coverImage: share.trip.coverImage,
      startDate: share.trip.startDate,
      endDate: share.trip.endDate,
      tags: share.trip.tags,
      user: share.trip.user,
      stops: share.trip.stops.map((s: any) => ({
        city: s.city,
        arrivalDate: s.arrivalDate,
        departureDate: s.departureDate,
        hotelName: s.hotelName,
        transportType: s.transportType,
        activities: s.activities.map((a: any) => a.activity)
      })),
      budgetSummary: {
        totalSpent: share.trip.expenses.reduce(
          (acc: number, exp: { amount: number }) => acc + (exp.amount ?? 0),
          0
        ),
        byCategory: share.trip.expenses.reduce(
          (acc: Record<string, number>, exp: { category: string; amount: number }) => {
            acc[exp.category] = (acc[exp.category] ?? 0) + (exp.amount ?? 0);
            return acc;
          },
          {} as Record<string, number>
        )
      }
    };

    return successResponse(sanitizedTrip);
  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
}
