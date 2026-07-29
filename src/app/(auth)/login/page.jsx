"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUtensils,
  FaArrowRight,
  FaSpinner,
  FaGoogle,
} from "react-icons/fa6";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: (ctx) => {
            setLoading(false);
            router.push("/");
          },
          onError: (ctx) => {
            setLoading(false);
            setError(
              ctx.error.message || "Invalid credentials. Please try again.",
            );
          },
        },
      );
    } catch (err) {
      setLoading(false);
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
      console.error("Sign-in error:", err);
    }
  };

 
  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });
    } catch (err) {
      setError("Failed to initialize Google authentication.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-12 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-md">
        
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center rounded-2xl mb-4">
            <FaUtensils className="text-orange-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Log in to discover and share amazing recipes!
          </p>
        </div>

      
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 focus:bg-white dark:bg-zinc-800 dark:focus:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaLock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 bg-gray-50 focus:bg-white dark:bg-zinc-800 dark:focus:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-md active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
          >
            {loading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <FaArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-150 dark:border-zinc-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-zinc-900 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/80 text-gray-700 dark:text-zinc-200 font-semibold py-3.5 px-4 rounded-2xl border border-gray-200 dark:border-zinc-700 flex items-center justify-center gap-3 hover:shadow-sm active:scale-[0.99] transition-all duration-150 cursor-pointer"
        >
          <FaGoogle className="w-4 h-4 text-red-500" />
          <span>Sign in with Google</span>
        </button>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&#39;t have an account?{" "}
          <Link
            href="/register"
            className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
