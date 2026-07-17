import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 md:p-20 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <Link href="/signup" className="text-indigo-600 hover:underline text-sm font-medium mb-8 inline-block">
          &larr; Back to Sign Up
        </Link>
        <h1 className="text-3xl font-bold mb-6 tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last Updated: July 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
            <p>When you create an account, we collect personal information such as your name, email address, and authentication credentials. We also collect data regarding your usage of the platform to improve your learning experience.</p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your account and our platform updates.</p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to maintain the safety of your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Third-Party Services</h2>
            <p>We do not sell your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website and conducting our business, so long as those parties agree to keep this information confidential.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
