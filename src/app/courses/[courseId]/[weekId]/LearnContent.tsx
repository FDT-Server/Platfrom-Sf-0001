"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CodeRunner from "@/components/CodeRunner";
import {
  IconCheck,
  IconLock,
  IconArrowLeft,
  IconChevronRight,
  IconChevronLeft,
  IconMenu2,
  IconCode,
  IconBrowser,
  IconBook,
  IconCertificate,
} from "@tabler/icons-react";

interface Topic {
  id: string;
  title: string;
  explanation: string;
  starterCode: string;
  solutionCode?: string;
  language: string;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  topics: Topic[];
}

interface LearnContentProps {
  user: { fullName: string; email: string; profileImage?: string | null };
  course: { id: string; title: string };
  week: Week;
  completedTopics: string[];
  isLocked: boolean;
  nextWeekId?: string;
  isFinalProject?: boolean;
}

export default function LearnContent({ user, course, week, completedTopics: initialCompleted, isLocked, nextWeekId, isFinalProject }: LearnContentProps) {
  const [completedTopics, setCompletedTopics] = useState<string[]>(initialCompleted);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "help">("code");
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [showSolutionPreview, setShowSolutionPreview] = useState(false);
  const [completionModal, setCompletionModal] = useState<{show: boolean, type: 'course' | 'module', message: string}>({ show: false, type: 'module', message: '' });

  const topics = week.topics;
  const activeTopic = topics[activeTopicIndex];
  
  // Trigger overlay when all topics are completed
  const allDone = topics.every(t => completedTopics.includes(t.id));
  useEffect(() => {
    if (allDone) {
      setShowCompletionOverlay(true);
    }
  }, [allDone]);
  const completedCount = topics.filter(t => completedTopics.includes(t.id)).length;
  const progressPct = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
  const isCurrentDone = activeTopic ? completedTopics.includes(activeTopic.id) : false;

  async function handleMarkComplete() {
    if (!activeTopic || isCurrentDone || markingComplete) return;
    setMarkingComplete(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/complete-topic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: activeTopic.id, weekId: week.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCompletedTopics(data.completedTopics);
        if (data.courseCompleted) {
          setCompletionModal({ show: true, type: 'course', message: "Congratulations! You've completed the entire course and earned your certificate! Check the Certifications tab." });
        } else if (data.weekCompleted) {
          setCompletionModal({ show: true, type: 'module', message: `You've completed "${week.title}"! The next module is now unlocked.` });
        }
        // Auto-advance to next topic
        if (activeTopicIndex < topics.length - 1) {
          setActiveTopicIndex(i => i + 1);
        }
      }
    } catch {
      setCompletionModal({ show: true, type: 'module', message: "Failed to save progress. Please try again." });
    } finally {
      setMarkingComplete(false);
    }
  }

  if (isLocked) {
    return (
      <DashboardLayout user={user}>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <IconLock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Module Locked</h2>
          <p className="text-sm text-slate-500 max-w-sm">Complete the previous module 100% to unlock this one.</p>
          <a href={`/courses/${course.id}`} className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1">
            <IconArrowLeft className="w-4 h-4" /> Back to Course
          </a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      {/* Container is absolutely positioned below the TopNav to prevent any full-page scrolling */}
      <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ top: "61px" }}>
        {/* Top bar */}
        <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <a href={`/courses/${course.id}`} className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-xs font-bold cursor-pointer">
            <IconArrowLeft className="w-4 h-4" /> {course.title}
          </a>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-800 truncate">Module {week.weekNumber}: {week.title}</span>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex gap-2">
              <button
                disabled={activeTopicIndex === 0}
                onClick={() => setActiveTopicIndex(i => i - 1)}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <IconChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={activeTopicIndex === topics.length - 1 || !isCurrentDone}
                onClick={() => setActiveTopicIndex(i => i + 1)}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                Next <IconChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            {!isCurrentDone ? (
              <button
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white font-bold px-4 py-1.5 rounded transition cursor-pointer border-0 text-xs flex items-center gap-1.5"
              >
                <IconCheck className="w-3.5 h-3.5" />
                {markingComplete ? "Saving..." : "Mark as Complete"}
              </button>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-4 py-1.5 rounded text-xs flex items-center gap-1.5">
                <IconCheck className="w-3.5 h-3.5" /> Completed
              </div>
            )}
          </div>
        </div>

        {/* Main layout: sidebar + content */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Topic sidebar */}
          <div 
            className={`shrink-0 border-r border-slate-200 bg-slate-50 overflow-y-auto overflow-x-hidden flex flex-col transition-all duration-300 z-10 ${isSidebarOpen ? "w-64" : "w-16"}`}
            onMouseEnter={() => setIsSidebarOpen(true)}
            onMouseLeave={() => setIsSidebarOpen(false)}
          >
            <div className={`p-4 border-b border-slate-200 flex flex-col gap-2.5 ${!isSidebarOpen && 'items-center px-2'}`}>
              <div className="flex items-center justify-between w-full">
                {isSidebarOpen ? (
                  <>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                    <span className="text-[11px] font-bold text-emerald-600">{progressPct}%</span>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-600 w-full text-center">{progressPct}%</span>
                )}
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              {isSidebarOpen && (
                <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{completedCount} of {topics.length} topics done</span>
              )}
            </div>
            <div className={`p-3 border-b border-slate-200 flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
              {isSidebarOpen ? (
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Topics</p>
              ) : (
                <IconMenu2 className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {topics.map((topic, idx) => {
                const isDone = completedTopics.includes(topic.id);
                const isActive = idx === activeTopicIndex;
                const isUnlocked = idx === 0 || completedTopics.includes(topics[idx - 1].id) || completedTopics.includes(topic.id);
                
                return (
                  <button
                    key={topic.id}
                    disabled={!isUnlocked}
                    onClick={() => setActiveTopicIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition border-0 ${
                      !isUnlocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    } ${
                      isActive
                        ? "bg-indigo-50 border-r-2 border-indigo-500"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-indigo-500 text-white"
                          : !isUnlocked 
                            ? "bg-slate-200 text-slate-400"
                            : "bg-white border border-slate-300 text-slate-500"
                    }`}>
                      {isDone ? <IconCheck className="w-3.5 h-3.5" /> : !isUnlocked ? <IconLock className="w-3 h-3" /> : (idx + 1)}
                    </div>
                    {isSidebarOpen && (
                      <span className={`text-xs whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? "font-bold text-indigo-700" : "font-medium text-slate-700"}`}>
                        {topic.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {allDone && (
              <div className="p-3 bg-emerald-50 border-t border-emerald-200 text-center">
                <p className="text-xs font-bold text-emerald-700">✅ Module Complete!</p>
              </div>
            )}
          </div>

          {/* Content Area */}
          {activeTopic && (
            <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-slate-900 relative">
              {isFinalProject ? (
                <>
                  {/* Tab Navigation (Final Project Only) */}
                  <div className="flex items-center gap-2 p-2 bg-slate-900 border-b border-slate-700 shrink-0">
                    <button onClick={() => setActiveTab('code')} className={`px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition ${activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
                      <IconCode className="w-4 h-4" /> Code
                    </button>
                    <button onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition ${activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
                      <IconBrowser className="w-4 h-4" /> Preview
                    </button>
                    <button onClick={() => setActiveTab('help')} className={`px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition ${activeTab === 'help' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
                      <IconBook className="w-4 h-4" /> Explanation
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-h-0 relative">
                    {/* Explanation Content */}
                    <div className={`absolute inset-0 bg-white overflow-y-auto p-6 md:p-10 ${activeTab === 'help' ? 'block' : 'hidden'}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
                          {week.title}
                        </span>
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-slate-700"
                        style={{ fontSize: "0.95rem", lineHeight: "1.75" }}
                        dangerouslySetInnerHTML={{
                          __html: activeTopic.explanation
                            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                            .replace(/`(.+?)`/g, (m, p1) => `<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em;color:#db2777">${p1.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`)
                            .replace(/```[\s\S]*?```/g, (m) => {
                              const code = m.replace(/```.*\n?/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                              return `<pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto;font-size:0.9em;margin:12px 0">${code}</pre>`;
                            })
                            .replace(/\|(.+)\|/g, (m) => `<tr>${m.split("|").filter(Boolean).map(c => `<td style="border:1px solid #e2e8f0;padding:8px 12px;font-size:0.9rem">${c.trim()}</td>`).join("")}</tr>`)
                            .replace(/\n*^### (.+)\n*/gm, '<h3 style="font-size:1.15rem;font-weight:700;color:#1e293b;margin:12px 0 6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">$1</h3>')
                            .replace(/\n*^## (.+)\n*/gm, '<h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:12px 0 8px;">$1</h2>')
                            .replace(/^- (.+)$/gm, '<li style="margin:6px 0;margin-left:24px;list-style-type:disc;">$1</li>')
                            .replace(/!\[([^\]]*)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin: 16px 0; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />')
                            .replace(/\n\n/g, "<br><br>")
                        }}
                      />
                      
                      {activeTopic.solutionCode && (
                        <div className="mt-12 pt-8 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-800">Final Solution</h3>
                            <button
                              onClick={() => setShowSolutionPreview(!showSolutionPreview)}
                              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow shadow-indigo-200"
                            >
                              <IconBrowser className="w-4 h-4" />
                              {showSolutionPreview ? "Hide Preview" : "View Solution Preview"}
                            </button>
                          </div>
                          
                          {showSolutionPreview && (
                            <div className="w-full h-[600px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner">
                              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border-b border-slate-200 shrink-0">
                                <div className="flex gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-red-400" />
                                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>
                                <span className="text-[10px] text-slate-500 font-medium">Solution Output</span>
                              </div>
                              <iframe
                                srcDoc={activeTopic.solutionCode}
                                title="Solution Preview"
                                sandbox="allow-scripts allow-same-origin allow-forms"
                                className="w-full h-full border-0"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Code Runner */}
                    <div className={`absolute inset-0 ${activeTab !== 'help' ? 'block' : 'hidden'}`}>
                      <CodeRunner
                        key={activeTopic.id}
                        initialCode={activeTopic.starterCode}
                        language={activeTopic.language}
                        activeTab={activeTab === 'preview' ? 'preview' : 'code'}
                        layout="tabs"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Split Layout (Regular Modules) */
                <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">
                  {/* Left: Explanation */}
                  <div className="w-full md:w-[40%] bg-white border-r border-slate-200 overflow-y-auto p-6 md:p-8 flex flex-col relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
                        {week.title}
                      </span>
                    </div>
                    <div
                      className="prose prose-sm max-w-none text-slate-700"
                      style={{ fontSize: "0.95rem", lineHeight: "1.75" }}
                      dangerouslySetInnerHTML={{
                        __html: activeTopic.explanation
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/`(.+?)`/g, (m, p1) => `<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em;color:#db2777">${p1.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`)
                          .replace(/```[\s\S]*?```/g, (m) => {
                            const code = m.replace(/```.*\n?/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            return `<pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto;font-size:0.9em;margin:12px 0">${code}</pre>`;
                          })
                          .replace(/\|(.+)\|/g, (m) => `<tr>${m.split("|").filter(Boolean).map(c => `<td style="border:1px solid #e2e8f0;padding:8px 12px;font-size:0.9rem">${c.trim()}</td>`).join("")}</tr>`)
                          .replace(/\n*^### (.+)\n*/gm, '<h3 style="font-size:1.15rem;font-weight:700;color:#1e293b;margin:12px 0 6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">$1</h3>')
                          .replace(/\n*^## (.+)\n*/gm, '<h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:12px 0 8px;">$1</h2>')
                          .replace(/^- (.+)$/gm, '<li style="margin:6px 0;margin-left:24px;list-style-type:disc;">$1</li>')
                          .replace(/!\[([^\]]*)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin: 16px 0; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />')
                          .replace(/\n\n/g, "<br><br>")
                      }}
                    />
                  </div>

                  {/* Right: Code Runner (Split Layout) */}
                  <div className="w-full md:w-[60%] flex flex-col min-h-0 bg-slate-900 relative">
                    <CodeRunner 
                      key={activeTopic.id} 
                      initialCode={activeTopic.starterCode} 
                      language={activeTopic.language} 
                      layout="split" 
                    />
                  </div>
                </div>
              )}              {/* Module Completion Overlay */}
              {showCompletionOverlay && (
                <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-8">
                  <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center transform transition-all border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {isFinalProject ? <IconCertificate className="w-10 h-10 text-emerald-600" /> : <IconCheck className="w-10 h-10 text-emerald-600" />}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                      {isFinalProject ? "Course Completed!" : "Module Complete!"}
                    </h2>
                    <p className="text-slate-600 mb-8 text-lg">
                      {isFinalProject 
                        ? "You've successfully finished every module and the final project. Your certificate is ready!"
                        : "Great job completing all the topics in this module. You're ready to move on to the next one."}
                    </p>
                    <div className="flex flex-col gap-3">
                      {isFinalProject ? (
                        <a
                          href="/portfolio"
                          className="inline-flex items-center justify-center w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition text-lg shadow-lg shadow-indigo-200"
                        >
                          <IconCertificate className="w-6 h-6" /> Claim Your Certificate
                        </a>
                      ) : nextWeekId ? (
                        <a
                          href={`/courses/${course.id}/${nextWeekId}`}
                          className="inline-flex items-center justify-center w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition text-lg shadow-lg shadow-indigo-200"
                        >
                          Start Next Module <IconChevronRight className="w-6 h-6" />
                        </a>
                      ) : null}
                      <button
                        onClick={() => setShowCompletionOverlay(false)}
                        className="inline-flex items-center justify-center w-full text-slate-500 font-bold py-3 hover:text-slate-800 transition"
                      >
                        Review Module Topics
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Beautiful Completion Modal */}
      {completionModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-md w-full text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.4)] relative">
              <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping"></div>
              {completionModal.type === 'course' ? (
                <IconCertificate className="w-10 h-10 animate-bounce" />
              ) : (
                <IconCheck className="w-10 h-10 animate-pulse" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {completionModal.type === 'course' ? 'Course Completed!' : 'Module Unlocked!'}
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              {completionModal.message}
            </p>
            <button
              onClick={() => {
                setCompletionModal({ ...completionModal, show: false });
                if (completionModal.type === 'course') {
                  window.location.href = '/certifications';
                }
              }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
            >
              {completionModal.type === 'course' ? 'View Certificate' : 'Continue Learning'}
            </button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
