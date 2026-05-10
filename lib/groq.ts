import Groq from "groq-sdk";

// Initialize Groq client only if API key is present
const groqApiKey = process.env.GROQ_API_KEY;
export const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

// Helper to determine if AI is enabled
export const isAIEnabled = () => !!groq;

// Standard model
export const AI_MODEL = "llama3-70b-8192";

export async function generateAIResponse(systemPrompt: string, userPrompt: string, isJson = false) {
  if (!groq) {
    throw new Error("AI is not configured. Missing GROQ_API_KEY.");
  }

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: AI_MODEL,
    temperature: 0.7,
    max_tokens: 2000,
    response_format: isJson ? { type: "json_object" } : { type: "text" },
  });

  return response.choices[0]?.message?.content || "";
}
