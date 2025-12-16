"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Users,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Mail,
  Clock,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/profile/me");
      if (res.ok) {
        const data = await res.json();
        setUserAvatar(data.avatar);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();
      fetchUserData();
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);
  return (
    <nav className="bg-gray-900 border-b border-purple-500/20 sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              MCTF
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* Search */}
                <Link
                  href="/search"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">
                    Find Players
                  </span>
                </Link>

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="font-bold text-lg">Notifications</h3>
                        <p className="text-xs text-gray-400">
                          {unreadCount > 0
                            ? `${unreadCount} new`
                            : "No new notifications"}
                        </p>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">
                              No notifications yet
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <Link
                              key={notif.id}
                              href={notif.link}
                              onClick={() => setShowNotifications(false)}
                              className="block p-4 hover:bg-gray-800/50 border-b border-gray-800 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                {notif.sender?.avatar && (
                                  <img
                                    src={notif.sender.avatar}
                                    alt={notif.sender.username}
                                    className="w-10 h-10 rounded-full border-2 border-purple-500/30"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-200 mb-1">
                                    {notif.message}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeAgo(notif.createdAt)}
                                  </div>
                                </div>
                                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              </div>
                            </Link>
                          ))
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <Link
                          href="/requests"
                          onClick={() => setShowNotifications(false)}
                          className="block p-3 text-center text-sm font-semibold text-purple-400 hover:bg-gray-800/50 transition-colors"
                        >
                          View All Requests →
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={session.user.username}
                      className="w-7 h-7 rounded-full border-2 border-purple-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                      {session.user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">
                    {session.user.username}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20  text-red-400 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
