import Link from "next/link";
import {
  Users,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Target,
  CheckCircle,
  ArrowRight,
  Bot,
  Coins,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Powered Squad Finding
              </span>
              <br />
              <span className="text-white">for MagicCraft Players</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Stop playing with randoms. Let AI analyze playstyles, match you
              with compatible teammates, and build winning squads with real
              synergy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/register"
                className="group px-10 py-5 rounded-2xl bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-bold text-lg flex items-center gap-3 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#how-it-works"
                className="px-10 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-purple-500/30 transition-all font-bold text-lg"
              >
                See How It Works
              </Link>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              MVP Early Access • 100% Free to Start • 2000 MCRT Bonus
            </p>
          </div>

          {/* Hero Stats */}
          {/*           <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard
              icon={<Users className="w-8 h-8" />}
              number="1,234"
              label="Active Players"
            />
            <StatCard
              icon={<Zap className="w-8 h-8" />}
              number="95%"
              label="Match Success"
            />
            <StatCard
              icon={<Trophy className="w-8 h-8" />}
              number="567"
              label="Teams Formed"
            />
          </div> */}
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Problem with{" "}
              <span className="text-red-400">Random Matchmaking</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ProblemCard
              icon={<XCircle className="w-10 h-10 text-red-400" />}
              title="Wrong Playstyles"
              description="Aggressive players paired with defensive ones. No synergy, constant friction."
            />
            <ProblemCard
              icon={<XCircle className="w-10 h-10 text-red-400" />}
              title="Communication Gaps"
              description="Different languages, no voice chat, timezone mismatches ruin coordination."
            />
            <ProblemCard
              icon={<XCircle className="w-10 h-10 text-red-400" />}
              title="Skill Mismatches"
              description="Beginners with pros. Casual players with tryhards. Nobody has fun."
            />
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4">
              <div className="w-12 h-1 bg-linear-to-r from-transparent to-purple-500"></div>
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              <div className="w-12 h-1 bg-linear-to-l from-transparent to-purple-500"></div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-500/30">
            <div className="text-center mb-8">
              <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  MatchCraft Solves This
                </span>
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our AI analyzes your role, skill level, playstyle, language,
                region, and personality to match you with teammates who actually
                complement your gameplay.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <SolutionCard
                icon={<CheckCircle className="w-8 h-8 text-green-400" />}
                title="Perfect Synergy"
                description="Tank + DPS pairs that make sense"
              />
              <SolutionCard
                icon={<CheckCircle className="w-8 h-8 text-green-400" />}
                title="Real Compatibility"
                description="Same language, timezone & voice chat"
              />
              <SolutionCard
                icon={<CheckCircle className="w-8 h-8 text-green-400" />}
                title="Balanced Teams"
                description="Similar skill levels & goals"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Powered Features
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Not just filters. Real AI that understands MagicCraft gameplay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI Bio Generator"
              description="Generate compelling player bios in 3 styles: Professional, Casual, or Competitive"
              gradient="from-purple-600 to-pink-600"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Smart Matching"
              description="AI analyzes 10+ factors to find teammates with 95%+ compatibility scores"
              gradient="from-cyan-600 to-blue-600"
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8" />}
              title="/ai Commands"
              description="Get strategies, tips, and advice from AI directly in team chat"
              gradient="from-green-600 to-emerald-600"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Team Insights"
              description="AI analyzes your team composition and suggests optimal strategies"
              gradient="from-orange-600 to-red-600"
            />
          </div>
        </div>
      </section>

      {/* $MCRT Token Utility */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-6">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-300">
                $MCRT Token Utility
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="text-yellow-400">$MCRT</span> Powers Your
              Success
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Use MagicCraft&apos;s native token to boost your profile and get
              premium features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <TokenUseCard
              icon={<Zap className="w-10 h-10 text-yellow-400" />}
              title="Profile Boosting"
              description="Boost your profile for 48h-30 days. Appear first in search results and get 2x visibility."
            />
            <TokenUseCard
              icon={<Sparkles className="w-10 h-10 text-purple-400" />}
              title="Priority AI Matching"
              description="Get matched faster with AI analyzing more factors for perfect compatibility."
            />
            <TokenUseCard
              icon={<Bot className="w-10 h-10 text-cyan-400" />}
              title="Advanced AI Features"
              description="Unlock unlimited /ai commands, team analytics, and personalized insights."
            />
          </div>

          <div className="bg-linear-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-300 mb-2">
                  MVP Note: Off-Chain Demo
                </h4>
                <p className="text-gray-300 text-sm">
                  Currently demonstrating $MCRT utility with simulated payments.
                  Full blockchain integration with real $MCRT coming soon.
                  Architecture is ready for on-chain deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why{" "}
              <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MatchCraft
              </span>{" "}
              Is Different
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <DifferenceCard
              icon={<Bot className="w-12 h-12 text-purple-400" />}
              title="AI-First, Not AI-Washed"
              description="Our AI actually analyzes gameplay, not just keyword matching. Real machine learning for real team synergy."
            />
            <DifferenceCard
              icon={<Shield className="w-12 h-12 text-cyan-400" />}
              title="Built for MagicCraft"
              description="Deep integration with MagicCraft's 18 heroes, roles, and game mechanics. Not a generic LFG tool."
            />
            <DifferenceCard
              icon={<Users className="w-12 h-12 text-green-400" />}
              title="Community-First"
              description="No pay-to-win. Free tier is fully functional. $MCRT boosts are optional enhancements, not requirements."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get matched with perfect teammates in 3 simple steps
            </p>
          </div>

          <div className="space-y-8">
            <StepCard
              number="1"
              title="Create Your Player Profile"
              description="Tell us your role, skill level, playstyle, language, and region. Use AI to generate a compelling bio in seconds."
              icon={<Users className="w-8 h-8" />}
            />
            <StepCard
              number="2"
              title="Let AI Analyze Your Playstyle"
              description="Our AI examines your profile, gaming preferences, and personality to understand exactly what makes you a great teammate."
              icon={<Bot className="w-8 h-8" />}
            />
            <StepCard
              number="3"
              title="Get Matched with High-Synergy Teammates"
              description="Receive AI-powered matches with compatibility scores. See why you're a good fit, send requests, and start winning together."
              icon={<Sparkles className="w-8 h-8" />}
            />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-bold text-lg shadow-2xl shadow-purple-500/50"
            >
              Start Finding Teammates
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-linear-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/30">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-300">
                Early Access MVP
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the First Wave of <br />
              <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Matched Players
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the MVP. Get 2000 free MCRT tokens. Shape the future of
              team finding with your feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-10 py-5 rounded-2xl bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-bold text-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/search"
                className="px-10 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-purple-500/30 transition-all font-bold text-lg"
              >
                Browse Players
              </Link>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              MVP Early Access • 100% Free to Start
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
function StatCard({ icon, number, label }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 text-center">
      <div className="flex justify-center mb-3 text-purple-400">{icon}</div>
      <div className="text-3xl font-bold mb-2">{number}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

function ProblemCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function SolutionCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/20">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h4 className="font-bold text-white">{title}</h4>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
      <div
        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function TokenUseCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
    </div>
  );
}

function DifferenceCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 text-center hover:border-purple-500/40 transition-all">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="shrink-0 w-16 h-16 rounded-2xl bg-linear-to-r from-purple-600 to-cyan-600 flex items-center justify-center text-2xl font-bold">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-purple-400">{icon}</div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 text-lg">{description}</p>
      </div>
    </div>
  );
}
