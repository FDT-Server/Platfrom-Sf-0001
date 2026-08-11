"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CodeRunner from "@/components/CodeRunner";
import DashboardLayout from "@/components/DashboardLayout";

import { examData } from "./examData";

export default function HTMLExamClient({ user }: { user: any }) {
  const router = useRouter();
  
  // Anti-Cheat & Cooldown State
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [warningsLeft, setWarningsLeft] = useState(3);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Exam State
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [currentSection, setCurrentSection] = useState<"mcq" | "coding">("mcq");
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [currentCodingIndex, setCurrentCodingIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<string, string>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<{ passed: boolean, score: number, message: string } | null>(null);

  // Check Cooldown on Mount
  useEffect(() => {
    const checkCooldown = () => {
      const cooldownEnd = localStorage.getItem("htmlExamCooldownEnd");
      if (cooldownEnd) {
        const endTime = parseInt(cooldownEnd, 10);
        const now = Date.now();
        if (now < endTime) {
          setIsCooldownActive(true);
          setCooldownRemaining(Math.floor((endTime - now) / 1000));
        } else {
          setIsCooldownActive(false);
          localStorage.removeItem("htmlExamCooldownEnd");
        }
      }
    };
    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [user.email]);

  // Timer logic
  useEffect(() => {
    if (!examStarted || timeLeft <= 0 || examResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, examResult]);

  // Anti-Cheat: Visibility Change (Tab Switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && !examResult && document.hidden) {
        handleCheatingDetected("tab_switch");
      }
    };
    
    const handleFullscreenChange = () => {
      if (examStarted && !examResult && !document.fullscreenElement && !showWarningModal) {
        handleCheatingDetected("exited_fullscreen");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [examStarted, examResult, warningsLeft, showWarningModal]);

  const startExam = async () => {
    try {
      const examContainer = document.getElementById("exam-container");
      if (examContainer) {
        await examContainer.requestFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
      setExamStarted(true);
    } catch (err) {
      alert("Failed to enter full-screen mode. Please allow full-screen to start the exam.");
    }
  };

  const setCooldown = () => {
    const cooldownEnd = Date.now() + 2 * 60 * 60 * 1000;
    localStorage.setItem("htmlExamCooldownEnd", cooldownEnd.toString());
  };

  const handleCheatingDetected = (reason: string) => {
    if (warningsLeft > 0) {
      setWarningsLeft(prev => prev - 1);
      setShowWarningModal(true);
    } else {
      setCheatingDetected(true);
      setCooldown();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(e => console.error(e));
      }
      setExamResult({
        passed: false,
        score: 0,
        message: "Exam automatically failed due to repeated violation of exam rules (tab switching or exiting full-screen). You must wait 2 hours before retrying."
      });
    }
  };

  const returnToExam = async () => {
    setShowWarningModal(false);
    try {
      const examContainer = document.getElementById("exam-container");
      if (examContainer) {
        await examContainer.requestFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMcqSelect = (questionId: string, answer: string) => {
    setMcqAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleCodeChange = (questionId: string, code: string) => {
    setCodingAnswers(prev => ({ ...prev, [questionId]: code }));
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    
    // Evaluate MCQs
    let score = 0;
    const totalPoints = examData.mcqs.length + examData.coding.length;
    
    examData.mcqs.forEach(q => {
      if (mcqAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    
    // Evaluate Coding
    examData.coding.forEach(q => {
      const code = codingAnswers[q.id] || "";
      if (q.validator(code)) {
        score += 1;
      }
    });
    
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= 75; // 75% to pass
    
    if (passed) {
      try {
        const res = await fetch("/api/certifications/issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "HTML Developer Certification" })
        });
        
        if (res.ok) {
          setExamResult({ 
            passed: true, 
            score: percentage, 
            message: "Congratulations! You passed the exam and earned your certification. It has been added to your Portfolio." 
          });
        } else {
          setExamResult({ passed: true, score: percentage, message: "You passed, but we couldn't issue the certificate. Please contact support." });
        }
      } catch (e) {
        console.error(e);
        setExamResult({ passed: true, score: percentage, message: "You passed, but an error occurred." });
      }
    } else {
      setCooldown();
      setExamResult({ 
        passed: false, 
        score: percentage, 
        message: "You didn't reach the 75% required passing score. A 2-hour cooldown has been applied. Review the material and try again later!" 
      });
    }
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.error(e));
    }
    
    setIsSubmitting(false);
  };

  if (!user) return <div className="p-8 text-slate-500">Error: User not found.</div>;

  return (
    <DashboardLayout user={user}>
      <div id="exam-container" className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">HTML Developer Certification Exam</h1>
            <p className="text-slate-500 text-sm">20 MCQs • 10 Coding Challenges • 45 Minutes</p>
          </div>
          
          {examStarted && !examResult && (
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-3 px-6 py-2 rounded-full font-bold text-xl ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
                <span className="material-symbols-outlined">timer</span>
                {formatTime(timeLeft)}
              </div>
              <button 
                onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-2 rounded-xl font-bold text-white transition-all bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2"
              >
                Submit Exam
                <span className="material-symbols-outlined text-[18px]">done_all</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {showSubmitConfirm && (
            <div className="fixed inset-0 bg-slate-900/90 z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                <span className="material-symbols-outlined text-6xl text-indigo-500 mb-4">assignment_turned_in</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Submit Exam?</h2>
                <div className="flex flex-col gap-3 my-6 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <div className="flex justify-between">
                     <span className="text-slate-600 font-medium">Attempted:</span>
                     <span className="font-bold text-emerald-600">{Object.keys(mcqAnswers).length + Object.keys(codingAnswers).length} / 30</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-600 font-medium">Not Answered:</span>
                     <span className="font-bold text-red-500">{30 - (Object.keys(mcqAnswers).length + Object.keys(codingAnswers).length)} / 30</span>
                   </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => { setShowSubmitConfirm(false); handleSubmitExam(); }}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showWarningModal && (
            <div className="fixed inset-0 bg-slate-900/90 z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-4 animate-bounce">warning</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Warning!</h2>
                <p className="text-slate-600 mb-6 font-medium">
                  You have switched tabs or exited full-screen mode. This is a violation of exam rules.
                  <br/><br/>
                  <span className="text-red-500 font-bold text-lg">Warnings Remaining: {warningsLeft}</span>
                  <br/><br/>
                  If you run out of warnings, the exam will be automatically terminated!
                </p>
                <button 
                  onClick={returnToExam}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition shadow-lg"
                >
                  Return to Exam (Enter Full-Screen)
                </button>
              </div>
            </div>
          )}

          {!examStarted ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 shadow-xl text-center border border-slate-100 mt-10">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="material-symbols-outlined text-5xl text-orange-600">html</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to start?</h2>
              
              {isCooldownActive ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl mb-8">
                  <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">lock_clock</span>
                    Exam Locked
                  </h3>
                  <p className="mb-4">You recently failed this exam or violated exam rules. You must wait before trying again.</p>
                  <div className="text-3xl font-black">{formatTime(cooldownRemaining)}</div>
                </div>
              ) : (
                <>
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-8 text-sm font-medium text-left">
                    <p className="flex items-start gap-2 mb-2">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      <strong>Strict Anti-Cheat Enforced:</strong> The exam will enter Full-Screen mode. If you exit full-screen or switch tabs/windows at any time, the exam will automatically fail and a 2-hour cooldown will be applied.
                    </p>
                  </div>
                  
                  <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                    This exam tests your knowledge of HTML semantics, structure, and forms. 
                    You have <span className="font-bold text-slate-800">45 minutes</span> to complete the exam. 
                  </p>
                  
                  <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="font-bold">Passing Score:</span>
                      <span>75%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="font-bold">Multiple Choice:</span>
                      <span>20 Questions</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                      <span className="font-bold">Coding Challenges:</span>
                      <span>10 Questions</span>
                    </div>
                    
                    <button 
                      onClick={startExam}
                      className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:-translate-y-1"
                    >
                      Enter Full-Screen & Start
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : examResult ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 shadow-xl text-center border border-slate-100 mt-10">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${examResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <span className="material-symbols-outlined text-5xl">
                  {cheatingDetected ? 'gavel' : examResult.passed ? 'workspace_premium' : 'sentiment_dissatisfied'}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                {cheatingDetected ? 'Exam Terminated' : examResult.passed ? 'Exam Passed!' : 'Exam Failed'}
              </h2>
              
              {!cheatingDetected && (
                <div className="text-6xl font-black my-8" style={{ color: examResult.passed ? '#10b981' : '#ef4444' }}>
                  {Math.round(examResult.score)}%
                </div>
              )}
              
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                {examResult.message}
              </p>
              
              <button 
                onClick={() => router.push(examResult.passed ? '/portfolio' : '/certifications')}
                className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
              >
                {examResult.passed ? 'View Portfolio' : 'Back to Certifications'}
              </button>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto h-full flex flex-col">
              
              {/* Section Tabs */}
              <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-fit mx-auto shrink-0">
                <button 
                  onClick={() => setCurrentSection("mcq")}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${currentSection === "mcq" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  Part 1: Multiple Choice
                </button>
                <button 
                  onClick={() => setCurrentSection("coding")}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${currentSection === "coding" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  Part 2: Coding Challenges
                </button>
              </div>

              {/* Questions Area */}
              <div className="flex-1 pb-32 max-w-4xl mx-auto w-full">
                {currentSection === "mcq" ? (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-bold text-slate-400">Question {currentMcqIndex + 1} of {examData.mcqs.length}</span>
                      {mcqAnswers[examData.mcqs[currentMcqIndex].id] && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md">Answered</span>}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
                      <span className="text-indigo-600 mr-2">{currentMcqIndex + 1}.</span> {examData.mcqs[currentMcqIndex].question}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {examData.mcqs[currentMcqIndex].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleMcqSelect(examData.mcqs[currentMcqIndex].id, opt)}
                          className={`p-5 rounded-xl border-2 text-left font-medium transition-all ${
                            mcqAnswers[examData.mcqs[currentMcqIndex].id] === opt 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                              : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                      <button 
                        onClick={() => setCurrentMcqIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentMcqIndex === 0}
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${currentMcqIndex === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Previous
                      </button>
                      
                      <button 
                        onClick={() => setCurrentMcqIndex(prev => Math.min(examData.mcqs.length - 1, prev + 1))}
                        disabled={currentMcqIndex === examData.mcqs.length - 1}
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${currentMcqIndex === examData.mcqs.length - 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        Next
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                      <span className="text-sm font-bold text-slate-400">Challenge {currentCodingIndex + 1} of {examData.coding.length}</span>
                      {codingAnswers[examData.coding[currentCodingIndex].id] && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md">Attempted</span>}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 shrink-0">
                      <span className="text-indigo-600 mr-2">Code {currentCodingIndex + 1}.</span> {examData.coding[currentCodingIndex].question}
                    </h3>
                    <div className="flex-1 min-h-0 bg-slate-900 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col">
                         <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-700">index.html</div>
                         <textarea 
                           className="flex-1 bg-transparent text-emerald-400 font-mono p-5 focus:outline-none resize-none leading-relaxed"
                           value={codingAnswers[examData.coding[currentCodingIndex].id] !== undefined ? codingAnswers[examData.coding[currentCodingIndex].id] : examData.coding[currentCodingIndex].starterCode}
                           onChange={(e) => handleCodeChange(examData.coding[currentCodingIndex].id, e.target.value)}
                           spellCheck={false}
                         />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6 pt-6 border-t border-slate-100 shrink-0">
                      <button 
                        onClick={() => setCurrentCodingIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentCodingIndex === 0}
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${currentCodingIndex === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Previous
                      </button>
                      
                      <button 
                        onClick={() => setCurrentCodingIndex(prev => Math.min(examData.coding.length - 1, prev + 1))}
                        disabled={currentCodingIndex === examData.coding.length - 1}
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${currentCodingIndex === examData.coding.length - 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        Next
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
          
        </div>
        
        
      </div>
    </DashboardLayout>
  );
}
