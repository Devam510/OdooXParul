import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { generateAIResponse, isAIEnabled } from "@/lib/groq";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const { destinations, duration, type } = await req.json();

    if (!isAIEnabled()) {
      // Fallback
      return successResponse({
        items: [
          { name: "Passport", category: "DOCUMENTS", quantity: 1, isEssential: true },
          { name: "Toothbrush", category: "TOILETRIES", quantity: 1, isEssential: false },
          { name: "Phone Charger", category: "ELECTRONICS", quantity: 1, isEssential: true },
          { name: "T-Shirts", category: "CLOTHES", quantity: Math.min(duration, 7), isEssential: false }
        ]
      });
    }

    const systemPrompt = `You are a smart travel assistant. Generate a highly curated packing list based on the destinations, trip duration (days), and trip type.
    Return ONLY a valid JSON object matching this schema:
    {
      "items": [
        {
          "name": "string",
          "category": "string (CLOTHES, TOILETRIES, ELECTRONICS, DOCUMENTS, MEDICAL, MISCELLANEOUS)",
          "quantity": number,
          "isEssential": boolean
        }
      ]
    }`;

    const userPrompt = `
      Destinations: ${destinations.join(", ")}
      Duration: ${duration} days
      Trip Type: ${type}
      
      Generate packing list. Return ONLY JSON.
    `;

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
