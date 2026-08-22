"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaFlag,
  FaTrash,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import {
  deleteReportedRecipe,
  dismissAdminReport,
  getAdminReports,
} from "@/lib/api/admin";

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    async function loadReports() {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminReports();
        setReports(data || []);
      } catch (err) {
        setError(err.message || "Could not load reports.");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [session?.user?.role]);

  async function handleDismiss(report) {
    setWorkingId(report._id);
    try {
      await dismissAdminReport(report._id);
      setReports((current) =>
        current.map((item) =>
          item._id === report._id ? { ...item, status: "dismissed" } : item,
        ),
      );
    } catch (err) {
      alert(err.message || "Could not dismiss report.");
    } finally {
      setWorkingId("");
    }
  }

  async function handleRemoveRecipe(report) {
    const confirmed = window.confirm(
      "This will delete the reported recipe and all reports against it.",
    );
    if (!confirmed) return;

    setWorkingId(report._id);
    try {
      await deleteReportedRecipe(report._id);
      setReports((current) =>
        current.filter((item) => item.recipeId !== report.recipeId),
      );
    } catch (err) {
      alert(err.message || "Could not remove reported recipe.");
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
          <FaFlag className="text-orange-500" />
          Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review flagged recipes, dismiss false reports, or remove the recipe.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {reports.map((report) => {
                const busy = workingId === report._id;
                const recipe = report.recipe;

                return (
                  <tr key={report._id}>
                    <td className="px-6 py-4">
                      {recipe ? (
                        <Link
                          href={`/recipes/${report.recipeId}`}
                          className="font-semibold text-gray-900 hover:text-orange-500 dark:text-white"
                        >
                          {recipe.recipeName}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Recipe removed
                        </span>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {report.reporterEmail}
                    </td>
                    <td className="px-6 py-4 text-sm">{report.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                          report.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {report.status === "pending" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDismiss(report)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            <FaXmark /> Dismiss
                          </button>
                        )}
                        {recipe && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleRemoveRecipe(report)}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            <FaTrash /> Remove Recipe
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {reports.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
