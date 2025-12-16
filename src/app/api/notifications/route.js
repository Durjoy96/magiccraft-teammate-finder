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

    // Get pending team requests
    const pendingRequests = await db
      .collection("teamRequests")
      .find({
        receiverId: session.user.id,
        status: "pending",
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get sender details
    const senderIds = pendingRequests.map((r) => new ObjectId(r.senderId));
    const senders = await db
      .collection("users")
      .find(
        { _id: { $in: senderIds } },
        { projection: { username: 1, avatar: 1, role: 1 } }
      )
      .toArray();

    const senderMap = {};
    senders.forEach((s) => {
      senderMap[s._id.toString()] = s;
    });

    const notifications = pendingRequests.map((req) => ({
      id: req._id.toString(),
      type: "team_request",
      message: `${senderMap[req.senderId]?.username} sent you a team request`,
      sender: senderMap[req.senderId],
      createdAt: req.createdAt,
      link: "/requests",
    }));

    return NextResponse.json({
      notifications,
      unreadCount: notifications.length,
    });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
