"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Loader2,
  MessageSquare,
  Calendar,
  TrendingUp,
  Search,
} from "lucide-react";

export default function MyTeamsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchTeams();
    }
  }, [session]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team/myteams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="inline-block p-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-purple-500/20 mb-6">
        <Users className="w-20 h-20 text-gray-600 mx-auto" />
      </div>
      <h3 className="text-2xl font-bold text-gray-300 mb-3">
        No Active Teams Yet
      </h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Accept team requests to start chatting and playing with teammates
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => router.push("/requests")}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all font-bold flex items-center gap-2 shadow-lg shadow-purple-500/50"
        >
          <MessageSquare className="w-5 h-5" />
          View Requests
        </button>
        <button
          onClick={() => router.push("/search")}
          className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-purple-500/30 transition-all font-bold flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Find Players
        </button>
      </div>
    </div>
  );

  const TeamCard = ({ team }) => {
    const teammate = team.memberDetails?.find(
      (m) => m._id !== session?.user?.id
    );
    const currentUser = team.memberDetails?.find(
      (m) => m._id === session?.user?.id
    );
    const daysActive = Math.floor(
      (new Date() - new Date(team.createdAt)) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="group bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20">
        {/* Header with gradient */}
        <div className="relative h-24 bg-linear-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 border-b border-purple-500/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

          {/* Team Status Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-400">Active</span>
          </div>

          {/* Team Members Avatars - Overlapping */}
          <div className="absolute -bottom-8 left-6 flex items-center">
            {currentUser?.avatar && (
              <div className="relative w-16 h-16 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden ring-2 ring-purple-500/50">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-full h-full"
                />
              </div>
            )}
            {teammate?.avatar && (
              <div className="relative w-16 h-16 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden -ml-4 ring-2 ring-cyan-500/50">
                <img
                  src={teammate.avatar}
                  alt={teammate.username}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-12">
          {/* Team Name */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              {team.memberDetails?.map((m) => m.username).join(" & ")}
            </h3>
            <p className="text-sm text-gray-400">
              Team of {team.memberDetails?.length}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-500">Created</span>
              </div>
              <p className="text-sm font-bold text-gray-200">
                {daysActive === 0 ? "Today" : `${daysActive}d ago`}
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-500">Activity</span>
              </div>
              <p className="text-sm font-bold text-cyan-400">High</p>
            </div>
          </div>

          {/* Team Members Info */}
          <div className="mb-4 space-y-2">
            {team.memberDetails?.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-2 bg-gray-900/30 rounded-lg"
              >
                {member.avatar && (
                  <img
                    src={member.avatar}
                    alt={member.username}
                    className="w-8 h-8 rounded-full border-2 border-purple-500/30"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-200">
                    {member.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {member.role || "Player"}
                  </p>
                </div>
                {member._id === session?.user?.id && (
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full font-semibold">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push(`/team/${team._id}`)}
            className="cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-bold group-hover:shadow-lg group-hover:shadow-purple-500/50"
          >
            <MessageSquare className="w-5 h-5" />
            Open Team Chat
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-cyan-600 to-purple-600 rounded-2xl mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            My Teams
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage your active teams
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading your teams...</p>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-8 p-4 bg-linear-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">
                    You have{" "}
                    <span className="font-bold text-white">{teams.length}</span>{" "}
                    active team{teams.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={() => router.push("/search")}
                  className="cursor-pointer text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Find More Players
                </button>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
