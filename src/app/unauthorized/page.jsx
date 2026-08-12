"use client";

import Link from "next/link";
import { FaShieldHalved } from "react-icons/fa6";

export default function  UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 px-6 py-12 transition-colors duration-300">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full border border-red-150 dark:border-red-900/50 shadow-sm animate-pulse">
            <FaShieldHalved className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          403 - Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          Oops! You do not have the required permissions to access this page. If
          you believe this is an error, please contact your administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-xl shadow-md transition-all duration-200"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800 rounded-xl transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
