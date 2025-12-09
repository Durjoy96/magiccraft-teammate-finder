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

    const { requestId } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    const teamRequest = await db.collection("teamRequests").findOne({
      _id: new ObjectId(requestId),
      receiverId: session.user.id,
      status: "pending",
    });

    if (!teamRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update request status
    await db
      .collection("teamRequests")
      .updateOne(
        { _id: new ObjectId(requestId) },
        { $set: { status: "accepted", updatedAt: new Date() } }
      );

    // Create team
    const team = await db.collection("teams").insertOne({
      members: [teamRequest.senderId, teamRequest.receiverId],
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Request accepted",
      teamId: team.insertedId,
    });
  } catch (error) {
    console.error("Accept request error:", error);
    return NextResponse.json(
      { error: "Failed to accept request" },
      { status: 500 }
    );
  }
}
