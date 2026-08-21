"use client";

import { useTheme } from "@/context/themeContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FaUtensils, 
  FaMoon, 
  FaSun, 
  FaBars, 
  FaXmark,
  FaChartPie,
  FaRightFromBracket
} from "react-icons/fa6";
import { useSession, signOut } from "@/lib/auth-client";
import { TbSunHighFilled } from "react-icons/tb";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse Recipes", path: "/recipes" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          <FaUtensils
            className="text-orange-500 text-xl animate-bounce"
            style={{ animationDuration: "3s" }}
          />
          <span>
            <span className="text-orange-500">Recipe</span>
            <span className="text-gray-900 dark:text-white">Hub</span>
          </span>
        </Link>

        {/* Desktop Links */}
        {/* <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? pathname === "/"
                : pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-orange-500 font-semibold"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav> */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? pathname === "/"
                : pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-orange-500 font-semibold"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
                )}
              </Link>
            );
          })}
          {session && (
            <Link
              href="/dashboard"
              className={`relative py-1 text-sm font-medium transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Dashboard
              {pathname.startsWith("/dashboard") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {/* Dark Mode Icon Button*/}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle Theme"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <TbSunHighFilled className="w-4 h-4 text-amber-500" />
            ) : (
              <FaMoon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center gap-5">
            {isPending ? (
              <div className="h-8 w-24 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />
            ) : session ? (
              <div className="relative">
                {/* Profile Toggle Button */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
                >
                  {session.user.image ? (
                    /*  <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-orange-500/80 shadow-sm"
                    /> */
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User avatar"}
                      width={36}
                      height={36}
                      unoptimized
                      className="w-9 h-9 rounded-full object-cover border-2 border-orange-500/80 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 flex items-center justify-center bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold border border-orange-500/20 shadow-sm">
                      {session.user.name
                        ? session.user.name[0].toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 hidden sm:inline-block">
                    {session.user.name}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-3.5 w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl py-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800/80 mb-2">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-gray-800 dark:text-zinc-150 truncate mt-0.5">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-450 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      {/* <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-gray-50 dark:text-zinc-300 dark:hover:text-orange-400 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <FaChartPie className="w-4 h-4 text-orange-500" />
                        <span>Dashboard</span>
                      </Link> */}

                      <hr className="border-gray-100 dark:border-zinc-800/80 my-1.5" />

                      <button
                        onClick={async () => {
                          setIsProfileOpen(false);
                          try {
                            await signOut();
                            router.push("/login");
                          } catch (error) {
                            console.error("Sign out error", error);
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors text-left cursor-pointer"
                      >
                        <FaRightFromBracket className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-800 hover:text-black dark:text-zinc-300 dark:hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-2xl transition-colors shadow-sm shadow-orange-500/10 active:scale-98"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            aria-label="Toggle Menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            {isMenuOpen ? (
              <FaXmark className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu*/}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-6 py-4 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium py-1 transition-colors ${
                    isActive
                      ? "text-orange-500 font-semibold"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <hr className="border-gray-100 dark:border-zinc-900" />

          <div className="flex flex-col space-y-3 pt-2">
            {isPending ? (
              <div className="h-10 w-full bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />
            ) : session ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User avatar"}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-10 h-10 rounded-full object-cover border border-orange-500"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold border border-orange-500/20">
                      {session.user.name
                        ? session.user.name[0].toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {session.user.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.user.email}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-sm font-semibold py-2.5 rounded-2xl text-center transition-colors cursor-pointer"
                >
                  <FaChartPie className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={async () => {
                    try {
                      await signOut();
                      setIsMenuOpen(false);
                      router.push("/login");
                    } catch (error) {
                      console.error("Sign out error", error);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-semibold py-2.5 rounded-2xl text-center transition-colors cursor-pointer"
                >
                  <FaRightFromBracket className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-800 hover:text-black dark:text-zinc-300 dark:hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-2xl text-center transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
