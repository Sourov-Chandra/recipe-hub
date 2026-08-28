import Link from "next/link";
import {
  FaUtensils,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold"
          >
            <FaUtensils className="text-orange-500" />
            <span>
              <span className="text-orange-500">Recipe</span>
              <span className="text-gray-900 dark:text-white">Hub</span>
            </span>
          </Link>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            A community kitchen for publishing, liking, unlocking, and featuring
            recipes — from weeknight bowls to celebration plates.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Explore
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Link href="/recipes" className="hover:text-orange-500">
              Browse Recipes
            </Link>
            <Link href="/plans" className="hover:text-orange-500">
              Premium Plans
            </Link>
            <Link href="/register" className="hover:text-orange-500">
              Create Account
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Kitchen
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Link href="/dashboard" className="hover:text-orange-500">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-orange-500">
              Login
            </Link>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            Follow Us
          </p>

          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-orange-500 hover:text-white dark:bg-zinc-900 dark:text-gray-300"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-orange-500 hover:text-white dark:bg-zinc-900 dark:text-gray-300"
            >
              <FaInstagram />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-orange-500 hover:text-white dark:bg-zinc-900 dark:text-gray-300"
            >
              <FaYoutube />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-orange-500 hover:text-white dark:bg-zinc-900 dark:text-gray-300"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-5 text-center text-xs text-gray-400 dark:border-zinc-900">
        © {new Date().getFullYear()} RecipeHub. Cook generously.
      </div>
    </footer>
  );
}
