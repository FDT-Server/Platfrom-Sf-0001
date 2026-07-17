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
      <div className="min-h-[calc(100vh-4.5rem)] w-full bg-[#020817] px-3 pb-8 pt-4 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[28px] border border-[#183157] bg-[radial-gradient(130%_130%_at_50%_0%,#0c2f5f_0%,#07142b_45%,#050d1d_100%)] p-4 md:p-7">
          <div className="mb-7 text-center">
            <h1 className="text-[2rem] font-black tracking-tight text-[#f6cf57] md:text-[2.45rem]">
              Upgrade to Premium
            </h1>
            <p className="mt-1 text-sm text-slate-300 md:text-base">
              Unlock exclusive benefits and accelerate your journey.
            </p>

            <div className="mx-auto mt-5 inline-flex rounded-full border border-[#1f365c] bg-[#0a1730] p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-bold transition md:px-8 ${
                  billing === "monthly"
                    ? "bg-[#111f3d] text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`rounded-full px-5 py-2 text-xs font-bold transition md:px-8 ${
                  billing === "yearly"
                    ? "bg-[#f7cb46] text-slate-950"
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
                className={`relative flex min-h-[490px] flex-col rounded-2xl border p-5 md:p-6 ${
                  plan.highlight
                    ? "border-[#f3c84f] bg-[#0b1a35] shadow-[0_16px_44px_-18px_rgba(247,203,70,0.45)]"
                    : "border-[#1f365d] bg-[#09142b]"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md border border-[#f8dc87] bg-[#f7cb46] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950">
                    {plan.highlight}
                  </span>
                ) : null}

                <h2 className="text-[1.85rem] font-extrabold leading-none text-white">{plan.name}</h2>
                {plan.subtitle ? <p className="mt-1 text-xs text-slate-400">{plan.subtitle}</p> : null}

                <div className="mt-4 flex items-end gap-1 text-white">
                  <span className="text-[3rem] font-black leading-none">₹{plan.selectedPrice.amount}</span>
                  <span className="pb-1 text-sm text-slate-300">/{plan.selectedPrice.cycle}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-[15px] text-slate-100">
                      <span className="material-symbols-outlined flex h-5 w-5 items-center justify-center rounded-full border border-[#f0cd65] bg-[#2e2509] text-[14px] text-[#f7cb46]">
                        done
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=${plan.selectedPrice.checkoutPlan}`}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${
                    plan.highlight
                      ? "bg-[#f7cb46] text-slate-950 hover:bg-[#f2c230]"
                      : "border border-[#4b607f] bg-transparent text-white hover:bg-[#12213f]"
                  }`}
                >
                  Get Started
                </Link>
              </section>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-[#1f365d] bg-[#09142b] p-4 text-center text-xs font-semibold text-slate-200 md:grid-cols-3 md:text-sm">
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 text-[15px] text-slate-100">
                verified_user
              </span>
              Money-back Guarantee
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 text-[15px] text-slate-100">
                update
              </span>
              Cancel Anytime
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 text-[15px] text-slate-100">
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
