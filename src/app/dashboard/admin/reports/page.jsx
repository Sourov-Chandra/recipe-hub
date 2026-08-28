"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
        <motion.div
          className="h-9 w-9 rounded-full border-2 border-orange-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <FaFlag className="text-orange-500" />
          Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review flagged recipes, dismiss false reports, or remove the recipe.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-3 overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <FaTriangleExclamation className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

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
              <AnimatePresence initial={false}>
                {reports.map((report, index) => {
                  const busy = workingId === report._id;
                  const recipe = report.recipe;

                  return (
                    <motion.tr
                      key={report._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                    >
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
                        <motion.span
                          key={report.status}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${
                            report.status === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {report.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {report.status === "pending" && (
                            <motion.button
                              type="button"
                              disabled={busy}
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.03 }}
                              onClick={() => handleDismiss(report)}
                              className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                            >
                              <FaXmark /> Dismiss
                            </motion.button>
                          )}
                          {recipe && (
                            <motion.button
                              type="button"
                              disabled={busy}
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.03 }}
                              onClick={() => handleRemoveRecipe(report)}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                            >
                              <FaTrash /> Remove Recipe
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>

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
    </motion.div>
  );
}
