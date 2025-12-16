"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleBadge from "./RoleBadge";
import { Check, X, Clock, MessageSquare } from "lucide-react";

export default function TeamRequestCard({ request, type, onAction }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const otherUser = type === "incoming" ? request.sender : request.receiver;

  const handleAction = async (action) => {
    setLoading(true);
    const result = await onAction(request._id, action);

    // If accepted and we got a teamId, redirect to chat
    if (action === "accept" && result?.teamId) {
      router.push(`/team/${result.teamId}`);
    }
    setLoading(false);
  };

  const handleOpenChat = () => {
    if (request.teamId) {
      router.push(`/team/${request.teamId}`);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2">
          <img
            src={otherUser.avatar}
            width={70}
            height={70}
            alt="avatar"
            className="border border-purple-500 rounded-full"
          />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              {otherUser.username}
            </h3>
            <RoleBadge role={otherUser.role} />
          </div>
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
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={loading}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}

      {request.status === "pending" && type === "sent" && (
        <div className="text-center py-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          Waiting for response...
        </div>
      )}

      {request.status === "accepted" && (
        <button
          onClick={handleOpenChat}
          className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold"
        >
          <MessageSquare className="w-4 h-4" />
          Open Team Chat
        </button>
      )}

      {request.status === "rejected" && (
        <div className="text-center py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
          Request Rejected
        </div>
      )}
    </div>
  );
}
