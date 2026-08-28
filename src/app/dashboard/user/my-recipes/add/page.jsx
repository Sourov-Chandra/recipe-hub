"use client";

import React, { useState } from "react";
import { addRecipe } from "@/lib/api/recipes";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export default function AddRecipePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    recipeName: "",
    category: "Breakfast",
    cuisineType: "",
    difficultyLevel: "Easy",
    preparationTime: "",
    ingredients: "",
    instructions: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const imgData = new FormData();
    imgData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgData,
      },
    );

    if (!response.ok) throw new Error("Failed to upload image.");
    const result = await response.json();
    return result.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!imageFile) {
      setError("Please select a recipe image.");
      setLoading(false);
      return;
    }

    try {
      const recipeImageUrl = await uploadImageToImgBB(imageFile);

      await addRecipe({
        ...formData,
        recipeImage: recipeImageUrl,
        authorId: session?.user?.id || "anonymous",
        authorName: session?.user?.name || "Anonymous User",
        authorEmail: session?.user?.email || "anonymous@recipehub.com",
      });

      setSuccess("Recipe added successfully!");
      setFormData({
        recipeName: "",
        category: "Breakfast",
        cuisineType: "",
        difficultyLevel: "Easy",
        preparationTime: "",
        ingredients: "",
        instructions: "",
      });
      setImageFile(null);

      setTimeout(() => {
        router.push("/recipes");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Add New Recipe
      </h2>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm overflow-hidden"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 p-4 bg-green-50 text-green-600 rounded-2xl text-sm overflow-hidden"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fieldVariants}>
          <label className="block text-sm font-semibold mb-1">
            Recipe Name
          </label>
          <input
            type="text"
            name="recipeName"
            value={formData.recipeName}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-50 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <label className="block text-sm font-semibold mb-1">
            Recipe Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            className="w-full p-3 bg-gray-50 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
          />
        </motion.div>

        <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Dessert</option>
              <option>Salad</option>
              <option>Beverage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Cuisine Type
            </label>
            <input
              type="text"
              name="cuisineType"
              placeholder="e.g. Italian, Thai"
              value={formData.cuisineType}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
        </motion.div>

        <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Difficulty Level
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Preparation Time (minutes)
            </label>
            <input
              type="number"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
        </motion.div>

        <motion.div variants={fieldVariants}>
          <label className="block text-sm font-semibold mb-1">
            Ingredients (comma separated)
          </label>
          <textarea
            name="ingredients"
            placeholder="e.g. 200g Pasta, 2 Eggs, Salt"
            value={formData.ingredients}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-50 border rounded-2xl h-24 dark:bg-zinc-800 dark:border-zinc-700"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <label className="block text-sm font-semibold mb-1">
            Instructions
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-50 border rounded-2xl h-32 dark:bg-zinc-800 dark:border-zinc-700"
          />
        </motion.div>

        <motion.button
          variants={fieldVariants}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-all disabled:opacity-50"
        >
          {loading ? "Adding Recipe..." : "Add Recipe"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
