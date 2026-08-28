"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaEye,
  FaClock,
  FaTrash,
  FaTriangleExclamation,
  FaUtensils,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { getFavorites, toggleFavorite } from "@/lib/api/favorites";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function MyFavoritesPage() {
  const { data: session } = useSession();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        setError("");

        const data = await getFavorites(session.user.email);
        setFavorites(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your favorite recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [session?.user?.email]);

  async function handleRemoveFavorite(recipeId) {
    if (!session?.user?.email) return;

    try {
      setRemovingId(recipeId);

      await toggleFavorite({
        userEmail: session.user.email,
        userId: session.user.id,
        recipeId,
      });

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (recipe) => (recipe._id || recipe.id) !== recipeId,
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Could not remove this recipe from favorites.");
    } finally {
      setRemovingId("");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading your favorites...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Favorites
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Keep track of recipes you want to cook again.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 overflow-hidden"
          >
            <FaTriangleExclamation className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/20">
            <FaHeart className="h-7 w-7" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            No favorite recipes yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Explore recipes and tap the heart button to save recipes here.
          </p>

          <Link
            href="/recipes"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <FaUtensils />
            Browse Recipes
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {favorites.map((recipe) => {
              const recipeId = recipe._id || recipe.id;
              const isRemoving = removingId === recipeId;

              return (
                <motion.article
                  key={recipeId}
                  variants={cardVariants}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  layout
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative h-48 bg-gray-100 dark:bg-zinc-800">
                    <Image
                      src={recipe.recipeImage}
                      alt={recipe.recipeName}
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    <span className="absolute left-3 top-3 rounded-xl bg-white/90 px-3 py-1 text-xs font-bold text-orange-600 shadow-sm backdrop-blur dark:bg-zinc-900/90 dark:text-orange-400">
                      {recipe.category || "Recipe"}
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                        {recipe.recipeName}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        By {recipe.authorName || "RecipeHub Chef"} ·{" "}
                        {recipe.cuisineType || "General cuisine"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-orange-500" />
                        {recipe.preparationTime || 0} mins
                      </span>

                      <span className="flex items-center gap-1.5 font-semibold text-red-500">
                        <FaHeart />
                        {recipe.likesCount || 0}
                      </span>
                    </div>

                    <div className="flex gap-3 border-t border-gray-100 pt-4 dark:border-zinc-800">
                      <Link
                        href={`/recipes/${recipeId}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-600 transition hover:bg-orange-100 dark:bg-orange-950/20 dark:text-orange-400"
                      >
                        <FaEye />
                        View Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(recipeId)}
                        disabled={isRemoving}
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-950/20 dark:text-red-400"
                      >
                        {isRemoving ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <FaTrash />
                        )}
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
