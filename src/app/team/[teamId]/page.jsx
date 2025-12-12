"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatMessageBubble from "@/components/ChatMessageBubble";
import { Send, Loader2, Users, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function TeamChatPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [team, setTeam] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const messagesEndRef = useRef(null);
  const { teamId } = React.use(params);

  useEffect(() => {
    if (session) {
      fetchTeamAndMessages();
      const interval = setInterval(fetchMessages, 3000);
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
          teamId: teamId,
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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const teammate = team?.memberDetails?.find(
    (m) => m._id !== session?.user?.id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Requests
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Teammate Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Teammate Info
            </h2>

            {teammate && (
              <div className="space-y-4">
                {/* Avatar & Name */}
                <div className="text-center">
                  {teammate.avatar && (
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-700 border-4 border-purple-500/30 mb-3">
                      <img
                        src={teammate.avatar}
                        alt={teammate.username}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{teammate.username}</h3>
                  {teammate.level && (
                    <p className="text-sm text-gray-400">
                      Level {teammate.level}
                    </p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  {teammate.uid && (
                    <div className="bg-gray-900 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Game UID</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm text-purple-400">
                          {teammate.uid}
                        </p>
                        <button
                          onClick={() => copyToClipboard(teammate.uid, "uid")}
                          className="p-1 hover:bg-gray-800 rounded transition-colors"
                        >
                          {copiedField === "uid" ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {teammate.discordTag && (
                    <div className="bg-gray-900 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Discord</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm text-cyan-400">
                          {teammate.discordTag}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(teammate.discordTag, "discord")
                          }
                          className="p-1 hover:bg-gray-800 rounded transition-colors"
                        >
                          {copiedField === "discord" ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {!teammate.uid && !teammate.discordTag && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Teammate hasn&apos;t added contact info yet
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <Link
                    href={`/player/${teammate._id}`}
                    className="block w-full text-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-semibold"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
            <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  <div>
                    <h1 className="text-xl font-bold">Team Chat</h1>
                    <p className="text-sm text-gray-400">
                      {team?.memberDetails?.map((m) => m.username).join(" & ")}
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
                    <p className="text-gray-500 text-sm">
                      Start the conversation!
                    </p>
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
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
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
      </div>
    </div>
  );
}
