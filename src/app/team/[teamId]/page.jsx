"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatMessageBubble from "@/components/ChatMessageBubble";
import { Send, Loader2, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeamChatPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [team, setTeam] = useState(null);
  const messagesEndRef = useRef(null);
  const { teamId } = React.use(params);

  useEffect(() => {
    if (session) {
      fetchTeamAndMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [session, teamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTeamAndMessages = async () => {
    setLoading(true);
    try {
      const [teamRes, messagesRes] = await Promise.all([
        fetch(`/api/team/${teamId}`),
        fetch(`/api/message/${teamId}`),
      ]);

      if (teamRes.ok && messagesRes.ok) {
        const teamData = await teamRes.json();
        const messagesData = await messagesRes.json();
        setTeam(teamData.team);
        setMessages(messagesData.messages);
      } else {
        // router.push("/requests");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/message/${teamId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Requests
      </Link>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
        <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              <div>
                <h1 className="text-xl font-bold">Team Chat</h1>
                <p className="text-sm text-gray-400">
                  {team?.memberDetails?.map((m) => m.username).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto p-6 bg-gray-900/30">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-400 mb-2">No messages yet</p>
                <p className="text-gray-500 text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessageBubble
                  key={message._id}
                  message={message}
                  isOwn={message.senderId === session?.user?.id}
                  senderName={message.senderName}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-gray-900/50 border-t border-gray-700"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
