import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shipping & Delivery Policy | Studentforge Platform",
  description: "Digital service delivery policy for Studentforge platform payments and Instamojo compliance.",
};

export default function ShippingPolicyPage() {
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
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
            <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Shipping & Digital Service Delivery Policy
          </h1>
        </div>

        <p className="text-xs font-semibold text-slate-400 mb-8">
          Effective Date: July 27, 2026 | Operator: Studentforge / Redlix Pro Wing
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              1. Electronic & Digital Service Nature
            </h2>
            <p>
              Studentforge Platform (operated by <strong>Redlix Pro Wing</strong>) is an online educational software-as-a-service (SaaS) platform. We do not sell or dispatch physical tangible goods or physical merchandise. Therefore, physical shipping and logistics shipping charges do not apply to any purchases made on our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              2. Instant Digital Delivery & Access Fulfillment
            </h2>
            <p>
              Upon successful payment authorization via our payment gateway partner <strong>Instamojo</strong>, your service access is delivered electronically immediately:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li><strong>Premium Membership Access:</strong> Activated instantly on your Studentforge user account dashboard.</li>
              <li><strong>Video Lectures & Courses:</strong> Unlocked immediately for streaming and learning.</li>
              <li><strong>Study Pods & Mentorship:</strong> Instant allocation of creation privileges and booking access.</li>
              <li><strong>Certificates & Transcripts:</strong> Digital PDF credentials downloadable directly from your account upon course completion.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              3. Confirmation & Invoicing
            </h2>
            <p>
              An automated email payment receipt containing your transaction reference ID and access instructions will be sent to your registered email address within <strong>5 minutes</strong> of completing payment on Instamojo.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              4. Delivery Delay Resolution
            </h2>
            <p>
              If your account upgrade or digital access is not reflected on your dashboard within 15 minutes of payment completion due to a network delay:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
              <li>Try refreshing your browser page or logging out and logging back in.</li>
              <li>Check your email inbox and spam folder for the Instamojo payment receipt.</li>
              <li>
                If access is still pending, send your transaction ID to{" "}
                <a href="mailto:studentforgetechnologies@gmail.com" className="text-indigo-600 font-bold underline">
                  studentforgetechnologies@gmail.com
                </a>. Our tech support team will manually resolve and grant access within 2 hours.
              </li>
            </ol>
          </section>

          <section className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-slate-900">Digital Fulfillment Enquiries</p>
            <p className="text-slate-600">
              For any questions regarding digital content access, write to us at{" "}
              <a href="mailto:studentforgetechnologies@gmail.com" className="text-blue-700 underline font-semibold">
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
