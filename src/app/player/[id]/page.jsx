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
  Award,
  Target,
  Shield,
} from "lucide-react";
import Link from "next/link";
import TeamUpButton from "./TeamUpButton";
import BoostButton from "./BoostButton";

async function getPlayer(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const player = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0, email: 0, uid: 0, discordTag: 0 } } // Hide private info
    );
    return player ? JSON.parse(JSON.stringify(player)) : null;
  } catch (error) {
    return null;
  }
}

export default async function PlayerDetailPage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const player = await getPlayer(id);

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

        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          {player.avatar && (
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-purple-500/30 flex-shrink-0">
              <img
                src={player.avatar}
                alt={player.username}
                className="w-full h-full"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-4xl font-bold mb-2">{player.username}</h1>
                {player.level && (
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Award className="w-4 h-4" />
                    <span>Level {player.level}</span>
                  </div>
                )}
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

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2 mt-4">
              {player.experienceLevel && (
                <div className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-semibold border border-cyan-500/30">
                  {player.experienceLevel}
                </div>
              )}
              {player.lookingFor && (
                <div className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-semibold border border-purple-500/30">
                  {player.lookingFor}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Player Information */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Player Information</h2>
            </div>
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
              {player.experienceLevel && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Experience Level</p>
                  <p className="text-lg font-semibold">
                    {player.experienceLevel}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold">Availability</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Region & Language</p>
                  <p className="text-gray-300 font-semibold">
                    {player.region || "Not set"} •{" "}
                    {player.language || "Not set"}
                  </p>
                </div>
              </div>

              {player.activeHours && (
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Active Hours</p>
                    <p className="text-gray-300 font-semibold">
                      {player.activeHours}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <MessageCircle
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    player.voice ? "text-green-400" : "text-gray-400"
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-400">Voice Chat</p>
                  <p
                    className={`font-semibold ${
                      player.voice ? "text-green-400" : "text-gray-300"
                    }`}
                  >
                    {player.voice ? "Available" : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Looking For */}
        {player.lookingFor && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Looking For</h3>
                <p className="text-gray-300">{player.lookingFor}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bio */}
        {player.bio && (
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">{player.bio}</p>
          </div>
        )}

        {/* Call to Action */}
        {!isOwnProfile && (
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Want to team up?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Send a team request to {player.username} and start playing
                  together! Once accepted, you&apos;ll be able to chat and
                  exchange contact information.
                </p>
                <TeamUpButton
                  playerId={player._id}
                  showIcon={false}
                  fullWidth={false}
                />
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
