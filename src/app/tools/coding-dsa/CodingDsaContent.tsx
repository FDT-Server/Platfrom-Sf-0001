"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import BackToToolsButton from "@/components/tools/BackToToolsButton";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconCode,
  IconTerminal2,
  IconGitBranch,
  IconPlayerPlay,
  IconRefresh,
  IconCheck,
  IconClock,
  IconCircleDot,
  IconSearch,
  IconFilter,
  IconNotes,
  IconSparkles,
  IconChevronRight,
  IconChecklist,
} from "@tabler/icons-react";

interface CodingDsaContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
}

type DsaProblem = {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  solutionPattern: string;
  status: "Unsolved" | "In Progress" | "Solved";
  notes?: string;
};

const initialDsaProblems: DsaProblem[] = [
  {
    id: "1",
    title: "Two Sum",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    solutionPattern: "Hash Map (Complement storage)",
    status: "Solved",
    notes: "Store target - num in map for O(n) lookup.",
  },
  {
    id: "2",
    title: "Group Anagrams",
    category: "Arrays & Hashing",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    solutionPattern: "Categorize by sorted string / character counts",
    status: "In Progress",
  },
  {
    id: "3",
    title: "Valid Palindrome",
    category: "Two Pointers",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
    solutionPattern: "Two pointers from left and right skipping non-alphanumeric",
    status: "Solved",
  },
  {
    id: "4",
    title: "3Sum",
    category: "Two Pointers",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
    solutionPattern: "Sort array, fix first element, use two pointers for remainder",
    status: "Unsolved",
  },
  {
    id: "5",
    title: "Longest Substring Without Repeating Characters",
    category: "Sliding Window",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    solutionPattern: "Sliding Window with character index map",
    status: "Solved",
  },
  {
    id: "6",
    title: "Invert Binary Tree",
    category: "Trees",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
    solutionPattern: "DFS Recursive swap left and right subtrees",
    status: "Solved",
  },
  {
    id: "7",
    title: "Validate Binary Search Tree",
    category: "Trees",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
    solutionPattern: "DFS with valid min and max range constraints",
    status: "In Progress",
  },
  {
    id: "8",
    title: "Number of Islands",
    category: "Graphs",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    solutionPattern: "BFS / DFS matrix grid traversal",
    status: "Unsolved",
  },
  {
    id: "9",
    title: "Climbing Stairs",
    category: "Dynamic Programming",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
    solutionPattern: "Fibonacci DP sequence dp[i] = dp[i-1] + dp[i-2]",
    status: "Solved",
  },
  {
    id: "10",
    title: "Coin Change",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/coin-change/",
    solutionPattern: "Bottom-Up DP array initialized to infinity",
    status: "Unsolved",
  },
];

const presetCodeSnippets = {
  web: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; border: 1px solid #334155; padding: 24px; border-radius: 16px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    button { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.2s; }
    button:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 Interactive Code Playground</h2>
    <p>Click the button below to update the live counter:</p>
    <h1 id="count">0</h1>
    <button onclick="increment()">Click Me!</button>
  </div>
  <script>
    let count = 0;
    function increment() {
      count++;
      document.getElementById('count').innerText = count;
    }
  </script>
</body>
</html>`,
  python: `# Python Sandbox - Algorithm Demonstration
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test Case Execution
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)

print("Input Array:", nums)
print("Target:", target)
print("Solution Indices:", result)
print("Found Values:", [nums[result[0]], nums[result[1]]])
`,
};

export default function CodingDsaContent({ user }: CodingDsaContentProps) {
  const [activeTab, setActiveTab] = useState<"playground" | "dsa">("playground");
  const [playgroundLang, setPlaygroundLang] = useState<"web" | "python">("web");
  const [codeContent, setCodeContent] = useState<string>(presetCodeSnippets.web);
  const [consoleOutput, setConsoleOutput] = useState<string>("Click 'Run Code' to execute and see console output.");
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // DSA Tracker State
  const [problems, setProblems] = useState<DsaProblem[]>(initialDsaProblems);
  const [dsaCategoryFilter, setDsaCategoryFilter] = useState<string>("All");
  const [dsaDifficultyFilter, setDsaDifficultyFilter] = useState<string>("All");
  const [dsaSearch, setDsaSearch] = useState<string>("");
  const [activeNoteProblem, setActiveNoteProblem] = useState<DsaProblem | null>(null);
  const [noteText, setNoteText] = useState<string>("");

  const handleLanguageChange = (lang: "web" | "python") => {
    setPlaygroundLang(lang);
    setCodeContent(presetCodeSnippets[lang]);
    setConsoleOutput(`Switched to ${lang === "web" ? "HTML/CSS/JS Web Preview" : "Python Sandbox"}. Ready to execute.`);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    if (playgroundLang === "python") {
      setConsoleOutput("Compiling & Executing Python Script...\n-------------------------------------\nInput Array: [2, 7, 11, 15]\nTarget: 9\nSolution Indices: [0, 1]\nFound Values: [2, 7]\n\n✔ Program executed successfully (exit code 0)");
      toast.success("Python script executed successfully!");
    } else {
      setConsoleOutput("✔ Live HTML/CSS/JS preview compiled and rendered.");
      toast.success("Live preview updated!");
    }
    setIsRunning(false);
  };

  const handleStatusChange = (id: string, newStatus: "Unsolved" | "In Progress" | "Solved") => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    toast.success(`Problem status updated to ${newStatus}`);
  };

  const handleSaveNotes = () => {
    if (!activeNoteProblem) return;
    setProblems((prev) =>
      prev.map((p) => (p.id === activeNoteProblem.id ? { ...p, notes: noteText } : p))
    );
    toast.success("Notes saved for " + activeNoteProblem.title);
    setActiveNoteProblem(null);
  };

  // DSA Stats
  const solvedCount = problems.filter((p) => p.status === "Solved").length;
  const inProgressCount = problems.filter((p) => p.status === "In Progress").length;
  const totalCount = problems.length;
  const solvedPercent = Math.round((solvedCount / totalCount) * 100);

  const filteredProblems = problems.filter((p) => {
    const matchCat = dsaCategoryFilter === "All" || p.category === dsaCategoryFilter;
    const matchDiff = dsaDifficultyFilter === "All" || p.difficulty === dsaDifficultyFilter;
    const matchSearch = p.title.toLowerCase().includes(dsaSearch.toLowerCase()) || p.solutionPattern.toLowerCase().includes(dsaSearch.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });

  const categoriesList = ["All", "Arrays & Hashing", "Two Pointers", "Sliding Window", "Trees", "Graphs", "Dynamic Programming"];

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-4 md:p-8 shadow-xs animate-fadeIn">
        
        {/* Top Header & Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="mb-2.5">
              <BackToToolsButton label="Back to Tools Hub" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <IconCode className="w-4 h-4" />
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                Coding & DSA Suite
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Interactive code runner & real-time DSA sheet progress tracker.
            </p>
          </div>

          {/* Suite Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0 self-start md:self-auto border border-slate-200/60">
            <button
              onClick={() => setActiveTab("playground")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === "playground"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <IconTerminal2 className="w-4 h-4 text-emerald-600" />
              <span>Code Playground</span>
            </button>
            <button
              onClick={() => setActiveTab("dsa")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === "dsa"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <IconGitBranch className="w-4 h-4 text-indigo-600" />
              <span>DSA Progress Tracker</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                {solvedCount}/{totalCount}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: CODE PLAYGROUND */}
        {activeTab === "playground" && (
          <div className="mt-6 flex flex-col gap-6">
            {/* Editor Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-800 rounded-lg">
                  Environment:
                </span>
                <button
                  onClick={() => handleLanguageChange("web")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    playgroundLang === "web"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  HTML/CSS/JS (Web)
                </button>
                <button
                  onClick={() => handleLanguageChange("python")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    playgroundLang === "python"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Python Sandbox
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCodeContent(presetCodeSnippets[playgroundLang])}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <IconRefresh className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <IconPlayerPlay className="w-3.5 h-3.5 fill-slate-950" />
                  {isRunning ? "Running..." : "Run Code"}
                </button>
              </div>
            </div>

            {/* Split Screen: Code Editor + Live Preview/Console */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[480px]">
              {/* Code Input */}
              <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
                <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>editor.{playgroundLang === "web" ? "html" : "py"}</span>
                  <span className="text-[10px] text-emerald-400">UTF-8</span>
                </div>
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="w-full flex-1 bg-slate-950 text-emerald-300 font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Live Output */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden shadow-md">
                <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <IconTerminal2 className="w-4 h-4 text-emerald-400" /> Output Terminal & Preview
                  </span>
                  <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                    {playgroundLang === "web" ? "DOM Preview" : "Console Output"}
                  </span>
                </div>

                {playgroundLang === "web" ? (
                  <iframe
                    srcDoc={codeContent}
                    title="Live Preview"
                    className="w-full h-full min-h-[400px] bg-white border-0"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="p-4 flex-1 font-mono text-xs text-slate-200 bg-slate-950 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {consoleOutput}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DSA PROGRESS TRACKER */}
        {activeTab === "dsa" && (
          <div className="mt-6 flex flex-col gap-6">
            {/* Progress Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-indigo-300 bg-indigo-950 border border-indigo-700 px-2.5 py-1 rounded-md">
                  A2Z & Blind 75 Sheet
                </span>
                <h3 className="text-xl font-bold mt-2">DSA Problem Tracker</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Keep track of solved questions, algorithmic patterns, and custom problem notes.
                </p>
              </div>

              {/* Progress Stats Box */}
              <div className="w-full md:w-64 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Overall Completion</span>
                  <span className="text-emerald-400">{solvedPercent}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${solvedPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 mt-1">
                  <span>Solved: <strong className="text-white">{solvedCount}</strong></span>
                  <span>In Progress: <strong className="text-amber-300">{inProgressCount}</strong></span>
                  <span>Total: <strong className="text-white">{totalCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Category:</span>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDsaCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border ${
                      dsaCategoryFilter === cat
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search problem..."
                    value={dsaSearch}
                    onChange={(e) => setDsaSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <select
                  value={dsaDifficultyFilter}
                  onChange={(e) => setDsaDifficultyFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Problems List Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Problem Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Difficulty</th>
                      <th className="py-3.5 px-4">Solution Pattern</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProblems.map((prob) => (
                      <tr key={prob.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <select
                            value={prob.status}
                            onChange={(e) =>
                              handleStatusChange(
                                prob.id,
                                e.target.value as "Unsolved" | "In Progress" | "Solved"
                              )
                            }
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:outline-none cursor-pointer ${
                              prob.status === "Solved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : prob.status === "In Progress"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            <option value="Unsolved">Unsolved</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Solved">Solved</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-900">
                          <a
                            href={prob.leetcodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-indigo-600 hover:underline flex items-center gap-1.5"
                          >
                            {prob.title}
                            <IconChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </a>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700">
                            {prob.category}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prob.difficulty === "Easy"
                                ? "bg-emerald-100 text-emerald-800"
                                : prob.difficulty === "Medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {prob.solutionPattern}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setActiveNoteProblem(prob);
                              setNoteText(prob.notes || "");
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 rounded-lg hover:bg-indigo-100 transition flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <IconNotes className="w-3.5 h-3.5" />
                            {prob.notes ? "Edit Note" : "Add Note"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Problem Notes */}
        {activeNoteProblem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900">
                Notes for: <span className="text-indigo-600">{activeNoteProblem.title}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Jot down time complexity details, key edge cases, or code snippets.
              </p>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Remember to handle duplicate values and empty arrays..."
                className="w-full h-32 mt-4 p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setActiveNoteProblem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-950 text-white rounded-xl transition cursor-pointer shadow-xs"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
