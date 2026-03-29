"use client";

interface Props {
  isbn?:      string;
  title?:     string;
  coverUrl?:  string;
  className?: string;
}

export default function BookCover({
  isbn, title, coverUrl, className
}: Props) {
  const src = coverUrl
    ? coverUrl
    : isbn
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
    : `https://placehold.co/180x240/1B3A6B/white?text=${
        encodeURIComponent(title?.slice(0, 12) || "Book")
      }`;

  return (
    <img
      src={src}
      alt={title || "Book"}
      className={className || "w-full h-full object-cover"}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src =
          `https://placehold.co/180x240/1B3A6B/white?text=${
            encodeURIComponent(title?.slice(0, 12) || "Book")
          }`;
      }}
    />
  );
}
