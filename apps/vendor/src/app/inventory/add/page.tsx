"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, account, Query, ID, saveLocalBook } from "@rebookindia/firebase";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";

const CONDITIONS = [
  { id: "like_new", label: "Like New", desc: "No marks, no writing. Basically unread." },
  { id: "good", label: "Good", desc: "Minor wear. No missing pages or torn binding." },
  { id: "fair", label: "Fair", desc: "Visible highlights / notes. Fully usable." },
  { id: "acceptable", label: "Acceptable", desc: "Heavy use. Cover may be worn. Binding intact." },
];

const CATEGORIES = [
  { label: "School (NCERT)", value: "school" },
  { label: "NEET Prep", value: "neet" },
  { label: "JEE Prep", value: "neet" },
  { label: "UPSC / Govt", value: "upsc" },
  { label: "College / Uni", value: "college" },
  { label: "Novels / Fiction", value: "novel" },
  { label: "Self-Help", value: "novel" },
  { label: "Other", value: "other" },
];

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [conditionNotes, setConditionNotes] = useState("");

  // Cloudinary states
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    account.get().then(async (user) => {
      const vendorDocs = await databases.listDocuments(DB_ID, COLLECTIONS.VENDORS, [Query.equal("userId", user.$id)]);
      if (vendorDocs.documents.length > 0) {
        setVendor(vendorDocs.documents[0]);
      } else {
        toast.error("Not a vendor account!");
        router.push("/login");
      }
    }).catch(() => router.push("/login"));
  }, [router]);

  const handleListBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !mrp || !sellingPrice) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const bookData = {
        title,
        author,
        isbn,
        category,
        mrp: parseFloat(mrp),
        sellingPrice: parseFloat(sellingPrice),
        condition,
        conditionNotes,
        coverUrl,
        vendorId: vendor?.$id || "dev_vendor_999",
        vendorName: vendor?.shopName || "PaperShop Books",
        isAvailable: true,
        isApproved: true,
        createdAt: new Date().toISOString(),
      };

      // Always save to localStorage first so customer site sees it instantly
      const newId = `vendor_book_${Date.now()}`;
      saveLocalBook({ ...bookData, $id: newId, id: newId });

      // Try Firestore in background (may fail in dev mode — that's ok)
      databases.createDocument(DB_ID, COLLECTIONS.BOOKS, ID.unique(), bookData).catch(() => {});

      toast.success("✅ Book listed successfully! Now live on the customer site.");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to list book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100">
          <ArrowLeft size={20} className="text-brand-primary" />
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">List a New Book</h1>
          <p className="text-gray-500 font-medium">Get your book in front of thousands of students.</p>
        </div>
      </div>

      <form onSubmit={handleListBook} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-brand-primary flex items-center gap-3">
              <BookOpen size={20} className="text-brand-secondary" />
              Book Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Book Title *</label>
                <input
                  type="text" value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="e.g. NCERT Mathematics Class 10"
                  className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Author *</label>
                <input
                  type="text" value={author} onChange={e => setAuthor(e.target.value)} required
                  placeholder="e.g. NCERT"
                  className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">ISBN (optional)</label>
                <input
                  type="text" value={isbn} onChange={e => setIsbn(e.target.value)}
                  placeholder="978-XXXXXXXXXX"
                  className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all appearance-none cursor-pointer">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-brand-primary">Pricing & Condition</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">MRP *</label>
                <input type="number" value={mrp} onChange={e => setMrp(e.target.value)} required placeholder="650" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none transition-all font-bold text-brand-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Your Price *</label>
                <input type="number" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} required placeholder="280" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none transition-all font-bold text-brand-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CONDITIONS.map(c => (
                <button
                  type="button" key={c.id} onClick={() => setCondition(c.id)}
                  className={cn("p-4 rounded-xl border-2 text-left transition-all", condition === c.id ? "border-brand-primary bg-brand-light/20" : "border-gray-50 bg-gray-50")}
                >
                  <span className="block text-xs font-black text-brand-primary">{c.label}</span>
                  <span className="block text-[10px] text-gray-400 mt-1">{c.desc}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Condition Notes</label>
              <textarea value={conditionNotes} onChange={e => setConditionNotes(e.target.value)} rows={3} placeholder="Any highlights, damage, or missing pages?" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none transition-all font-bold text-brand-primary resize-none" />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xl hover:bg-brand-secondary transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {loading ? <><Loader2 className="animate-spin" /> Listing...</> : "List Book →"}
          </button>
        </div>

        {/* Right: Cover Photo Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-black text-brand-primary flex items-center gap-2">
              <Camera size={20} className="text-brand-secondary" />
              Cover Photo
            </h2>

            <ImageUploader
              label="Book Cover Photo"
              folder="rebookindia/books"
              currentUrl={coverUrl}
              onUpload={(url) => {
                setCoverUrl(url);
              }}
              onRemove={() => {
                setCoverUrl("");
              }}
            />

            {coverUrl && (
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest text-center">
                ✓ Photo saved to Cloudinary
              </p>
            )}

            <div className="p-4 bg-brand-background rounded-2xl text-xs text-gray-500 font-medium space-y-1">
              <p>📸 Good photos get <span className="font-black text-brand-primary">3x more views</span></p>
              <p>💡 Use natural lighting for best results</p>
              <p>📐 Square or portrait orientation preferred</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
