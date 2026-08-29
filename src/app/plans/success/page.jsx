"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaCrown, FaCheckCircle, FaTriangleExclamation } from "react-icons/fa6";
import Link from "next/link";
import { getUserToken } from "@/lib/core/session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState(
    sessionId
      ? ""
      : "Payment Session ID is missing. Verification could not proceed.",
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    async function verifyPayment() {
      try {
        const token = await getUserToken();
        const response = await fetch(
          `${BASE_URL}/payments/verify-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ sessionId }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to verify checkout session.",
          );
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Failed to authenticate payment with our servers.",
        );
        setLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Verifying Payment...
        </h2>
        <p className="text-xs text-gray-505 dark:text-gray-400">
          Please wait while we secure and update your pro membership status.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-955/20 text-red-550 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center justify-center">
          <FaTriangleExclamation className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Verification Failed
          </h2>
          <p className="text-sm text-red-500 leading-relaxed max-w-sm mx-auto">
            {error}
          </p>
        </div>
        <Link
          href="/plans"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl inline-block transition-all shadow-sm"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 animate-in zoom-in-95 duration-200">
      <div className="mx-auto w-20 h-20 bg-linear-to-tr from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center shadow-xl animate-bounce">
        <FaCrown className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Congratulations!
        </h1>
        <p className="text-sm text-gray-550 dark:text-gray-400 max-w-sm mx-auto">
          Your payment was processed successfully. You are now a **RecipeHub
          Premium Creator**!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          onClick={() => {
            window.location.href = "/dashboard/user";
          }}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
        >
          Go to Dashboard
        </button>
        <Link
          href="/"
          className="px-6 py-3 text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-xs font-semibold transition-all"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto my-24 px-6 p-10 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-xl flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
            <span className="text-xs text-gray-500 mt-2 block">
              Loading page...
            </span>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
