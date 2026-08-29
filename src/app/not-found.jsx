import Link from "next/link";
import { FaArrowLeft, FaUtensils } from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-6 py-16 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
          <FaUtensils className="text-3xl" />
        </div>

        <p className="text-8xl font-black tracking-tight text-zinc-900 sm:text-9xl dark:text-white">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Oops! Recipe not found
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-zinc-500 dark:text-zinc-400">
          The page you’re looking for seems to have disappeared from the
          kitchen. Let’s get you back to something delicious!
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/30"
          >
            <FaArrowLeft className="text-sm" />
            Back to Home
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-zinc-400 dark:text-zinc-600">
          <span className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
          <span>Let’s find something delicious</span>
          <span className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}
