"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Save, RefreshCw, Info, Sparkles, Wand2 } from "lucide-react";

const ROLES = [
  {
    value: "Damage Dealer",
    label: "Damage Dealer",
    description: "High damage output, offensive playstyle",
    heroes: "Karas, Blazy, Vladislav",
  },
  {
    value: "Tank",
    label: "Tank",
    description: "High health, frontline defender",
    heroes: "Bjorn, Craig, Frigard",
  },
  {
    value: "Support",
    label: "Support",
    description: "Heals and buffs teammates",
    heroes: "Moira, Druid, Gail",
  },
  {
    value: "Assassin",
    label: "Assassin",
    description: "Burst damage, high mobility",
    heroes: "Ronin, Vega, Tara",
  },
  {
    value: "Marksman",
    label: "Marksman",
    description: "Ranged sustained damage",
    heroes: "True Shot, Brienne, Amun",
  },
  {
    value: "Mage",
    label: "Mage",
    description: "Magic damage, area control",
    heroes: "Zap, Dr. Lutz, Jean",
  },
  {
    value: "Flex",
    label: "Flex",
    description: "Can play multiple roles",
    heroes: "Any character",
  },
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const PLAYSTYLES = ["Aggressive", "Balanced", "Defensive", "Strategic"];
const EXPERIENCE_LEVELS = ["Newbie", "Casual", "Experienced", "Veteran", "Pro"];
const LOOKING_FOR = [
  "Casual Fun",
  "Ranked Grinding",
  "Tournament Team",
  "Learning & Practice",
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  // AI Bio Generator states
  const [generatingBio, setGeneratingBio] = useState(false);
  const [showBioOptions, setShowBioOptions] = useState(false);
  const [bioOptions, setBioOptions] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    avatar: "",
    uid: "",
    level: "",
    role: "",
    skillLevel: "",
    playstyle: "",
    region: "",
    language: "",
    activeHours: "",
    voice: false,
    discordTag: "",
    bio: "",
    lookingFor: "",
    experienceLevel: "",
  });

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile/me");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          username: data.username || "",
          avatar: data.avatar || "",
          uid: data.uid || "",
          level: data.level || "",
          role: data.role || "",
          skillLevel: data.skillLevel || "",
          playstyle: data.playstyle || "",
          region: data.region || "",
          language: data.language || "",
          activeHours: data.activeHours || "",
          voice: data.voice || false,
          discordTag: data.discordTag || "",
          bio: data.bio || "",
          lookingFor: data.lookingFor || "",
          experienceLevel: data.experienceLevel || "",
        });
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const regenerateAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${Date.now()}`;
    setFormData({ ...formData, avatar: newAvatar });
  };

  const handleGenerateBio = async () => {
    if (!formData.role || !formData.skillLevel || !formData.playstyle) {
      setError("Please fill in Role, Skill Level, and Playstyle first");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setGeneratingBio(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formData.role,
          skillLevel: formData.skillLevel,
          playstyle: formData.playstyle,
          lookingFor: formData.lookingFor,
          experienceLevel: formData.experienceLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBioOptions(data.bios);
        setShowBioOptions(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to generate bio");
      }
    } catch (err) {
      setError("Failed to generate bio. Please try again.");
    } finally {
      setGeneratingBio(false);
    }
  };

  const selectBio = (bioType) => {
    setFormData({ ...formData, bio: bioOptions[bioType] });
    setShowBioOptions(false);
    setBioOptions(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const selectedRole = ROLES.find((r) => r.value === formData.role);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
        <p className="text-gray-400">Update your information</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 text-green-400">
          Profile updated successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-bold mb-4">Avatar</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-4 border-purple-500/30">
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full"
                />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Your unique gaming avatar
              </p>
              <button
                type="button"
                onClick={regenerateAvatar}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Avatar
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Game UID
                <span className="text-gray-500 text-xs ml-2">
                  (Private until matched)
                </span>
              </label>
              <input
                type="text"
                name="uid"
                value={formData.uid}
                onChange={handleChange}
                placeholder="Your MagicCraft UID"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                placeholder="e.g., 45"
                min="1"
                max="999"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Primary Role *
              </label>
              <button
                type="button"
                onClick={() => setShowRoleInfo(!showRoleInfo)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">Select Role</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            {showRoleInfo && (
              <div className="mt-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-2">
                {ROLES.map((role) => (
                  <div key={role.value} className="text-sm">
                    <span className="font-semibold text-purple-400">
                      {role.label}:
                    </span>
                    <span className="text-gray-300 ml-2">
                      {role.description}
                    </span>
                    <div className="text-gray-500 text-xs ml-2">
                      Heroes: {role.heroes}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedRole && (
              <div className="mt-2 text-sm text-gray-400">
                <span className="text-purple-400">
                  {selectedRole.description}
                </span>
                <span className="text-gray-500">
                  {" "}
                  • Example heroes: {selectedRole.heroes}
                </span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Skill Level *
              </label>
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select Skill Level</option>
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Playstyle *
              </label>
              <select
                name="playstyle"
                value={formData.playstyle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select Playstyle</option>
                {PLAYSTYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select Experience</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Looking For
              </label>
              <select
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select Goal</option>
                {LOOKING_FOR.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <h2 className="text-xl font-bold mb-4">Availability</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Region *</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select Region</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Oceania">Oceania</option>
                <option value="Middle East">Middle East</option>
                <option value="Africa">Africa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Language *
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g., English, Spanish"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Active Hours
            </label>
            <input
              type="text"
              name="activeHours"
              value={formData.activeHours}
              onChange={handleChange}
              placeholder="e.g., 6 PM - 11 PM EST, Weekends"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Communication */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <h2 className="text-xl font-bold mb-4">Communication</h2>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="voice"
                checked={formData.voice}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium">Voice chat available</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Discord Tag
              <span className="text-gray-500 text-xs ml-2">
                (Private until matched)
              </span>
            </label>
            <input
              type="text"
              name="discordTag"
              value={formData.discordTag}
              onChange={handleChange}
              placeholder="e.g., username#1234"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Bio with AI Generator */}
        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">About You</h2>
            </div>
            <button
              type="button"
              onClick={handleGenerateBio}
              disabled={
                generatingBio ||
                !formData.role ||
                !formData.skillLevel ||
                !formData.playstyle
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {generatingBio ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </button>
          </div>

          {!formData.role || !formData.skillLevel || !formData.playstyle ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4 text-sm text-yellow-400">
              Fill in Role, Skill Level, and Playstyle to use AI bio generator
            </div>
          ) : null}

          {showBioOptions && bioOptions && (
            <div className="mb-4 space-y-3">
              <p className="text-sm text-gray-400 mb-3">Choose a bio style:</p>

              <button
                type="button"
                onClick={() => selectBio("professional")}
                className="w-full text-left p-4 bg-gray-900/50 hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-400">
                    Professional
                  </span>
                  <span className="text-xs text-gray-500">Click to use</span>
                </div>
                <p className="text-sm text-gray-300">
                  {bioOptions.professional}
                </p>
              </button>

              <button
                type="button"
                onClick={() => selectBio("casual")}
                className="w-full text-left p-4 bg-gray-900/50 hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-cyan-400">Casual</span>
                  <span className="text-xs text-gray-500">Click to use</span>
                </div>
                <p className="text-sm text-gray-300">{bioOptions.casual}</p>
              </button>

              <button
                type="button"
                onClick={() => selectBio("competitive")}
                className="w-full text-left p-4 bg-gray-900/50 hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-red-400">
                    Competitive
                  </span>
                  <span className="text-xs text-gray-500">Click to use</span>
                </div>
                <p className="text-sm text-gray-300">
                  {bioOptions.competitive}
                </p>
              </button>

              <button
                type="button"
                onClick={handleGenerateBio}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-semibold cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Generate New Options
              </button>
            </div>
          )}

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell others about yourself, your playstyle, and what you're looking for in teammates..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}
