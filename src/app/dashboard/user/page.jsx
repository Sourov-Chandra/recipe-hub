"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getRecipes } from "@/lib/api/recipes";
import { getFavorites } from "@/lib/api/favorites";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaHeart,
  FaCrown,
  FaArrowRight,
  FaPlus,
  FaClock,
  FaTriangleExclamation,
} from "react-icons/fa6";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function UserOverviewPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!session?.user?.email) return;

      try {
        setLoading(true);

        const [recipeData, favoriteData] = await Promise.all([
          getRecipes({ email: session.user.email }),
          getFavorites(session.user.email),
        ]);

        setRecipes(recipeData || []);
        setFavorites(favoriteData || []);
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mb-4"
        />
        <span className="text-sm text-gray-500">Loading your dashboard...</span>
      </div>
    );
  }

  const isPremium = session?.user?.isPremium;

  const myRecipes = recipes.filter(
    (r) =>
      r.authorId === session?.user?.id ||
      r.authorEmail === session?.user?.email,
  );

  const totalLikes = myRecipes.reduce(
    (acc, curr) => acc + (curr.likesCount || 0),
    0,
  );

  const isLimitReached = !isPremium && myRecipes.length >= 2;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Welcome, {session?.user?.name || "Chef"}!</span>
            {isPremium && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 bg-amber-500 text-white text-[10px] uppercase font-bold py-1 px-2.5 rounded-full shadow-sm"
              >
                <FaCrown className="w-3 h-3" /> Premium
              </motion.span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your recipes, see statistics, and interact with the RecipeHub
            community.
          </p>
        </div>

        {isLimitReached ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/plans"
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-md transition-colors"
            >
              <FaCrown className="w-4 h-4" /> Upgrade to Add Recipe
            </Link>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/dashboard/user/my-recipes/add"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-md transition-colors"
            >
              <FaPlus className="w-4 h-4" /> Add Recipe
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Banner / Notice Section */}
      <AnimatePresence>
        {!isPremium && (
          <motion.div variants={itemVariants} className="space-y-4">
            {isLimitReached && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-2xl flex items-start gap-3 text-sm"
              >
                <FaTriangleExclamation className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Recipe Limit Reached:</span> You
                  have published 2/2 recipes. Free accounts are limited to a
                  maximum of 2 published recipes. Please upgrade to Premium or
                  delete an existing recipe to publish more.
                </div>
              </motion.div>
            )}

            <div className="p-6 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FaCrown /> Upgrade to RecipeHub Premium
                </h3>
                <p className="text-sm opacity-90 max-w-xl">
                  Unlock unlimited recipe slots, post purchase-locked content,
                  and receive support from the community.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/plans"
                  className="bg-white text-orange-600 font-bold text-sm px-6 py-3 rounded-2xl shadow-md hover:bg-orange-50 transition-colors inline-block whitespace-nowrap"
                >
                  Upgrade Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl flex items-center justify-between shadow-sm"
        >
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Total Recipes
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
              {isPremium ? myRecipes.length : `${myRecipes.length} / 2`}
            </h3>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
              {isPremium
                ? "Unlimited slots available"
                : `${2 - myRecipes.length} slot(s) remaining`}
            </span>
          </div>
          <div className="p-3.5 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-950/30 text-orange-500 rounded-2xl">
            <FaUtensils className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl flex items-center justify-between shadow-sm"
        >
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Total Likes
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
              {totalLikes}
            </h3>
            <span className="text-[10px] text-gray-400 mt-1 block">
              Accumulated likes across all recipes
            </span>
          </div>
          <div className="p-3.5 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 text-red-500 rounded-2xl">
            <FaHeart className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl flex items-center justify-between shadow-sm"
        >
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Favorites Added
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
              {favorites.length}
            </h3>
            <span className="text-[10px] text-gray-400 mt-1 block">
              Recipes saved to your bookmarks
            </span>
          </div>
          <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950/30 text-blue-500 rounded-2xl">
            <FaHeart className="w-5 h-5" />
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Recipes Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            My Recent Recipes
          </h3>
          <Link
            href="/dashboard/user/my-recipes"
            className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:text-orange-600 transition-colors group"
          >
            See All
            <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {myRecipes.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            You haven&apos;t added any recipes yet. Click &quot;Add Recipe&quot;
            above to share your first!
          </div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {myRecipes.slice(0, 4).map((recipe) => (
              <motion.div
                key={recipe._id || recipe.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-4 p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 transition-shadow hover:shadow-xs"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800 shrink-0">
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
                  <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1 items-center">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-orange-500 w-3 h-3" />{" "}
                      {recipe.preparationTime} mins
                    </span>
                    <span>•</span>
                    <span>{recipe.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-zinc-300 bg-red-50/50 dark:bg-red-950/10 px-2.5 py-1.5 rounded-xl border border-red-100/50 dark:border-red-950/30">
                  <FaHeart className="text-red-500 w-3.5 h-3.5" />
                  <span>{recipe.likesCount || 0}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
