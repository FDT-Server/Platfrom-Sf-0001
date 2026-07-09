"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";


const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0 text-indigo-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [signUpStep, setSignUpStep] = useState<number>(1);
  
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  
  const roles = [
    "Experienced Software Engineer / Lead",
    "Product / Project Manager",
    "New / Aspiring Developer",
    "Academic Trainer / Instructor",
    "Other"
  ];
  const [selectedRole, setSelectedRole] = useState("New / Aspiring Developer");
  const [otherRoleText, setOtherRoleText] = useState("");

  
  const initialGoals = [
    { id: "frontend", label: "Master Frontend Engineering (React, Next.js, CSS)", checked: true },
    { id: "backend", label: "Build Robust Backend APIs & Database Architectures", checked: false },
    { id: "ai", label: "Integrate Generative AI & Large Language Models", checked: false },
    { id: "system", label: "Design High-Availability Cloud & System Design", checked: false },
    { id: "devops", label: "Automate Infrastructure, CI/CD, & DevOps Pipelines", checked: false }
  ];
  const [goals, setGoals] = useState(initialGoals);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const handleNextStep = () => {
    if (signUpStep < 3) {
      setSignUpStep(signUpStep + 1);
    } else {
      handleSignupSubmit();
    }
  };

  const handlePrevStep = () => {
    if (signUpStep > 1) {
      setSignUpStep(signUpStep - 1);
    }
  };

  const handleSignupSubmit = async () => {
    setError("");
    setLoading(true);

    const selectedGoals = goals.filter(g => g.checked).map(g => g.label);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          selectedRole,
          otherRoleText: selectedRole === "Other" ? otherRoleText : null,
          goals: selectedGoals,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
      } else {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const isPasswordValid = password.trim().length >= 6;
  const isStep1Valid = fullName.trim() !== "" && email.includes("@") && isPasswordValid;

  return (
    <AppLayout mode="signup">
      <div className="flex flex-col justify-between h-full w-full max-w-md">
        
        
        <div className="flex items-center gap-1.5 mb-6">
          <button 
            onClick={() => setSignUpStep(1)} 
            className={`h-2 rounded-full transition-all duration-300 ${signUpStep === 1 ? "w-8 bg-indigo-600" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
            title="Step 1: Credentials"
          />
          <button 
            onClick={() => isStep1Valid && setSignUpStep(2)} 
            disabled={!isStep1Valid}
            className={`h-2 rounded-full transition-all duration-300 ${signUpStep === 2 ? "w-8 bg-indigo-600" : "w-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50"}`}
            title="Step 2: Position/Role"
          />
          <button 
            onClick={() => isStep1Valid && setSignUpStep(3)} 
            disabled={!isStep1Valid}
            className={`h-2 rounded-full transition-all duration-300 ${signUpStep === 3 ? "w-8 bg-indigo-600" : "w-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50"}`}
            title="Step 3: Goals"
          />
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">
            {error}
          </div>
        )}

        
        {signUpStep === 1 && (
          <div className="flex-grow flex flex-col justify-between animate-fadeIn">
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h3>
                <p className="text-slate-500 text-sm mt-1">Fill out your profile credentials to get started.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if(isStep1Valid) handleNextStep(); }}>
                <div>
                  <label htmlFor="full-name" className="text-[10px] font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full-name"
                    name="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adam Wake"
                    className="w-full px-4 py-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-[10px] font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adam@example.com"
                    className="w-full px-4 py-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className="text-[10px] font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      name="new-password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min. 6 characters)"
                      className="w-full px-4 py-2.5 pr-10 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition placeholder-slate-400 hover:border-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none p-1"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
              <Link 
                href="/login" 
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition"
              >
                Already have an account? Sign In
              </Link>
              <button
                onClick={handleNextStep}
                disabled={!isStep1Valid}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-none text-sm font-semibold transition duration-200 shadow-sm cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        
        {signUpStep === 2 && (
          <div className="flex-grow flex flex-col justify-between animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2.5xl">
                What best describes your current position in tech?
              </h3>

              <div className="mt-4 bg-indigo-50/50 border border-indigo-100/70 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-indigo-900">
                <InfoIcon />
                <p>
                  <span className="font-semibold">38% of our students</span> are not fully utilizing our resources, this allows us to tailor your learning experience.
                </p>
              </div>

              <div className="mt-5 space-y-2.5">
                {roles.map((role) => {
                  const isSelected = selectedRole === role;
                  return (
                    <div key={role} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`w-full text-left py-3.5 px-5 rounded-none border text-sm font-medium transition duration-200 ${
                          isSelected
                            ? "border-indigo-600 ring-1 ring-indigo-600 text-indigo-900 shadow-sm"
                            : "border-slate-300 text-slate-700 bg-white hover:border-slate-400 hover:bg-slate-50/40"
                        }`}
                      >
                        {role}
                      </button>
                      {role === "Other" && isSelected && (
                        <input
                          type="text"
                          value={otherRoleText}
                          onChange={(e) => setOtherRoleText(e.target.value)}
                          placeholder="Please specify your position..."
                          className="mt-2 w-full px-4 py-2 rounded-none border border-slate-300 focus:outline-none focus:border-indigo-500 text-slate-800 text-xs transition animate-slideDown"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-6">
              <button
                onClick={handlePrevStep}
                className="border border-slate-300 hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-none text-sm font-semibold transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-none text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        
        {signUpStep === 3 && (
          <div className="flex-grow flex flex-col justify-between animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2.5xl">
                What are your primary learning goals?
              </h3>
              <p className="text-slate-500 text-sm mt-1">Select all areas you want to prioritize.</p>

              <div className="mt-6 space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full text-left py-4 px-5 rounded-none border flex items-center justify-between text-sm font-medium transition duration-200 ${
                      goal.checked
                        ? "border-indigo-600 bg-indigo-50/10 text-indigo-950 ring-1 ring-indigo-600"
                        : "border-slate-300 text-slate-700 bg-white hover:border-slate-400 hover:bg-slate-50/40"
                    }`}
                  >
                    <span>{goal.label}</span>
                    <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-all ${
                      goal.checked 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "border-slate-300 bg-white"
                    }`}>
                      {goal.checked && <CheckIcon />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-6">
              <button
                onClick={handlePrevStep}
                className="border border-slate-300 hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-none text-sm font-semibold transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-none text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                {loading ? "Completing..." : "Complete Sign Up"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
