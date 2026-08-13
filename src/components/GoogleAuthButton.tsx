"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GoogleAuthButtonProps {
  text?: string;
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    // Check if script tag already exists
    const existing = document.getElementById("google-gsi-script");
    if (existing) {
      // Script tag exists, wait for it to load
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve();
        } else if (attempts > 30) {
          clearInterval(interval);
          reject(new Error("Google SDK timed out."));
        }
      }, 200);
      return;
    }

    // Inject script fresh
    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait a moment for google object to initialize after load
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve();
        } else if (attempts > 20) {
          clearInterval(interval);
          reject(new Error("Google SDK loaded but oauth2 not available."));
        }
      }, 150);
    };
    script.onerror = () => reject(new Error("Failed to load Google SDK script."));
    document.body.appendChild(script);
  });
}

export default function GoogleAuthButton({ text = "Continue with Google" }: GoogleAuthButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId || clientId.includes("PASTE_YOUR")) {
      toast.error("Google Client ID is not configured in .env.local");
      return;
    }

    setLoading(true);

    try {
      await loadGoogleScript();
    } catch (err) {
      console.error("SDK load error:", err);
      toast.error("Failed to load Google. Check your internet connection and try again.");
      setLoading(false);
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            toast.error("Google sign in was cancelled.");
            setLoading(false);
            return;
          }

          if (tokenResponse.access_token) {
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken: tokenResponse.access_token }),
              });

              const data = await res.json();
              if (res.ok && data.success) {
                toast.success("Signed in with Google!");
                const userEmail = (data.user?.email || "").trim().toLowerCase();
                if (userEmail === "webstrixx@gmail.com") {
                  router.push("/admin");
                } else if (userEmail === "hrstudentforge@gmail.com") {
                  router.push("/sfadmin/dashboard");
                } else {
                  router.push("/dashboard");
                }
                router.refresh();
              } else {
                toast.error(data.error || "Google authentication failed.");
              }
            } catch (err) {
              console.error(err);
              toast.error("Server error during Google sign in.");
            } finally {
              setLoading(false);
            }
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("Failed to open Google sign in popup.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-400 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-500 transition cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      {loading ? "Connecting…" : text}
    </button>
  );
}

declare global {
  interface Window {
    google?: any;
  }
}
