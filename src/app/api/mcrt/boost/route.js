import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const BOOST_PLANS = {
  "48h": { hours: 48, price: 500 },
  "7d": { hours: 168, price: 1200 },
  "15d": { hours: 360, price: 2200 },
  "30d": { hours: 720, price: 3500 },
};

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await request.json();

    if (!tier || !BOOST_PLANS[tier]) {
      return NextResponse.json(
        { error: "Invalid boost tier" },
        { status: 400 }
      );
    }

    const plan = BOOST_PLANS[tier];
    const client = await clientPromise;
    const db = client.db();

    // Get user's current balance
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { mcrtBalance: 1, boostedUntil: 1 } }
      );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check balance
    if (user.mcrtBalance < plan.price) {
      return NextResponse.json(
        { error: "Insufficient MCRT balance" },
        { status: 400 }
      );
    }

    // Calculate new boost end date
    const now = new Date();
    const currentBoostEnd =
      user.boostedUntil && new Date(user.boostedUntil) > now
        ? new Date(user.boostedUntil)
        : now;

    const newBoostEnd = new Date(
      currentBoostEnd.getTime() + plan.hours * 60 * 60 * 1000
    );

    // Update user
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          boostedUntil: newBoostEnd,
          boostTier: tier,
          lastBoostDate: new Date(),
          updatedAt: new Date(),
        },
        $inc: {
          mcrtBalance: -plan.price,
          totalBoosts: 1,
        },
      }
    );

    return NextResponse.json({
      message: "Profile boosted successfully",
      boostedUntil: newBoostEnd,
      newBalance: user.mcrtBalance - plan.price,
      tier,
    });
  } catch (error) {
    console.error("Boost error:", error);
    return NextResponse.json(
      { error: "Failed to boost profile" },
      { status: 500 }
    );
  }
}
