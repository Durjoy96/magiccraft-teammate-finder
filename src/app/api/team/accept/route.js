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

    // Check if team already exists between these users
    let existingTeam = await db.collection("teams").findOne({
      members: { $all: [teamRequest.senderId, teamRequest.receiverId] },
    });

    let teamId;
    if (existingTeam) {
      teamId = existingTeam._id;
    } else {
      // Create new team
      const team = await db.collection("teams").insertOne({
        members: [teamRequest.senderId, teamRequest.receiverId],
        createdAt: new Date(),
      });
      teamId = team.insertedId;
    }

    // Update request status and link to team
    await db.collection("teamRequests").updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status: "accepted",
          teamId: teamId.toString(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "Request accepted",
      teamId: teamId.toString(),
    });
  } catch (error) {
    console.error("Accept request error:", error);
    return NextResponse.json(
      { error: "Failed to accept request" },
      { status: 500 }
    );
  }
}
