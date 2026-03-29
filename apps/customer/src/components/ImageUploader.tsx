"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { X, CheckCircle, Loader2, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  currentUrl?: string;
  folder?: string;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  aspectRatio?: "square" | "cover" | "wide";
}

const HEIGHT_MAP = {
  square: "h-40",
  cover: "h-56",
  wide: "h-36",
};

export default function ImageUploader({
  onUpload,
  onRemove,
  currentUrl,
  folder = "rebookindia/profiles",
  label = "Upload Image",
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 5,
  aspectRatio = "square",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setUploading(true);
    setProgress(30);
    try {
      setProgress(60);
      const result = await uploadToCloudinary(file, folder);
      setProgress(100);
      setPreview(result.url);
      onUpload(result.url, result.publicId);
    } catch {
      setError("Upload failed. Please try again.");
      setPreview(currentUrl || "");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  function handleRemove() {
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  }

  return (
    <div className="w-full">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
        {label}
      </label>
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? "#E8962E" : preview ? "#1B3A6B" : "#e5e7eb",
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{ duration: 0.15 }}
        className={`relative w-full ${HEIGHT_MAP[aspectRatio]} border-2 border-dashed rounded-2xl overflow-hidden bg-brand-background transition-colors ${!preview ? "cursor-pointer hover:border-brand-primary" : ""}`}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="bg-white text-brand-primary px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-100 transition-colors">Change</button>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(); }} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-red-600 transition-colors">Remove</button>
              </div>
              {!uploading && <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg"><CheckCircle size={14} /></div>}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                <ImageIcon size={22} className="text-brand-primary" />
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm font-bold">Drop or <span className="text-brand-primary underline">browse</span></p>
                <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP — Max {maxSizeMB}MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {uploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
              <Loader2 size={28} className="text-white animate-spin" />
              <p className="text-white text-sm font-bold">Uploading...</p>
              <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-brand-accent rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs mt-2 flex items-center gap-1 font-bold">
            <X size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  );
}
