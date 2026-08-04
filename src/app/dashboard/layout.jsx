"use client";

import React, { useState } from "react";
import { FaChartPie, FaBars, FaXmark } from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardShellLayout({ children }) {
  const [isSideOpen, setIsSideOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <header className="md:hidden w-full bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-16 z-30">
        <span className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <FaChartPie className="text-orange-500 text-lg" />
          <span>{isAdmin ? "Admin Menu" : "Dashboard Menu"}</span>
        </span>
        <button
          onClick={() => setIsSideOpen(!isSideOpen)}
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-gray-700 dark:text-zinc-300"
        >
          {isSideOpen ? (
            <FaXmark className="w-4 h-4" />
          ) : (
            <FaBars className="w-4 h-4" />
          )}
        </button>
      </header>

      <DashboardSidebar
        session={session}
        isAdmin={isAdmin}
        isSideOpen={isSideOpen}
        setIsSideOpen={setIsSideOpen}
      />
      <main className="flex-1 min-w-0 p-6 md:p-10 z-10">{children}</main>
    </div>
  );
}
