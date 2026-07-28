import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions | Studentforge Platform",
  description: "Terms and conditions of service for Studentforge educational platform and Instamojo payment gateway transactions.",
};

export default function TermsPage() {
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

        <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight text-slate-900">
          Terms & Conditions
        </h1>
        <p className="text-xs font-semibold text-slate-400 mb-8">
          Effective Date: July 27, 2026 | Operator: Studentforge
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, registering, or purchasing subscriptions on Studentforge Platform (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operated by <strong>Studentforge</strong>, you agree to be legally bound by these Terms & Conditions. If you do not agree with any portion of these terms, you must not use our website or purchase any digital services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              2. Educational Platform Services
            </h2>
            <p>
              Studentforge provides legitimate online educational services including engineering video lectures, curated technical resources, study pods, startup guidance, and mentorship sessions for students and engineering professionals.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              3. User Accounts & Registration
            </h2>
            <p>
              You must provide accurate, complete, and current information when creating an account. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized account access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              4. Subscription Fees & Payment Processing
            </h2>
            <p>
              All payments for paid tracks (Monthly Premium, Yearly Premium, Mentorship, and Certification tracks) are processed securely through our authorized payment gateways.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li>Prices are displayed in Indian Rupees (INR ₹) inclusive of applicable taxes.</li>
              <li>Supports UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards (Visa, MasterCard, RuPay), and NetBanking.</li>
              <li>Payment receipt emails and invoices will be issued automatically upon payment confirmation.</li>
              <li>You agree not to initiate fraudulent chargebacks. Any unauthorized dispute will lead to immediate account suspension.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              5. Digital Delivery & Service Fulfillment
            </h2>
            <p>
              Because Studentforge provides digital educational access, all purchased features (video courses, study pods, certificate verification, mentorship booking) are delivered electronically and instantly upon successful payment verification. No physical products are shipped.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              6. Intellectual Property Rights
            </h2>
            <p>
              All course materials, video lectures, source codes, logos, trademarks, and content hosted on Studentforge are the exclusive intellectual property of Studentforge. You are granted a limited, personal, non-transferable, non-commercial license to access the content. Reproduction or distribution is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              7. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall Studentforge be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our educational services or payment portal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              8. Governing Law & Dispute Resolution
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these terms or payments shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          <section className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-slate-900">Questions regarding Terms of Service?</p>
            <p className="text-slate-600">
              Contact our legal and compliance desk at{" "}
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
