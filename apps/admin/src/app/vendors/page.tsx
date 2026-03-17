"use client";

import React, { useState, useEffect, Suspense } from "react";
import { CheckCircle2, Eye, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { databases, DB_ID, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";

const planColor: Record<string, string> = {
  Gold: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Silver: "bg-gray-50 text-gray-700 border-gray-200",
  Bronze: "bg-orange-50 text-orange-700 border-orange-100",
};

function VendorsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [filter, setFilter] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.VENDORS);
      setVendors(res.documents);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendors.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await databases.updateDocument(DB_ID, COLLECTIONS.VENDORS, id, {
        status: "approved",
        isApproved: true
      });
      setVendors(prev => prev.map(v => v.$id === id ? { ...v, status: "approved" } : v));
      toast.success("Vendor approved! 🎉");
    } catch (err) {
      toast.error("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = vendors
    .filter((v) => filter === "all" || v.status === filter)
    .filter((v) => 
      v.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendors Management</h1>
          <p className="text-sm text-gray-500">Approve or manage marketplace sellers.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between font-bold">
          <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg">
            {["all", "pending", "approved"].map((s) => (
              <button
                key={s} onClick={() => setFilter(s)}
                className={cn("px-4 py-1.5 rounded-md text-xs transition-all capitalize", filter === s ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500")}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text" placeholder="Search shops..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Shop Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center text-gray-400"><Loader2 className="animate-spin mx-auto" /></td></tr>
              ) : filtered.map((vendor) => (
                <tr key={vendor.$id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{vendor.shopName}</div>
                    <div className="text-xs text-gray-500">{vendor.ownerName} · {vendor.city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                      vendor.status === "approved" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {vendor.status === "pending" && (
                      <button 
                        disabled={processingId === vendor.$id}
                        onClick={() => handleApprove(vendor.$id)}
                        className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-black disabled:opacity-50"
                      >
                        {processingId === vendor.$id ? "..." : "Approve Seller"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminVendorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <VendorsContent />
    </Suspense>
  )
}
