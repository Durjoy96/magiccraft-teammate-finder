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

export async function findSmartMatches(userProfile, allPlayers) {
  // Check if we have enough players
  if (allPlayers.length === 0) {
    throw new Error("No players available for matching");
  }

  // Prepare user profile summary
  const userSummary = `
Role: ${userProfile.role}
Skill Level: ${userProfile.skillLevel}
Playstyle: ${userProfile.playstyle}
Experience: ${userProfile.experienceLevel || "Not specified"}
Looking For: ${userProfile.lookingFor || "teammates"}
Region: ${userProfile.region}
Language: ${userProfile.language}
Bio: ${userProfile.bio || "No bio"}
`.trim();

  // Prepare players list (limit to 20 for token efficiency)
  const playersToAnalyze = allPlayers.slice(0, 20);
  const playersList = playersToAnalyze
    .map((p, idx) =>
      `
Player ${idx + 1} (ID: ${p._id}):
- Username: ${p.username}
- Role: ${p.role}
- Skill: ${p.skillLevel}
- Playstyle: ${p.playstyle}
- Experience: ${p.experienceLevel || "Not specified"}
- Looking For: ${p.lookingFor || "teammates"}
- Region: ${p.region}
- Language: ${p.language}
- Bio: ${p.bio || "No bio"}
- Voice: ${p.voice ? "Yes" : "No"}
`.trim()
    )
    .join("\n\n");

  // Determine how many matches to request (max 5, but not more than available players)
  const maxMatches = Math.min(5, playersToAnalyze.length);

  const prompt = `You are an AI teammate matching system for MagicCraft, a PvP MOBA game. 

USER PROFILE:
${userSummary}

AVAILABLE PLAYERS (${playersToAnalyze.length} total):
${playersList}

Analyze these players and find the TOP ${maxMatches} BEST matches for this user based on:
1. Complementary roles (Tank + DPS is good, Tank + Tank might not be)
2. Similar skill levels (within 1 level difference is best)
3. Compatible playstyles (Aggressive + Aggressive can work, or Aggressive + Balanced)
4. Matching goals (Casual Fun vs Ranked Grinding)
5. Same region and language
6. Personality compatibility from bios
7. Voice chat preference match

IMPORTANT: 
- Each player can only appear ONCE in your results
- Return exactly ${maxMatches} UNIQUE matches
- Use the exact Player ID from the list above

For each match, provide:
- Player ID (use the exact ID from above)
- Compatibility score (0-100)
- Reason (2-3 sentences explaining WHY they're a good match)

Return ONLY a JSON array with this exact structure (no markdown, no extra text):
[
  {
    "playerId": "actual_player_id_here",
    "score": 95,
    "reason": "Explanation here"
  }
]

Return exactly ${maxMatches} UNIQUE matches, ordered by score (highest first).`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No content returned from Groq");
    }

    // Parse JSON response
    let matches = JSON.parse(content);

    // Remove duplicates by playerId
    const uniqueMatches = [];
    const seenIds = new Set();

    for (const match of matches) {
      if (match.playerId && !seenIds.has(match.playerId)) {
        // Verify the player exists
        const playerExists = playersToAnalyze.find(
          (p) => p._id === match.playerId
        );
        if (playerExists) {
          uniqueMatches.push(match);
          seenIds.add(match.playerId);
        }
      }
    }

    // If we still don't have enough unique matches, fall back to simple sorting
    if (uniqueMatches.length < maxMatches) {
      // Add remaining players with a basic score
      for (const player of playersToAnalyze) {
        if (!seenIds.has(player._id) && uniqueMatches.length < maxMatches) {
          uniqueMatches.push({
            playerId: player._id,
            score: 70,
            reason: `Compatible teammate with ${player.role} role and ${player.skillLevel} skill level. Good potential for team synergy.`,
          });
          seenIds.add(player._id);
        }
      }
    }

    return uniqueMatches;
  } catch (error) {
    console.error("Groq AI Matcher error:", error);
    throw new Error("Failed to find AI matches");
  }
}
