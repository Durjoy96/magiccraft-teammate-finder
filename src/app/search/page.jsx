"use client";
import { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Search, Filter, Loader2 } from "lucide-react";

const ROLES = ["Tank", "DPS", "Support", "Mage", "Assassin"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Pro"];

export default function SearchPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    skillLevel: "",
    region: "",
    language: "",
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
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
    });
    setTimeout(() => searchPlayers(), 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Teammates</h1>
        <p className="text-gray-400">
          Search for players matching your criteria
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold">Filters</h2>
        </div>

        <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
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
            <input
              type="text"
              name="region"
              value={filters.region}
              onChange={handleFilterChange}
              placeholder="Any region"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
            />
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

          <div className="md:col-span-4 flex gap-3">
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
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors font-semibold"
            >
              Clear
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
