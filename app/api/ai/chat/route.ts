import { NextRequest } from "next/server";
import { isAIEnabled, groq, AI_MODEL } from "@/lib/groq";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, tripContext } = await req.json();

    if (!isAIEnabled() || !groq) {
      return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });
    }

    const systemPrompt = {
      role: "system",
      content: `You are Traveloop's AI assistant. You help the user plan their trips.
      Here is the context of their current trip:
      ${JSON.stringify(tripContext)}
      
      Keep your answers concise, helpful, and focused on travel planning.
      If they ask about something unrelated to travel, politely guide them back.`
    };

    const completionStream = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completionStream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
