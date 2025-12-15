import Link from "next/link";
import RoleBadge from "./RoleBadge";
import { Clock, Globe, MessageCircle, Zap, Award } from "lucide-react";

export default function ProfileCard({ user, showActions = true }) {
  const isBoosted =
    user.boostedUntil && new Date(user.boostedUntil) > new Date();

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border transition-all flex flex-col justify-between ${
        isBoosted
          ? "border-purple-500 shadow-lg shadow-purple-500/50 ring-2 ring-purple-500/20"
          : "border-purple-500/20 hover:border-purple-500/40"
      }`}
    >
      <div>
        {isBoosted && (
          <div className="flex items-center gap-2 mb-3 text-purple-500 text-sm font-semibold">
            <Zap className="w-4 h-4" />
            <span>Featured</span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          {user.avatar && (
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-purple-500/30 flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1 truncate">
              {user.username}
            </h3>
            {user.level && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                <Award className="w-3 h-3" />
                <span>Level {user.level}</span>
              </div>
            )}
            <RoleBadge role={user.role} />
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Skill:</span>
            <span className="font-semibold">
              {user.skillLevel || "Not set"}
            </span>
          </div>
          {user.experienceLevel && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Experience:</span>
              <span className="font-semibold">{user.experienceLevel}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="truncate">
              {user.region || "Not set"} • {user.language || "Not set"}
            </span>
          </div>
          {user.activeHours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="truncate">{user.activeHours}</span>
            </div>
          )}
          {user.voice && (
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Voice Available</span>
            </div>
          )}
        </div>

        {user.lookingFor && (
          <div className="mb-4">
            <div className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs inline-block">
              {user.lookingFor}
            </div>
          </div>
        )}

        {user.bio && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{user.bio}</p>
        )}
      </div>

      {showActions && (
        <Link
          href={`/player/${user._id}`}
          className="block w-full text-center px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold"
        >
          View Profile
        </Link>
      )}
    </div>
  );
}
