"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaPlus,
  FaUtensils,
  FaHouse,
  FaChartPie,
  FaUsers,
  FaUser,
  FaHeart,
  FaCreditCard,
  FaFlag,
} from "react-icons/fa6";
import Image from "next/image";

export function DashboardSidebar({
  session,
  isAdmin,
  isSideOpen,
  setIsSideOpen,
}) {
  const pathname = usePathname();

  const userLinks = [
    {
      name: "Overview",
      path: "/dashboard/user",
      icon: <FaChartPie className="w-4.5 h-4.5" />,
      exact: true,
    },
    {
      name: "My Recipes",
      path: "/dashboard/user/my-recipes",
      icon: <FaUtensils className="w-4.5 h-4.5" />,
      exact: true,
    },
    {
      name: "Add Recipe",
      path: "/dashboard/user/my-recipes/add",
      icon: <FaPlus className="w-4.5 h-4.5" />,
    },
    {
      name: "My Favorites",
      path: "/dashboard/user/my-favorites",
      icon: <FaHeart className="w-4.5 h-4.5" />,
    },
    {
      name: "My Purchased Recipes",
      path: "/dashboard/user/purchased-recipes",
      icon: <FaCreditCard className="w-4.5 h-4.5" />,
    },
    {
      name: "Profile",
      path: "/dashboard/user/profile",
      icon: <FaUser className="w-4.5 h-4.5" />,
    },
  ];

  const adminLinks = [
    {
      name: "Overview",
      path: "/dashboard/admin",
      icon: <FaChartPie className="w-4.5 h-4.5" />,
      exact: true,
    },
    {
      name: "Manage Users",
      path: "/dashboard/admin/manage-users",
      icon: <FaUsers className="w-4.5 h-4.5" />,
    },
    {
      name: "Manage Recipes",
      path: "/dashboard/admin/manage-recipes",
      icon: <FaUtensils className="w-4.5 h-4.5" />,
    },
    {
      name: "Reports",
      path: "/dashboard/admin/reports",
      icon: <FaFlag className="w-4.5 h-4.5" />,
    },
  ];

  const sideLinks = isAdmin ? adminLinks : userLinks;

  const utilityLinks = [
    {
      name: "Back to Home",
      path: "/",
      icon: <FaHouse className="w-4.5 h-4.5" />,
    },
  ];

  return (
    <aside
      className={`
        fixed md:sticky top-32 md:top-16 z-25 md:z-0
        w-64 h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]
        bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900
        flex flex-col justify-between py-6 px-4
        transition-transform duration-300 md:translate-x-0
        ${isSideOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="space-y-6">
        <div className="px-2">
          <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {isAdmin ? "Admin Dashboard" : "User Workspace"}
          </h2>
          {session?.user && (
            <div className="flex items-center gap-3 mt-3 px-2 py-2.5 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-900">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User avatar"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-orange-500/20"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-full font-bold border border-orange-500/20 text-xs">
                  {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-800 dark:text-zinc-150 truncate">
                  {session.user.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-450 truncate">
                  {isAdmin ? "Administrator" : "Creator"}
                </p>
              </div>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {sideLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.path
              : pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsSideOpen(false)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 shadow-sm shadow-orange-500/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-900/50"
                  }
                `}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <hr className="border-gray-100 dark:border-zinc-900" />
        <nav className="space-y-1">
          {utilityLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsSideOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-900/50 rounded-2xl transition-all duration-200"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-2.5 bg-orange-50/50 dark:bg-orange-950/10 rounded-2xl text-center border border-orange-500/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
            {isAdmin ? "Full Access Control" : "RecipeHub Creator"}
          </span>
        </div>
      </div>
    </aside>
  );
}
