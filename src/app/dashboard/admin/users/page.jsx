"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBan, FaCheck, FaUsers } from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import { serverFetch, serverMutation } from "@/lib/core/server";

export default function ManageUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/login");
      } else if (session.user?.role !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const data = await serverFetch("/admin/users");
        setUsers(data || []);
      } catch (err) {
        setError(err.message || "Could not load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [session?.user?.role]);

  async function toggleUserStatus(user) {
    const currentUserId = session?.user?.id || session?.user?._id;

    if (user._id === currentUserId) {
      alert("You cannot block your own account.");
      return;
    }

    setWorkingId(user._id);

    try {
      await serverMutation(`/admin/users/${user._id}/status`, "PATCH", {
        isBlocked: !user.isBlocked,
      });

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: !item.isBlocked }
            : item,
        ),
      );
    } catch (err) {
      alert(err.message || "Could not update user.");
    } finally {
      setWorkingId("");
    }
  }

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <FaUsers className="text-orange-500" />
          Manage Users
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review member accounts and control their access.
        </p>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Membership</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {users.map((user) => {
                const currentUserId = session?.user?.id || session?.user?._id;
                const isSelf = user._id === currentUserId;
                const busy = workingId === user._id;

                return (
                  <tr key={user._id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>

                    <td className="px-6 py-4 text-sm capitalize">
                      {user.role}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 dark:bg-orange-950/30">
                        {user.isPremium ? "Premium" : "Free"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                          user.isBlocked
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        disabled={busy || isSelf}
                        onClick={() => toggleUserStatus(user)}
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                          user.isBlocked
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {user.isBlocked ? <FaCheck /> : <FaBan />}
                        {isSelf ? "You" : user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No users found.
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
