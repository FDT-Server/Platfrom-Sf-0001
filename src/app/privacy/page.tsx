import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Studentforge Platform",
  description: "Privacy policy for Studentforge platform detailing data collection, storage, and Instamojo payment gateway data safety.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 md:p-12 font-sans flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full bg-white p-6 sm:p-10 md:p-14 rounded-3xl shadow-sm border border-slate-200/90 my-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition bg-indigo-50 px-3 py-1.5 rounded-lg"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </Link>

          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Privacy Policy & Data Safety
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs font-semibold text-slate-400 mb-8">
          Effective Date: July 27, 2026 | Operator: STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              1. Information We Collect
            </h2>
            <p>
              When you use Studentforge Platform, operated by <strong>STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED</strong>, we collect personal information necessary to deliver our online learning services, process transactions, and personalize your experience:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li><strong>Account Information:</strong> Full name, email address, phone number, password, and profile preferences.</li>
              <li><strong>Payment & Transaction Information:</strong> Payment reference numbers, transaction IDs, selected subscription plans, and invoice history.</li>
              <li><strong>Usage Data:</strong> Course progress, study pod interactions, mentorship bookings, IP addresses, browser types, and access timestamps.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              2. Razorpay & HDFC Collect Now Payment Security & Data Handling
            </h2>
            <p>
              We prioritize financial security. We do not store sensitive payment instrument details such as credit/debit card numbers, CVVs, or NetBanking passwords on our servers.
            </p>
            <p className="text-xs text-slate-600">
              All electronic checkout transactions are handled securely by our licensed payment processing partner <strong>Razorpay Software Private Limited / HDFC Bank Collect Now</strong>, which complies with <strong>PCI-DSS (Payment Card Industry Data Security Standard) Level 1</strong> and Reserve Bank of India (RBI) directives.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              3. How We Use Your Information
            </h2>
            <p>We use the collected information for the following legitimate purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li>To provide, operate, maintain, and upgrade our educational portal and study pods.</li>
              <li>To process subscription billing and issue official tax invoices and receipts.</li>
              <li>To verify certificate issuing and track student learning achievements.</li>
              <li>To communicate important updates, account alerts, and security notifications.</li>
              <li>To prevent fraudulent transactions and unauthorized system activity.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              4. Data Protection & Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party advertisers. We share information only with essential service infrastructure providers (such as Instamojo for payment authorization, cloud server hosts, and transactional email services) who are bound by strict confidentiality agreements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              5. Indian IT Act 2000 Compliance & User Rights
            </h2>
            <p>
              In accordance with Information Technology Act, 2000 and rules made thereunder, you have the right to review, update, or request the deletion of your personal account information by contacting our privacy officer.
            </p>
          </section>

          <section className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-slate-900">Grievance & Privacy Officer</p>
            <p className="text-slate-600">
              For any privacy concerns or data inquiry, please contact us at{" "}
              <a href="mailto:studentforgetechnologies@gmail.com" className="text-indigo-600 underline font-semibold">
                studentforgetechnologies@gmail.com
              </a>.
            </p>
          </section>

        </div>

      </div>

      <Footer variant="light" className="max-w-4xl mx-auto w-full" />
    </div>
  );
}
