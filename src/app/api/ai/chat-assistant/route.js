import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { aiChatAssistant } from "@/lib/groq";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { command, teamId, userCommand } = await request.json();

    if (!command) {
      return NextResponse.json(
        { error: "Command is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Store user's AI command first if provided
    if (userCommand && teamId) {
      await db.collection("messages").insertOne({
        teamId,
        senderId: session.user.id,
        content: userCommand,
        isAiCommand: true,
        createdAt: new Date(),
      });
    }

    // Get user profile
    const userProfile = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { role: 1, skillLevel: 1, playstyle: 1 } }
      );

    let context = { userProfile };

    // If in a team chat, get team context
    if (teamId) {
      const team = await db.collection("teams").findOne({
        _id: new ObjectId(teamId),
      });

      if (team) {
        const members = await db
          .collection("users")
          .find(
            { _id: { $in: team.members.map((id) => new ObjectId(id)) } },
            { projection: { username: 1, role: 1, skillLevel: 1 } }
          )
          .toArray();

        context.teamMembers = members;
      }
    }

    // Get AI response
    const response = await aiChatAssistant(command, context);

    // Store AI response in database
    if (teamId) {
      await db.collection("messages").insertOne({
        teamId,
        senderId: "ai",
        content: response,
        isAi: true,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Chat Assistant error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
