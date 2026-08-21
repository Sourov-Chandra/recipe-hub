"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBagShopping,
  FaClock,
  FaDollarSign,
  FaEye,
  FaReceipt,
  FaTriangleExclamation,
  FaUtensils,
} from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import { getPurchases } from "@/lib/api/purchases";

export default function MyPurchasesPage() {
  const { data: session } = useSession();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPurchases() {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        setError("");

        const data = await getPurchases(session.user.email);
        setPurchases(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your purchased recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadPurchases();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading your purchases...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Purchases
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Recipes you have unlocked for $1.99.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 dark:border-orange-950/30 dark:bg-orange-950/20 dark:text-orange-400">
          <FaBagShopping />
          {purchases.length} Purchased
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <FaTriangleExclamation className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {purchases.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-950/20">
            <FaBagShopping className="h-7 w-7" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            No purchases yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Browse premium recipes and unlock your favorite dishes for just
            $1.99.
          </p>

          <Link
            href="/recipes"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <FaUtensils />
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {purchases.map((recipe) => {
            const recipeId = recipe._id || recipe.id;

            return (
              <article
                key={recipe.paymentId || recipeId}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-48 bg-gray-100 dark:bg-zinc-800">
                  <Image
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <span className="absolute left-3 top-3 rounded-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Unlocked
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                      {recipe.recipeName}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      By {recipe.authorName || "RecipeHub Chef"} ·{" "}
                      {recipe.category || "Recipe"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <FaClock className="text-orange-500" />
                      {recipe.preparationTime || 0} mins
                    </span>

                    <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      <FaDollarSign />${(recipe.amount || 1.99).toFixed(2)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-[11px] text-gray-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaReceipt className="text-orange-500" />
                      <span className="font-semibold">Transaction:</span>
                      <span className="truncate">
                        {recipe.transactionId || "Verified payment"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/recipes/${recipeId}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    <FaEye />
                    View Recipe Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
