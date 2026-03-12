"use client";

import React, { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookCover } from "@rebookindia/ui";

const PENDING_REVIEWS = [
  { id: "o1", book: "NCERT Mathematics Class 10", vendor: "PaperShop", orderDate: "Oct 15", image: "https://picsum.photos/400/600?random=1" },
];
const MY_REVIEWS = [
  { id: "r1", book: "DC Pandey Physics NEET", rating: 5, review: "Excellent condition, exactly as described. Super fast delivery!", date: "Sep 28", vendor: "PaperShop" },
];

export default function ReviewsPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl space-y-12">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">My Reviews</h1>
          <p className="text-gray-500 font-medium mt-1">Rate your purchases and help other students.</p>
        </div>

        {/* Pending Reviews */}
        {PENDING_REVIEWS.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-accent rounded-full" />
              <p className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Awaiting Your Review</p>
            </div>
            <div className="flex items-center gap-6">
              <BookCover coverUrl={item.image} title={item.book} size="S" className="w-16 h-20 rounded-2xl object-cover" />
              <div>
                <p className="font-black text-brand-primary">{item.book}</p>
                <p className="text-xs font-bold text-gray-400">{item.vendor} · Ordered {item.orderDate}</p>
              </div>
            </div>

            {submitted.has(item.id) ? (
              <div className="flex items-center gap-3 p-5 bg-green-50 rounded-2xl text-brand-success font-bold">
                <CheckCircle2 size={20} /> Review submitted! Thank you.
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Your Rating</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} onClick={() => setRatings((p) => ({ ...p, [item.id]: s }))}>
                        <Star size={32} className={cn("transition-colors", (ratings[item.id] || 0) >= s ? "text-yellow-500 fill-yellow-500" : "text-gray-200 fill-gray-200")} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Your Review</p>
                  <textarea rows={3} value={texts[item.id] || ""} onChange={(e) => setTexts((p) => ({ ...p, [item.id]: e.target.value }))}
                    placeholder="How was the book condition? Was it accurate as described?"
                    className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary resize-none"
                  />
                </div>
                <button onClick={() => setSubmitted((p) => new Set(p).add(item.id))}
                  className="flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl">
                  <Send size={18} /> Submit Review
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Past Reviews */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Your Past Reviews</h3>
          {MY_REVIEWS.map((r) => (
            <div key={r.id} className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-black text-brand-primary">{r.book}</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={14} className={cn(s <= r.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200")} />)}
                </div>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">{r.review}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{r.vendor} · {r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
