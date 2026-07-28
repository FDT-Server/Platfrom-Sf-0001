import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund & Cancellation Policy | Studentforge Platform",
  description: "Official refund and cancellation policy for Studentforge platform payments and Instamojo transactions.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 md:p-12 font-sans flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full bg-white p-6 sm:p-10 md:p-14 rounded-3xl shadow-sm border border-slate-200/90 my-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition bg-indigo-50 px-3 py-1.5 rounded-lg"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Dashboard
          </Link>

          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Instamojo Gateway Compliant
          </span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-600">
            <span className="material-symbols-outlined text-[24px]">currency_exchange</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Refund & Cancellation Policy
          </h1>
        </div>

        <p className="text-xs font-semibold text-slate-400 mb-8">
          Effective Date: July 27, 2026 | Operator: Studentforge / Redlix Pro Wing
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              1. Overview & Satisfaction Commitment
            </h2>
            <p>
              At Studentforge Platform (operated by <strong>Redlix Pro Wing</strong>), we strive to deliver high-quality educational courses, video lectures, and mentorship tracks. We recognize that occasional issues may arise, and we have established this transparent Refund & Cancellation Policy for all payments processed through <strong>Instamojo Payment Gateway</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              2. Eligibility for Refund (7-Day Money-Back Period)
            </h2>
            <p>You are eligible for a full refund of your subscription or plan payment under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li><strong>7-Day Window:</strong> Refund request is submitted within 7 calendar days of purchase.</li>
              <li><strong>Duplicate Payment:</strong> You were charged multiple times for the same transaction due to a network or gateway glitch.</li>
              <li><strong>Technical Service Inaccessibility:</strong> Platform technical failure prevented access to paid features for more than 48 consecutive hours.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              3. Subscription Cancellation Policy
            </h2>
            <p>
              You may cancel your monthly or annual Premium membership at any time prior to the next billing renewal. Upon cancellation, your subscription will remain active until the conclusion of the current paid billing cycle, after which no further recurring charges will be incurred.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              4. Non-Refundable Situations
            </h2>
            <p>Refunds will not be issued under the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li>Refund requested after 7 calendar days from the transaction date.</li>
              <li>Completion of more than 50% of video lecture tracks or downloading of certificate credentials.</li>
              <li>Conducting a completed 1-on-1 mentorship session with an assigned mentor.</li>
              <li>Account termination resulting from violations of our Terms of Service (e.g. copyright infringement or account sharing).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              5. Refund Request Process & Instamojo Settlement Timeframe
            </h2>
            <p>To request a refund, follow these simple steps:</p>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600">
              <li>
                Email our billing team at{" "}
                <a href="mailto:studentforgetechnologies@gmail.com" className="text-indigo-600 font-bold underline">
                  studentforgetechnologies@gmail.com
                </a>{" "}
                with the subject line <strong>&quot;Refund Request - [Your Registered Email]&quot;</strong>.
              </li>
              <li>Include your Payment Reference ID, Instamojo Transaction ID, and reason for the request.</li>
              <li>Our finance team will verify your account details within <strong>24 to 48 business hours</strong>.</li>
              <li>
                Approved refunds will be credited back via Instamojo to your original payment method (UPI account, Credit/Debit Card, or Bank Account) within <strong>5 to 7 business days</strong>.
              </li>
            </ol>
          </section>

          <section className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-slate-900">Need Urgent Assistance with a Payment?</p>
            <p className="text-slate-600">
              Contact our support team directly at{" "}
              <a href="mailto:studentforgetechnologies@gmail.com" className="text-amber-700 underline font-semibold">
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
