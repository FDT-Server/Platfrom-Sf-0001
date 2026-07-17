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
  monthlyPrice: number;
  yearlyPrice: number;
  subtitle: string;
  highlight?: string;
  ctaStyle: string;
  cardStyle: string;
  featureStyle: string;
  features: string[];
  checkoutPlan: "monthly" | "yearly";
};

const plans: PlanCard[] = [
  {
    name: "Student Pro",
    subtitle: "For focused learners",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    checkoutPlan: "monthly",
    ctaStyle:
      "border border-slate-400/70 bg-slate-900/60 text-slate-100 hover:bg-slate-800",
    cardStyle: "border-slate-700 bg-slate-950/65",
    featureStyle: "text-slate-200",
    features: [
      "All Free Features",
      "Exclusive Events",
      "Priority Opportunities",
      "Community Access",
    ],
  },
  {
    name: "Student Premium",
    subtitle: "Best for career growth",
    monthlyPrice: 999,
    yearlyPrice: 7990,
    checkoutPlan: "yearly",
    highlight: "Most Popular",
    ctaStyle: "bg-amber-400 text-slate-950 hover:bg-amber-300",
    cardStyle: "border-amber-300 bg-slate-950/80 shadow-[0_20px_50px_-24px_rgba(250,204,21,0.55)]",
    featureStyle: "text-amber-50",
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
    subtitle: "For founders and operators",
    monthlyPrice: 1999,
    yearlyPrice: 14999,
    checkoutPlan: "yearly",
    ctaStyle:
      "border border-slate-400/70 bg-slate-900/60 text-slate-100 hover:bg-slate-800",
    cardStyle: "border-slate-700 bg-slate-950/65",
    featureStyle: "text-slate-200",
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
    const cycleLabel = billing === "monthly" ? "month" : "year";
    return plans.map((plan) => ({
      ...plan,
      price: billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice,
      cycleLabel,
    }));
  }, [billing]);

  return (
    <DashboardLayout user={user}>
      <div className="min-h-[calc(100vh-4.5rem)] w-full px-4 pb-8 pt-6 md:px-7">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-700 bg-[radial-gradient(120%_120%_at_20%_0%,rgba(30,58,138,0.35),rgba(2,6,23,0.98))] p-5 md:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-amber-300 md:text-4xl">
              Upgrade to Premium
            </h1>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Unlock exclusive benefits and accelerate your journey.
            </p>

            <div className="mx-auto mt-5 inline-flex rounded-full border border-slate-700 bg-slate-900/80 p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-bold transition md:px-8 ${
                  billing === "monthly"
                    ? "bg-slate-200 text-slate-900"
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
                    ? "bg-amber-300 text-slate-950"
                    : "text-amber-200 hover:text-amber-100"
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {summary.map((plan) => (
              <section
                key={plan.name}
                className={`relative flex min-h-[520px] flex-col rounded-2xl border p-5 md:p-6 ${plan.cardStyle}`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md border border-amber-200/70 bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950">
                    {plan.highlight}
                  </span>
                ) : null}

                <h2 className="text-2xl font-black text-white">{plan.name}</h2>
                <p className="mt-1 text-xs text-slate-400">{plan.subtitle}</p>

                <div className="mt-4 flex items-end gap-1 text-white">
                  <span className="text-4xl font-black">₹{plan.price}</span>
                  <span className="pb-1 text-sm text-slate-300">/{plan.cycleLabel}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-center gap-2.5 text-sm ${plan.featureStyle}`}>
                      <span className="material-symbols-outlined text-[18px] text-amber-300">verified</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=${plan.checkoutPlan}`}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${plan.ctaStyle}`}
                >
                  Get Started
                </Link>
              </section>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-center text-xs font-semibold text-slate-200 md:grid-cols-3 md:text-sm">
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-300">verified_user</span>
              Money-back Guarantee
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-300">event_repeat</span>
              Cancel Anytime
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-300">lock</span>
              100% Secure Payment
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
