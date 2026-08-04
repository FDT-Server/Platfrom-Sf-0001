"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function SessionValidator({
  isSessionValid,
}: {
  isSessionValid: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hasAlerted = useRef(false);

  useEffect(() => {
    // Only redirect if on a protected route and session is invalid
    if (!isSessionValid && pathname !== "/login" && pathname !== "/signup" && !pathname.startsWith("/launch")) {
      if (!hasAlerted.current) {
        toast.error("You have been logged out because your account was accessed from another device.");
        hasAlerted.current = true;
      }
      
      // Clear local storage and redirect
      localStorage.clear();
      router.push("/login");
    }
  }, [isSessionValid, pathname, router]);

  return null;
}
