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

    const teams = await db
      .collection("teams")
      .find({ members: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate member details
    const allMemberIds = [...new Set(teams.flatMap((t) => t.members))];
    const users = await db
      .collection("users")
      .find(
        { _id: { $in: allMemberIds.map((id) => new ObjectId(id)) } },
        { projection: { username: 1, role: 1 } }
      )
      .toArray();

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    const populatedTeams = teams.map((team) => ({
      ...team,
      memberDetails: team.members.map((memberId) => userMap[memberId]),
    }));

    return NextResponse.json({
      teams: JSON.parse(JSON.stringify(populatedTeams)),
    });
  } catch (error) {
    console.error("Fetch teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
