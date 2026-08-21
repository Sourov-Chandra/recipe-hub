"use client";

import React, { use, useState, useEffect } from "react";
import { getRecipeById } from "@/lib/api/recipes";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaClock,
  FaUtensils,
  FaHeart,
  FaBookmark,
  FaArrowLeft,
  FaGlobe,
  FaSignal,
  FaFlag,
  FaLock,
  FaCrown,
  FaCircleCheck,
  FaXmark,
} from "react-icons/fa6";

export default function RecipeDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const recipeId = params.id;

  const searchParams = useSearchParams();
  const purchaseSuccess = searchParams.get("purchase_success");
  const sessionId = searchParams.get("session_id");

  const { data: session } = useSession();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");
  const [reporting, setReporting] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [favorited, setFavorited] = useState(false);

  async function verifyRecipePayment(sId) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/verify-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sId }),
        },
      );
      if (response.ok) {
        setPurchased(true);
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  }

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);
        const data = await getRecipeById(recipeId);
        setRecipe(data);
        setLikesCount(data.likesCount || 0);

        if (purchaseSuccess && sessionId && session?.user?.email) {
          await verifyRecipePayment(sessionId);
        }
      } catch (err) {
        console.error("Failed to load recipe:", err);
        setError("Recipe not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }

    if (recipeId) {
      loadRecipe();
    }
  }, [recipeId, purchaseSuccess, sessionId, session?.user?.email]);

  async function verifyRecipePayment(sId) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/verify-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sId }),
        },
      );
      if (response.ok) {
        setPurchased(true);
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  }

  const handlePurchase = async () => {
    if (!session?.user) {
      alert("Please login to purchase this recipe!");
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/payments/create-recipe-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            userId: session.user.id,
            recipeId,
            recipeName: recipe.recipeName,
          }),
        },
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Checkout failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const handleLike = async () => {
    if (!session) {
      alert("Please login to like this recipe!");
      return;
    }

    const action = liked ? "unlike" : "like";

    try {
      const res = await fetch(
        `http://localhost:5000/api/recipes/${recipeId}/like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        },
      );

      if (res.ok) {
        setLikesCount((prev) => Math.max(0, prev + (liked ? -1 : 1)));
        setLiked(!liked);
      }
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  const handleFavorite = async () => {
    if (!session) {
      alert("Please login to bookmark favorites!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          userId: session.user.id,
          recipeId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.action === "added") {
          setFavorited(true);
          alert("Added to Favorites!");
        } else if (data.action === "removed") {
          setFavorited(false);
          alert("Removed from Favorites.");
        }
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReporting(true);
    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId,
          reporterEmail: session?.user?.email || "anonymous",
          reason: reportReason,
        }),
      });
      if (res.ok) {
        alert("Report submitted successfully.");
        setIsReportOpen(false);
      }
    } catch (err) {
      alert("Failed to submit report.");
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
        <span className="text-sm text-gray-500">Loading recipe details...</span>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-md mx-auto my-24 px-6 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
          <FaUtensils className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Recipe Not Found</h2>
        <Link
          href="/recipes"
          className="px-6 py-3 bg-orange-500 text-white font-bold text-xs rounded-2xl inline-flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Recipes
        </Link>
      </div>
    );
  }

  const ingredientsList = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : recipe.ingredients
      ? recipe.ingredients.split(",").map((i) => i.trim())
      : [];

  return (
    <div className="max-w-4xl mx-auto my-12 px-6 space-y-8 animate-in fade-in duration-300">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
      >
        <FaArrowLeft className="w-3.5 h-3.5" /> Back to Recipes
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-55 border border-gray-150 shadow-md">
          <Image
            src={recipe.recipeImage}
            alt={recipe.recipeName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="px-3 py-1.5 bg-orange-50 text-orange-500 rounded-xl border border-orange-100/50 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/50">
              {recipe.category}
            </span>
            <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-xl">
              {recipe.cuisineType}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {recipe.recipeName}
          </h1>
          <p className="text-sm text-gray-500">
            Created by{" "}
            <span className="font-semibold text-gray-800 dark:text-zinc-200">
              {recipe.authorName || "Anonymous Chef"}
            </span>
          </p>

          <hr className="border-gray-150 dark:border-zinc-800" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100">
              <FaClock className="text-orange-500 w-4 h-4 mx-auto mb-1" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Prep Time
              </span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white mt-1 block">
                {recipe.preparationTime} mins
              </span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100">
              <FaSignal className="text-orange-500 w-4 h-4 mx-auto mb-1" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Difficulty
              </span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white mt-1 block">
                {recipe.difficultyLevel}
              </span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100">
              <FaGlobe className="text-orange-500 w-4 h-4 mx-auto mb-1" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Cuisine
              </span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white mt-1 block truncate">
                {recipe.cuisineType}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-98 cursor-pointer ${
                  liked
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white hover:bg-red-50/50 text-gray-700 dark:bg-zinc-900 dark:text-zinc-300 border-gray-200 dark:border-zinc-800"
                }`}
              >
                <FaHeart />
                <span>{likesCount} Likes</span>
              </button>

              <button
                onClick={handleFavorite}
                className={`px-5 py-3 rounded-2xl border transition-all active:scale-98 cursor-pointer ${
                  favorited
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-200 dark:border-zinc-800 hover:bg-orange-50 text-gray-500"
                }`}
                title="Favorite"
              >
                <FaBookmark />
              </button>

              <button
                onClick={() => setIsReportOpen(true)}
                className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all cursor-pointer"
                title="Report Abuse"
              >
                <FaFlag />
              </button>
            </div>

            <div className="p-5 bg-linear-to-tr from-amber-500/10 to-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <FaCrown className="text-amber-500" /> Unlock Full Recipe
                  Access
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Buy this guide once for lifetime access to cooking
                  instructions.
                </p>
              </div>

              {purchased ? (
                <span className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1">
                  <FaCircleCheck /> Unlocked
                </span>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {purchasing ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <FaLock className="w-3 h-3" /> Buy $1.99
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-sm h-fit">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FaUtensils className="text-orange-500 text-sm" /> Ingredients
          </h3>
          <ul className="space-y-3">
            {ingredientsList.map((ingredient, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 w-4.5 h-4.5 mt-0.5 accent-orange-500"
                />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FaClock className="text-orange-500 text-sm" /> Cooking Instructions
          </h3>
          <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
      </div>

      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Report Recipe
              </h3>
              <button
                onClick={() => setIsReportOpen(false)}
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl text-sm"
                >
                  <option value="Spam">Spam</option>
                  <option value="Offensive Content">Offensive Content</option>
                  <option value="Copyright Issue">Copyright Issue</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsReportOpen(false)}
                  type="button"
                  className="flex-1 py-3 text-xs font-semibold text-gray-700 dark:text-zinc-300 border rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className="flex-1 py-3 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {reporting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
