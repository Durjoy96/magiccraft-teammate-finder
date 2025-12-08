import Link from "next/link";
import { Users, Search, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-transparent">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Find Your Perfect
          <br />
          MagicCraft Teammates
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with skilled players, build your dream team, and dominate the
          battlefield together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="px-8 py-4 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Find Teammates
          </Link>
          <Link
            href="/profile"
            className="px-8 py-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all font-semibold text-lg border border-purple-500/30"
          >
            Create Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <StatCard
          icon={<Users className="w-8 h-8" />}
          number="1,234"
          label="Active Players"
        />
        <StatCard
          icon={<Shield className="w-8 h-8" />}
          number="567"
          label="Teams Formed"
        />
        <StatCard
          icon={<Zap className="w-8 h-8" />}
          number="89"
          label="Matches Today"
        />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Users className="w-6 h-6" />}
          title="Smart Matching"
          description="Find players that match your playstyle and skill level"
        />
        <FeatureCard
          icon={<Search className="w-6 h-6" />}
          title="Advanced Filters"
          description="Search by role, region, language, and availability"
        />
        <FeatureCard
          icon={<Zap className="w-6 h-6" />}
          title="Instant Chat"
          description="Connect and communicate with your teammates in real-time"
        />
        <FeatureCard
          icon={<Shield className="w-6 h-6" />}
          title="Profile Boost"
          description="Increase your visibility with MCRT token boosts"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, number, label }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 text-center">
      <div className="flex justify-center mb-3 text-purple-400">{icon}</div>
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
      <div className="text-cyan-400 mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
