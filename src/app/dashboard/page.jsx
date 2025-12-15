import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import RoleBadge from "@/components/RoleBadge";
import {
  Edit,
  Search,
  Mail,
  Clock,
  Globe,
  MessageCircle,
  Award,
  Target,
  Zap,
  Users,
} from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import DashboardBoostSection from "@/components/DashboardBoostSection";

async function getUserProfile(userId) {
  const client = await clientPromise;
  const db = client.db();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  return JSON.parse(JSON.stringify(user));
}

async function getUserStats(userId) {
  const client = await clientPromise;
  const db = client.db();

  const [pendingRequests, acceptedRequests, teams] = await Promise.all([
    db.collection("teamRequests").countDocuments({
      receiverId: userId,
      status: "pending",
    }),
    db.collection("teamRequests").countDocuments({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted",
    }),
    db.collection("teams").countDocuments({
      members: userId,
    }),
  ]);

  return { pendingRequests, acceptedRequests, teams };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const [user, stats] = await Promise.all([
    getUserProfile(session.user.id),
    getUserStats(session.user.id),
  ]);

  const isBoosted =
    user.boostedUntil && new Date(user.boostedUntil) > new Date();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.username}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 text-purple-400" />
            {stats.pendingRequests > 0 && (
              <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                {stats.pendingRequests}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold">{stats.pendingRequests}</p>
          <p className="text-sm text-gray-400">Pending Requests</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold">{stats.acceptedRequests}</p>
          <p className="text-sm text-gray-400">Accepted Matches</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-2xl font-bold">{stats.teams}</p>
          <p className="text-sm text-gray-400">Active Teams</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold">{isBoosted ? "Yes" : "No"}</p>
          <p className="text-sm text-gray-400">Profile Boosted</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Link
          href="/profile"
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all text-center group"
        >
          <Edit className="w-8 h-8 mx-auto mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold mb-1">Edit Profile</h3>
          <p className="text-sm text-gray-400">Update your information</p>
        </Link>

        <Link
          href="/search"
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-center group"
        >
          <Search className="w-8 h-8 mx-auto mb-3 text-cyan-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold mb-1">Find Players</h3>
          <p className="text-sm text-gray-400">Search for teammates</p>
        </Link>

        <Link
          href="/teams"
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all text-center group"
        >
          <Users className="w-8 h-8 mx-auto mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold mb-1">My Teams</h3>
          <p className="text-sm text-gray-400">Manage your active teams</p>
        </Link>

        <Link
          href="/requests"
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all text-center group relative"
        >
          {stats.pendingRequests > 0 && (
            <span className="absolute top-4 right-4 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
              {stats.pendingRequests}
            </span>
          )}
          <Mail className="w-8 h-8 mx-auto mb-3 text-pink-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold mb-1">Requests</h3>
          <p className="text-sm text-gray-400">Manage team invites</p>
        </Link>
      </div>

      {/* Boost Section */}
      <div className="mb-8">
        <DashboardBoostSection user={user} />
      </div>

      {/* Profile Overview */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
            <p className="text-gray-400">Your current profile information</p>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-semibold"
          >
            Edit Profile
          </Link>
        </div>

        {!user.role ? (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
            <p className="text-yellow-400 font-semibold mb-4">
              Complete your profile to start finding teammates!
            </p>
            <Link
              href="/profile"
              className="inline-block px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 transition-colors font-semibold"
            >
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-6 pb-6 border-b border-gray-700">
              {user.avatar && (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-4 border-purple-500/30 flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{user.username}</h3>
                {user.level && (
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Award className="w-4 h-4" />
                    <span>Level {user.level}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <RoleBadge role={user.role} />
                  {user.experienceLevel && (
                    <div className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-semibold border border-cyan-500/30">
                      {user.experienceLevel}
                    </div>
                  )}
                  {user.lookingFor && (
                    <div className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-semibold border border-purple-500/30">
                      {user.lookingFor}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Game Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {user.uid && (
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Game UID</p>
                    <p className="font-mono text-purple-400">{user.uid}</p>
                  </div>
                )}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Skill Level</p>
                  <p className="font-semibold">{user.skillLevel}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Playstyle</p>
                  <p className="font-semibold">{user.playstyle}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    {user.region || "Not set"} • {user.language || "Not set"}
                  </span>
                </div>
                {user.activeHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">{user.activeHours}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <span
                    className={user.voice ? "text-green-400" : "text-gray-300"}
                  >
                    Voice Chat: {user.voice ? "Available" : "Not available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {user.discordTag && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Discord</p>
                  <p className="font-mono text-cyan-400">{user.discordTag}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    This will be shared with teammates when you match
                  </p>
                </div>
              </div>
            )}

            {/* Bio */}
            {user.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Bio</h3>
                <p className="text-gray-300 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
