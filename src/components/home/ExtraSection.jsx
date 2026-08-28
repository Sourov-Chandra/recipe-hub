"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaCrown,
  FaHeart,
  FaPenNib,
  FaUnlock,
} from "react-icons/fa6";

const steps = [
  {
    icon: <FaPenNib className="h-5 w-5" />,
    title: "Publish a dish",
    text: "Free chefs get 2 slots. Upload a photo, ingredients, and steps.",
  },
  {
    icon: <FaHeart className="h-5 w-5" />,
    title: "Earn the table",
    text: "Likes, favorites, and reports keep the kitchen honest and lively.",
  },
  {
    icon: <FaUnlock className="h-5 w-5" />,
    title: "Unlock or go Pro",
    text: "Buy a single recipe for $1.99, or upgrade for unlimited publishing.",
  },
];

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Drinks",
  "Vegan",
];

const perks = [
  "Unlimited recipe uploads",
  "Premium Chef badge on your profile",
  "Priority featuring by admins",
  "Keep selling $1.99 recipe unlocks",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ExtraSection() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            From stove to feed
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            How RecipeHub works
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-950/30">
                {step.icon}
              </div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                Step 0{index + 1}
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {step.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <motion.div key={category} variants={fadeUp}>
              <Link
                href="/recipes"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 transition hover:border-orange-300 hover:text-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {category}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-zinc-950 px-8 py-14 text-white sm:px-14">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-orange-500/30 blur-3xl" />
          <div className="absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeLeft}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                <FaCrown /> Premium membership
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Unlimited recipes.
                <span className="block text-orange-400">
                  Golden chef badge.
                </span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
                Free accounts stop at two recipes. Upgrade to publish without
                limits and stand out on every plate you share.
              </p>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <Link
                  href="/plans"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-orange-600"
                >
                  View Plans <FaBookOpen />
                </Link>
              </motion.div>
            </motion.div>

            <motion.ul
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-3 text-sm"
            >
              {perks.map((perk) => (
                <motion.li
                  key={perk}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                >
                  {perk}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>
    </>
  );
}
