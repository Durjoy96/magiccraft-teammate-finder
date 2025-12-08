import { Shield, Swords, Heart, Sparkles, Skull } from "lucide-react";

const roleConfig = {
  Tank: {
    icon: Shield,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  DPS: { icon: Swords, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  Support: {
    icon: Heart,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  Mage: {
    icon: Sparkles,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  Assassin: {
    icon: Skull,
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
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
