"use client";

import React, { useState } from "react";
import {
  IconFileText,
  IconDownload,
  IconPlayerPlay,
  IconX,
  IconMaximize,
} from "@tabler/icons-react";
import { PostMedia } from "./types";
import { toast } from "sonner";

interface PostGalleryProps {
  media: PostMedia[];
}

export default function PostGallery({ media }: PostGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!media || media.length === 0) return null;

  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");
  const pdfs = media.filter((m) => m.type === "pdf");

  const handleDownloadPdf = (title?: string) => {
    toast.success(`Downloading ${title || "attachment"}...`);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div
          className={`grid gap-2 rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${
            images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img.url)}
              className="relative group cursor-pointer overflow-hidden bg-slate-900 aspect-video md:aspect-auto md:h-80"
            >
              <img
                src={img.url}
                alt={img.title || "Post Image"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                <IconMaximize className="w-6 h-6 drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Placeholder */}
      {videos.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video relative flex items-center justify-center group shadow-sm select-none">
          <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg cursor-pointer">
            <IconPlayerPlay className="w-8 h-8 fill-white ml-1" />
          </div>
          <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md">
            Video Preview Placeholder
          </span>
        </div>
      )}

      {/* PDF Attachment Cards */}
      {pdfs.length > 0 && (
        <div className="flex flex-col gap-2">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex items-center justify-between gap-3 hover:border-blue-300 transition duration-150 select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                  <IconFileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{pdf.title || "Document.pdf"}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{pdf.size || "1.2 MB"} · PDF Document</span>
                </div>
              </div>

              <button
                onClick={() => handleDownloadPdf(pdf.title)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition duration-150 cursor-pointer shrink-0"
              >
                <IconDownload className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition cursor-pointer"
          >
            <IconX className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen preview"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
