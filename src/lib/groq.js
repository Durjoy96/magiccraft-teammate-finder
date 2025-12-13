import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateBio(userData) {
  const { role, skillLevel, playstyle, lookingFor, experienceLevel } = userData;

  const prompt = `You are a gaming profile bio generator for MagicCraft, a PvP MOBA game. Generate a compelling, concise bio for a player with these characteristics:

Role: ${role}
Skill Level: ${skillLevel}
Playstyle: ${playstyle}
Experience: ${experienceLevel || "Not specified"}
Looking For: ${lookingFor || "teammates"}

Generate 3 different bio styles:
1. PROFESSIONAL: Serious, competitive, focused on strategy
2. CASUAL: Friendly, fun, relaxed
3. COMPETITIVE: Intense, ambitious, rankings-focused

Each bio should be:
- 2-3 sentences max
- Personality-driven
- Include their role and what they're looking for
- NO generic phrases like "passionate gamer" or "looking for teammates"
- Make it unique and memorable

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "professional": "bio text here",
  "casual": "bio text here",
  "competitive": "bio text here"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
      max_completion_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No content returned from Groq");
    }

    // Parse JSON response
    const bios = JSON.parse(content);
    return bios;
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to generate bio");
  }
}
