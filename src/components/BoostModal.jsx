"use client";
import { useState } from "react";
import { X, Zap, Check, AlertCircle } from "lucide-react";

const BOOST_PLANS = [
  {
    id: "48h",
    duration: "48 Hours",
    hours: 48,
    price: 500,
    badge: "Quick Boost",
    popular: false,
  },
  {
    id: "7d",
    duration: "7 Days",
    hours: 168,
    price: 1200,
    badge: "Most Popular",
    popular: true,
  },
  {
    id: "15d",
    duration: "15 Days",
    hours: 360,
    price: 2200,
    badge: "Best Value",
    popular: false,
  },
  {
    id: "30d",
    duration: "30 Days",
    hours: 720,
    price: 3500,
    badge: "Premium",
    popular: false,
  },
];

export default function BoostModal({
  isOpen,
  onClose,
  currentBalance,
  onBoostSuccess,
}) {
  const [selectedPlan, setSelectedPlan] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const plan = BOOST_PLANS.find((p) => p.id === selectedPlan);
  const canAfford = currentBalance >= plan.price;

  const handleBoost = async () => {
    if (!canAfford) {
      setError("Insufficient MCRT balance");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mcrt/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedPlan }),
      });

      const data = await res.json();

      if (res.ok) {
        onBoostSuccess(data);
        onClose();
      } else {
        setError(data.error || "Failed to boost profile");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-purple-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-purple-600 to-cyan-600 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Boost Your Profile</h2>
                <p className="text-sm text-gray-400">
                  Get 2x visibility and priority placement
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance & Demo Notice */}
        <div className="p-6 bg-linear-to-r from-purple-500/10 to-cyan-500/10 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Your MCRT Balance:</span>
            <span className="text-2xl font-bold text-purple-400">
              {currentBalance.toLocaleString()} MCRT
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Demo Mode:</strong> This is a demonstration of the MCRT
              payment system. Blockchain integration coming soon!
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 space-y-3">
          <h3 className="font-semibold mb-4">Choose Your Boost Duration:</h3>

          {BOOST_PLANS.map((boostPlan) => {
            const isSelected = selectedPlan === boostPlan.id;
            const affordable = currentBalance >= boostPlan.price;

            return (
              <button
                key={boostPlan.id}
                onClick={() => setSelectedPlan(boostPlan.id)}
                disabled={!affordable}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/10"
                    : affordable
                    ? "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                    : "border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          {boostPlan.duration}
                        </span>
                        {boostPlan.popular && (
                          <span className="px-2 py-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold">
                            {boostPlan.badge}
                          </span>
                        )}
                        {!boostPlan.popular && boostPlan.badge && (
                          <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs font-semibold text-gray-400">
                            {boostPlan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Premium visibility for{" "}
                        {boostPlan.duration.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {boostPlan.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">MCRT</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="px-6 pb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h4 className="font-semibold mb-3 text-sm text-gray-300">
              Boost Benefits:
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Appear first in search results
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Premium purple glow on profile
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Priority in AI matching
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                2x profile visibility & views
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Verified boost badge
              </li>
            </ul>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 pb-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-800/30 border-t border-gray-800">
          <button
            onClick={handleBoost}
            disabled={loading || !canAfford}
            className="w-full px-6 py-4 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : !canAfford ? (
              "Insufficient Balance"
            ) : (
              <>
                <Zap className="w-6 h-6" />
                Boost Profile for {plan.price} MCRT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
