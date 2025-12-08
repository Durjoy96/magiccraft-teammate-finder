import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import RoleBadge from "@/components/RoleBadge";
import {
  Clock,
  Globe,
  MessageCircle,
  Mail,
  Zap,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import TeamUpButton from "./TeamUpButton";
import BoostButton from "./BoostButton";

async function getPlayer(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const player = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { passwordHash: 0, email: 0 } }
      );
    return player ? JSON.parse(JSON.stringify(player)) : null;
  } catch (error) {
    return null;
  }
}

export default async function PlayerDetailPage({ params }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = await params;

  const player = await getPlayer(userId);

  if (!player) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Player Not Found</h1>
          <Link
            href="/search"
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = player._id === session.user.id;
  const isBoosted =
    player.boostedUntil && new Date(player.boostedUntil) > new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </Link>

      <div
        className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border ${
          isBoosted
            ? "border-yellow-500/50 shadow-lg shadow-yellow-500/20"
            : "border-purple-500/20"
        }`}
      >
        {isBoosted && (
          <div className="flex items-center gap-2 mb-4 text-yellow-400 text-sm font-semibold">
            <Zap className="w-5 h-5" />
            <span>BOOSTED PROFILE</span>
            <span className="text-gray-400">
              • Until {new Date(player.boostedUntil).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-3">{player.username}</h1>
            <RoleBadge role={player.role} />
          </div>

          {isOwnProfile ? (
            <Link
              href="/profile"
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors font-semibold"
            >
              Edit Profile
            </Link>
          ) : (
            <div className="flex gap-3">
              <TeamUpButton playerId={player._id} />
              <BoostButton playerId={player._id} />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Player Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Skill Level</p>
                <p className="text-lg font-semibold">
                  {player.skillLevel || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Playstyle</p>
                <p className="text-lg font-semibold">
                  {player.playstyle || "Not set"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Availability</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">
                  {player.region || "Not set"} • {player.language || "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">
                  {player.activeHours || "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span
                  className={player.voice ? "text-green-400" : "text-gray-300"}
                >
                  Voice Chat: {player.voice ? "Available" : "Not available"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {player.bio && (
          <div>
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">{player.bio}</p>
          </div>
        )}

        {!isOwnProfile && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Want to team up?
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Send a team request to {player.username} and start playing
                    together!
                  </p>
                  <TeamUpButton
                    playerId={player._id}
                    showIcon={false}
                    fullWidth={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Member since {new Date(player.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
