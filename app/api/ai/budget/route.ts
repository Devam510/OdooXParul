import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { generateAIResponse, isAIEnabled } from "@/lib/groq";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const { tripTitle, destinations, currentExpenses } = await req.json();

    if (!isAIEnabled()) {
      // Fallback
      return successResponse({
        tips: [
          "Book your flights on Tuesdays for the best rates.",
          "Use local public transport instead of taxis.",
          "Look for free walking tours in major cities."
        ]
      });
    }

    const systemPrompt = `You are a frugal travel financial advisor. Based on the provided trip details and current expenses, provide 3 to 5 highly specific, actionable budget optimization tips. 
    Return ONLY a JSON array of strings under the key "tips".
    Example format: { "tips": ["Tip 1", "Tip 2", "Tip 3"] }`;

    const userPrompt = `
      Trip: ${tripTitle}
      Destinations: ${destinations.join(", ")}
      Current Expenses Summary: ${JSON.stringify(currentExpenses)}
      
      Generate budget tips. Return ONLY JSON.
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
