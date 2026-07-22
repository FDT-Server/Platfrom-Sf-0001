"use client";

import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  illustrationUrl?: string;
  hideQuote?: boolean;
}

export default function AuthLayout({
  children,
  illustrationUrl,
  hideQuote = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white">

      <div className="hidden lg:flex lg:w-[52%] bg-[#f0ebe0] flex-col p-10 xl:p-12 overflow-hidden justify-between">

        <div className="shrink-0 space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
              alt="Studentforge Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="h-6 w-[1px] bg-slate-300"></div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              <span className="text-blue-600">P</span>latform
            </span>
          </div>

          {}
          {!hideQuote && (
            <div className="pt-2 max-w-md mx-auto text-center flex flex-col items-center">
              <svg
                className="w-8 h-8 text-blue-600 mb-2 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-800 text-lg font-semibold leading-snug tracking-tight">
                &ldquo;Empowering every student to learn, build, and forge their future with confidence.&rdquo;
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Student Forge Platform
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center py-2" suppressHydrationWarning>
          {illustrationUrl ? (
            <img
              src={illustrationUrl}
              alt="Auth Illustration"
              className="w-full max-w-[520px] max-h-[500px] object-contain select-none pointer-events-none"
              draggable={false}
            />
          ) : (
            <iframe
              src="https://lottie.host/embed/ea8bc4c7-442b-48c1-95b4-c7d02afd2cca/ebPEadNeIk.lottie"
              className="w-full max-w-[560px] h-[520px] border-0 select-none pointer-events-none"
              title="Student Forge Animation"
            />
          )}
        </div>

        <p className="text-[11px] text-slate-500 font-mono shrink-0 text-center">
          © 2026 Student Forge Technologies Private Limited. All Rights Reserved.
        </p>
      </div>

      <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 py-12 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

    </div>
  );
}
