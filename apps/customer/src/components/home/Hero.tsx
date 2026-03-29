"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BookCover from "@/components/BookCover";

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-br from-[#1B3A6B] via-[#2E75B6] to-[#1B3A6B] dark:from-[#0a0f1e] dark:via-[#0f1f3d] dark:to-[#0a0f1e] text-white pt-24 pb-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">

        {/* Left side */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm text-blue-200 mb-4">
            📚 India&apos;s Book Reuse Revolution
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Buy Books at{" "}
            <span className="text-[#E8962E]">40–70% Off</span> MRP
          </h1>
          <p className="text-blue-100 dark:text-gray-300 text-lg mb-6">
            Verified second-hand books from trusted sellers across India.
            Safe payments. Doorstep delivery.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push("/books")}
              className="bg-[#E8962E] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">
              Browse Books →
            </button>
            <button
              onClick={() => router.push("/sell")}
              className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-full transition-colors">
              Sell Your Books
            </button>
          </div>

          {/* Trust stats */}
          <div className="flex gap-6 mt-8 text-sm">
            <div>
              <p className="text-2xl font-bold text-[#E8962E]">5,000+</p>
              <p className="text-blue-200">Books Listed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8962E]">200+</p>
              <p className="text-blue-200">Verified Sellers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8962E]">4.8★</p>
              <p className="text-blue-200">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Right side — floating book cards */}
        <div className="hidden md:grid grid-cols-2 gap-3">
          {[
            { title: "NCERT Maths 10", price: "₹35", off: "65% OFF", isbn: "9788174506163" },
            { title: "The Alchemist", price: "₹99", off: "60% OFF", isbn: "9780062315007" },
            { title: "DC Pandey Physics", price: "₹299", off: "55% OFF", isbn: "9789313194117" },
            { title: "Atomic Habits", price: "₹149", off: "58% OFF", isbn: "9780735211292" },
          ].map((book) => (
            <div
              key={book.isbn}
              className="bg-white/10 dark:bg-[#1a2744]/40 backdrop-blur rounded-xl p-2 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-[#1a2744]/60 transition-all cursor-pointer"
              onClick={() => router.push("/books")}
            >
              <img
                src={(book as any).coverUrl || `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                alt={book.title}
                className="w-full h-32 object-cover rounded-lg mb-2"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/180x240/1B3A6B/white?text=${encodeURIComponent(book.title?.slice(0,12) || "Book")}`;
                }}
              />
              <p className="text-white text-xs font-medium line-clamp-1">{book.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[#E8962E] font-bold text-sm">{book.price}</span>
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{book.off}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
