"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaCamera,
  FaCheck,
  FaCrown,
  FaEnvelope,
  FaPen,
  FaTriangleExclamation,
  FaUser,
} from "react-icons/fa6";
import { authClient, useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, refetch } = useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

 useEffect(() => {
   if (!session?.user) return;

   // eslint-disable-next-line react-hooks/set-state-in-effect
   setName(session.user.name || "");
   setImage(session.user.image || "");
 }, [session]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Your name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (result?.error) {
        throw new Error(result.error.message || "Profile update failed.");
      }

      await refetch();

      setMessage("Your profile has been updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  }

  const isPremium = session?.user?.isPremium;

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your public profile information.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-28 bg-linear-to-r from-orange-500 to-amber-400" />

        <div className="relative px-6 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-4 border-white bg-orange-100 shadow-md dark:border-zinc-900 dark:bg-orange-950/30">
                {image ? (
                  <Image
                    src={image}
                    alt={name || "Profile image"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-orange-600">
                    {name ? name[0].toUpperCase() : <FaUser />}
                  </div>
                )}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {session?.user?.name || "RecipeHub Member"}
                </h2>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <FaEnvelope className="text-orange-500" />
                  {session?.user?.email}
                </p>
              </div>
            </div>

            {isPremium && (
              <span className="flex w-fit items-center gap-2 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                <FaCrown />
                Premium Member
              </span>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your name and profile image are visible across RecipeHub.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            <FaTriangleExclamation className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400">
            <FaCheck />
            <p>{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Full Name
            </span>

            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Email Address
            </span>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-gray-400"
              />
            </div>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Profile Image URL
          </span>

          <div className="relative">
            <FaCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </label>

        <div className="flex justify-end border-t border-gray-100 pt-6 dark:border-zinc-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FaPen />
            )}
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}