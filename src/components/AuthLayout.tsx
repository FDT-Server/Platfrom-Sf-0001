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
    <div className="h-screen w-full max-h-screen overflow-hidden flex flex-col lg:flex-row font-sans bg-white">

      {/* Left side illustration / quote */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] bg-[#f0ebe0] flex-col p-6 xl:p-8 overflow-hidden justify-between h-full shrink-0">

        <div className="shrink-0 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
              alt="Studentforge Logo"
              className="h-9 w-auto object-contain"
            />
            <div className="h-5 w-[1px] bg-slate-300"></div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              <span className="text-blue-600">P</span>latform
            </span>
          </div>

          {!hideQuote && (
            <div className="pt-1 max-w-md mx-auto text-center flex flex-col items-center">
              <svg
                className="w-6 h-6 text-blue-600 mb-1 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-800 text-base font-semibold leading-snug tracking-tight">
                &ldquo;Empowering every student to learn, build, and forge their future with confidence.&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Student Forge Platform
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0 py-2" suppressHydrationWarning>
          {illustrationUrl ? (
            <img
              src={illustrationUrl}
              alt="Auth Illustration"
              className="w-full max-w-[440px] max-h-[380px] object-contain select-none pointer-events-none"
              draggable={false}
            />
          ) : (
            <iframe
              src="https://lottie.host/embed/ea8bc4c7-442b-48c1-95b4-c7d02afd2cca/ebPEadNeIk.lottie"
              className="w-full max-w-[480px] h-[380px] border-0 select-none pointer-events-none"
              title="Student Forge Animation"
            />
          )}
        </div>

        <p className="text-[10px] text-slate-500 font-mono shrink-0 text-center">
          © 2026 Student Forge Technologies Private Limited. All Rights Reserved.
        </p>
      </div>

      {/* Right side form container */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 lg:p-10 h-full overflow-y-auto">
        <div className="w-full max-w-sm my-auto">
          {children}
        </div>
      </div>

    </div>
  );
}
