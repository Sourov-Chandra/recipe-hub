"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaClock, FaHeart, FaStar } from "react-icons/fa6";

export default function HomeRecipeCard({ recipe, featured = false }) {
  const id = recipe._id || recipe.id;
  const image =
    recipe.recipeImage ||
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Image
            src={image}
            alt={recipe.recipeName}
            fill
            unoptimized
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {featured && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
          >
            <FaStar className="h-3 w-3" /> Featured
          </motion.span>
        )}

        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-orange-600 backdrop-blur dark:bg-zinc-950/80 dark:text-orange-400">
          {recipe.category || "Recipe"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-orange-500">
          {recipe.cuisineType || "Worldwide"} ·{" "}
          {recipe.difficultyLevel || "Easy"}
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
            <motion.span
              whileTap={{ scale: 1.3 }}
              className="inline-flex items-center gap-1.5 font-semibold text-red-500"
            >
              <FaHeart />
              {recipe.likesCount || 0}
            </motion.span>
          </div>
          <Link
            href={`/recipes/${id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600"
          >
            Cook
            <motion.span
              className="inline-flex"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <FaArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
