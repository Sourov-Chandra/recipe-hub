"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/login");
      } else if (session.user?.role === "admin") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/dashboard/user/my-recipes/add");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
      <span className="text-sm text-gray-500 dark:text-gray-450">
        Loading Dashboard...
      </span>
    </div>
  );
}
