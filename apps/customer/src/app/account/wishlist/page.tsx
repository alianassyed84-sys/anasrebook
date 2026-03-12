"use client";

import React, { useState } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BookCover } from "@rebookindia/ui";

const WISHLIST = [
  { id: "b_1", title: "NCERT Mathematics Class 10", author: "NCERT", price: 35, mrp: 85, image: "https://picsum.photos/400/600?random=1", rating: 4.8, inStock: true },
  { id: "b_11", title: "Laxmikant Indian Polity", author: "M. Laxmikant", price: 320, mrp: 750, image: "https://picsum.photos/400/600?random=11", rating: 4.9, inStock: true },
  { id: "b_15", title: "The Alchemist", author: "Paulo Coelho", price: 99, mrp: 299, image: "https://picsum.photos/400/600?random=15", rating: 4.7, inStock: false },
];

export default function WishlistPage() {
  const [items, setItems] = useState(WISHLIST);

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Saved Books</h1>
          <p className="text-gray-500 font-medium mt-1">{items.length} books in your wishlist</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32 space-y-6">
            <Heart size={64} className="text-gray-200 mx-auto" />
            <p className="text-xl font-black text-gray-400">Your wishlist is empty</p>
            <Link href="/categories" className="inline-block bg-brand-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl">Browse Books</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((book, i) => (
                <motion.div key={book.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all"
                >
                  <Link href={`/books/${book.id}`}>
                    <div className="relative aspect-[3/4] bg-brand-background overflow-hidden">
                      <BookCover coverUrl={book.image} title={book.title} size="M" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      {!book.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-brand-primary font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-brand-primary text-sm line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-gray-400 font-bold">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-brand-primary">{book.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 line-through font-bold">₹{book.mrp}</span>
                        <p className="text-xl font-black text-brand-primary">₹{book.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={!book.inStock}
                        className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-black text-xs hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                      <button onClick={() => setItems((p) => p.filter((b) => b.id !== book.id))}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
