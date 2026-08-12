"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getRecipes, deleteRecipe } from "@/lib/api/recipes";
import Link from "next/link";
import Image from "next/image";
import {
  FaUtensils,
  FaHeart,
  FaCrown,
  FaPlus,
  FaClock,
  FaTrash,
  FaEye,
  FaTriangleExclamation,
  FaXmark
} from "react-icons/fa6";

export default function MyRecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadMyRecipes() {
    if (!session?.user?.email) return;
    try {
      setLoading(true);
      const data = await getRecipes({ email: session.user.email });
      setRecipes(data || []);
    } catch (err) {
      console.error("Failed to load recipes:", err);
      setError("Failed to fetch your recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!session?.user?.email) return;

    async function fetchMyRecipes() {
      try {
        setLoading(true);

        const data = await getRecipes({
          email: session.user.email,
        });

        setRecipes(data || []);
      } catch (err) {
        console.error("Failed to load recipes:", err);
        setError("Failed to fetch your recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyRecipes();
  }, [session?.user?.email]);

  const handleDeleteClick = (recipe) => {
    setDeleteTarget(recipe);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const id = deleteTarget._id || deleteTarget.id;
      await deleteRecipe(id);
      setRecipes(recipes.filter((r) => (r._id || r.id) !== id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      alert(err.message || "Could not delete recipe. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const isPremium = session?.user?.isPremium;
  const isLimitReached = !isPremium && recipes.length >= 2;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading your culinary creations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            My Recipes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your published recipes, track their performance, or share a new one.
          </p>
        </div>

        {isLimitReached ? (
          <Link
            href="/plans"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-98"
            id="upgrade-button-header"
          >
            <FaCrown className="w-4 h-4 animate-bounce" /> Upgrade to Add Recipe
          </Link>
        ) : (
          <Link
            href="/dashboard/user/my-recipes/add"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-98"
            id="add-recipe-button-header"
          >
            <FaPlus className="w-4 h-4" /> Add Recipe
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-55 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-2xl flex items-start gap-3 text-sm">
          <FaTriangleExclamation className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {!isPremium && (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 text-orange-500 rounded-2xl">
              <FaUtensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Recipe Creation Slots: <span className="text-orange-500">{recipes.length} / 2</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-455 mt-1 max-w-lg">
                As a free tier chef, you can publish up to 2 recipes. Delete an existing recipe to publish a new one, or upgrade for unlimited slots.
              </p>
            </div>
          </div>
          <Link
            href="/plans"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-sm"
          >
            Unlock Unlimited Slots
          </Link>
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-sm">
          <div className="max-w-sm mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-gray-600 rounded-2xl flex items-center justify-center mb-4">
              <FaUtensils className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Recipes Published</h3>
            <p className="text-xs text-gray-500 dark:text-gray-450 mb-6">
              You haven&apos;t added any recipes to the hub yet. Create one now to share with the community!
            </p>
            <Link
              href="/dashboard/user/my-recipes/add"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" /> Share Your First Recipe
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 text-[11px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest bg-gray-55/50 dark:bg-zinc-900/50">
                  <th className="px-6 py-4.5">Recipe Info</th>
                  <th className="px-6 py-4.5">Category</th>
                  <th className="px-6 py-4.5">Difficulty</th>
                  <th className="px-6 py-4.5">Prep Time</th>
                  <th className="px-6 py-4.5 text-center">Likes</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {recipes.map((recipe) => (
                  <tr
                    key={recipe._id || recipe.id}
                    className="hover:bg-gray-50/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                          <Image
                            src={recipe.recipeImage}
                            alt={recipe.recipeName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                            {recipe.recipeName}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Cuisine: {recipe.cuisineType || "General"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-650 bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300 px-2.5 py-1.5 rounded-xl border border-gray-200/20">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-700 dark:text-zinc-300">
                        {recipe.difficultyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <FaClock className="text-orange-500 w-3 h-3" /> {recipe.preparationTime} mins
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 dark:bg-red-950/10 px-2.5 py-1.5 rounded-xl border border-red-100/50 dark:border-red-950/20">
                        <FaHeart className="w-3 h-3" /> {recipe.likesCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/recipes/${recipe._id || recipe.id}`}
                          className="p-2 text-gray-400 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 dark:bg-zinc-800 dark:hover:bg-orange-950/20 rounded-xl border border-gray-100 dark:border-zinc-800 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(recipe)}
                          type="button"
                          className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-zinc-800 dark:hover:bg-red-950/20 rounded-xl border border-gray-100 dark:border-zinc-800 transition-colors"
                          title="Delete Recipe"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-100 dark:divide-zinc-800">
            {recipes.map((recipe) => (
              <div key={recipe._id || recipe.id} className="p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                    <Image
                      src={recipe.recipeImage}
                      alt={recipe.recipeName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {recipe.recipeName}
                    </h4>
                    <div className="flex gap-2 items-center text-[10px] text-gray-550 dark:text-gray-400 mt-1">
                      <span className="font-semibold text-orange-500">{recipe.category}</span>
                      <span>•</span>
                      <span>{recipe.difficultyLevel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-gray-50/55 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800/80">
                  <div className="flex gap-3">
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <FaClock className="text-orange-500" /> {recipe.preparationTime}m
                    </span>
                    <span className="text-[11px] text-red-500 font-bold flex items-center gap-1">
                      <FaHeart /> {recipe.likesCount || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/recipes/${recipe._id || recipe.id}`}
                      className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-white hover:text-orange-500 dark:bg-zinc-800 dark:text-zinc-300 rounded-lg border border-gray-150 dark:border-zinc-750 flex items-center gap-1 transition-colors"
                    >
                      <FaEye className="w-3 h-3" /> View
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(recipe)}
                      type="button"
                      className="px-2.5 py-1.5 text-xs font-semibold text-red-650 bg-white hover:bg-red-50 dark:bg-zinc-800 dark:text-red-400 rounded-lg border border-gray-150 dark:border-zinc-750 flex items-center gap-1 transition-colors"
                    >
                      <FaTrash className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30 text-red-500 rounded-2xl">
                <FaTrash className="w-5 h-5 animate-pulse" />
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-55 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-750 rounded-xl transition-colors"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Recipe</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Are you absolutely sure you want to delete <span className="font-bold text-gray-700 dark:text-zinc-200">&quot;{deleteTarget.recipeName}&quot;</span>? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                type="button"
                className="flex-1 py-3 text-xs font-semibold text-gray-700 dark:text-zinc-300 border border-gray-205 dark:border-zinc-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-850 active:scale-98 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                type="button"
                className="flex-1 py-3 text-xs font-semibold text-white bg-red-550 hover:bg-red-600 active:scale-98 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Delete Recipe"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}