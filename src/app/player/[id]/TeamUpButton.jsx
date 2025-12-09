"use client";
import { useState } from "react";
import { UserPlus, Loader2, Check } from "lucide-react";

export default function TeamUpButton({
  playerId,
  showIcon = true,
  fullWidth = false,
}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleTeamUp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: playerId }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
      } else {
        alert(data.error || "Failed to send request");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <button
        disabled
        className={`${
          fullWidth ? "w-full" : ""
        } px-6 py-2 rounded-lg bg-green-600 font-semibold flex items-center justify-center gap-2`}
      >
        <Check className="w-5 h-5" />
        Request Sent!
      </button>
    );
  }

  return (
    <button
      onClick={handleTeamUp}
      disabled={loading}
      className={`cursor-pointer ${
        fullWidth ? "w-full" : ""
      } px-6 py-2 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {showIcon && <UserPlus className="w-5 h-5" />}
          <span>Send Team Request</span>
        </>
      )}
    </button>
  );
}
