"use client";

import React, { useState } from "react";
import { Search, Filter, SlidersHorizontal, ChevronDown, BookOpen, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BookCover } from "@rebookindia/ui";

const CATEGORIES = ["All", "School", "College", "NEET", "JEE", "UPSC", "Novels"];
const CONDITIONS = ["Any", "Like New", "Good", "Fair", "Acceptable"];

const MOCK_BOOKS = [
  { id: "b_1", title: "NCERT Mathematics Class 10", author: "NCERT", price: 35, mrp: 85, discount: 58, condition: "good", category: "School", image: "https://picsum.photos/400/600?random=1" },
  { id: "b_8", title: "DC Pandey Physics NEET", author: "D.C. Pandey", price: 280, mrp: 650, discount: 56, condition: "good", category: "NEET", image: "https://picsum.photos/400/600?random=8" },
  { id: "b_11", title: "Laxmikant Indian Polity", author: "M. Laxmikant", price: 320, mrp: 750, discount: 57, condition: "good", category: "UPSC", image: "https://picsum.photos/400/600?random=11" },
  { id: "b_15", title: "The Alchemist", author: "Paulo Coelho", price: 99, mrp: 299, discount: 66, condition: "good", category: "Novels", image: "https://picsum.photos/400/600?random=15" },
  { id: "b_16", title: "Atomic Habits", author: "James Clear", price: 199, mrp: 499, discount: 60, condition: "like_new", category: "Novels", image: "https://picsum.photos/400/600?random=16" },
  { id: "b_18", title: "Engineering Maths BS Grewal", author: "B.S. Grewal", price: 300, mrp: 750, discount: 60, condition: "good", category: "College", image: "https://picsum.photos/400/600?random=18" },
];

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("Any");

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Search Header */}
        <div className="flex flex-col gap-6 mb-12">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Browse Books</h1>
          
          <div className="relative group max-w-2xl">
            <div className="absolute -inset-1 bg-brand-primary rounded-[1.5rem] blur opacity-5 group-hover:opacity-10 transition duration-500" />
            <div className="relative flex items-center bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
              <Search className="ml-4 text-gray-400" size={22} />
              <input 
                type="text" 
                placeholder="Search by title, author, or publisher..."
                className="flex-1 px-4 py-3 bg-transparent outline-none text-brand-primary font-medium"
              />
              <button className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-secondary transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-50 text-brand-primary">
                <SlidersHorizontal size={18} />
                <span className="font-bold">Filters</span>
              </div>

              {/* Category Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Category</h4>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                        selectedCategory === cat 
                          ? "bg-brand-light text-brand-primary shadow-sm" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-brand-primary"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Condition</h4>
                <div className="flex flex-col gap-2">
                  {CONDITIONS.map(cond => (
                    <button 
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={cn(
                        "text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                        selectedCondition === cond 
                          ? "bg-brand-light text-brand-primary shadow-sm" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-brand-primary"
                      )}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Price Range</h4>
                <div className="space-y-4">
                  <input type="range" className="w-full accent-brand-primary" min="0" max="1000" />
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>₹0</span>
                    <span>₹1000+</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-500">
                Showing <span className="text-brand-primary">240</span> results for <span className="text-brand-primary">"All Books"</span>
              </p>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Sort By: Popular</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_BOOKS.map((book, index) => (
                <motion.div 
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group block bg-white rounded-3xl border border-gray-100 p-4 hover:shadow-2xl hover:border-brand-secondary/20 transition-all"
                >
                  <Link href={`/book/${book.id}`} className="block">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-brand-background">
                      <BookCover coverUrl={book.image} title={book.title} size="M" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        {book.discount}% OFF
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-brand-light text-brand-primary px-2 py-0.5 rounded-md">{book.category}</span>
                    </div>
                    <Link href={`/book/${book.id}`}>
                      <h4 className="font-bold text-brand-primary line-clamp-1 group-hover:text-brand-secondary transition-colors">{book.title}</h4>
                    </Link>
                    <p className="text-sm text-gray-500 font-medium">{book.author}</p>
                    
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through font-bold">&#8377;{book.mrp}</span>
                        <span className="text-xl font-black text-brand-primary">&#8377;{book.price}</span>
                      </div>
                      <button className="bg-brand-primary text-white p-3 rounded-xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/10">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
