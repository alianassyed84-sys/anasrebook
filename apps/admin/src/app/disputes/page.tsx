"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AlertCircle, CheckCircle2, MessageSquare, XCircle, Info, ExternalLink, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { disputeActions } from "@rebookindia/firebase/src/disputes";
import type { Dispute, DisputeStatus } from "@rebookindia/types";
import toast from "react-hot-toast";
import { format } from "date-fns";

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  open: { label: "Open Issue", class: "bg-red-50 text-red-700 border-red-100" },
  under_review: { label: "Under Review", class: "bg-orange-50 text-orange-700 border-orange-100" },
  resolved_refund: { label: "Resolved (Refunded)", class: "bg-green-50 text-green-700 border-green-100" },
  resolved_no_refund: { label: "Resolved (No Refund)", class: "bg-gray-50 text-gray-700 border-gray-200" },
};

function DisputesContent() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await disputeActions.getAllDisputes();
      setDisputes(data);
    } catch (error) {
      toast.error("Failed to load disputes.");
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id: string, refund: boolean) => {
    const confirmation = window.confirm(
      refund 
        ? "Approve full refund for the buyer?" 
        : "Close dispute without refund? This will release funds to the vendor."
    );
    if (!confirmation) return;

    setProcessingId(id);
    const toastId = toast.loading("Processing resolution...");
    try {
      if (refund) {
        await disputeActions.resolveWithRefund(id, "Resolved by Admin via refund.");
      } else {
        await disputeActions.resolveNoRefund(id, "Resolved by Admin. No refund issued.");
      }
      
      setDisputes(p => p.map(d => d.disputeId === id ? { 
        ...d, 
        status: refund ? "resolved_refund" : "resolved_no_refund" 
      } : d));
      
      toast.success("Dispute resolved successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to resolve dispute.", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Disputes Manager</h1>
        <p className="text-sm text-gray-500">
           Manage buyer complaints and order issues
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
           Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse space-y-4">
               <div className="h-4 bg-gray-100 rounded w-1/4" />
               <div className="h-6 bg-gray-100 rounded w-3/4" />
               <div className="h-4 bg-gray-100 rounded w-1/2" />
             </div>
           ))
        ) : disputes.length === 0 ? (
           <div className="bg-white rounded-xl p-20 text-center border border-gray-100">
              <ShieldAlert size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No disputes reported so far. Great work!</p>
           </div>
        ) : (
          disputes.map((dispute) => (
            <motion.div
              key={dispute.disputeId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-white rounded-xl p-6 border shadow-sm transition-all",
                dispute.status === "open" ? "border-red-100" : "border-gray-100"
              )}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      #{dispute.disputeId}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
                      STATUS_MAP[dispute.status || "open"]?.class
                    )}>
                      {STATUS_MAP[dispute.status || "open"]?.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold ml-auto uppercase">
                      Raised {format(new Date(dispute.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div>
                     <h3 className="text-lg font-bold text-gray-900">{dispute.reason.replace("_", " ")}</h3>
                     <p className="text-sm text-gray-600 mt-1 leading-relaxed">{dispute.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Order Reference</span>
                        <span className="text-xs font-bold text-orange-600">#{dispute.orderId}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Vendor ID</span>
                        <span className="text-xs font-bold text-gray-900">{dispute.vendorId}</span>
                     </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 md:border-l border-gray-100 md:pl-6 justify-center min-w-[180px]">
                  {dispute.status === "open" ? (
                    <>
                      <button 
                        onClick={() => resolveDispute(dispute.disputeId, true)}
                        disabled={!!processingId}
                        className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                      >
                        Refund Buyer
                      </button>
                      <button 
                         onClick={() => resolveDispute(dispute.disputeId, false)}
                         disabled={!!processingId}
                         className="w-full px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      >
                        Release to Vendor
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                        <MessageSquare size={14} /> Contact
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                       <CheckCircle2 size={24} className="mx-auto text-green-500 mb-2" />
                       <p className="text-[10px] font-bold text-gray-500 uppercase">Case Resolved</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminDisputesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Connecting to Support Hub...</div>}>
       <DisputesContent />
    </Suspense>
  )
}

