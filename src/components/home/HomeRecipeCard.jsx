"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaClock, FaHeart, FaStar } from "react-icons/fa6";

export default function HomeRecipeCard({ recipe, featured = false }) {
  const id = recipe._id || recipe.id;
  const image =
    recipe.recipeImage ||
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <Image
          src={image}
          alt={recipe.recipeName}
          fill
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {featured && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            <FaStar className="h-3 w-3" /> Featured
          </span>
        )}

        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-orange-600 backdrop-blur dark:bg-zinc-950/80 dark:text-orange-400">
          {recipe.category || "Recipe"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-orange-500">
          {recipe.cuisineType || "Worldwide"} · {recipe.difficultyLevel || "Easy"}
        </p>
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900 transition group-hover:text-orange-500 dark:text-white">
          {recipe.recipeName}
        </h3>
        <p className="mb-5 text-xs text-gray-500 dark:text-gray-400">
          By {recipe.authorName || "Anonymous Chef"}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-sm dark:border-zinc-800">
          <div className="flex items-center gap-3 text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <FaClock className="text-orange-500" />
              {recipe.preparationTime || 0}m
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-red-500">
              <FaHeart />
              {recipe.likesCount || 0}
            </span>
          </div>
          <Link
            href={`/recipes/${id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600"
          >
            Cook
            <FaArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}