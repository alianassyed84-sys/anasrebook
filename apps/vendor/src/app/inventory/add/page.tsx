"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Upload, BookOpen, Camera, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookCover } from "@rebookindia/ui";
import { databases, storage, DB_ID, COLLECTIONS, account, Query } from "@/lib/appwrite";
import { ID } from "appwrite";
import toast from "react-hot-toast";

const CONDITIONS = [
  { id: "like_new", label: "Like New", desc: "No marks, no writing. Basically unread." },
  { id: "good", label: "Good", desc: "Minor wear. No missing pages or torn binding." },
  { id: "fair", label: "Fair", desc: "Visible highlights / notes. Fully usable." },
  { id: "acceptable", label: "Acceptable", desc: "Heavy use. Cover may be worn. Binding intact." },
];

const CATEGORIES = ["School (NCERT)", "NEET Prep", "JEE Prep", "UPSC / Govt", "College / Uni", "Novels / Fiction", "Self-Help", "Other"];

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<any>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [conditionNotes, setConditionNotes] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const handleListBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !mrp || !sellingPrice || !vendor) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Images
      const imageIds: string[] = [];
      for (const file of imageFiles) {
        const uploadedFile = await storage.createFile("book-images", ID.unique(), file);
        imageIds.push(uploadedFile.$id);
      }

      // 2. Create Book Document
      await databases.createDocument(DB_ID, COLLECTIONS.BOOKS, ID.unique(), {
        title,
        author,
        isbn,
        category,
        mrp: parseFloat(mrp),
        sellingPrice: parseFloat(sellingPrice),
        condition,
        conditionNotes,
        imageIds,
        vendorId: vendor.$id,
        isApproved: false,
        createdAt: new Date().toISOString(),
      });

      toast.success("Book listed for review! 📚");
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
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all appearance-none cursor-pointer">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
            
            <div className="grid grid-cols-2 gap-3 pb-4">
              {CONDITIONS.map(c => (
                <button
                  type="button" key={c.id} onClick={() => setCondition(c.id)}
                  className={cn("p-4 rounded-xl border-2 text-left transition-all", condition === c.id ? "border-brand-primary bg-brand-light/20" : "border-gray-50 bg-gray-50")}
                >
                  <p className="text-xs font-black text-brand-primary">{c.label}</p>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Condition Notes</label>
              <textarea value={conditionNotes} onChange={e => setConditionNotes(e.target.value)} rows={3} placeholder="Highlights? Any damage?" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none transition-all font-bold text-brand-primary resize-none" />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xl hover:bg-brand-secondary transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3"
          >
            {loading ? <><Loader2 className="animate-spin" /> Listing...</> : "List Book"}
          </button>
        </div>

        {/* Right: Images */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-black text-brand-primary flex items-center gap-2">
              <Camera size={20} className="text-brand-secondary" />
              Photos *
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              {previewUrls.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
              <label className="aspect-square bg-brand-background rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-primary transition-all">
                <Upload size={20} className="text-gray-300" />
                <span className="text-[8px] font-black uppercase text-gray-400">Add Photo</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
