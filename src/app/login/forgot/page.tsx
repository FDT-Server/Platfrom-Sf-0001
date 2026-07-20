"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

const EyeIcon = () => (
  <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState<"request" | "otp" | "success">("request");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to initiate recovery request.");
      } else {
        setStatusMessage("Verification OTP code sent to your email!");
        setStep("otp");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to verify code and update password.");
      } else {
        setStep("success");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      illustrationUrl="https://ik.imagekit.io/dypkhqxip/Forgot%20password-amico.svg"
      hideQuote
    >
      {/* ── STEP 1: REQUEST OTP ────────────────────────────────────────────── */}
      {step === "request" && (
        <div>
          <div className="mb-7">
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
              Forgot Password
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Enter your registered email address to receive a 6-digit verification code.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="recovery-email" className="text-[11px] font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                id="recovery-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adam@example.com"
                className="w-full px-5 py-3.5 rounded-full border border-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={!email || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-full text-sm font-semibold transition duration-200 shadow-sm mt-2 cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send OTP Code"}
            </button>
          </form>

          <p className="text-center text-[12px] text-slate-500 mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
              Back to Login
            </Link>
          </p>
        </div>
      )}

      {/* ── STEP 2: ENTER OTP & NEW PASSWORD ───────────────────────────────── */}
      {step === "otp" && (
        <div>
          <div className="mb-7">
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
              Verify & Reset
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Enter the 6-digit OTP code sent to <span className="font-semibold text-slate-800">{email}</span> and create your new password.
            </p>
          </div>

          {statusMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl px-4 py-3">
              {statusMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-3.5">
            {/* OTP Code */}
            <div>
              <label htmlFor="otp-code" className="text-[11px] font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                id="otp-code"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full px-5 py-3.5 rounded-full border border-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-base font-bold tracking-widest text-center transition placeholder-slate-400 hover:border-slate-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="text-[11px] font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-5 py-3.5 pr-12 rounded-full border border-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none p-1"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="text-[11px] font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-5 py-3.5 rounded-full border border-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={!otp || !password || !confirmPassword || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-full text-sm font-semibold transition duration-200 shadow-sm mt-2 cursor-pointer"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center text-[12px] text-slate-500 mt-6">
            Need to restart?{" "}
            <button
              onClick={() => { setStep("request"); setError(""); setStatusMessage(""); }}
              className="text-blue-600 font-semibold hover:text-blue-700 transition focus:outline-none cursor-pointer"
            >
              Resend OTP
            </button>
          </p>
        </div>
      )}

      {/* ── STEP 3: SUCCESS ────────────────────────────────────────────────── */}
      {step === "success" && (
        <div className="text-center py-4">
          <div className="mx-auto bg-emerald-100 text-emerald-700 p-4 rounded-full w-fit mb-5 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
            Password Reset!
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-xs mx-auto">
            Your account password has been updated successfully. You can now use your new password to sign in.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-full text-sm font-semibold transition duration-200 shadow-sm mt-8 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
