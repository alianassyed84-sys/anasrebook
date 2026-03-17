"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Trash2, CheckCircle2, Eye, Tag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, getStorageUrl, BUCKETS } from "@rebookindia/firebase";
import toast from "react-hot-toast";

function BooksContent() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.BOOKS);
      setBooks(res.documents);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load catalog.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await databases.updateDocument(DB_ID, COLLECTIONS.BOOKS, id, {
        isApproved: true,
        status: "active"
      });
      setBooks(prev => prev.map(b => b.$id === id ? { ...b, isApproved: true, status: "active" } : b));
      toast.success("Book approved for sale!");
    } catch (err) {
      toast.error("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book listing?")) return;
    try {
      await databases.deleteDocument(DB_ID, COLLECTIONS.BOOKS, id);
      setBooks(prev => prev.filter(b => b.$id !== id));
      toast.success("Book removed");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = books
    .filter(b => filter === "all" || (filter === "pending" && !b.isApproved) || (filter === "active" && b.isApproved))
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Catalog</h1>
          <p className="text-sm text-gray-500">Total {books.length} listings registered.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text" placeholder="Search books..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          {["all", "pending", "active"].map((s) => (
            <button
              key={s} onClick={() => setFilter(s)}
              className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all capitalize", filter === s ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Book Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400"><Loader2 className="animate-spin mx-auto" /></td></tr>
            ) : filtered.map((book) => (
              <tr key={book.$id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-14 bg-gray-100 rounded border shrink-0 overflow-hidden">
                    {book.imageIds?.[0] && <img src={getStorageUrl(BUCKETS.BOOK_IMAGES, book.imageIds[0])} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                    book.isApproved ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {book.isApproved ? "Active" : "Pending Approval"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-black">₹{book.sellingPrice}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!book.isApproved && (
                      <button 
                        onClick={() => handleApprove(book.$id)}
                        className="px-3 py-1 bg-brand-primary text-white rounded-lg text-xs font-black"
                      >
                        Approve
                      </button>
                    )}
                    <button onClick={() => handleDelete(book.$id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminBooksPage() {
  return (
    <Suspense fallback={<div>Loading catalog...</div>}>
      <BooksContent />
    </Suspense>
  )
}
