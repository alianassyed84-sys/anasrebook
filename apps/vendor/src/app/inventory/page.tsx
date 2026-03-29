"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, Pencil, Trash2, Eye, Package,
  AlertTriangle, CheckCircle2, RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, Query } from "@rebookindia/firebase";
import toast from "react-hot-toast";

const conditionColor: Record<string, string> = {
  like_new: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-yellow-100 text-yellow-700",
  acceptable: "bg-orange-100 text-orange-700",
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.BOOKS, [
        Query.equal("vendorId", "dev_vendor_999"),
      ]);
      setBooks(res.documents);
    } catch (err) {
      console.error(err);
      toast.error("Could not load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filtered = books.filter((b) =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm("Remove this book from your inventory?")) return;
    // Remove from localStorage if it's a vendor-added book
    const stored = JSON.parse(localStorage.getItem("ri_vendor_books") || "[]");
    const updated = stored.filter((b: any) => b.$id !== id && b.id !== id);
    localStorage.setItem("ri_vendor_books", JSON.stringify(updated));
    setBooks((prev) => prev.filter((b) => b.$id !== id));
    toast.success("Book removed from inventory");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">
            My Inventory
          </h1>
          <p className="text-gray-500 font-medium">
            {books.length} books listed · {books.filter((b) => !b.isAvailable).length} unavailable
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBooks}
            className="p-3 text-gray-400 hover:text-brand-primary hover:bg-brand-light rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <Link
            href="/inventory/add"
            className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-3"
          >
            <Plus size={20} />
            Add New Book
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative group max-w-lg">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your inventory..."
          className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-brand-background border-b border-gray-100">
          <div className="col-span-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Book</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Condition</div>
          <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="animate-spin mx-auto text-brand-primary" size={32} />
            <p className="text-sm font-bold text-gray-400 mt-4">Loading inventory...</p>
          </div>
        ) : (
          <>
            {filtered.map((book, i) => (
              <motion.div
                key={book.$id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-gray-50 hover:bg-brand-background/50 transition-all items-center group"
              >
                <div className="col-span-5 space-y-1">
                  <p className="font-bold text-brand-primary line-clamp-1">{book.title}</p>
                  <p className="text-xs text-gray-400 font-medium">{book.author}</p>
                  {book.category && (
                    <span className="text-[9px] uppercase font-black tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
                      {book.category}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="font-black text-brand-primary text-lg">₹{book.sellingPrice}</p>
                  {book.mrp > book.sellingPrice && (
                    <p className="text-xs text-gray-400 line-through font-bold">₹{book.mrp}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider", conditionColor[book.condition] || "bg-gray-100 text-gray-500")}>
                    {(book.condition || "").replace("_", " ")}
                  </span>
                </div>
                <div className="col-span-1">
                  {book.isAvailable ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-black">Live</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-500">
                      <AlertTriangle size={14} />
                      <span className="text-[10px] font-black">Off</span>
                    </span>
                  )}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Link
                    href={`/book/${book.$id}`}
                    target="_blank"
                    className="p-2.5 text-gray-400 hover:text-brand-primary hover:bg-brand-light rounded-xl transition-all"
                    title="View on site"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(book.$id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="py-20 text-center space-y-4">
                <Package size={48} className="mx-auto text-gray-200" />
                <p className="text-sm font-bold text-gray-400">No books in your inventory yet.</p>
                <Link
                  href="/inventory/add"
                  className="inline-block px-6 py-3 bg-brand-primary text-white rounded-xl font-black text-sm hover:bg-brand-secondary transition-all"
                >
                  + Add Your First Book
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
