import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { findSmartMatches } from "@/lib/groq";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get current user profile
    const userProfile = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { passwordHash: 0, email: 0 } }
      );

    if (!userProfile || !userProfile.role) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      );
    }

    // Get all available players (exclude self, only completed profiles)
    const allPlayers = await db
      .collection("users")
      .find(
        {
          role: { $ne: null },
          _id: { $ne: new ObjectId(session.user.id) },
        },
        { projection: { passwordHash: 0, email: 0, uid: 0, discordTag: 0 } }
      )
      .limit(50)
      .toArray();

    if (allPlayers.length === 0) {
      return NextResponse.json(
        { error: "No players available for matching" },
        { status: 404 }
      );
    }

    // Use AI to find smart matches
    const matches = await findSmartMatches(
      JSON.parse(JSON.stringify(userProfile)),
      JSON.parse(JSON.stringify(allPlayers))
    );

    // Enrich matches with full player data
    const enrichedMatches = matches
      .map((match) => {
        const player = allPlayers.find(
          (p) => p._id.toString() === match.playerId
        );
        return {
          ...match,
          player: player ? JSON.parse(JSON.stringify(player)) : null,
        };
      })
      .filter((m) => m.player !== null);

    return NextResponse.json({ matches: enrichedMatches });
  } catch (error) {
    console.error("AI Smart Match error:", error);
    return NextResponse.json(
      { error: "Failed to find smart matches. Please try again." },
      { status: 500 }
    );
  }
}
