"use client";
import { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import {
  Search,
  Filter,
  Loader2,
  X,
  Sparkles,
  Zap,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

const ROLES = [
  "Damage Dealer",
  "Tank",
  "Support",
  "Assassin",
  "Marksman",
  "Mage",
  "Flex",
];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Oceania",
  "Middle East",
  "Africa",
];
const EXPERIENCE_LEVELS = ["Newbie", "Casual", "Experienced", "Veteran", "Pro"];
const LOOKING_FOR = [
  "Casual Fun",
  "Ranked Grinding",
  "Tournament Team",
  "Learning & Practice",
];

export default function SearchPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiMatching, setAiMatching] = useState(false);
  const [showAiResults, setShowAiResults] = useState(false);
  const [aiMatches, setAiMatches] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    skillLevel: "",
    region: "",
    language: "",
    experienceLevel: "",
    lookingFor: "",
    voiceOnly: false,
  });

  useEffect(() => {
    searchPlayers();
  }, []);

  const searchPlayers = async () => {
    setLoading(true);
    setShowAiResults(false);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAiMatch = async () => {
    setAiMatching(true);
    try {
      const res = await fetch("/api/ai/smart-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setAiMatches(data.matches);
        setShowAiResults(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to find AI matches");
      }
    } catch (err) {
      alert("Failed to find AI matches. Please try again.");
    } finally {
      setAiMatching(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchPlayers();
  };

  const clearFilters = () => {
    setFilters({
      role: "",
      skillLevel: "",
      region: "",
      language: "",
      experienceLevel: "",
      lookingFor: "",
      voiceOnly: false,
    });
    setTimeout(() => searchPlayers(), 100);
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== false
  ).length;
  const displayPlayers = showAiResults
    ? aiMatches.map((m) => m.player)
    : players;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Find Your Perfect Teammates
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Use AI to discover compatible players or search manually
          </p>

          {/* AI Match Button - Hero Style */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleAiMatch}
              disabled={aiMatching}
              className="group relative px-10 py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 transition-all duration-300 font-bold text-xl disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 cursor-pointer"
            >
              {aiMatching ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    AI Analyzing Profiles...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-8 h-8 animate-pulse" />
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Find Teammates with AI
                  </span>
                </>
              )}

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            </button>

            {showAiResults && (
              <button
                onClick={() => {
                  setShowAiResults(false);
                  searchPlayers();
                }}
                className="text-sm text-purple-400 hover:text-purple-300 underline flex items-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Clear AI Results
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        {/* Manual Search Section */}
        {!showAiResults && (
          <div className="mb-8">
            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-purple-500/20 hover:border-purple-500/40 transition-all flex items-center justify-center gap-3 font-semibold mb-4 cursor-pointer"
            >
              <SlidersHorizontal className="w-5 h-5 text-purple-400" />
              <span>Manual Search Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Filter className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold">Search Filters</h2>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Role
                      </label>
                      <select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">All Roles</option>
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Skill Level
                      </label>
                      <select
                        name="skillLevel"
                        value={filters.skillLevel}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">All Levels</option>
                        {SKILL_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Region
                      </label>
                      <select
                        name="region"
                        value={filters.region}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">All Regions</option>
                        {REGIONS.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        value={filters.language}
                        onChange={handleFilterChange}
                        placeholder="e.g., English"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Experience
                      </label>
                      <select
                        name="experienceLevel"
                        value={filters.experienceLevel}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">All Experience</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Looking For
                      </label>
                      <select
                        name="lookingFor"
                        value={filters.lookingFor}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">Any Goal</option>
                        {LOOKING_FOR.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-700">
                    <input
                      type="checkbox"
                      name="voiceOnly"
                      checked={filters.voiceOnly}
                      onChange={handleFilterChange}
                      className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
                    />
                    <label className="text-sm font-medium cursor-pointer">
                      Only show players with voice chat
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-6 h-6" />
                        Search Players
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {loading || aiMatching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 animate-spin text-purple-400 mb-4" />
            <p className="text-gray-400 text-lg">
              {aiMatching
                ? "AI is analyzing profiles..."
                : "Searching for players..."}
            </p>
          </div>
        ) : displayPlayers.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-purple-500/20 mb-6">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-xl font-semibold mb-2">
                {showAiResults ? "No AI matches found" : "No players found"}
              </p>
              <p className="text-gray-500">
                {showAiResults
                  ? "Try manual search or complete your profile"
                  : "Try adjusting your filters or wait for more players to join"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* AI Results Header */}
            {showAiResults && (
              <div className="mb-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      AI-Powered Matches
                    </h2>
                    <p className="text-gray-400">
                      Found {aiMatches.length} perfect teammate
                      {aiMatches.length !== 1 ? "s" : ""} for you
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Search Results Header */}
            {!showAiResults && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-400 text-lg">
                  Found{" "}
                  <span className="text-white font-bold">{players.length}</span>{" "}
                  player{players.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Player Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showAiResults
                ? aiMatches.map((match) => (
                    <div key={match.player._id} className="relative group">
                      {/* AI Match Badge */}
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full px-4 py-2 text-sm font-bold shadow-lg flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            {match.score}% Match
                          </div>
                        </div>
                      </div>

                      <ProfileCard user={match.player} />

                      {/* AI Reason */}
                      <div className="mt-3 p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start gap-2 mb-2">
                          <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-purple-400 font-semibold">
                            AI Analysis
                          </p>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {match.reason}
                        </p>
                      </div>
                    </div>
                  ))
                : players.map((player) => (
                    <ProfileCard key={player._id} user={player} />
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
