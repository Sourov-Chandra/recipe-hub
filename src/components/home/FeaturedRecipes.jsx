import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import HomeRecipeCard from "./HomeRecipeCard";

export default function FeaturedRecipes({ recipes = [] }) {
  const featured = recipes.filter((recipe) => recipe.isFeatured).slice(0, 3);
  const list = featured.length ? featured : recipes.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Editor picks
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Featured recipes
          </h2>
          <p className="mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
            Plates our admins starred for the community. If none are featured
            yet, we show the newest dishes.
          </p>
        </div>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600"
        >
          See all <FaArrowRight />
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 px-6 py-16 text-center text-sm text-gray-500 dark:border-zinc-800">
          No recipes yet. Be the first chef to publish one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((recipe) => (
            <HomeRecipeCard
              key={recipe._id || recipe.id}
              recipe={recipe}
              featured
            />
          ))}
        </div>
      )}
    </section>
  );
}
