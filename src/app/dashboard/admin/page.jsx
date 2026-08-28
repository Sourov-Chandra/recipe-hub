"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { serverFetch } from "@/lib/core/server";
import Link from "next/link";
import {
  FaUsers,
  FaUtensils,
  FaFlag,
  FaCreditCard,
  FaArrowRight,
} from "react-icons/fa6";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    activeReports: 0,
    totalRevenue: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/login");
      } else if (session.user?.role !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    async function loadStats() {
      try {
        setStatsLoading(true);
        setStatsError("");

        const [users, recipes, reports, transactions] = await Promise.all([
          serverFetch("/admin/users"),
          serverFetch("/admin/recipes"),
          serverFetch("/admin/reports"),
          serverFetch("/admin/transactions"),
        ]);

        setStats({
          totalUsers: users.length,
          totalRecipes: recipes.length,
          activeReports: reports.filter((report) => report.status === "pending")
            .length,
          totalRevenue: transactions.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0,
          ),
        });
      } catch (err) {
        console.error(err);
        setStatsError(err.message || "Could not load dashboard statistics.");
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, [session?.user?.role]);

  if (isPending || !session || session.user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          className="rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
        <span className="text-sm text-gray-500">Checking permissions...</span>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Registered Users",
      value: statsLoading ? "—" : stats.totalUsers,
      icon: <FaUsers className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-950/30",
    },
    {
      label: "Recipes Submitted",
      value: statsLoading ? "—" : stats.totalRecipes,
      icon: <FaUtensils className="w-5 h-5 text-orange-500" />,
      bg: "bg-orange-50/50 dark:bg-orange-950/10 border-orange-100 dark:border-orange-950/30",
    },
    {
      label: "Active Flagged Reports",
      value: statsLoading ? "—" : stats.activeReports,
      icon: <FaFlag className="w-5 h-5 text-red-500" />,
      bg: "bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-950/30",
    },
    {
      label: "Total Premium Revenue",
      value: statsLoading ? "—" : `$${stats.totalRevenue.toFixed(2)}`,
      icon: <FaCreditCard className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950/30",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      desc: "Promote, restrict, and oversee registered site members.",
      link: "/dashboard/admin/users",
      btnColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Moderate Recipes",
      desc: "Approve user-submitted recipes or feature top culinary guides.",
      link: "/dashboard/admin/recipes",
      btnColor: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Review Flagged Reports",
      desc: "Investigate and resolve reports filed against recipes.",
      link: "/dashboard/admin/reports",
      btnColor: "bg-red-500 hover:bg-red-600",
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {session.user.name}. Here is what&apos;s happening on
          RecipeHub.
        </p>
      </div>

      <AnimatePresence>
        {statsError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
          >
            {statsError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            whileHover={{ y: -3 }}
            className="p-6 border rounded-3xl flex items-center justify-between bg-white dark:bg-zinc-900 border-gray-150 dark:border-zinc-800 shadow-sm"
          >
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {card.label}
              </p>
              <motion.h3
                key={card.value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2"
              >
                {card.value}
              </motion.h3>
            </div>
            <div className={`p-3.5 rounded-2xl border ${card.bg}`}>
              {card.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.08 }}
            className="p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-450 leading-relaxed mb-6">
                {action.desc}
              </p>
            </div>
            <Link href={action.link} className="w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 px-4 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors ${action.btnColor}`}
              >
                <span>Manage</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
