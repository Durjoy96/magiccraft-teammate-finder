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

    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID required" },
        { status: 400 }
      );
    }

    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot send request to yourself" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if request already exists
    const existing = await db.collection("teamRequests").findOne({
      senderId: session.user.id,
      receiverId: receiverId,
      status: "pending",
    });

    if (existing) {
      return NextResponse.json(
        { error: "Request already sent" },
        { status: 400 }
      );
    }

    const result = await db.collection("teamRequests").insertOne({
      senderId: session.user.id,
      receiverId: receiverId,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Request sent",
      requestId: result.insertedId,
    });
  } catch (error) {
    console.error("Team request error:", error);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}
