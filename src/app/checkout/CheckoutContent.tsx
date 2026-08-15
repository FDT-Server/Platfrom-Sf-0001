"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

interface CheckoutContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
    isPremium: boolean;
  };
  plan: string;
}

export default function CheckoutContent({ user, plan }: CheckoutContentProps) {
  const router = useRouter();
  const [name, setName] = useState(user.fullName);
  const [referenceNo, setReferenceNo] = useState("");
  const [utrNo, setUtrNo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentMode, setPaymentMode] = useState<"razorpay" | "utr">("razorpay");

  // Mobile OTP state
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isMonthly = plan.toLowerCase() === "monthly";
  const cost = isMonthly ? "₹49" : "₹499";
  const planLabel = isMonthly ? "Monthly Premium Track" : "Yearly Premium Track";

  // Dynamic script loader for Razorpay Checkout JS with DOM polling
  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }

      // Check if script element already exists in DOM (e.g. injected via Next Script tag)
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      const appendFreshScript = () => {
        if (typeof window === "undefined") {
          resolve(false);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      };

      if (existingScript) {
        // Poll for window.Razorpay for up to 3 seconds in case it is currently loading
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (typeof window !== "undefined" && (window as any).Razorpay) {
            clearInterval(interval);
            resolve(true);
          } else if (attempts >= 30) {
            clearInterval(interval);
            appendFreshScript();
          }
        }, 100);
        return;
      }

      appendFreshScript();
    });
  };

  // --- Mobile OTP Handlers ---
  const startResendTimer = () => {
    setResendTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      setOtpError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setSendingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/send-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpDigits(["", "", "", "", "", ""]);
        startResendTimer();
        toast.success(data.dev ? `[DEV] OTP sent to console` : `OTP sent to +91 ${phone}`);
      } else {
        setOtpError(data.error || "Failed to send OTP.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) { setOtpError("Enter all 6 digits."); return; }
    setVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMobileVerified(true);
        if (timerRef.current) clearInterval(timerRef.current);
        toast.success("Mobile number verified! ✅");
      } else {
        setOtpError(data.error || "Invalid OTP.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Handle Live/Test Razorpay Checkout Popup
  const handleRazorpayPayment = async () => {
    setLoadingRazorpay(true);
    setError("");

    try {
      // 1. Ensure Razorpay SDK script is loaded
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded) {
        setError(
          "Razorpay Checkout SDK could not be loaded. Please ensure you do not have an Ad-Blocker, Brave Shield, or network proxy blocking 'checkout.razorpay.com'. Alternatively, you can use the Manual UTR Transfer mode."
        );
        toast.error("Razorpay SDK script blocked or failed to load.");
        setLoadingRazorpay(false);
        return;
      }

      // 2. Create order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: isMonthly ? "monthly" : "yearly" }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize payment gateway.");
      }

      // 3. Configure Razorpay modal options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED",
        description: `${planLabel} Subscription`,
        image: "https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user.name || user.fullName,
          email: orderData.user.email || user.email,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setLoadingRazorpay(true);
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                plan: isMonthly ? "monthly" : "yearly",
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setVerifiedSuccess(true);
              toast.success("Payment verified! Account upgraded to Premium.");
            } else {
              setError(verifyData.error || "Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            setError("Network error verifying transaction.");
          } finally {
            setLoadingRazorpay(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingRazorpay(false);
          },
        },
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          console.error("Razorpay Payment Failed:", response.error);
          setError(response.error?.description || "Payment attempt failed.");
          setLoadingRazorpay(false);
        });
        rzp.open();
      } else {
        throw new Error("Razorpay modal object could not be created.");
      }
    } catch (err: any) {
      console.error("Payment Handler Exception:", err);
      setError(err?.message || "Failed to start Razorpay payment.");
      setLoadingRazorpay(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !referenceNo.trim() || !utrNo.trim() || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: isMonthly ? "monthly" : "yearly",
          referenceNo,
          name,
          utrNo,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to submit checkout details.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Instant Verified Success Screen (Razorpay Modal Complete)
  if (verifiedSuccess) {
    return (
      <DashboardLayout user={user}>
        <div className="flex h-fit w-full flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white p-8 md:p-16 shadow-sm text-center max-w-2xl mx-auto animate-fadeIn mt-10">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center shadow-md animate-bounce">
            <span className="material-symbols-outlined text-[44px]">verified</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-6 leading-tight">
            Payment Verified & Account Activated!
          </h3>
          <p className="text-sm text-slate-600 mt-3 max-w-md leading-relaxed">
            Your transaction via <strong>Razorpay / HDFC Gateway</strong> was verified instantly. Your account is now upgraded to <strong>Premium Access</strong>.
          </p>
          <div className="border-t border-slate-200/80 w-full my-6" />
          <button
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-3.5 text-xs font-bold transition shadow-md cursor-pointer select-none"
          >
            Go to Premium Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Manual UTR Submitted Screen
  if (success) {
    return (
      <DashboardLayout user={user}>
        <div className="flex h-fit w-full flex-col items-center justify-center rounded-2xl border border-slate-350 bg-white p-8 md:p-16 shadow-sm text-center max-w-2xl mx-auto animate-fadeIn mt-10">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center shadow-xs animate-pulse">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-6 leading-tight">
            Receipt Details Logged!
          </h3>
          <p className="text-sm text-slate-600 mt-3 max-w-md leading-relaxed">
            Your payment reference and UTR details have been logged. The administrator will verify the receipt and enable your Premium access shortly.
          </p>
          <div className="border-t border-slate-200/80 w-full my-6" />
          <button
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
            className="bg-black hover:bg-slate-900 text-white rounded-xl px-8 py-3 text-xs font-bold transition shadow-xs cursor-pointer select-none"
          >
            Go to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-fadeIn">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium select-none">
          <a href="/plans" className="hover:text-indigo-600 transition">
            Plans
          </a>
          <span className="text-slate-350">/</span>
          <span className="text-slate-800 font-semibold">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start max-w-5xl">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
                Secure Checkout Gateway
              </h2>
              <p className="text-[11px] text-indigo-100 font-semibold mt-1 leading-relaxed">
                Powered by HDFC Bank Collect Now & Razorpay Payment Gateway (PCI-DSS Level 1 Compliant)
              </p>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3.5 rounded-xl font-bold leading-relaxed space-y-2">
                  <p>{error}</p>
                  {error.includes("Ad-Blocker") && (
                    <button
                      type="button"
                      onClick={() => setPaymentMode("utr")}
                      className="text-xs text-indigo-700 underline font-extrabold hover:text-indigo-900 cursor-pointer block pt-1"
                    >
                      👉 Switch to Manual UTR Transfer mode
                    </button>
                  )}
                </div>
              )}

              {/* Selected Plan Summary Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selected Plan</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{planLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Amount</p>
                  <p className="text-lg font-black text-indigo-600">{cost}</p>
                </div>
              </div>

              {/* Toggle Payment Mode Tabs */}
              <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentMode("razorpay")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    paymentMode === "razorpay"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ⚡ Online Payment (Instant)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("utr")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    paymentMode === "utr"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📝 Manual UTR Transfer
                </button>
              </div>

              {/* Mode A: Razorpay Modal */}
              {paymentMode === "razorpay" && (
                <div className="space-y-5 pt-2">

                  {/* ── Contact Details: Mobile OTP ── */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-600 text-[18px]">phone_iphone</span>
                      <span className="text-xs font-bold text-slate-800">Contact Details — Mobile Verification</span>
                      {mobileVerified && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      {mobileVerified ? (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <span className="material-symbols-outlined text-emerald-600 text-[22px]">verified</span>
                          <div>
                            <p className="text-xs font-bold text-emerald-700">+91 {phone} — Verified</p>
                            <p className="text-[10px] text-emerald-600 mt-0.5">Your mobile number has been confirmed.</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Phone input row */}
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shrink-0">
                              🇮🇳 +91
                            </div>
                            <input
                              type="tel"
                              maxLength={10}
                              value={phone}
                              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                              placeholder="10-digit mobile number"
                              className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition bg-white text-slate-800"
                              disabled={otpSent && !mobileVerified}
                            />
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={sendingOtp || (resendTimer > 0 && otpSent) || phone.length !== 10}
                              className="shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-[11px] font-bold px-3 py-2.5 rounded-lg transition cursor-pointer"
                            >
                              {sendingOtp ? (
                                <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                              ) : resendTimer > 0 && otpSent ? (
                                `${resendTimer}s`
                              ) : otpSent ? (
                                "Resend"
                              ) : (
                                "Send OTP"
                              )}
                            </button>
                          </div>

                          {/* OTP digit boxes */}
                          {otpSent && (
                            <div className="space-y-3">
                              <p className="text-[11px] text-slate-500 font-medium">
                                Enter the 6-digit OTP sent to <strong>+91 {phone}</strong>
                              </p>
                              <div className="flex gap-2 justify-center">
                                {otpDigits.map((d, i) => (
                                  <input
                                    key={i}
                                    ref={(el) => { otpRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={d}
                                    onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    className="w-10 h-11 text-center border border-slate-300 rounded-xl text-base font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-white text-slate-900"
                                  />
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={verifyingOtp || otpDigits.join("").length !== 6}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                              >
                                {verifyingOtp ? (
                                  <><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> Verifying...</>
                                ) : (
                                  <><span className="material-symbols-outlined text-[16px]">verified_user</span> Verify OTP</>
                                )}
                              </button>
                            </div>
                          )}

                          {otpError && (
                            <p className="text-[11px] text-red-600 font-semibold bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{otpError}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="p-4 border border-indigo-100 rounded-2xl bg-indigo-50/50 space-y-2 text-xs text-slate-700">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-indigo-600 text-[18px]">lock</span>
                      Instant Online Activation
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Supports all Indian payment methods including <strong>UPI (GPay, PhonePe, Paytm), NetBanking, Credit Cards, and Debit Cards</strong>. Access will be unlocked immediately upon successful payment.
                    </p>
                  </div>

                  {/* Pay button — locked until mobile verified */}
                  {!mobileVerified && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      Verify your mobile number above to unlock payment.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleRazorpayPayment}
                    disabled={loadingRazorpay || !mobileVerified}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-extrabold py-3.5 px-6 rounded-xl text-sm shadow-md transition duration-150 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loadingRazorpay ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                        <span>Initializing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">credit_card</span>
                        <span>Pay {cost} via Razorpay / HDFC Gateway</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                    <span>🔒 256-Bit SSL Encryption</span>
                    <span>•</span>
                    <span>PCI-DSS Level 1 Compliant</span>
                  </div>
                </div>
              )}

              {/* Mode B: Manual UTR Form */}
              {paymentMode === "utr" && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Payer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition text-slate-850 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Payment Reference / UPI Transaction ID
                    </label>
                    <input
                      type="text"
                      required
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)}
                      placeholder="e.g. UPI Ref ID or Bank Ref Number"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition text-slate-850 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>UTR Number (12 Digits)</span>
                      <span className="text-[9px] text-slate-400 font-semibold lowercase">Required for manual banking audit</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={utrNo}
                      onChange={(e) => setUtrNo(e.target.value)}
                      placeholder="12-digit UTR bank number"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition text-slate-850 bg-white"
                      maxLength={24}
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      onClick={() => router.push("/plans")}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-lg text-xs transition cursor-pointer select-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !referenceNo.trim() || !utrNo.trim()}
                      className="bg-slate-950 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-xs transition duration-150 cursor-pointer flex items-center gap-1.5"
                    >
                      {submitting ? "Logging transaction..." : "Submit Receipt details"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col gap-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Official Merchant Info
              </h4>

              <div className="text-xs text-slate-600 space-y-3 font-medium leading-relaxed">
                <p>
                  Legal Entity: <strong className="text-slate-850">STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED</strong>
                </p>
                <div className="bg-white p-3 border border-slate-200 rounded-xl text-center select-all font-mono font-bold text-slate-800 text-sm">
                  upi@studentforge
                </div>

                <p className="border-t border-slate-200/80 pt-3">
                  All electronic checkout transactions are processed through authorized payment gateway partners adhering to RBI & PCI-DSS Level 1 guidelines.
                </p>
              </div>

              <div className="border-t border-slate-200/80 pt-3 flex items-start gap-2 text-[10px] text-slate-400 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">info</span>
                <span>Automatic payment confirmation unlocks full access instantly.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-white text-center">
              <p className="text-[11px] text-slate-450 font-bold uppercase tracking-wider">Need help with payments?</p>
              <p className="text-xs text-slate-600 mt-1">Contact accounts at <strong>studentforgetechnologies@gmail.com</strong></p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
