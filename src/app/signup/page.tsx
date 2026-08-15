"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";
import GoogleAuthButton from "@/components/GoogleAuthButton";

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

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP. Please try again.");
      } else {
        toast.success("Verification OTP sent to your email!");
        setStep("otp");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
      } else {
        toast.success("Account created successfully! Welcome to Studentforge.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isFormValid = fullName.trim() !== "" && email.includes("@") && isPasswordValid;

  return (
    <AuthLayout>
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
          {step === "details" ? "Create Account" : "Verify Email"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {step === "details"
            ? "Fill in your details to get started."
            : `Enter the 6-digit OTP sent to ${email}`}
        </p>
      </div>

      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3.5 py-2">
          {error}
        </div>
      )}

      {step === "details" && (
        <>
          <div className="mb-3">
            <GoogleAuthButton />
          </div>

          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Or</span>
            </div>
          </div>

          <form
            className="space-y-2.5"
            onSubmit={(e) => { e.preventDefault(); if (isFormValid) handleRequestOtp(); }}
          >
            <input
              type="text"
              id="full-name"
              name="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-full border border-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-xs transition placeholder-slate-400 hover:border-slate-500"
            />
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-2.5 rounded-full border border-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-xs transition placeholder-slate-400 hover:border-slate-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="new-password"
                name="new-password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (8+ chars, 1 cap, 1 num, 1 symbol)"
                className="w-full px-4 py-2.5 pr-11 rounded-full border border-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-xs transition placeholder-slate-400 hover:border-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 focus:outline-none p-1 cursor-pointer"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="flex gap-1.5 px-2">
                {[
                  { label: "8+", ok: password.length >= 8 },
                  { label: "A–Z", ok: /[A-Z]/.test(password) },
                  { label: "0–9", ok: /[0-9]/.test(password) },
                  { label: "!@#", ok: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
                ].map(({ label, ok }) => (
                  <span
                    key={label}
                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold transition ${
                      ok ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2 pt-0.5">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-500 cursor-pointer leading-relaxed">
                By continuing you agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-2.5 rounded-full text-xs font-semibold transition duration-200 shadow-sm mt-1 cursor-pointer"
            >
              {loading ? "Sending OTP…" : "Continue"}
            </button>
          </form>
        </>
      )}

      {step === "otp" && (
        <form
          className="space-y-4 mt-2"
          onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) handleSignupSubmit(); }}
        >
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
              placeholder="000000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm font-semibold tracking-widest text-center transition placeholder-slate-300 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={otp.length !== 6 || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-xs transition duration-150 shadow shadow-blue-500/20 active:scale-95 flex justify-center items-center cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep("details");
                setOtp("");
                setError("");
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-xs transition duration-150 shadow-3xs cursor-pointer"
            >
              Back to Details
            </button>
          </div>
        </form>
      )}

      {/* Login link */}
      <p className="text-center text-[11px] text-slate-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
