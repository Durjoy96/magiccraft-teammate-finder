"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Loader2, MessageSquare, Calendar } from "lucide-react";

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-cyan-400" />
          <h1 className="text-4xl font-bold">My Teams</h1>
        </div>
        <p className="text-gray-400">View and manage your active teams</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/20 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg mb-2">No active teams yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Accept team requests to start chatting with teammates
          </p>
          <button
            onClick={() => router.push("/requests")}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold"
          >
            View Requests
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {team.memberDetails.map((m) => m.username).join(" & ")}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/team/${team._id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open Chat
                </button>
              </div>
              <div className="flex gap-2">
                {team.memberDetails.map((member) => (
                  <div
                    key={member._id}
                    className="px-3 py-1 rounded-lg bg-gray-700 text-sm"
                  >
                    {member.username}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
