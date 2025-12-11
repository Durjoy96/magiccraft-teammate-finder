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

    const data = await request.json();
    const {
      username,
      avatar,
      uid,
      level,
      role,
      skillLevel,
      playstyle,
      region,
      language,
      activeHours,
      voice,
      discordTag,
      bio,
      lookingFor,
      experienceLevel,
    } = data;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          username,
          avatar,
          uid,
          level: level ? parseInt(level) : null,
          role,
          skillLevel,
          playstyle,
          region,
          language,
          activeHours,
          voice,
          discordTag,
          bio,
          lookingFor,
          experienceLevel,
          lastActive: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
