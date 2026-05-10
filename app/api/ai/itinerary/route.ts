import { NextRequest } from "next/server";
import { withAuth, JWTPayload } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { generateAIResponse, isAIEnabled } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const { destinations, startDate, endDate, travelStyle, tripId } = await req.json();

    if (!isAIEnabled()) {
      // Fallback
      return successResponse({
        stops: destinations.map((city: any, idx: number) => ({
          cityId: city.id,
          order: idx,
          hotelName: "Standard Hotel",
          transportType: idx === 0 ? "FLIGHT" : "TRAIN",
          activities: [
            {
              name: `Walking Tour of ${city.name}`,
              durationMins: 120,
              estimatedCost: 0,
              category: "CULTURE"
            }
          ]
        }))
      });
    }

    const systemPrompt = `You are an expert travel agent. Generate an itinerary based on the given destinations, dates, and travel style.
    Return ONLY a valid JSON object matching this schema:
    {
      "stops": [
        {
          "cityId": "string (the exact ID provided in input)",
          "order": number (0-indexed),
          "hotelName": "string (suggest a realistic hotel name for the travel style)",
          "transportType": "string (FLIGHT, TRAIN, BUS, CAR, SHIP)",
          "activities": [
            {
              "name": "string",
              "description": "string",
              "durationMins": number,
              "estimatedCost": number (in USD),
              "category": "string (SIGHTSEEING, FOOD, ADVENTURE, RELAXATION, CULTURE, SHOPPING, NIGHTLIFE)"
            }
          ]
        }
      ]
    }`;

    const userPrompt = `
      Destinations (with IDs): ${JSON.stringify(destinations.map((d: any) => ({ name: d.name, id: d.id })))}
      Dates: ${startDate} to ${endDate}
      Travel Style: ${travelStyle || "General"}
      
      Generate the itinerary. Return ONLY the JSON object.
    `;

    const resultString = await generateAIResponse(systemPrompt, userPrompt, true);
    
    try {
      const resultJson = JSON.parse(resultString);
      
      // Save to database
      for (const stop of resultJson.stops) {
        // Find existing stop or create new one
        let dbStop = await prisma.tripStop.findFirst({
          where: { tripId, cityId: stop.cityId }
        });
        
        if (dbStop) {
          await prisma.tripStop.update({
            where: { id: dbStop.id },
            data: {
              hotelName: stop.hotelName,
              transportType: stop.transportType
            }
          });
        } else {
          dbStop = await prisma.tripStop.create({
            data: {
              tripId,
              cityId: stop.cityId,
              order: stop.order,
              hotelName: stop.hotelName,
              transportType: stop.transportType
            }
          });
        }

        // Add activities
        if (stop.activities && stop.activities.length > 0) {
          for (let i = 0; i < stop.activities.length; i++) {
            const act = stop.activities[i];
            
            // Need to find an activity ID in the city or create a dummy one if it doesn't exist?
            // Actually, TripActivity expects an `activityId` to an existing Activity model.
            // Let's create an Activity in the DB first if we can't find a similar one
            const dbActivity = await prisma.activity.create({
              data: {
                cityId: stop.cityId,
                name: act.name,
                description: act.description,
                durationMins: act.durationMins || 120,
                estimatedCost: act.estimatedCost || 0,
                category: act.category || "SIGHTSEEING",
              }
            });

            await prisma.tripActivity.create({
              data: {
                tripStopId: dbStop.id,
                activityId: dbActivity.id,
                order: i,
              }
            });
          }
        }
      }

      return successResponse(resultJson);
    } catch (parseError) {
      console.error("Failed to parse AI response:", resultString);
      return errorResponse("SERVER_ERROR", "AI returned invalid format", 500);
    }

  } catch (error: any) {
    return errorResponse("SERVER_ERROR", error.message, 500);
  }
});
