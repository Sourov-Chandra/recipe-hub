"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaEye,
  FaStar,
  FaTrash,
  FaTriangleExclamation,
  FaUtensils,
  FaXmark,
} from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import {
  deleteAdminRecipe,
  featureAdminRecipe,
  getAdminRecipes,
  updateAdminRecipe,
} from "@/lib/api/admin";

export default function AdminRecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [workingId, setWorkingId] = useState("");

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    async function loadRecipes() {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminRecipes();
        setRecipes(data || []);
      } catch (err) {
        setError(err.message || "Could not load recipes.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, [session?.user?.role]);

  async function handleFeature(recipe) {
    const id = recipe._id;
    setWorkingId(id);
    try {
      await featureAdminRecipe(id, !recipe.isFeatured);
      setRecipes((current) =>
        current.map((item) =>
          item._id === id ? { ...item, isFeatured: !item.isFeatured } : item,
        ),
      );
    } catch (err) {
      alert(err.message || "Could not update featured status.");
    } finally {
      setWorkingId("");
    }
  }

  async function handleStatus(recipe, status) {
    const id = recipe._id;
    setWorkingId(id);
    try {
      await updateAdminRecipe(id, { status });
      setRecipes((current) =>
        current.map((item) => (item._id === id ? { ...item, status } : item)),
      );
    } catch (err) {
      alert(err.message || "Could not update recipe status.");
    } finally {
      setWorkingId("");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    setWorkingId(id);
    try {
      await deleteAdminRecipe(id);
      setRecipes((current) => current.filter((item) => item._id !== id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || "Could not delete recipe.");
    } finally {
      setWorkingId("");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <FaUtensils className="text-orange-500" />
          Manage Recipes
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Feature, approve, or remove recipes submitted by users.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <FaTriangleExclamation className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">Recipe</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {recipes.map((recipe) => {
                const id = recipe._id;
                const busy = workingId === id;

                return (
                  <tr key={id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
                          <Image
                            src={recipe.recipeImage}
                            alt={recipe.recipeName}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {recipe.recipeName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {recipe.category} · {recipe.cuisineType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800 dark:text-zinc-200">
                        {recipe.authorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {recipe.authorEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={recipe.status || "approved"}
                        disabled={busy}
                        onChange={(e) => handleStatus(recipe, e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                          recipe.isFeatured
                            ? "bg-amber-50 text-amber-600"
                            : "bg-gray-100 text-gray-500 dark:bg-zinc-800"
                        }`}
                      >
                        {recipe.isFeatured ? "Featured" : "Normal"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/recipes/${id}`}
                          className="rounded-xl border border-gray-100 p-2 text-gray-400 hover:text-orange-500 dark:border-zinc-800"
                        >
                          <FaEye />
                        </Link>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleFeature(recipe)}
                          className="rounded-xl border border-gray-100 p-2 text-gray-400 hover:text-amber-500 disabled:opacity-50 dark:border-zinc-800"
                          title="Toggle featured"
                        >
                          <FaStar />
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setDeleteTarget(recipe)}
                          className="rounded-xl border border-gray-100 p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 dark:border-zinc-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {recipes.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No recipes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">Delete Recipe</h3>
              <button type="button" onClick={() => setDeleteTarget(null)}>
                <FaXmark />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Delete &quot;{deleteTarget.recipeName}&quot; permanently?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-2xl border py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
