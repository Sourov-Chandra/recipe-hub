"use client";

import { useEffect, useState } from "react";
import { getRecipes } from "@/lib/api/recipes";
import Banner from "@/components/home/Banner";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import PopularRecipes from "@/components/home/PopularRecipes";
import ExtraSection from "@/components/home/ExtraSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data || []);
      } catch (err) {
        console.error("Failed to load home recipes:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-(--background)">
      <Banner />

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Plating tonight’s recipes...</p>
        </div>
      ) : (
        <>
          <FeaturedRecipes recipes={recipes} />
          <PopularRecipes recipes={recipes} />
        </>
      )}

      <ExtraSection />
      <Footer />
    </div>
  );
}