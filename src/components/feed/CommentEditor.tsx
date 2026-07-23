"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  IconMoodSmile,
  IconPhoto,
  IconAt,
  IconCode,
  IconSend,
  IconX,
  IconUser,
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

const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗",
  "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄",
  "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯",
  "🤠", "🥳", "😎", "🤓", "🧐", "👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆",
  "👇", "☝️", "🖐️", "✋", "🖖", "👋", "🤚", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "🧠", "🔥", "✨", "🎉",
  "❤️", "💖", "💙", "💚", "💛", "💜", "🖤", "💯", "⭐", "🌟", "💫", "🚀", "💻", "🖥️", "📱", "⚙️", "💡", "📚"
];

export default function CommentEditor({
  currentUser,
  onSubmitComment,
  placeholder = "Write a thoughtful comment...",
  buttonLabel = "Comment",
  autoFocus = false,
}: CommentEditorProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [membersList, setMembersList] = useState<{ id: string; fullName: string }[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchUsersForMentions = async () => {
      try {
        const res = await fetch(`/api/users?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users)) {
            setMembersList(data.users.map((u: any) => ({ id: u.id, fullName: u.fullName })));
          }
        }
      } catch (err) {
        console.error("Failed to load mention members:", err);
      }
    };
    fetchUsersForMentions();
  }, []);

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
    setShowEmojiPicker(false);
    setShowMentionPicker(false);
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSelectMention = (name: string) => {
    const firstName = name.split(" ")[0];
    setText((prev) => {
      const trimmed = prev.trimEnd();
      return trimmed ? `${trimmed} @${firstName} ` : `@${firstName} `;
    });
    setShowMentionPicker(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleAttachImage = () => {
    toast.info("Image attachment option ready!");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      {currentUser.image ? (
        <img
          src={currentUser.image}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0 mt-0.5"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
          {initials}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <textarea
          ref={textareaRef}
          rows={2}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner resize-none"
        />

        {/* Floating Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute left-4 bottom-14 z-30 bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 w-72 max-h-56 overflow-y-auto animate-fadeIn select-none">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-800">Select Emoji</span>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              >
                <IconX className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_LIST.map((e, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectEmoji(e)}
                  className="hover:scale-125 transition-transform duration-100 p-1 text-base rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floating Mention User Selector */}
        {showMentionPicker && (
          <div className="absolute left-16 bottom-14 z-30 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2.5 w-64 max-h-52 overflow-y-auto animate-fadeIn select-none">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-800">Mention Member</span>
              <button
                type="button"
                onClick={() => setShowMentionPicker(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              >
                <IconX className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {membersList.length > 0 ? (
                membersList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMention(m.fullName)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-blue-50 text-left transition cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold">
                      {m.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate">{m.fullName}</span>
                  </button>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 text-center py-2">No members found</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowMentionPicker(false);
              }}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                showEmojiPicker ? "bg-amber-100 text-amber-700" : "text-slate-500 hover:text-amber-600 hover:bg-slate-100"
              }`}
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
              onClick={() => {
                setShowMentionPicker(!showMentionPicker);
                setShowEmojiPicker(false);
              }}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                showMentionPicker ? "bg-purple-100 text-purple-700" : "text-slate-500 hover:text-purple-600 hover:bg-slate-100"
              }`}
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
