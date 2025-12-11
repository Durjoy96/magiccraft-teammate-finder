"use client";
import { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Search, Filter, Loader2, X } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Teammates</h1>
        <p className="text-gray-400">
          Search for players matching your criteria
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
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
              <label className="block text-sm font-medium mb-2">
                Skill Level
              </label>
              <select
                name="skillLevel"
                value={filters.skillLevel}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
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
              <label className="block text-sm font-medium mb-2">Region</label>
              <select
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
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
              <label className="block text-sm font-medium mb-2">Language</label>
              <input
                type="text"
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                placeholder="Any language"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Experience
              </label>
              <select
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
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
              <label className="block text-sm font-medium mb-2">
                Looking For
              </label>
              <select
                name="lookingFor"
                value={filters.lookingFor}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
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

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="voiceOnly"
                checked={filters.voiceOnly}
                onChange={handleFilterChange}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium">Voice chat only</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20">
          <p className="text-gray-400 text-lg">
            No players found matching your criteria
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-400">
            Found {players.length} player{players.length !== 1 ? "s" : ""}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <ProfileCard key={player._id} user={player} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
