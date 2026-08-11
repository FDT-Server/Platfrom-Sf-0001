"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import BackToToolsButton from "@/components/tools/BackToToolsButton";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconClock,
  IconPlayerPlay,
  IconPlayerPause,
  IconRefresh,
  IconCheck,
  IconPlus,
  IconTrash,
  IconSparkles,
} from "@tabler/icons-react";

interface ProductivityContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
}

export default function ProductivityContent({ user }: ProductivityContentProps) {
  // Pomodoro State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: "1", text: "Complete System Design practice session", done: true },
    { id: "2", text: "Review ATS Resume score & recommendations", done: false },
    { id: "3", text: "Solve 2 LeetCode Medium binary tree problems", done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          if (mode === "work") {
            toast.success("Focus session completed! Time for a 5-minute break. 🎉");
            setMode("break");
            setMinutes(5);
          } else {
            toast.info("Break ended! Ready to focus again?");
            setMode("work");
            setMinutes(25);
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "work" ? 25 : 5);
    setSeconds(0);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now().toString(), text: newTaskText.trim(), done: false }]);
    setNewTaskText("");
    toast.success("Task added to daily checklist");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-4 md:p-8 shadow-xs animate-fadeIn">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-100">
          <div className="mb-2.5">
            <BackToToolsButton label="Back to Tools Hub" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
              <IconClock className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Focus & Task Suite
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pomodoro focus cycles and daily study checklist.
          </p>
        </div>

        {/* Split: Pomodoro Timer + Task Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Pomodoro Timer Box */}
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-md">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              {mode === "work" ? "🎯 Focus Session" : "☕ Rest Break"}
            </span>

            {/* Timer Display */}
            <div className="text-6xl md:text-7xl font-extrabold font-mono tracking-tight my-4 text-slate-100">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={toggleTimer}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isActive ? <IconPlayerPause className="w-4 h-4 fill-white" /> : <IconPlayerPlay className="w-4 h-4 fill-white" />}
                {isActive ? "Pause" : "Start Focus"}
              </button>

              <button
                onClick={resetTimer}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition cursor-pointer"
              >
                <IconRefresh className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Daily Task Checklist */}
          <div className="flex flex-col bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <IconSparkles className="w-4 h-4 text-rose-500" /> Daily Target Checklist
            </h3>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a new task target..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <IconPlus className="w-4 h-4" /> Add
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2 flex-1 overflow-y-auto max-h-64 pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        task.done
                          ? "bg-rose-500 border-rose-500 text-white"
                          : "bg-slate-50 border-slate-300 text-transparent"
                      }`}
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-xs font-semibold ${task.done ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {task.text}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
