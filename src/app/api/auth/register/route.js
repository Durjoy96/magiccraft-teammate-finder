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

    const result = await db.collection("users").insertOne({
      email,
      passwordHash,
      username,
      role: null,
      skillLevel: null,
      playstyle: null,
      activeHours: null,
      region: null,
      language: null,
      voice: false,
      bio: "",
      avatar: null,
      boostedUntil: null,
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
