"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TeamRequestCard from "@/components/TeamRequestCard";
import { Mail, Loader2, Send, Inbox } from "lucide-react";

export default function RequestsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("incoming");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchRequests();
    }
  }, [session, activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team/myrequests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const endpoint =
        action === "accept" ? "/api/team/accept" : "/api/team/reject";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (res.ok) {
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Action failed");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === "incoming") {
      return req.receiverId === session?.user?.id;
    } else {
      return req.senderId === session?.user?.id;
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold">Team Requests</h1>
        </div>
        <p className="text-gray-400">
          Manage your incoming and sent team requests
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`cursor-pointer flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "incoming"
                ? "bg-purple-600 text-white"
                : "bg-gray-800/50 text-gray-400 hover:text-gray-300"
            }`}
          >
            <Inbox className="w-5 h-5" />
            Incoming
            {filteredRequests.filter(
              (r) =>
                r.status === "pending" && r.receiverId === session?.user?.id
            ).length > 0 && (
              <span className="ml-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs">
                {
                  filteredRequests.filter(
                    (r) =>
                      r.status === "pending" &&
                      r.receiverId === session?.user?.id
                  ).length
                }
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`cursor-pointer flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "sent"
                ? "bg-purple-600 text-white"
                : "bg-gray-800/50 text-gray-400 hover:text-gray-300"
            }`}
          >
            <Send className="w-5 h-5" />
            Sent
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-2">
                No {activeTab} requests
              </p>
              <p className="text-gray-500 text-sm">
                {activeTab === "incoming"
                  ? "When other players send you team requests, they will appear here"
                  : "Send team requests to players you want to team up with"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <TeamRequestCard
                  key={request._id}
                  request={request}
                  type={activeTab}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
