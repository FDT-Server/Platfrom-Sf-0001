"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import BackToToolsButton from "@/components/tools/BackToToolsButton";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconHelpCircle,
  IconBookmark,
  IconBookmarkFilled,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconCheck,
  IconSparkles,
  IconBrain,
  IconTarget,
  IconBulb,
} from "@tabler/icons-react";

interface InterviewPrepContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
}

type QuestionItem = {
  id: string;
  category: "Frontend" | "Backend" | "System Design" | "Behavioral & HR" | "DSA Concepts";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  hint: string;
  answerText: string;
  keyTakeaways: string[];
  bookmarked?: boolean;
  mastered?: boolean;
};

const initialQuestions: QuestionItem[] = [
  {
    id: "q1",
    category: "Frontend",
    difficulty: "Medium",
    question: "Explain the virtual DOM in React and how reconciliation works.",
    hint: "Think about how React minimizes direct DOM mutations using diffing algorithms.",
    answerText:
      "The Virtual DOM is a lightweight, in-memory representation of the real DOM. When component state changes, React creates a new VDOM tree and compares it with the previous VDOM tree using a heuristic O(n) diffing algorithm called reconciliation. It then batches and applies only the calculated differences to the actual browser DOM.",
    keyTakeaways: [
      "VDOM prevents expensive full-page layout re-calculations.",
      "Keys in lists allow React to match children across renders efficiently.",
      "Reconciliation operates under assumptions of component element type equality.",
    ],
  },
  {
    id: "q2",
    category: "Frontend",
    difficulty: "Easy",
    question: "What is the difference between event bubbling and event capturing?",
    hint: "Consider the direction in which event listeners execute in the DOM tree.",
    answerText:
      "Event bubbling phase propagates the event upwards from the target element to ancestor nodes up to the root window. Event capturing phase propagates downwards from the window down to the target element. Standard `addEventListener` uses bubbling by default unless `capture: true` is passed.",
    keyTakeaways: [
      "Capturing happens first (Top to Bottom), followed by Target phase, then Bubbling (Bottom to Top).",
      "event.stopPropagation() halts further propagation in both phases.",
    ],
  },
  {
    id: "q3",
    category: "Backend",
    difficulty: "Medium",
    question: "How do database indexes improve query performance, and what are their write overheads?",
    hint: "Think about B-Tree data structures and why INSERTs become slower with indexes.",
    answerText:
      "Database indexes create auxiliary data structures (typically B-Trees or Hash tables) that allow logarithmic O(log N) lookup time instead of O(N) sequential table scans. However, every INSERT, UPDATE, or DELETE operation requires updating all corresponding index trees, increasing write latency and storage usage.",
    keyTakeaways: [
      "Index columns frequently filtered in WHERE, JOIN, and ORDER BY clauses.",
      "Avoid over-indexing tables with high write frequency.",
    ],
  },
  {
    id: "q4",
    category: "System Design",
    difficulty: "Hard",
    question: "How would you design a rate limiter for a REST API to handle millions of requests?",
    hint: "Compare Token Bucket, Leaky Bucket, and Fixed/Sliding Window Log algorithms.",
    answerText:
      "A distributed rate limiter can be designed using Redis with the Token Bucket or Sliding Window Log algorithm. Requests pass through an API gateway layer which inspects incoming IP or User Tokens, querying Redis using atomic Lua scripts to verify quota limits.",
    keyTakeaways: [
      "Token Bucket supports bursts of traffic smoothly.",
      "Redis memory overhead is minimized using sliding window counter heuristics.",
      "Return HTTP 429 Too Many Requests with Retry-After header.",
    ],
  },
  {
    id: "q5",
    category: "Behavioral & HR",
    difficulty: "Medium",
    question: "Tell me about a time you faced a critical bug production release and how you handled it.",
    hint: "Structure your answer using the STAR method (Situation, Task, Action, Result).",
    answerText:
      "Focus on calm triage, immediate rollback or hotfix mitigation, clear stakeholder communication, and establishing a post-mortem blameless RCA (Root Cause Analysis) to prevent recurrence.",
    keyTakeaways: [
      "Emphasize teamwork and blameless post-mortem culture.",
      "Demonstrate customer-first priority and systematic debugging.",
    ],
  },
];

export default function InterviewPrepContent({ user }: InterviewPrepContentProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openAnswerId, setOpenAnswerId] = useState<string | null>("q1");

  const categories = ["All", "Frontend", "Backend", "System Design", "Behavioral & HR", "DSA Concepts"];

  const toggleBookmark = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, bookmarked: !q.bookmarked } : q))
    );
    toast.success("Updated bookmarks");
  };

  const toggleMastered = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, mastered: !q.mastered } : q))
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchCat = activeCategory === "All" || q.category === activeCategory;
    const matchSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answerText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const masteredCount = questions.filter((q) => q.mastered).length;

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-4 md:p-8 shadow-xs animate-fadeIn">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="mb-2.5">
              <BackToToolsButton label="Back to Tools Hub" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <IconHelpCircle className="w-4 h-4" />
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                Interview Prep Suite
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Curated technical, system design, and behavioral questions with answer guides.
            </p>
          </div>

          {/* Mastered Counter Badge */}
          <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-3 self-start md:self-auto">
            <IconTarget className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">
                Questions Mastered
              </p>
              <p className="text-xs font-bold text-slate-900">
                {masteredCount} of {questions.length} questions
              </p>
            </div>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border ${
                  activeCategory === cat
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 text-slate-650 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search interview topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Questions Accordion List */}
        <div className="mt-6 flex flex-col gap-4">
          {filteredQuestions.map((q) => {
            const isOpen = openAnswerId === q.id;
            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition duration-200 overflow-hidden bg-white ${
                  isOpen ? "border-purple-300 shadow-md" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Question Header Row */}
                <div
                  onClick={() => setOpenAnswerId(isOpen ? null : q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(q.id);
                      }}
                      className="mt-0.5 text-slate-400 hover:text-amber-500 transition cursor-pointer"
                    >
                      {q.bookmarked ? (
                        <IconBookmarkFilled className="w-5 h-5 text-amber-500" />
                      ) : (
                        <IconBookmark className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-150">
                          {q.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-100 text-emerald-800"
                              : q.difficulty === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        {q.mastered && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <IconCheck className="w-3 h-3" /> Mastered
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(q.id);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        q.mastered
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {q.mastered ? "Mastered" : "Mark Mastered"}
                    </button>

                    {isOpen ? (
                      <IconChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <IconChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Collapsible Answer & Key Takeaways Area */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40">
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl mb-4 text-xs text-amber-900 flex items-start gap-2">
                      <IconBulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Interview Hint:</strong> {q.hint}
                      </div>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                      Model Answer
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                      {q.answerText}
                    </p>

                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mt-4 mb-2">
                      Key Takeaways to Mention
                    </h4>
                    <ul className="space-y-1.5">
                      {q.keyTakeaways.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <IconCheck className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
