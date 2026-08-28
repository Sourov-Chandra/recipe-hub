import HomeRecipeCard from "./HomeRecipeCard";

export default function PopularRecipes({ recipes = [] }) {
  const popular = [...recipes]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 6);

  return (
    <section className="bg-orange-50/50 py-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Trending now
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Most loved recipes
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sorted by likes from the RecipeHub kitchen.
          </p>
        </div>

        {popular.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500 dark:border-zinc-800 dark:bg-zinc-900">
            Popular recipes will appear here after the first likes come in.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popular.map((recipe) => (
              <HomeRecipeCard key={recipe._id || recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
