"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconPlayerPlay, IconRefresh } from "@tabler/icons-react";

interface CodeRunnerProps {
  initialCode: string;
  language?: string;
  activeTab?: "code" | "preview";
  layout?: "tabs" | "split";
}

export default function CodeRunner({ initialCode, language = "html", activeTab = "code", layout = "tabs" }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Live preview debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setOutput(code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code]);

  // Re-run when initialCode changes (topic change)
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  function resetCode() {
    setCode(initialCode);
  }

  // Handle tab key in textarea
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current!;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      }, 0);
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Editor</span>
          <span className="text-[10px] bg-slate-700 text-amber-400 px-2 py-0.5 rounded font-mono uppercase">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCode}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-700 transition cursor-pointer"
          >
            <IconRefresh className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Editor / Output toggle based on activeTab or layout */}
      <div className={`flex flex-1 min-h-0 overflow-hidden relative bg-slate-900 ${layout === 'split' ? 'flex-col' : ''}`}>
        
        {/* Code editor */}
        <div className={`${layout === 'split' ? 'flex flex-1 relative' : `absolute inset-0 flex-col ${activeTab === 'code' ? 'flex' : 'hidden'}`}`}>
          {layout === 'split' && (
            <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-bl uppercase font-bold z-10">HTML/CSS/JS</div>
          )}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full bg-slate-900 text-slate-100 font-mono text-[14px] leading-relaxed p-4 resize-none focus:outline-none"
            style={{ fontFamily: "'Fira Code', 'Courier New', monospace" }}
          />
        </div>

        {/* Output iframe */}
        <div className={`${layout === 'split' ? 'flex flex-1 relative border-t-4 border-slate-700 bg-white' : `absolute inset-0 flex-col bg-white ${activeTab === 'preview' ? 'flex' : 'hidden'}`}`}>
          {layout === 'split' && (
            <div className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[10px] px-2 py-1 rounded-bl uppercase font-bold z-10 shadow-sm border-b border-l border-slate-300">Live Output</div>
          )}
          <iframe
            srcDoc={output}
            title="Output"
            sandbox="allow-scripts allow-same-origin allow-forms"
            className="flex-1 w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
