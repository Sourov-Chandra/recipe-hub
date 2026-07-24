"use client";

import { useTheme } from "@/context/themeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaUtensils, FaMoon, FaSun, FaBars, FaXmark } from "react-icons/fa6";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse Recipes", path: "/recipes" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 dark:bg-zinc-950 dark:border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <FaUtensils className="text-orange-500 text-xl" />
          <span>
            <span className="text-orange-500">Recipe</span>
            <span className="text-gray-900 dark:text-white">Hub</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
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
        </nav>

        <div className="flex items-center gap-4">
          {/* Dark Mode Icon Button*/}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle Theme"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {theme === "dark" ? (
              <FaSun className="w-4 h-4" />
            ) : (
              <FaMoon className="w-4 h-4" />
            )}
          </button>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/login"
              className="text-gray-800 hover:text-black dark:text-zinc-300 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-2xl transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            aria-label="Toggle Menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors"
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
              const isActive = pathname === link.path;
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
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-2xl text-center transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
