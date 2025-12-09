"use client";
import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";

export default function BoostButton({ playerId }) {
  const [loading, setLoading] = useState(false);
  const [boosted, setBoosted] = useState(false);

  const handleBoost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mcrt/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: playerId }),
      });

      const data = await res.json();

      if (res.ok) {
        setBoosted(true);
        alert("Profile boosted for 24 hours! (MCRT placeholder)");
      } else {
        alert(data.error || "Failed to boost profile");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBoost}
      disabled={loading || boosted}
      className="cursor-pointer px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Zap className="w-5 h-5" />
          <span className="hidden sm:inline">Boost Profile</span>
        </>
      )}
    </button>
  );
}
