"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUtensils,
  FaArrowRight,
  FaSpinner,
  FaGoogle,
} from "react-icons/fa6";
import Image from "next/image";
import { FiUploadCloud } from "react-icons/fi";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null); // Holds the raw File object
  const [imagePreview, setImagePreview] = useState(null); // Holds preview URL for UI

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ImgBB API key is missing. Add NEXT_PUBLIC_IMGBB_API_KEY to your .env file.",
      );
    }

    const imgData = new FormData();
    imgData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to ImgBB.");
    }

    const result = await response.json();
    return result.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!imageFile) {
      setError("Please select a profile picture.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const uploadedImageUrl = await uploadImageToImgBB(imageFile);

      await authClient.signUp.email(
        {
          email,
          password,
          name,
          image: uploadedImageUrl,
          role: "user",
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
              ctx.error.message || "Registration failed. Please try again.",
            );
          },
        },
      );
    } catch (err) {
      setLoading(false);
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
      console.error("Signup error:", err);
    }
  };

  // Google Authentication Handler
  const handleGoogleSignUp = async () => {
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // Redirect to home page on success
      });
    } catch (err) {
      setError("Failed to initialize Google authentication.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-12 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center rounded-2xl mb-4">
            <FaUtensils className="text-orange-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Join Recipe Hub and discover amazing recipes!
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 focus:bg-white dark:bg-zinc-800 dark:focus:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Email Input */}
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

          {/* Styled File Upload Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 overflow-hidden flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <FiUploadCloud className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <label className="grow cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-gray-200 dark:border-zinc-700 px-4 py-3 rounded-2xl text-sm font-medium text-gray-700 dark:text-zinc-200 text-center transition-colors">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Password Input */}
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

            <div className="mt-2 text-xs space-y-1 text-gray-500 dark:text-gray-400">
              <p
                className={
                  formData.password.length >= 6
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : ""
                }
              >
                • Minimum 6 characters
              </p>
              <p
                className={
                  /[A-Z]/.test(formData.password)
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : ""
                }
              >
                • At least one uppercase letter
              </p>
              <p
                className={
                  /[a-z]/.test(formData.password)
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : ""
                }
              >
                • At least one lowercase letter
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-md active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
          >
            {loading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Uploading & Creating...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <FaArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-150 dark:border-zinc-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-zinc-900 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/80 text-gray-700 dark:text-zinc-200 font-semibold py-3.5 px-4 rounded-2xl border border-gray-200 dark:border-zinc-700 flex items-center justify-center gap-3 hover:shadow-sm active:scale-[0.99] transition-all duration-150 cursor-pointer"
        >
          <FaGoogle className="w-4 h-4 text-red-500" />
          <span>Sign up with Google</span>
        </button>

        {/* Login Link */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
