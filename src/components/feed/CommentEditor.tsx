"use client";

import React, { useState } from "react";
import {
  IconMoodSmile,
  IconPhoto,
  IconAt,
  IconCode,
  IconSend,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface CommentEditorProps {
  currentUser: {
    name: string;
    image?: string | null;
  };
  onSubmitComment: (text: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  autoFocus?: boolean;
}

export default function CommentEditor({
  currentUser,
  onSubmitComment,
  placeholder = "Write a thoughtful comment...",
  buttonLabel = "Comment",
  autoFocus = false,
}: CommentEditorProps) {
  const [text, setText] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  const initials = currentUser.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SF";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmitComment(text.trim());
    setText("");
    setShowCodeInput(false);
  };

  const handleInsertEmoji = () => {
    setText((prev) => prev + " 🚀");
    toast.info("Inserted emoji placeholder!");
  };

  const handleAttachImage = () => {
    toast.info("Image attachment feature ready for backend integration.");
  };

  const handleMention = () => {
    setText((prev) => prev + " @Aarav ");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      {currentUser.image ? (
        <img
          src={currentUser.image}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0 mt-0.5"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
          {initials}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <textarea
          rows={2}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner resize-none"
        />
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleInsertEmoji}
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition cursor-pointer"
              title="Insert Emoji"
            >
              <IconMoodSmile className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAttachImage}
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
              title="Attach Image"
            >
              <IconPhoto className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleMention}
              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 transition cursor-pointer"
              title="Mention User"
            >
              <IconAt className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition cursor-pointer"
              title="Code Snippet"
            >
              <IconCode className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl px-4 py-1.5 transition duration-150 shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <IconSend className="w-3.5 h-3.5" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
