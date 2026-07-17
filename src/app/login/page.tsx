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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
      } else {
        toast.success("Signed in successfully!");
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

  return (
    <AppLayout mode="login">
      <div className="absolute top-10 right-10 lg:top-12 lg:right-16 flex items-center gap-3 z-20">
        <span className="text-xl font-bold tracking-tight text-slate-900">Platform</span>
        <div className="h-6 w-[1px] bg-slate-200"></div>
        <img 
          src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858" 
          alt="Studentforge Logo" 
          className="h-8 w-auto object-contain"
        />
      </div>
      <div className="flex flex-col justify-between h-full w-full max-w-md animate-fadeIn mt-10">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h3>
            <p className="text-slate-500 text-sm mt-1">Please enter your credentials to log in.</p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-white px-3 text-slate-500 uppercase tracking-wider font-bold">Or continue with email</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="login-email" className="text-[10px] font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adam@example.com"
                className="w-full px-4 py-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="current-password" className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                  Password
                </label>
                <Link href="/login/forgot" className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 transition">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="current-password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-3">
          <Link 
            href="/signup" 
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition"
          >
            Create an account (Sign Up)
          </Link>
          <button
            onClick={handleLoginSubmit}
            disabled={!email || !password || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-none text-sm font-semibold transition duration-200 shadow-sm cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
