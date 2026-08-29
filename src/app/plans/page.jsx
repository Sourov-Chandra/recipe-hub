"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { FaCrown, FaCheck, FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { getUserToken } from "@/lib/core/session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function PlansPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (!session?.user) {
      setError("Please sign in to upgrade your account.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getUserToken();
      const response = await fetch(
        `${BASE_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            email: session.user.email,
            userId: session.user.id,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to initiate payment session.",
        );
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Payment redirect URL missing.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const premiumFeatures = [
    "Unlimited Recipe Upload Slots (Free accounts are limited to 2)",
    "Exclusive 'Premium Chef' Golden Badge on your profile",
    "Publish paywalled recipes (others must pay to unlock them)",
    "Priority moderation and recipe featuring",
  ];

  return (
    <div className="max-w-4xl mx-auto my-16 px-6 animate-in fade-in duration-300">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-amber-500/20">
          <FaCrown /> Pro Membership
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Level Up Your Cooking Account
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Unlock the full power of RecipeHub and share your culinary creations
          without limitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-lg p-8 items-center">
        <div className="md:col-span-3 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Premium Features Included:
          </h3>
          <ul className="space-y-4">
            {premiumFeatures.map((feat, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-650 dark:text-gray-450 leading-normal"
              >
                <span className="p-1 bg-green-50 dark:bg-green-950/20 text-green-500 border border-green-100 dark:border-green-950/30 rounded-lg shrink-0 mt-0.5">
                  <FaCheck className="w-3 h-3" />
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl text-center space-y-6 h-full flex flex-col justify-center">
          <div>
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">
              One-Time Fee
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                $10
              </span>
              <span className="text-sm text-gray-500 font-semibold">USD</span>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">
              Lifetime Access
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-950/30">
              {error}
            </p>
          )}

          {session?.user ? (
            session.user.isPremium ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs font-semibold">
                You are already a Premium Member!
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Upgrade to Premium</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            )
          ) : (
            <Link
              href="/login"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-md block transition-all active:scale-98"
            >
              Sign In to Upgrade
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
