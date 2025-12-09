import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const requests = await db
      .collection("teamRequests")
      .find({
        $or: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate user details
    const userIds = [
      ...new Set(requests.flatMap((r) => [r.senderId, r.receiverId])),
    ];
    const users = await db
      .collection("users")
      .find(
        { _id: { $in: userIds.map((id) => new ObjectId(id)) } },
        { projection: { username: 1, role: 1, skillLevel: 1, region: 1 } }
      )
      .toArray();

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    const populatedRequests = requests.map((req) => ({
      ...req,
      sender: userMap[req.senderId],
      receiver: userMap[req.receiverId],
    }));

    return NextResponse.json({
      requests: JSON.parse(JSON.stringify(populatedRequests)),
    });
  } catch (error) {
    console.error("Fetch requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
