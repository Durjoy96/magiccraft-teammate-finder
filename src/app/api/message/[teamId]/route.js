import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { teamId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const messages = await db
      .collection("messages")
      .find({ teamId: teamId })
      .sort({ createdAt: 1 })
      .toArray();

    // Get sender names
    const senderIds = [...new Set(messages.map((m) => m.senderId))];
    const users = await db
      .collection("users")
      .find(
        { _id: { $in: senderIds.map((id) => new ObjectId(id)) } },
        { projection: { username: 1 } }
      )
      .toArray();

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user.username;
    });

    const populatedMessages = messages.map((msg) => ({
      ...msg,
      senderName: userMap[msg.senderId],
    }));

    return NextResponse.json({
      messages: JSON.parse(JSON.stringify(populatedMessages)),
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
