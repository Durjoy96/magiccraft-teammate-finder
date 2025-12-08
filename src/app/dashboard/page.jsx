import { redirect } from "next/navigation";
import Link from "next/link";
import RoleBadge from "@/components/RoleBadge";
import { Edit, Search, Mail, Clock, Globe, MessageCircle } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

async function getUserProfile(userId) {
  const client = await clientPromise;
  const db = client.db();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  return JSON.parse(JSON.stringify(user));
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = await getUserProfile(session.user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.username}!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
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
          href="/requests"
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all text-center group"
        >
          <Mail className="w-8 h-8 mx-auto mb-3 text-pink-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold mb-1">Requests</h3>
          <p className="text-sm text-gray-400">Manage team invites</p>
        </Link>
      </div>

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
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Username</p>
                  <p className="font-semibold">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Role</p>
                  <RoleBadge role={user.role} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Skill Level</p>
                  <p className="font-semibold">
                    {user.skillLevel || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Playstyle</p>
                  <p className="font-semibold">{user.playstyle || "Not set"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    {user.region || "Not set"} • {user.language || "Not set"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    {user.activeHours || "Not set"}
                  </span>
                </div>
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

            {user.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Bio</h3>
                <p className="text-gray-300">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
