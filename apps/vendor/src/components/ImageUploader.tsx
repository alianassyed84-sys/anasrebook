"use client";
import { useState, useRef } from "react";
import { uploadImage } from "@/lib/cloudinary";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";

interface Props {
  onUpload:    (url: string) => void;
  onRemove?:   () => void;
  currentUrl?: string;
  folder?:     string;
  label?:      string;
}

export default function ImageUploader({
  onUpload,
  onRemove,
  currentUrl = "",
  folder = "rebookindia/books",
  label = "Upload Photo",
}: Props) {
  const [url,      setUrl]      = useState(currentUrl);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [drag,     setDrag]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("Max 5MB allowed"); return;
    }
    setError("");
    setLoading(true);

    // Show local preview
    const reader = new FileReader();
    reader.onload = e =>
      setUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const cloudUrl = await uploadImage(file, folder);
      setUrl(cloudUrl);
      onUpload(cloudUrl);
    } catch (err: any) {
      console.error(err);
      setError(`ERR: ${err?.message || err} `);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium
        text-gray-700 dark:text-gray-300 block mb-2">
        {label}
      </label>

      <div
        onDragOver={e => {
          e.preventDefault(); setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => {
          e.preventDefault(); setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() =>
          !url && inputRef.current?.click()
        }
        className={`relative h-48 rounded-2xl border-2
          border-dashed overflow-hidden transition-all
          ${drag
            ? "border-[#E8962E] bg-orange-50"
            : "border-gray-200 bg-gray-50"
          }
          ${!url ? "cursor-pointer" : ""}`}
      >
        {url ? (
          <>
            <img src={url} alt="Preview"
              className="w-full h-full object-cover"/>
            <div className="absolute inset-0
              bg-black/40 opacity-0 hover:opacity-100
              transition-opacity flex items-center
              justify-center gap-3">
              <button type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                className="bg-white text-gray-800
                  px-3 py-1.5 rounded-lg text-xs
                  font-medium">
                Change
              </button>
              <button type="button"
                onClick={() => {
                  setUrl(""); onRemove?.();
                }}
                className="bg-red-500 text-white
                  px-3 py-1.5 rounded-lg text-xs
                  font-medium">
                Remove
              </button>
            </div>
            {!loading && (
              <div className="absolute top-2 right-2
                bg-green-500 text-white rounded-full p-1">
                <CheckCircle size={14}/>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center
            justify-center h-full gap-2">
            <Upload size={28} className="text-gray-400"/>
            <p className="text-gray-500 text-sm">
              Drop image or{" "}
              <span className="text-[#1B3A6B] underline">
                browse
              </span>
            </p>
            <p className="text-gray-400 text-xs">
              JPG, PNG, WebP — Max 5MB
            </p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/50
            flex items-center justify-center">
            <Loader2 size={28}
              className="text-white animate-spin"/>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1
          flex items-center gap-1">
          <X size={12}/> {error}
        </p>
      )}

      <input ref={inputRef} type="file"
        accept="image/*"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        className="hidden"/>
    </div>
  );
}
