"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { IconAward, IconDownload, IconShare, IconExternalLink } from "@tabler/icons-react";

interface CertificateProps {
  id: string;
  title: string;
  issuer: string | null;
  issueDate: string | null;
  credentialId: string | null;
}

interface CertificationsContentProps {
  user: { fullName: string; email: string; profileImage?: string | null };
  certificates: CertificateProps[];
}

export default function CertificationsContent({ user, certificates }: CertificationsContentProps) {
  return (
    <DashboardLayout user={user}>
      <div className="w-full flex flex-col gap-8 animate-fadeIn p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-850">My Portfolio</h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            View and manage all the certifications you have earned through the Student Forge platform. These certificates verify your completion of official courses and can be shared on your resume or LinkedIn.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="w-full bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <IconAward className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No Certifications Yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-8">
              You haven't earned any certificates. Enroll in our platform courses and complete all the modules to automatically earn your first certificate!
            </p>
            <div className="flex gap-4">
              <a href="/courses" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm">
                Explore Courses
              </a>
              <a href="/certifications" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm">
                Explore Certifications
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="h-40 bg-gradient-to-br from-indigo-900 to-indigo-700 relative overflow-hidden p-6 flex flex-col items-center justify-center text-center">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <IconAward className="w-32 h-32 text-white" />
                  </div>
                  <IconAward className="w-10 h-10 text-amber-400 mb-3 drop-shadow-md z-10" />
                  <p className="text-[10px] uppercase tracking-widest text-indigo-200 font-bold z-10">Certificate of Completion</p>
                  <h3 className="text-white font-serif italic text-xl font-bold mt-1 z-10 line-clamp-2">{user.fullName}</h3>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-extrabold text-slate-800 text-lg mb-1 leading-tight">{cert.title.replace("Completion Certificate: ", "")}</h4>
                  <p className="text-xs text-slate-500 mb-4">{cert.issuer}</p>
                  
                  <div className="mt-auto space-y-2 text-[11px] text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issued On:</span>
                      <span className="text-slate-800">{cert.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credential ID:</span>
                      <span className="text-slate-800 font-mono">{cert.credentialId}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 rounded-lg transition border border-indigo-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                      <IconDownload className="w-3.5 h-3.5" /> Download
                    </button>
                    <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-lg transition border border-slate-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                      <IconShare className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
