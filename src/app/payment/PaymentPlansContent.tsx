"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

type BillingCycle = "monthly" | "yearly";

interface PaymentPlansContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
    isPremium: boolean;
  };
  initialBilling: BillingCycle;
}

type PlanCard = {
  name: string;
  subtitle: string;
  highlight?: string;
  pricing: {
    monthly: { amount: number; cycle: string; checkoutPlan: "monthly" | "yearly" };
    yearly: { amount: number; cycle: string; checkoutPlan: "monthly" | "yearly" };
  };
  features: string[];
};

const plans: PlanCard[] = [
  {
    name: "Student Pro",
    subtitle: "",
    pricing: {
      monthly: { amount: 149, cycle: "month", checkoutPlan: "monthly" },
      yearly: { amount: 149, cycle: "month", checkoutPlan: "monthly" },
    },
    features: [
      "All Free Features",
      "Exclusive Events",
      "Priority Opportunities",
      "Community Access",
    ],
  },
  {
    name: "Student Premium",
    subtitle: "",
    highlight: "Most Popular",
    pricing: {
      monthly: { amount: 999, cycle: "month", checkoutPlan: "monthly" },
      yearly: { amount: 999, cycle: "year", checkoutPlan: "yearly" },
    },
    features: [
      "All Pro Features",
      "1:1 Mentorship (2 sessions)",
      "Portfolio Review",
      "Certificate of Completion",
      "Premium Resources",
      "AI Tools Access",
    ],
  },
  {
    name: "Student Elite",
    subtitle: "",
    pricing: {
      monthly: { amount: 1999, cycle: "month", checkoutPlan: "monthly" },
      yearly: { amount: 1999, cycle: "year", checkoutPlan: "yearly" },
    },
    features: [
      "All Premium Features",
      "1:1 Mentorship (Unlimited)",
      "Startup Guidance",
      "Priority Internship Access",
      "Personal Branding Support",
    ],
  },
];

export default function PaymentPlansContent({ user, initialBilling }: PaymentPlansContentProps) {
  const [billing, setBilling] = useState<BillingCycle>(initialBilling);

  const summary = useMemo(() => {
    return plans.map((plan) => ({
      ...plan,
      selectedPrice: plan.pricing[billing],
    }));
  }, [billing]);

  return (
    <DashboardLayout user={user}>
      <div
        className="min-h-[calc(100vh-4.5rem)] w-full bg-[#040b1a] px-3 pb-8 pt-4 md:px-6"
        style={{ fontFamily: "Poppins, Inter, Arial, sans-serif" }}
      >
        <div className="mx-auto max-w-[1040px] rounded-[30px] border border-[#16335c] bg-[radial-gradient(145%_125%_at_50%_-8%,#123f75_0%,#0b1b36_42%,#061126_100%)] p-4 shadow-[0_24px_60px_-28px_rgba(3,8,20,0.95)] md:p-7">
          <div className="mb-7 text-center">
            <h1 className="text-[2rem] font-extrabold tracking-[-0.015em] text-[#f6cc49] md:text-[2.55rem]">
              Upgrade to Premium
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-300 md:text-base">
              Unlock exclusive benefits and accelerate your journey.
            </p>

            <div className="mx-auto mt-5 inline-flex rounded-full border border-[#264872] bg-[#0a1b39] p-1 shadow-inner shadow-[#050a14]">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-6 py-2 text-xs font-semibold transition md:px-9 ${
                  billing === "monthly"
                    ? "bg-[#122649] text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`rounded-full px-6 py-2 text-xs font-semibold transition md:px-9 ${
                  billing === "yearly"
                    ? "bg-[#f3c746] text-slate-950"
                    : "text-amber-200 hover:text-amber-100"
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {summary.map((plan) => (
              <section
                key={plan.name}
                className={`relative flex min-h-[512px] flex-col rounded-[18px] border px-5 pb-5 pt-6 md:px-6 md:pb-6 md:pt-7 ${
                  plan.highlight
                    ? "border-[#f3c84f] bg-[#0d1e3b] shadow-[0_20px_42px_-20px_rgba(243,199,70,0.45)]"
                    : "border-[#1e3860] bg-[#0b1832]"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md border border-[#ffe597] bg-[#f3c746] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-950">
                    {plan.highlight}
                  </span>
                ) : null}

                <h2 className="text-[2.05rem] font-extrabold leading-none text-white">{plan.name}</h2>
                {plan.subtitle ? <p className="mt-1 text-xs text-slate-400">{plan.subtitle}</p> : null}

                <div className="mt-5 flex items-end gap-1.5 text-white">
                  <span className="text-[3.15rem] font-extrabold leading-none">₹{plan.selectedPrice.amount}</span>
                  <span className="pb-1 text-[15px] font-medium text-slate-300">/{plan.selectedPrice.cycle}</span>
                </div>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-[15px] font-medium text-slate-100">
                      <span className="material-symbols-outlined flex h-5 w-5 items-center justify-center rounded-full border border-[#f0cd65] bg-[#2a2209] text-[14px] text-[#f3c746]">
                        done
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=${plan.selectedPrice.checkoutPlan}`}
                  className={`mt-7 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-[#f3c746] text-slate-950 hover:bg-[#eabc32]"
                      : "border border-[#4b607f] bg-[#0d1a35] text-white hover:bg-[#132447]"
                  }`}
                >
                  Get Started
                </Link>
              </section>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-[#203c65] bg-[#0a1831] p-4 text-center text-xs font-medium text-slate-200 md:grid-cols-3 md:text-sm">
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[15px] text-slate-100">
                verified_user
              </span>
              Money-back Guarantee
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[15px] text-slate-100">
                update
              </span>
              Cancel Anytime
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[15px] text-slate-100">
                lock
              </span>
              100% Secure Payment
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
