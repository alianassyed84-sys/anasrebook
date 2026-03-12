"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, ShoppingCart, BookOpen,
  X, Star, ArrowUpDown, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, Query } from "@/lib/appwrite";
import toast from "react-hot-toast";

const CATEGORIES = ["school", "college", "neet", "upsc", "novel", "other"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function BookCard({ book }: { book: any }) {
  const router = useRouter();
  const discount = book.mrp > 0 ? Math.round(((book.mrp - book.sellingPrice) / book.mrp) * 100) : 0;
  

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((item: any) => item.$id === book.$id);
    if (!exists) {
      cart.push(book);
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("📚 Added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      toast.error("Already in cart!");
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/checkout?bookId=" + book.$id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div 
        onClick={() => router.push(`/book/${book.$id}`)}
        className="block group bg-white rounded-3xl border border-gray-100 p-4 hover:shadow-2xl hover:border-brand-secondary/20 transition-all cursor-pointer h-full"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gray-50">
          <img
            src={
              book.isbn
                ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
                : `https://images.unsplash.com/photo-1491843384429-30494622eb9d?auto=format&fit=crop&w=600&h=800&q=80`
            }
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://images.unsplash.com/photo-1491843384429-30494622eb9d?auto=format&fit=crop&w=600&h=800&q=80`;
            }}
          />

          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow">
              {discount}% OFF
            </div>
          )}
          
          <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/20 transition-all flex flex-col items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 duration-300">
            <button 
              onClick={handleAddToCart}
              className="bg-white text-brand-primary px-4 py-2 rounded-full flex items-center gap-2 shadow-xl text-xs font-black hover:scale-105 transition-transform"
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-brand-secondary text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl text-xs font-black hover:scale-105 transition-transform"
            >
              <Zap size={14} fill="currentColor" /> Buy Now
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill="currentColor" className="text-yellow-400" />
            ))}
            <span className="text-[9px] text-gray-400 font-bold ml-1">(4.8)</span>
          </div>
          <h4 className="font-bold text-brand-primary line-clamp-2 text-sm leading-tight group-hover:text-brand-secondary transition-colors">{book.title}</h4>
          <p className="text-xs text-gray-400 font-medium truncate">{book.author}</p>
          <div className="pt-2 flex items-center justify-between">
            <div>
              {book.mrp > book.sellingPrice && (
                <span className="text-[10px] text-gray-400 line-through font-bold block">₹{book.mrp}</span>
              )}
              <span className="text-lg font-black text-brand-primary">₹{book.sellingPrice}</span>
            </div>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
              book.condition === "like_new" ? "bg-green-100 text-green-700" :
              book.condition === "good" ? "bg-blue-100 text-blue-700" :
              "bg-yellow-100 text-yellow-700"
            )}>
              {book.condition?.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const queries = [
        Query.equal("isAvailable", true),
        Query.limit(50)
      ];

      if (searchQuery) {
        // Appwrite's Query.search works best if indexes are set up. Fallback to client filter if needed, 
        // but user asked for Query.search
        queries.push(Query.search("title", searchQuery));
      }

      if (category !== "all") {
        queries.push(Query.equal("category", category));
      }

      if (sort === "price_asc") queries.push(Query.orderAsc("sellingPrice"));
      if (sort === "price_desc") queries.push(Query.orderDesc("sellingPrice"));
      if (sort === "newest") queries.push(Query.orderDesc("$createdAt"));

      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.BOOKS,
        queries
      );
      setBooks(response.documents);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      toast.error("Cloud connection failed. Using local cache.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, sort]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    router.push("/books?" + params.toString());
  };

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Search Header */}
      <div className="bg-brand-primary text-white py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Search Results</h1>
          <form onSubmit={handleSearch} className="max-w-2xl relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author or ISBN..."
              className="w-full pl-14 pr-32 py-5 bg-white rounded-2xl text-brand-primary font-bold outline-none focus:ring-4 ring-brand-secondary/20 shadow-2xl"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-brand-secondary text-white px-6 rounded-xl font-black text-sm hover:bg-brand-primary transition-all"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-black text-brand-primary mb-6 flex items-center gap-2">
                <SlidersHorizontal size={18} /> FILTERS
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Category</p>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setCategory("all")}
                      className={cn(
                        "text-left px-4 py-2 rounded-xl text-sm font-bold transition-all",
                        category === "all" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map(c => (
                      <button 
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "text-left px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize",
                          category === c ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-50"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Sort By</p>
                  <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border-none ring-1 ring-gray-100 focus:ring-brand-primary transition-all appearance-none"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-brand-primary font-bold">
                Found {books.length} books {searchQuery && `for "${searchQuery}"`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 h-80 animate-pulse">
                    <div className="aspect-[3/4] bg-gray-50 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-50 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-50 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100">
                <div className="w-24 h-24 bg-brand-light/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen size={48} className="text-brand-primary" />
                </div>
                <h2 className="text-2xl font-black text-brand-primary mb-2">No results found</h2>
                <p className="text-gray-500 mb-8">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setCategory("all"); }}
                  className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book.$id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="animate-spin text-brand-primary">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
