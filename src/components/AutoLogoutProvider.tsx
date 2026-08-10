"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AutoLogoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

  useEffect(() => {
    // Don't auto-logout if they are on a public auth page
    if (pathname === "/login" || pathname === "/signup") {
      return;
    }

    const logout = async () => {
      // Clear localStorage
      localStorage.clear();
      
      // Call the logout API to clear the session cookie
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Failed to log out via API:", err);
      }

      // Redirect to login
      router.push("/login");
    };

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(logout, TIMEOUT_MS);
    };

    // Initialize timer
    resetTimer();

    // Event listeners for user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    const handleUserActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [pathname, router]);

  return <>{children}</>;
}
