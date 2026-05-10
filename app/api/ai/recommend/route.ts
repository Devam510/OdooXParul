import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { generateAIResponse, isAIEnabled } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const { cityId, travelStyle } = await req.json();

    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return errorResponse("NOT_FOUND", "City not found", 404);
    }

    if (!isAIEnabled()) {
      // Fallback
      const activities = await prisma.activity.findMany({
        where: { cityId },
        orderBy: { rating: "desc" },
        take: 5
      });
      return successResponse({ recommendations: activities });
    }

    const systemPrompt = `You are a local travel expert. Recommend 5 unique, highly-rated activities for a visitor to ${city.name}, ${city.country}.
    Tailor these recommendations specifically to a ${travelStyle || "general"} travel style.
    Return ONLY a valid JSON object matching this schema:
    {
      "recommendations": [
        {
          "name": "string",
          "description": "string",
          "durationMins": number,
          "estimatedCost": number (in USD),
          "category": "string (SIGHTSEEING, FOOD, ADVENTURE, RELAXATION, CULTURE, SHOPPING, NIGHTLIFE)",
          "rating": number (between 4.0 and 5.0)
        }
      ]
    }`;

    const userPrompt = `City: ${city.name}, Travel Style: ${travelStyle}. Generate 5 recommendations. Return ONLY JSON.`;

    const resultString = await generateAIResponse(systemPrompt, userPrompt, true);
    
    try {
      const resultJson = JSON.parse(resultString);
      return successResponse(resultJson);
    } catch (parseError) {
      return errorResponse("SERVER_ERROR", "AI returned invalid format", 500);
    }

  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
