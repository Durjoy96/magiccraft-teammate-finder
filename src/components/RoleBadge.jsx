import {
  Shield,
  Swords,
  Heart,
  Sparkles,
  Skull,
  Target,
  Zap,
} from "lucide-react";

const roleConfig = {
  "Damage Dealer": {
    icon: Swords,
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  Tank: {
    icon: Shield,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  Support: {
    icon: Heart,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  Assassin: {
    icon: Skull,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  Marksman: {
    icon: Target,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  Mage: {
    icon: Sparkles,
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  Flex: {
    icon: Zap,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
};

export default function RoleBadge({ role }) {
  if (!role || !roleConfig[role]) return null;

  const { icon: Icon, color } = roleConfig[role];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${color} text-sm font-semibold`}
    >
      <Icon className="w-4 h-4" />
      <span>{role}</span>
    </div>
  );
}
