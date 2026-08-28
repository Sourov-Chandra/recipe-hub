"use client";

import React, { useState, useEffect } from "react";
import { getRecipes } from "@/lib/api/recipes";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaClock,
  FaArrowRight,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaRotateLeft,
} from "react-icons/fa6";

const AVAILABLE_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Drinks",
  "Vegan",
];

export default function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const limit = 6; // 6 recipes per page

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await getRecipes({
          page,
          limit,
          category: selectedCategories,
        });

        // Backend returns paginated object { recipes, total, page, totalPages } when page/limit is provided
        setRecipes(data.recipes || []);
        setTotalPages(data.totalPages || 1);
        setTotalRecipes(data.total || 0);
      } catch (err) {
        console.error("Error loading recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [page, selectedCategories]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      return next;
    });
    setPage(1); // Reset to page 1 on filter changes
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Browse All <span className="text-orange-500">Recipes</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Discover community recipes or filter down to your favorites.
          </p>
        </div>

        <AnimatePresence>
          {selectedCategories.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-orange-500 transition-colors border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 bg-white dark:bg-zinc-900 cursor-pointer"
            >
              <FaRotateLeft /> Clear Filters
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <FaFilter className="text-orange-500 w-4 h-4" /> Filter by
              Category
            </h2>
            <div className="space-y-3.5">
              {AVAILABLE_CATEGORIES.map((category) => {
                const isChecked = selectedCategories.includes(category);
                return (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 w-4.5 h-4.5 accent-orange-500 cursor-pointer transition-all"
                    />
                    <span
                      className={
                        isChecked ? "font-semibold text-orange-500" : ""
                      }
                    >
                      {category}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500">
              <motion.div
                className="rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              <span>Loading recipes...</span>
            </div>
          ) : recipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl text-gray-500"
            >
              No recipes found matching the selected filters.
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${page}-${selectedCategories.join(",")}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {recipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id || recipe.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group flex flex-col bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                        <Image
                          src={
                            recipe.recipeImage ||
                            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800"
                          }
                          alt={recipe.recipeName}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-103"
                          unoptimized
                        />
                        {recipe.isFeatured && (
                          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex gap-2 text-xs text-orange-500 font-semibold mb-2">
                          <span>{recipe.category}</span>
                          <span>•</span>
                          <span>{recipe.difficultyLevel}</span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-orange-500 transition-colors">
                          {recipe.recipeName}
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                          By{" "}
                          <span className="font-medium text-gray-700 dark:text-zinc-300">
                            {recipe.authorName || "Anonymous User"}
                          </span>
                        </p>

                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800/80 text-sm text-gray-500 dark:text-zinc-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <FaClock className="text-orange-500" />{" "}
                              {recipe.preparationTime} mins
                            </span>
                            <span className="flex items-center gap-1.5 text-red-500 font-semibold">
                              <FaHeart /> {recipe.likesCount || 0}
                            </span>
                          </div>
                          <Link
                            href={`/recipes/${recipe._id || recipe.id}`}
                            className="text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600 transition-colors"
                          >
                            View Details{" "}
                            <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 dark:border-zinc-800/80 pt-6 gap-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Showing <span className="font-bold">{recipes.length}</span>{" "}
                    of <span className="font-bold">{totalRecipes}</span> recipes
                  </span>

                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:hover:text-inherit disabled:hover:border-gray-200 dark:disabled:hover:border-zinc-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <FaChevronLeft className="w-3.5 h-3.5" />
                    </motion.button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => {
                        const isActive = p === page;
                        return (
                          <motion.button
                            key={p}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              isActive
                                ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                                : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:border-orange-500 hover:text-orange-500"
                            }`}
                          >
                            {p}
                          </motion.button>
                        );
                      },
                    )}

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:hover:text-inherit disabled:hover:border-gray-200 dark:disabled:hover:border-zinc-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <FaChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
