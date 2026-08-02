import React from "react";

export default function DashboardShellLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      {children}
    </div>
  );
}
