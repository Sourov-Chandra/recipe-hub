"use client";

import { useEffect, useState } from "react";
import { FaCreditCard, FaTriangleExclamation } from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import { getAdminTransactions } from "@/lib/api/admin";

export default function AdminTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    async function loadTransactions() {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminTransactions();
        setTransactions(data || []);
      } catch (err) {
        setError(err.message || "Could not load transactions.");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [session?.user?.role]);

  const totalRevenue = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <FaCreditCard className="text-orange-500" />
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Recipe unlocks and membership payments recorded after Stripe
            verification.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 dark:border-emerald-950/30 dark:bg-emerald-950/20">
          Total: ${totalRevenue.toFixed(2)}
        </div>
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
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {transactions.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 text-sm">{payment.userEmail}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                      {payment.recipeId ? "Recipe Unlock" : "Premium"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    ${Number(payment.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                      {payment.paymentStatus || "unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="max-w-45 truncate px-6 py-4 text-xs text-gray-400">
                    {payment.transactionId}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No transactions found.
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
