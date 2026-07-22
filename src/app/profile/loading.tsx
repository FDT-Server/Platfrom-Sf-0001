import React from "react";

export default function ProfileLoading() {
  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden md:flex-row flex-col">

      <div className="hidden md:flex md:flex-col bg-blue-600 w-[85px] shrink-0 border-r border-blue-700/50 p-4 justify-between items-center h-full">
        <div className="flex flex-col gap-8 w-full items-center">
          <div className="h-8 w-8 bg-blue-500/80 rounded-lg animate-pulse" />
          <div className="flex flex-col gap-5 w-full items-center mt-4">
            <div className="h-6 w-6 bg-blue-500/80 rounded-md animate-pulse" />
            <div className="h-6 w-6 bg-blue-500/80 rounded-md animate-pulse" />
            <div className="h-6 w-6 bg-blue-500/80 rounded-md animate-pulse" />
            <div className="h-6 w-6 bg-blue-500/80 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="h-8 w-8 bg-blue-500/80 rounded-full animate-pulse" />
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-8 bg-slate-50 justify-between">
        <div className="flex-1 flex flex-col rounded-2xl border border-slate-300 bg-white shadow-sm relative overflow-hidden">

          <div className="w-full h-36 bg-slate-100 rounded-t-2xl animate-pulse" />

          <div className="relative px-6 md:px-10 pb-6 flex-1 flex flex-col">
            <div className="flex justify-between items-end -mt-16 mb-4">

              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 animate-pulse shadow-sm" />

              <div className="h-9 w-24 bg-slate-100 border border-slate-200 rounded-xl animate-pulse" />
            </div>

            <div className="mt-4">
              <div className="h-6 w-48 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-32 bg-slate-100 rounded-md mt-2 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-200 mt-6 opacity-35">
              <div className="h-10 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-md animate-pulse" />
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-4 py-8">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin shadow-sm" />
              <p className="text-xs font-semibold text-slate-500 animate-pulse">Loading profile...</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
