import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Message content required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Verify team membership
    const team = await db.collection("teams").findOne({
      _id: new ObjectId(teamId),
    });

    if (!team || !team.members.includes(session.user.id)) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const result = await db.collection("messages").insertOne({
      teamId,
      senderId: session.user.id,
      content: content.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Message sent",
      messageId: result.insertedId,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
