"use client";
import { useState } from "react";
import RoleBadge from "./RoleBadge";
import { Check, X, Clock } from "lucide-react";

export default function TeamRequestCard({ request, type, onAction }) {
  const [loading, setLoading] = useState(false);
  const otherUser = type === "incoming" ? request.sender : request.receiver;

  const handleAction = async (action) => {
    setLoading(true);
    await onAction(request._id, action);
    setLoading(false);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            {otherUser.username}
          </h3>
          <RoleBadge role={otherUser.role} />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="text-sm text-gray-300 mb-4">
        <p>Skill: {otherUser.skillLevel}</p>
        <p>Region: {otherUser.region}</p>
      </div>

      {request.status === "pending" && type === "incoming" && (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction("accept")}
            disabled={loading}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={loading}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-200 text-red-950 font-semibold hover:opacity-80 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}

      {request.status !== "pending" && (
        <div
          className={`text-center py-2 rounded-lg ${
            request.status === "accepted"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </div>
      )}
    </div>
  );
}
