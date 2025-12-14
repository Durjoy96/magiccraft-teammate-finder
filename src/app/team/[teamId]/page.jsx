"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatMessageBubble from "@/components/ChatMessageBubble";
import {
  Send,
  Loader2,
  Users,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Zap,
  Bot,
} from "lucide-react";
import Link from "next/link";

export default function TeamChatPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [team, setTeam] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const chatContainerRef = useRef(null);
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
    // Only auto-scroll if user hasn't manually scrolled up
    if (!userScrolled) {
      scrollToBottom();
    }
  }, [messages]);

  // check scroll position
  const handleScroll = (e) => {
    const element = e.target;
    const isNearBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setUserScrolled(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
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
    if (!newMessage.trim() || sending || aiThinking) return;

    const messageText = newMessage.trim();

    // Check if it's an AI command
    if (messageText.startsWith("/ai ")) {
      await handleAiCommand(messageText);
      return;
    }

    setSending(true);
    setNewMessage("");

    try {
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: teamId,
          content: messageText,
        }),
      });

      if (res.ok) {
        fetchMessages();
      } else {
        alert("Failed to send message");
        setNewMessage(messageText); // Restore message on error
      }
    } catch (error) {
      alert("An error occurred");
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleAiCommand = async (command) => {
    setAiThinking(true);
    setNewMessage("");

    try {
      const res = await fetch("/api/ai/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: command.replace("/ai ", ""),
          teamId: teamId,
          userCommand: command, // Send full command to store
        }),
      });

      if (res.ok) {
        // Messages are now stored in DB, just refresh
        await fetchMessages();
      } else {
        const data = await res.json();
        alert(data.error || "AI command failed. Please try again.");
      }
    } catch (error) {
      alert("Failed to get AI response");
    } finally {
      setAiThinking(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const quickAiCommands = [
    {
      label: "Team Strategy",
      command: "/ai suggest a strategy for our team composition",
    },
    {
      label: "Role Tips",
      command: "/ai give me tips for playing my role better",
    },
    {
      label: "Best Builds",
      command: "/ai what are the best builds for our team?",
    },
    {
      label: "Counter Picks",
      command: "/ai what heroes counter our team composition?",
    },
  ];

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
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 sticky top-6 space-y-6">
            <div>
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
                              <Copy className="w-4 h-4 text-gray-400" />
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
                              <Copy className="w-4 h-4 text-gray-400" />
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

            {/* AI Assistant Info */}
            <div className="pt-6 border-t border-gray-700">
              <button
                onClick={() => setShowAiHelp(!showAiHelp)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">AI Assistant</span>
                </div>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </button>

              {showAiHelp && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-400 mb-3">Quick commands:</p>
                  {quickAiCommands.map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewMessage(cmd.command)}
                      className="w-full text-left text-xs p-2 rounded bg-gray-900/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all"
                    >
                      <span className="text-purple-400 font-semibold">
                        {cmd.label}
                      </span>
                    </button>
                  ))}
                  <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-cyan-400 font-semibold mb-1">
                      💡 Usage:
                    </p>
                    <p className="text-xs text-gray-400">
                      Type <code className="text-purple-400">/ai</code> followed
                      by your question
                    </p>
                  </div>
                </div>
              )}
            </div>
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
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Bot className="w-4 h-4" />
                  <span>AI Enabled</span>
                </div>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="h-[500px] overflow-y-auto p-6 bg-gray-900/30"
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No messages yet</p>
                    <p className="text-gray-500 text-sm mb-4">
                      Start the conversation or try AI assistant!
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">
                        Type <code className="text-purple-400">/ai</code> to use
                        AI
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    if (message.isAi) {
                      return (
                        <div key={message._id} className="mb-6">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex-shrink-0">
                              <Bot className="w-5 h-5" />
                            </div>
                            <div className="flex-1 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl rounded-tl-none p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-purple-400">
                                  AI Assistant
                                </span>
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                              </div>
                              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (message.isAiCommand) {
                      return (
                        <div
                          key={message._id}
                          className="mb-4 flex justify-end"
                        >
                          <div className="max-w-md bg-purple-600/20 border border-purple-500/30 rounded-2xl rounded-tr-none px-4 py-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-3 h-3 text-purple-400" />
                              <span className="text-xs text-purple-400 font-semibold">
                                AI Command
                              </span>
                            </div>
                            <p className="text-sm text-gray-200">
                              {message.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <ChatMessageBubble
                        key={message._id}
                        message={message}
                        isOwn={message.senderId === session?.user?.id}
                        senderName={message.senderName}
                      />
                    );
                  })}
                  {aiThinking && (
                    <div className="mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex-shrink-0 animate-pulse">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl rounded-tl-none p-4">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            <span className="text-sm text-gray-400">
                              AI is thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                  placeholder="Type a message or /ai for AI assistant..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  disabled={sending || aiThinking}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending || aiThinking}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {sending || aiThinking ? (
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
