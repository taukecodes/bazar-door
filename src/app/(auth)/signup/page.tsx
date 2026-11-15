"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast"; // টাস্ট দেখানোর জন্য এটি আবশ্যিক
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setPasswordError("পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }

    if (String(data.password).length < 8) {
      setPasswordError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!");
      return;
    }

    const { data: resData, error } = await signUp.email({
      email: data.email as string,
      password: data.password as string,
      name: data.name as string,
    });

    if (error) {
      toast.error(error.message || "সাইন আপ করতে সমস্যা হয়েছে!");
      return;
    }

    if (resData) {
      toast.success("Account Created Successfully, Login to Continue");
      router.push("/signin");
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7f5] px-4 py-10">
      {/* Header Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#18181b] tracking-tight">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm sm:text-[15px] text-[#64748b] mt-1">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#1e293b] mb-1.5"
            >
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="যেমন: রহিম উদ্দিন"
              className="w-full px-3.5 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:bg-white focus:border-[#008f4c] focus:ring-1 focus:ring-[#008f4c] transition-colors placeholder:text-[#94a3b8]"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#1e293b] mb-1.5"
            >
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:bg-white focus:border-[#008f4c] focus:ring-1 focus:ring-[#008f4c] transition-colors placeholder:text-[#94a3b8]"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#1e293b] mb-1.5"
            >
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full px-3.5 py-2.5 pr-10 text-sm text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:bg-white focus:border-[#008f4c] focus:ring-1 focus:ring-[#008f4c] transition-colors placeholder:text-[#94a3b8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-[#1e293b] mb-1.5"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="আবার লিখুন"
                className="w-full px-3.5 py-2.5 pr-10 text-sm text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:bg-white focus:border-[#008f4c] focus:ring-1 focus:ring-[#008f4c] transition-colors placeholder:text-[#94a3b8]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Password Error Alert */}
          {passwordError && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {passwordError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 mt-2 bg-[#008f4c] hover:bg-[#007a40] active:bg-[#006635] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            অ্যাকাউন্ট তৈরি করুন
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-[#e2e8f0] w-full"></div>
          <span className="bg-white px-3 text-xs text-[#64748b] font-medium">
            অথবা
          </span>
          <div className="border-t border-[#e2e8f0] w-full"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#1e293b] transition-colors cursor-pointer"
          >
            <FcGoogle className="text-lg shrink-0" />
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#1e293b] transition-colors cursor-pointer"
          >
            <FaGithub className="text-base text-[#18181b] shrink-0" />
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-xs sm:text-sm text-[#475569] mt-6">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#008f4c] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#64748b] hover:text-[#1e293b] mt-6 transition-colors"
      >
        <ArrowLeft size={15} />
        <span>হোম পেজে ফিরে যান</span>
      </Link>
    </div>
  );
}
