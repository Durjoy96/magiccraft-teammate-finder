import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateBio } from "@/lib/groq";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await request.json();

    // Validate required fields
    if (!userData.role || !userData.skillLevel || !userData.playstyle) {
      return NextResponse.json(
        { error: "Please complete Role, Skill Level, and Playstyle first" },
        { status: 400 }
      );
    }

    const bios = await generateBio(userData);

    return NextResponse.json({ bios });
  } catch (error) {
    console.error("AI Bio generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate bio. Please try again." },
      { status: 500 }
    );
  }
}
