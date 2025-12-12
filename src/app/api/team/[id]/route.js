import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const team = await db.collection("teams").findOne({
      _id: new ObjectId(id),
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user is member
    if (!team.members.includes(session.user.id)) {
      return NextResponse.json({ error: "Not a team member" }, { status: 403 });
    }

    // Get member details WITH contact info (only visible to team members)
    const members = await db
      .collection("users")
      .find(
        { _id: { $in: team.members.map((id) => new ObjectId(id)) } },
        {
          projection: {
            username: 1,
            role: 1,
            avatar: 1,
            uid: 1,
            discordTag: 1,
            level: 1,
          },
        }
      )
      .toArray();

    return NextResponse.json({
      team: {
        ...team,
        memberDetails: JSON.parse(JSON.stringify(members)),
      },
    });
  } catch (error) {
    console.error("Fetch team error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}
