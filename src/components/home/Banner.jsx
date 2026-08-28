/* "use client";

import Link from "next/link";
import { FaArrowRight, FaFire, FaUtensils } from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function Banner() {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600"
          alt="Delicious food"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/70" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/70 to-orange-950/40" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-24">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
          <FaFire /> Community cookbook
        </span>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Cook stories worth
          <span className="block text-orange-400">sharing tonight.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          RecipeHub is where home chefs publish dishes, unlock premium plates,
          and find the next recipe the table will remember.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
          >
            Browse Recipes <FaArrowRight />
          </Link>
          <Link
            href={session ? "/dashboard/user/my-recipes/add" : "/register"}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <FaUtensils />
            {session ? "Add a Recipe" : "Join as a Chef"}
          </Link>
        </div>

        <div className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {[
            { n: "2+", l: "Free recipe slots" },
            { n: "$1.99", l: "Unlock any plate" },
            { n: "Pro", l: "Unlimited publishing" },
          ].map((item) => (
            <div key={item.l}>
              <p className="text-2xl font-extrabold text-white">{item.n}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
                {item.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
 */

"use client";

import Link from "next/link";
import { FaArrowRight, FaFire, FaUtensils } from "react-icons/fa6";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Banner() {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600"
          alt="Delicious food"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/70" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/70 to-orange-950/40" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-24">
        <motion.span
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-300"
        >
          <FaFire /> Community cookbook
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl"
        >
          Cook stories worth
          <span className="block text-orange-400">sharing tonight.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg"
        >
          RecipeHub is where home chefs publish dishes, unlock premium plates,
          and find the next recipe the table will remember.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-98"
          >
            Browse Recipes <FaArrowRight />
          </Link>
          <Link
            href={session ? "/dashboard/user/my-recipes/add" : "/register"}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 active:scale-98"
          >
            <FaUtensils />
            {session ? "Add a Recipe" : "Join as a Chef"}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8"
        >
          {[
            { n: "2+", l: "Free recipe slots" },
            { n: "$1.99", l: "Unlock any plate" },
            { n: "Pro", l: "Unlimited publishing" },
          ].map((item) => (
            <div key={item.l}>
              <p className="text-2xl font-extrabold text-white">{item.n}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
                {item.l}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}