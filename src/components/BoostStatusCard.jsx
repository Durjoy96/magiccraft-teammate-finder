import { Zap, TrendingUp, Eye, Mail, Calendar } from "lucide-react";

export default function BoostStatusCard({ user, onBoostClick }) {
  const isBoosted =
    user.boostedUntil && new Date(user.boostedUntil) > new Date();
  const boostEndDate = isBoosted ? new Date(user.boostedUntil) : null;
  const daysLeft = boostEndDate
    ? Math.ceil((boostEndDate - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  if (isBoosted) {
    return (
      <div className="bg-linear-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/50 shadow-lg shadow-purple-500/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-r from-purple-600 to-cyan-600 rounded-xl animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-300">
                Profile Boosted!
              </h3>
              <p className="text-sm text-gray-400">Premium visibility active</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">{daysLeft}</div>
            <div className="text-xs text-gray-400">days left</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Profile Views</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">
              {user.profileViews || 0}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">This Week</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {user.totalBoosts || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span>
            Boost ends: {boostEndDate?.toLocaleDateString()} at{" "}
            {boostEndDate?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <button
          onClick={onBoostClick}
          className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors font-semibold text-sm cursor-pointer"
        >
          Extend Boost
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/10 rounded-xl">
          <Zap className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Boost Your Profile</h3>
          <p className="text-sm text-gray-400">Get 2x more visibility</p>
        </div>
      </div>

      <ul className="space-y-2 mb-4 text-sm text-gray-300">
        <li className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          Appear first in search results
        </li>
        <li className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          Premium purple glow effect
        </li>
        <li className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          Priority in AI matching
        </li>
        <li className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-400" />
          2x profile views & requests
        </li>
      </ul>

      <button
        onClick={onBoostClick}
        className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-bold flex items-center justify-center gap-2 cursor-pointer"
      >
        <Zap className="w-5 h-5" />
        Boost Profile with MCRT
      </button>
    </div>
  );
}
