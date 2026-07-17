"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
      } else {
        toast.success("Account created successfully!");
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const isPasswordValid = password.trim().length >= 6;
  const isStep1Valid = fullName.trim() !== "" && email.includes("@") && isPasswordValid;

  return (
    <AppLayout mode="signup">
      <div className="flex flex-col justify-between h-full w-full max-w-md">

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">
            {error}
          </div>
        )}

        <div className="flex-grow flex flex-col justify-between animate-fadeIn">
          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h3>
              <p className="text-slate-500 text-sm mt-1">Fill out your profile credentials to get started.</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (isStep1Valid) handleSignupSubmit(); }}>
              <div>
                <label htmlFor="full-name" className="text-[10px] font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  name="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adam Wake"
                  className="w-full px-4 py-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-[10px] font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adam@example.com"
                  className="w-full px-4 py-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="text-[10px] font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    name="new-password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 6 characters)"
                    className="w-full px-4 py-2.5 pr-10 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400"
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

              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 w-3 h-3 text-indigo-600 border-slate-300 rounded-none focus:ring-indigo-500 cursor-pointer shrink-0"
                />
                <label htmlFor="terms" className="ml-2 text-[10px] text-slate-500 cursor-pointer">
                  By Continuing you agree to the <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Services</Link> and <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy policy</Link>.
                </label>
              </div>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
            <Link
              href="/login"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition"
            >
              Already have an account? Sign In
            </Link>
            <button
              onClick={handleSignupSubmit}
              disabled={!isStep1Valid || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-none text-sm font-semibold transition duration-200 shadow-sm cursor-pointer"
            >
              {loading ? "Completing..." : "Complete Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
