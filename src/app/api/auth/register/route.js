import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth-helpers";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 422 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Generate DiceBear avatar URL
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      username
    )}`;

    const result = await db.collection("users").insertOne({
      email,
      passwordHash,
      username,
      avatar: avatarUrl,

      // Game Profile
      uid: null,
      level: null,
      role: null,
      skillLevel: null,
      playstyle: null,

      // Availability
      region: null,
      language: null,
      activeHours: null,

      // Communication (private until matched)
      voice: false,
      discordTag: null,

      // Optional
      bio: "",
      lookingFor: null,
      experienceLevel: null,

      // Meta
      mcrtBalance: 2000, // Free 2000 MCRT for new users
      boostTier: null,
      profileViews: 0,
      totalBoosts: 0,
      lastBoostDate: null,
      lastActive: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "User created", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
