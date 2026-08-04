"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

function TypewriterText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsComplete(false);
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      <span
        className={`inline-block w-[3px] h-[0.85em] bg-indigo-600 ml-1.5 align-middle rounded-xs ${
          isComplete ? "animate-sharpBlink" : "opacity-100"
        }`}
      />
    </span>
  );
}

function AnimatedCounter({ value }: { value: string }) {
  const [displayVal, setDisplayVal] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let targetNum = 0;
    let suffix = "";
    let isDecimal = false;
    let formattedCommas = false;

    if (value.includes("10,000")) {
      targetNum = 10000;
      suffix = "+";
      formattedCommas = true;
    } else if (value.includes("94%")) {
      targetNum = 94;
      suffix = "%";
    } else if (value.includes("120")) {
      targetNum = 120;
      suffix = "+";
    } else if (value.includes("4.9")) {
      targetNum = 4.9;
      suffix = " / 5";
      isDecimal = true;
    } else {
      setDisplayVal(value);
      return;
    }

    const duration = 1800;
    const steps = 45;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetNum * easeProgress;

      if (currentStep >= steps) {
        if (formattedCommas) {
          setDisplayVal(targetNum.toLocaleString("en-US") + suffix);
        } else if (isDecimal) {
          setDisplayVal(targetNum.toFixed(1) + suffix);
        } else {
          setDisplayVal(Math.round(targetNum) + suffix);
        }
        clearInterval(timer);
      } else {
        if (formattedCommas) {
          setDisplayVal(Math.round(currentVal).toLocaleString("en-US") + suffix);
        } else if (isDecimal) {
          setDisplayVal(currentVal.toFixed(1) + suffix);
        } else {
          setDisplayVal(Math.round(currentVal) + suffix);
        }
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return <span ref={elementRef}>{displayVal}</span>;
}

const announcementsData = [
  {
    badge: "Platform Launch",
    text: "Student Forge Platform Launch — Explore the official launch event!",
    linkText: "Join Launch Event →",
    href: "https://events.studentforge.in/events/cmsbpnls8000004lfw3bvf1a7",
  },
  {
    badge: "Live Event",
    text: "Incept Edition - 01 — Join the official Studentforge event!",
    linkText: "Register Now →",
    href: "https://events.studentforge.in/events/cmsdaqzpr000004kyklwexkkb",
  },
  {
    badge: "New Cohort",
    text: "Admissions now open for Full-Stack & AI Engineering Tracks!",
    linkText: "Apply Now →",
    href: "/signup",
  },
  {
    badge: "Live Workshop",
    text: "Master System Design & Microservices Architecture this weekend!",
    linkText: "Register Free →",
    href: "/signup",
  },
  {
    badge: "Placement Record",
    text: "94% of Studentforge grads secured top engineering roles in 2026",
    linkText: "Learn More →",
    href: "/signup",
  },
];

function AnnouncementBar({ items }: { items: Array<{ badge: string; text: string; linkText: string; href: string }> }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const current = items[currentIndex];

  return (
    <div className="bg-slate-900 text-white text-[11px] font-semibold py-2 px-3 sm:px-6 border-b border-slate-800 flex items-center justify-between gap-2 max-w-full overflow-hidden select-none">
      <button
        onClick={handlePrev}
        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer flex items-center shrink-0"
        aria-label="Previous announcement"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
      </button>

      <div
        key={currentIndex}
        className="animate-slideFromLeft flex items-center justify-center gap-2 text-center truncate min-w-0"
      >
        <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0">
          {current.badge}
        </span>
        <span className="truncate">{current.text}</span>
        {current.href.startsWith("http") ? (
          <a
            href={current.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-indigo-300 font-bold hover:text-white transition ml-1 shrink-0 whitespace-nowrap"
          >
            {current.linkText}
          </a>
        ) : (
          <Link
            href={current.href}
            className="underline text-indigo-300 font-bold hover:text-white transition ml-1 shrink-0 whitespace-nowrap"
          >
            {current.linkText}
          </Link>
        )}
      </div>

      <button
        onClick={handleNext}
        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer flex items-center shrink-0"
        aria-label="Next announcement"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
    </div>
  );
}

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };



  const features = [
    {
      title: "1-on-1 Expert Mentorship",
      desc: "Get direct code reviews, career guidance, and weekly live Q&A sessions with senior engineers.",
      icon: "supervisor_account",
    },
    {
      title: "Production-Grade Projects",
      desc: "Build real enterprise software applications rather than simple tutorial clones.",
      icon: "terminal",
    },
    {
      title: "AI-Powered StudyPod",
      desc: "Accelerate your learning with AI quiz generators, interactive code snippets, and automated feedback.",
      icon: "psychology",
    },
    {
      title: "Startup & Career Support",
      desc: "Access resume building, mock tech interviews, and direct referrals to hiring partners.",
      icon: "rocket_launch",
    },
  ];

  const stats = [
    { label: "Active Learners", value: "10,000+" },
    { label: "Placement & Internship Rate", value: "94%" },
    { label: "Hiring Network Partners", value: "120+" },
    { label: "Average Rating", value: "4.9 / 5" },
  ];

  const faqs = [
    {
      q: "Who is Studentforge designed for?",
      a: "Studentforge is built for engineering students, self-taught developers, and technology professionals who want to acquire practical, industry-ready software engineering skills.",
    },
    {
      q: "What payment methods are supported for membership?",
      a: "We support all major Indian payment methods via HDFC Collect Now / Razorpay, including UPI (GPay, PhonePe, Paytm), Net Banking, Debit Cards, and Credit Cards.",
    },
    {
      q: "Can I cancel my subscription or get a refund?",
      a: "Yes. We offer transparent subscription plans and a dedicated refund policy as outlined in our legal policy documents linked in the footer.",
    },
    {
      q: "Will I receive a verified certificate upon course completion?",
      a: "Yes. Completing all required modules and project submissions qualifies you for an industry-verified digital certificate issued directly by Studentforge.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      
      {/* Top Announcement Bar Carousel */}
      <AnnouncementBar items={announcementsData} />

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold tracking-tight select-none text-[#011E3B]">
              Platform
            </span>
            <div className="h-4 w-[1.5px] bg-[#011E3B]"></div>
            <img
              src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
              alt="Studentforge Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <Link href="#features" className="hover:text-indigo-600 transition">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition">
              Plans & Pricing
            </Link>
            <Link href="/login" className="hover:text-indigo-600 transition">
              Courses
            </Link>
            <Link href="/login" className="hover:text-indigo-600 transition">
              Mentorship
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-800 hover:text-indigo-600 px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl shadow-xs transition duration-150 cursor-pointer"
            >
              Get Started
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 leading-tight tracking-tight min-h-[2.5em] sm:min-h-[2.4em]">
              <TypewriterText text="Transform Your Tech Career with Industry-Grade Engineering Skills" />
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-2xl">
              Studentforge equips engineering students and software developers with real-world project experience, 1-on-1 mentorship, and structured computer science tracks designed to help you land top tech roles.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-xs transition text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Get Started Now</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>

              <Link
                href="/login"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl transition text-center cursor-pointer border border-slate-200"
              >
                Student Login
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500 font-semibold flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                No Prior Coding Required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                Verified Certifications
              </span>
            </div>

          </div>

          {/* Hero Right Tech Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src="/hero-illustration.png"
                alt="Studentforge Developer Learning Ecosystem Illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Stats Bar (Floating Curved Overlap) */}
      <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 -mt-10 sm:-mt-12 mb-2 sm:mb-4 relative z-20">
        <section className="bg-slate-900 text-white py-5 sm:py-6 px-6 sm:px-14 rounded-2xl sm:rounded-[2rem] shadow-2xl border border-slate-800/90">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <p className="text-2xl sm:text-4xl font-black text-indigo-400 font-mono tracking-tight">
                  <AnimatedCounter value={st.value} />
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {st.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>



      {/* Features Section */}
      <section id="features" className="bg-white py-16 sm:py-24 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Built for Engineering Excellence
            </h2>
            <h3 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Why Engineering Students Choose Studentforge
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Everything you need to build, practice, and showcase software engineering proficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((ft, idx) => (
              <div
                key={idx}
                className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-500/80 shadow-2xs hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 ease-out hover:-translate-y-1.5 cursor-pointer space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[22px]">{ft.icon}</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
                  {ft.title}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Subscription Section (Razorpay Merchant Compliance) */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Transparent Pricing
          </h2>
          <h3 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Flexible Membership Plans
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Choose a plan to unlock full access to courses, video lectures, AI study pods, and 1-on-1 mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Monthly Plan */}
          <div className="group bg-white rounded-3xl p-8 border border-slate-200 hover:border-indigo-500/80 shadow-2xs hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ease-out hover:-translate-y-2 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full transition-colors duration-200">
                Monthly Track
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">Monthly Membership</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">₹49</span>
                <span className="text-xs text-slate-500 font-bold">/ month</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Ideal for short-term project preparation and module access.</p>
              
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Full access to all engineering courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>AI StudyPod interactive practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Community mentor Q&A support</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout?plan=monthly"
              className="w-full bg-slate-900 group-hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-all duration-300 text-center shadow-xs group-hover:shadow-md block"
            >
              Subscribe Monthly (₹49)
            </Link>
          </div>

          {/* Yearly Plan */}
          <div className="group bg-slate-900 text-white rounded-3xl p-8 border-2 border-indigo-500 hover:border-indigo-400 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 ease-out hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden space-y-6">
            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">
              Best Value
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider bg-slate-800 px-3 py-1 rounded-full">
                Annual Pass
              </span>
              <h4 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors duration-200">Yearly Membership</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-indigo-400">₹499</span>
                <span className="text-xs text-slate-400 font-bold">/ year</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Save 15% on full annual access, project reviews, and certificates.</p>
              
              <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs text-slate-200 font-medium">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">check</span>
                  <span>All Monthly features included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">check</span>
                  <span>Priority 1-on-1 mentor guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">check</span>
                  <span>Industry-verified course certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">check</span>
                  <span>Startup hub & incubation access</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout?plan=yearly"
              className="w-full bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-all duration-300 text-center shadow-xs group-hover:shadow-lg group-hover:shadow-indigo-500/30 block"
            >
              Subscribe Yearly Pass (₹499)
            </Link>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 sm:py-24 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Got Questions?
            </h2>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 cursor-pointer transition"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</h4>
                  <span className="material-symbols-outlined text-[20px] text-slate-500">
                    {activeFaq === idx ? "remove" : "add"}
                  </span>
                </div>
                {activeFaq === idx && (
                  <p className="text-xs text-slate-600 font-medium mt-3 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Footer Integration */}
      <Footer variant="dark" />

    </div>
  );
}
