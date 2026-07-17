import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 md:p-20 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <Link href="/signup" className="text-indigo-600 hover:underline text-sm font-medium mb-8 inline-block">
          &larr; Back to Sign Up
        </Link>
        <h1 className="text-3xl font-bold mb-6 tracking-tight text-slate-900">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-8">Last Updated: July 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using the Studentforge Platform, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, you may not access the service.</p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. User Accounts</h2>
            <p>You are responsible for safeguarding your password and you agree not to disclose your password to any third party. You are responsible for any activities or actions under your account.</p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Educational Use</h2>
            <p>The content provided on Studentforge is for educational and training purposes. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Premium Memberships</h2>
            <p>Premium features are billed according to the selected plan. Payments are non-refundable except where required by law. We reserve the right to modify our pricing at any time.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
