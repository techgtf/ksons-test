"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle, FiKey, FiMail } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // API CALL HERE
    // await sendOtp(email)

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // API CALL HERE
    // await verifyOtp(email, otp)

    setTimeout(() => {
      setLoading(false);

      // Redirect to login
      router.push("/admin");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="px-8 py-8">
            {/* Back */}
            <Link
              href="/admin"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0f172a]"
            >
              <FiArrowLeft size={16} />
              Back to Login
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f172a] text-white shadow-lg shadow-[#0f172a]/10">
                {submitted ? <FiCheckCircle size={26} /> : <FiMail size={26} />}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
                {submitted ? "Verify OTP" : "Forgot Password"}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {submitted
                  ? "Enter the OTP sent to your email address."
                  : "Enter your email address and we’ll send you an OTP."}
              </p>
            </div>

            {/* EMAIL FORM */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-full w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl bg-[#0f172a] text-sm font-semibold text-white shadow-lg shadow-[#0f172a]/10 transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </motion.button>
              </form>
            ) : (
              /* OTP FORM */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <p className="text-sm leading-6 text-green-700">
                    OTP has been sent to:
                  </p>

                  <p className="mt-1 font-semibold text-[#0f172a]">{email}</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>

                  <div className="group flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 transition-all duration-200 focus-within:border-[#0f172a] focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-100">
                    <FiKey
                      size={20}
                      className="text-gray-400 group-focus-within:text-[#0f172a]"
                    />

                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6 digit OTP"
                      className="h-full w-full bg-transparent text-sm tracking-[0.3em] text-gray-900 placeholder:text-gray-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-500 transition hover:text-[#0f172a]"
                  >
                    Resend OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-medium text-gray-500 transition hover:text-[#0f172a]"
                  >
                    Change Email
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl bg-[#0f172a] text-sm font-semibold text-white shadow-lg shadow-[#0f172a]/10 transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </motion.button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-[#fafafa] px-8 py-5 text-center">
            <p className="text-sm text-gray-500">
              Secure password recovery for your account
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
