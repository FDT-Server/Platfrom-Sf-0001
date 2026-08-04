"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Payment / Subscription Support",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 md:p-12 font-sans flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full bg-white p-6 sm:p-10 md:p-14 rounded-3xl shadow-sm border border-slate-200/90 my-6 space-y-8">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition bg-indigo-50 px-3 py-1.5 rounded-lg"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </Link>

          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Customer Support Desk
          </span>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[15px]">headset_mic</span>
            Customer Support & Contact Info
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Contact Us
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Have questions regarding platform subscriptions, course tracks, or technical support? Our dedicated team is here to assist you.
          </p>
        </div>

        {/* Merchant Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Official Email</h3>
            <p className="text-sm font-extrabold text-slate-800 break-all">
              <a href="mailto:studentforgetechnologies@gmail.com" className="hover:text-indigo-600 underline">
                studentforgetechnologies@gmail.com
              </a>
            </p>
            <p className="text-[11px] text-slate-500">SLA: 24–48 hours response time</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Working Hours</h3>
            <p className="text-sm font-extrabold text-slate-800">Mon – Sat: 9:00 AM – 6:00 PM</p>
            <p className="text-[11px] text-slate-500">Indian Standard Time (IST)</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
            </div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Business Entity</h3>
            <p className="text-sm font-extrabold text-slate-800">STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED</p>
            <p className="text-[11px] text-slate-500">Registered Corporate Entity in India</p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-indigo-600">send</span>
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">task_alt</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-600">
                Thank you for contacting Studentforge support. Our team will review your query and reply to <strong>{formData.email}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-indigo-600 hover:underline pt-2 inline-block cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 bg-white"
                >
                  <option value="Payment Query">Payment Query</option>
                  <option value="Refund & Cancellation Request">Refund & Cancellation Request</option>
                  <option value="Subscription & Access Issue">Subscription & Access Issue</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Message / Issue Details</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Include transaction ID or details if reporting a payment issue..."
                  className="w-full border border-slate-200 rounded-xl p-4 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-2xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

      <Footer variant="light" className="max-w-4xl mx-auto w-full" />
    </div>
  );
}
