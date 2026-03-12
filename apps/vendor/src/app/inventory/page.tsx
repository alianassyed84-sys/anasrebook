"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BOOKS = [
  { id: "b_1", title: "NCERT Mathematics Class 10", author: "NCERT", price: 35, mrp: 85, stock: 3, condition: "good", status: "active", views: 124 },
  { id: "b_8", title: "DC Pandey Physics NEET Vol 1", author: "D.C. Pandey", price: 280, mrp: 650, stock: 1, condition: "like_new", status: "active", views: 89 },
  { id: "b_11", title: "Laxmikant Indian Polity", author: "M. Laxmikant", price: 320, mrp: 750, stock: 2, condition: "good", status: "active", views: 56 },
  { id: "b_15", title: "The Alchemist", author: "Paulo Coelho", price: 99, mrp: 299, stock: 0, condition: "good", status: "sold_out", views: 210 },
  { id: "b_18", title: "Engineering Maths BS Grewal", author: "B.S. Grewal", price: 300, mrp: 750, stock: 1, condition: "fair", status: "active", views: 47 },
];

const conditionColor: Record<string, string> = {
  like_new: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-yellow-100 text-yellow-700",
  acceptable: "bg-orange-100 text-orange-700",
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = BOOKS.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">
            Inventory
          </h1>
          <p className="text-gray-500 font-medium">
            {BOOKS.length} books listed · {BOOKS.filter((b) => b.stock === 0).length} sold out
          </p>
        </div>
        <Link
          href="/inventory/add"
          className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-3"
        >
          <Plus size={20} />
          Add New Book
        </Link>
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
          <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Book</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Condition</div>
          <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</div>
          <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Views</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</div>
        </div>

        {/* Rows */}
        {filtered.map((book, i) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-gray-50 hover:bg-brand-background/50 transition-all items-center group"
          >
            <div className="col-span-4 space-y-1">
              <p className="font-bold text-brand-primary line-clamp-1">{book.title}</p>
              <p className="text-xs text-gray-400 font-medium">{book.author}</p>
            </div>
            <div className="col-span-2">
              <p className="font-black text-brand-primary text-lg">₹{book.price}</p>
              <p className="text-xs text-gray-400 line-through font-bold">₹{book.mrp}</p>
            </div>
            <div className="col-span-2">
              <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider", conditionColor[book.condition])}>
                {book.condition.replace("_", " ")}
              </span>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-1.5">
                {book.stock === 0 ? (
                  <AlertTriangle size={14} className="text-brand-accent" />
                ) : (
                  <CheckCircle2 size={14} className="text-brand-success" />
                )}
                <span className={cn("font-black text-sm", book.stock === 0 ? "text-brand-accent" : "text-brand-primary")}>
                  {book.stock === 0 ? "Out" : book.stock}
                </span>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Eye size={14} />
                <span className="font-bold text-sm text-brand-primary">{book.views}</span>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:text-brand-primary hover:bg-brand-light rounded-xl transition-all">
                <Pencil size={16} />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Package size={48} className="mx-auto text-gray-200" />
            <p className="text-sm font-bold text-gray-400">No books matched your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
