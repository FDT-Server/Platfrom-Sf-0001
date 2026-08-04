"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";

const EyeIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

export default function SFAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [view, setView] = useState<"login" | "forgot-request" | "forgot-reset" | "success">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== "hrstudentforge@gmail.com") {
      setError("Access denied: Unauthorized admin email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/sfadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please verify credentials.");
      } else {
        router.push("/sfadmin/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setStatusMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== "hrstudentforge@gmail.com") {
      setError("Access denied: Password recovery is restricted to hrstudentforge@gmail.com.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/sfadmin/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to initiate recovery request.");
      } else {
        setStatusMessage("Verification OTP code sent to your email!");
        setView("forgot-reset");
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

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/sfadmin/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, otp, password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to verify code and update password.");
      } else {
        setView("success");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout mode="login">
      <div className="flex flex-col justify-between h-full w-full max-w-md animate-fadeIn">

        {view === "login" && (
          <div className="space-y-6 flex-1">
            <div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                SF Admin Access
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
                Studentforge Admin Panel
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Authorized credentials access for Studentforge Admin.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 font-semibold">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="admin-email" className="text-[10px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  id="admin-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hrstudentforge@gmail.com"
                  className="w-full px-4 py-2.5 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="admin-password" className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">
                    Admin Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStatusMessage("");
                      setView("forgot-request");
                    }}
                    className="text-[11px] font-medium text-amber-600 hover:text-amber-700 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="admin-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {view === "forgot-request" && (
          <div className="space-y-6 flex-1">
            <div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                Password Recovery
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
                Forgot Admin Password
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Enter your admin email address to request a verification OTP code.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 font-semibold">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleRequestOtp}>
              <div>
                <label htmlFor="recovery-email" className="text-[10px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  id="recovery-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hrstudentforge@gmail.com"
                  className="w-full px-4 py-2.5 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400 rounded-lg"
                />
              </div>
            </form>
          </div>
        )}

        {view === "forgot-reset" && (
          <div className="space-y-6 flex-1">
            <div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                Security Verification
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
                Verify OTP & Reset
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Enter the 6-digit OTP code sent to your email and set your new password.
              </p>
            </div>

            {statusMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-3 font-semibold">
                {statusMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 font-semibold">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="otp-code" className="text-[10px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">
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
                  className="w-full px-4 py-2.5 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 text-sm font-semibold tracking-widest text-center transition placeholder-slate-400 hover:border-slate-400 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="text-[10px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="text-[10px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400 rounded-lg"
                />
              </div>
            </form>
          </div>
        )}

        {view === "success" && (
          <div className="space-y-6 flex-1 flex flex-col justify-center text-center py-8">
            <div className="mx-auto bg-emerald-100 text-emerald-800 p-3 rounded-full w-fit">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Successful</h3>
              <p className="text-slate-500 text-sm mt-2">
                Your Admin password has been updated successfully. You can now use your new password to sign in.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-8">
          {view === "login" ? (
            <Link
              href="/login"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition"
            >
              User Login Portal
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setError("");
                setStatusMessage("");
                setView("login");
              }}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition"
            >
              Back to Admin Sign In
            </button>
          )}

          {view === "login" && (
            <button
              onClick={handleLoginSubmit}
              disabled={!email || !password || loading}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-semibold transition duration-200 shadow-sm cursor-pointer rounded-lg"
            >
              {loading ? "Authorizing..." : "Admin Access"}
            </button>
          )}

          {view === "forgot-request" && (
            <button
              onClick={handleRequestOtp}
              disabled={!email || loading}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-semibold transition duration-200 shadow-sm cursor-pointer rounded-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}

          {view === "forgot-reset" && (
            <button
              onClick={handleResetPassword}
              disabled={!otp || !newPassword || !confirmPassword || loading}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-semibold transition duration-200 shadow-sm cursor-pointer rounded-lg"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          )}

          {view === "success" && (
            <button
              onClick={() => setView("login")}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 text-sm font-semibold transition duration-200 shadow-sm cursor-pointer rounded-lg"
            >
              Back to Login
            </button>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
