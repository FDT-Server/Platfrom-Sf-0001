"use client";

import dynamic from "next/dynamic";

const ResumeAnalyzerContent = dynamic(
  () => import("@/app/tools/resume-analyzer/ResumeAnalyzerContent"),
  { ssr: false }
);

export default function ResumeAnalyzerDynamic({ user }: { user: any }) {
  return <ResumeAnalyzerContent user={user} />;
}
