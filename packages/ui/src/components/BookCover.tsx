"use client";

import React, { useState } from "react";
import { Book as BookIcon } from "lucide-react";
import Image from "next/image";

interface BookCoverProps {
  isbn?: string;
  title?: string;
  coverUrl?: string; // custom cover from db
  imageId?: string; // appwrite storage id
  size?: "S" | "M" | "L";
  className?: string;
  bucketId?: string; // used with imageId preview
  projectId?: string; // used with imageId preview
}

export function BookCover({ isbn, title, coverUrl, imageId, size = "M", className, bucketId, projectId }: BookCoverProps) {
  const [imgError, setImgError] = useState(false);

  // Determine Image URL logic priority:
  // 1. Appwrite Storage Image ID
  // 2. Exact coverUrl from DB
  // 3. OpenLibrary ISBN fetch
  let imageUrl = "";

  if (imageId && bucketId && projectId) {
      imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageId}/preview?project=${projectId}`;
  } else if (coverUrl && coverUrl.trim() !== "") {
      imageUrl = coverUrl;
  } else if (isbn && isbn.trim() !== "") {
      imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
  }

  // Fallback if no valid URL or if image failed to load
  if (imgError || !imageUrl) {
    return (
      <div className={`bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800
                       flex flex-col items-center justify-center
                       rounded-md text-slate-500 dark:text-slate-400 ${className}`}>
        <BookIcon size={size === "S" ? 24 : size === "L" ? 48 : 32} className="opacity-50" />
        {title && size !== "S" && (
          <span className="text-[10px] sm:text-xs text-center px-3 mt-3 opacity-70 line-clamp-2 font-medium">
            {title}
          </span>
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={`Cover of ${title || 'book'}`}
      className={`object-cover rounded-md bg-slate-100 dark:bg-slate-800 ${className}`}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}
