import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, skillLevel, region, language } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    const query = { role: { $ne: null } };

    if (role) query.role = role;
    if (skillLevel) query.skillLevel = skillLevel;
    if (region) query.region = new RegExp(region, "i");
    if (language) query.language = new RegExp(language, "i");

    const players = await db
      .collection("users")
      .find(query, { projection: { passwordHash: 0 } })
      .sort({ boostedUntil: -1, createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ players: JSON.parse(JSON.stringify(players)) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
