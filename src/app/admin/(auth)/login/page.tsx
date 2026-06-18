"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/src/admin/redux/features/authSlice";
import api from "@/src/admin/lib/axios";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const response = await api.post("/admin/auth/login", {
        email,
        password,
      });

      const data = response.data.data;

      // Save tokens
      Cookies.set("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken);

      // Save redux state
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        })
      );

      router.push("/admin/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center justify-center text-white">
                <img
                  src="/images/home/logo-initial.svg"
                  className="w-10"
                  alt="logo"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
                  Welcome Back
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Login to continue to your dashboard
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="group flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 transition-all duration-200 focus-within:border-[#0f172a] focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-100">
                  <FiMail
                    size={20}
                    className="text-gray-400 group-focus-within:text-[#0f172a]"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-full w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="group flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 transition-all duration-200 focus-within:border-[#0f172a] focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-100">
                  <FiLock
                    size={20}
                    className="text-gray-400 group-focus-within:text-[#0f172a]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-full w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 transition hover:text-[#0f172a]"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0f172a] focus:ring-[#0f172a]"
                  />
                  <span>Keep me logged in</span>
                </label>

                {/* <Link
                  href="/admin/forgot-password"
                  className="text-sm font-medium text-[#0f172a] transition hover:opacity-70"
                >
                  Forgot Password?
                </Link> */}
              </div>

              {/* Login Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                type="submit"
                className="h-14 w-full rounded-2xl bg-[#0f172a] text-sm font-semibold text-white shadow-lg shadow-[#0f172a]/10 transition-all hover:bg-black"
              >
                Sign In
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-[#fafafa] px-8 py-5 text-center">
            <p className="text-sm text-gray-500">
              Secure access to your admin dashboard
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
