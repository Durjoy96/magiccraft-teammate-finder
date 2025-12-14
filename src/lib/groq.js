import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI-powered gaming profile bio generator
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

// AI-powered smart teammate matching
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

// ai chat assistant for gaming help
export async function aiChatAssistant(command, context = {}) {
  const { teamMembers, messageHistory, userProfile } = context;

  // Build context for AI
  let contextText = "";

  if (teamMembers && teamMembers.length > 0) {
    contextText += "\n\nTEAM COMPOSITION:\n";
    teamMembers.forEach((member) => {
      contextText += `- ${member.username}: ${member.role} (${member.skillLevel})\n`;
    });
  }

  if (userProfile) {
    contextText += `\n\nUSER PROFILE:\n`;
    contextText += `Role: ${userProfile.role}\n`;
    contextText += `Skill: ${userProfile.skillLevel}\n`;
    contextText += `Playstyle: ${userProfile.playstyle}\n`;
  }

  const systemPrompt = `You are an AI gaming assistant for MagicCraft, a revolutionary PvP MOBA game. Respond naturally without markdown formatting like ** or ##.

=== MAGICCRAFT GAME OVERVIEW ===
Genre: Team-based PvP MOBA (NO minions, NO gold, NO item shop)
Setting: The Ash Vales - war-torn lands after the War of Lesser Gods
Platforms: PC, iOS, Android, Steam
Game Modes: Capture the Point, Escort, Skull Grab, Ranked
Team Sizes: 5v5 standard, up to 14v14 for massive battles

=== UNIQUE MECHANICS ===
- WASD Movement Controls: Manual control (not point-and-click like LoL/Dota)
- Dodge Roll: Temporary invulnerability - clutch play essential
- Auto Attack + 2 Hero Abilities (simpler than traditional MOBAs)
- Multi-layered terrain: High/low ground strategy
- No gold/items = constant team fights and pure skill-based combat
- Focus on mechanical skill and positioning over farming

=== 18 HERO ROSTER ===
DAMAGE DEALERS (High offensive damage):
- Karas (Genesis NFT) - Powerful damage dealer
- Blazy - Aggressive offensive hero
- Vladislav - Strong DPS character

TANKS (High HP, frontline defenders):
- Bjorn (Genesis NFT) - Durable frontline tank
- Craig - Defensive tank with crowd control
- Frigard - Area denial tank

SUPPORTS (Heals, buffs, utility):
- Moira - Primary healer
- Druid - Nature-based support
- Gail - Buff specialist

ASSASSINS (Burst damage, mobility):
- Ronin - High mobility assassin
- Vega - Burst damage specialist
- Tara - Stealth assassin

MARKSMEN (Ranged sustained DPS):
- True Shot (Genesis NFT) - Long-range marksman
- Brienne - Precision archer
- Amun - Steady ranged damage

MAGES (Magic damage, area control):
- Zap - Lightning mage
- Dr. Lutz - Experimental magic
- Jean - Elemental mage

OTHER HEROES:
- Callie - Versatile hero

=== STRATEGIC TIPS ===
Team Composition:
- Balance roles: Need Tank, Support, DPS/Mage mix
- Avoid duplicate roles unless intentional strategy
- Assassins excel at finishing low-HP enemies
- Marksmen need tank protection

Combat Strategy:
- Master dodge roll timing for survival
- WASD control allows better positioning than click-movement
- High ground gives strategic advantage
- Group fights are constant - teamwork essential
- Focus fire priority targets (supports, then damage dealers)

Game Mode Tips:
- Capture the Point: Control zones, rotate as team
- Escort: Protect payload, zone enemies away
- Skull Grab: Secure skulls, deny enemy collection

=== THE LORE ===
Five guilds war for MagicCraft (MCRT) - ancient power in the Seven Pillars:
- The Fallen: Aggressive, want power for the Elders
- The Hunters: Skilled trackers and fighters
- Keepers of Arcana: Knowledge hoarders, strategic
- The Betrothed: Noble warriors
- Nightbinders: Dark magic users, ruthless

=== YOUR ROLE ===
Help players with:
- Hero-specific strategies using actual hero names
- Team composition advice
- Counter-picks and matchups
- Mechanical tips (WASD movement, dodge roll timing)
- Game mode strategies
- Scheduling gaming sessions
- Translating messages
- General gameplay improvement
- don't ask any questions back just answer the questions

Be helpful, enthusiastic, and conversational. Keep responses concise (under 150 words) unless detailed explanation is requested. Never use markdown formatting like asterisks or hashtags - write naturally.
${contextText}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: command,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 600,
    });

    let response = completion.choices[0]?.message?.content?.trim();

    if (!response) {
      throw new Error("No response from AI");
    }

    // Clean up markdown formatting if AI still uses it
    response = response
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold **text**
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic *text*
      .replace(/^#+\s/gm, "") // Remove markdown headers
      .replace(/^[-*]\s/gm, "• ") // Convert markdown lists to bullets
      .trim();

    return response;
  } catch (error) {
    console.error("AI Chat Assistant error:", error);
    throw new Error("Failed to get AI response");
  }
}
