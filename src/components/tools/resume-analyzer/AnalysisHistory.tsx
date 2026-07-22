"use client";

import React, { useState } from "react";
import {
  IconHistory,
  IconClock,
  IconTrendingUp,
  IconCheck,
  IconArrowRight,
  IconTrash,
  IconFileText,
} from "@tabler/icons-react";
import { toast } from "sonner";

export interface HistoryRecord {
  id: string;
  date: string;
  score: number;
  fileName: string;
  trend: "+5%" | "+12%" | "0%" | "Baseline";
  fileSize: string;
}

interface AnalysisHistoryProps {
  onSelectRecord?: (record: HistoryRecord) => void;
}

export default function AnalysisHistory({ onSelectRecord }: AnalysisHistoryProps) {
  const [records, setRecords] = useState<HistoryRecord[]>([
    {
      id: "hist-1",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      score: 87,
      fileName: "Alex_Morgan_Resume_v3.pdf",
      trend: "+12%",
      fileSize: "154 KB",
    },
    {
      id: "hist-2",
      date: "Jul 15, 2026",
      score: 75,
      fileName: "Alex_Morgan_Resume_v2.docx",
      trend: "+5%",
      fileSize: "142 KB",
    },
    {
      id: "hist-3",
      date: "Jul 02, 2026",
      score: 70,
      fileName: "Alex_Morgan_Resume_Draft.pdf",
      trend: "Baseline",
      fileSize: "138 KB",
    },
  ]);

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast.success("History item deleted.");
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 10
            </span>
            <h3 className="text-lg font-bold text-slate-800">Analysis History & Improvement Trend</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track historical ATS scans, score increments over time, and compare version performance.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {records.map((record) => (
          <div
            key={record.id}
            onClick={() => onSelectRecord && onSelectRecord(record)}
            className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50/80 transition-all cursor-pointer shadow-2xs gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                <IconFileText className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{record.fileName}</h4>
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {record.fileSize}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <IconClock className="w-3.5 h-3.5 text-slate-400" /> {record.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <IconTrendingUp className="w-3.5 h-3.5" /> Trend: {record.trend}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Score:</span>
                <span
                  className={`text-sm font-extrabold px-3 py-1 rounded-lg border ${
                    record.score >= 80
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {record.score} / 100
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleDeleteRecord(record.id, e)}
                  title="Delete from history"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
                <IconArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
