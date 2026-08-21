"use client";

import React, { useState, useEffect } from "react";
import { getRecipes } from "@/lib/api/recipes";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUtensils, FaArrowRight, FaHeart } from "react-icons/fa6"; 

export default function SimpleBrowseRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data || []);
      } catch (err) {
        console.error("Error loading recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
        <span>Loading recipes...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">
        Browse <span className="text-orange-500">Recipes</span>
      </h1>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl text-gray-500">
          No recipes found in the database. Try adding one from the dashboard!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id || recipe.id}
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300"
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
                    href={`/recipes/${recipe._id}`}
                    className="text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600 transition-colors"
                  >
                    View Details{" "}
                    <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
