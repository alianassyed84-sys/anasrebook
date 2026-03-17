"use client";

import React, { useState, useEffect } from "react";
import { Search, Printer, CheckCircle2, Clock, Truck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, account, Query } from "@/lib/firebase";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

const STATUS_FLOW = ["pending", "confirmed", "shipped", "delivered"];

export default function VendorOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const u = await account.get();
        const vendorDocs = await databases.listDocuments(DB_ID, COLLECTIONS.VENDORS, [Query.equal("userId", u.$id)]);
        
        if (vendorDocs.documents.length === 0) return;
        const v = vendorDocs.documents[0];
        setVendor(v);

        const ordersRes = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
          Query.equal("vendorId", v.$id),
          Query.orderDesc("$createdAt")
        ]);
        setOrders(ordersRes.documents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    if (idx === STATUS_FLOW.length - 1) return;
    const nextStatus = STATUS_FLOW[idx + 1];

    try {
      await databases.updateDocument(DB_ID, COLLECTIONS.ORDERS, orderId, {
        orderStatus: nextStatus,
        updatedAt: new Date().toISOString()
      });
      
      setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, orderStatus: nextStatus } : o));
      toast.success(`Order marked as ${nextStatus}!`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-brand-primary" size={48} />
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Orders Management</h1>
          <p className="text-gray-500 font-medium">Manage and fulfill your customer requests.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {["all", ...STATUS_FLOW].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold transition-all capitalize",
              filter === s
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                : "bg-white text-gray-500 border border-gray-100 hover:bg-brand-background hover:text-brand-primary"
            )}
          >
            {s === "all" ? `All (${orders.length})` : `${STATUS_CONFIG[s].label} (${orders.filter((o) => o.orderStatus === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <p className="text-center py-20 text-gray-400 font-bold italic bg-white rounded-[2.5rem] border border-gray-100">No orders found.</p>
          ) : (
            filtered.map((order, i) => {
              const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              const canProgress = STATUS_FLOW.indexOf(order.orderStatus) < STATUS_FLOW.length - 1;

              return (
                <motion.div
                  key={order.$id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">#{order.$id.slice(-8)}</span>
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", cfg.color)}>
                          <Icon size={10} />
                          {cfg.label}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-brand-primary">{order.bookTitle}</h3>
                      <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500">
                        <span>👤 {order.customerName}</span>
                        <span>📍 {order.deliveryCity} ({order.deliveryPincode})</span>
                        <span>🕐 {new Date(order.$createdAt).toLocaleString()}</span>
                        <span>📞 {order.customerPhone}</span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                      <span className="text-2xl font-black text-brand-primary">₹{order.totalAmount}</span>
                      <div className="flex gap-3">
                        {canProgress && (
                          <button
                            onClick={() => handleUpdateStatus(order.$id, order.orderStatus)}
                            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-black text-sm hover:bg-brand-secondary transition-all shadow-lg"
                          >
                            Mark as {STATUS_CONFIG[STATUS_FLOW[STATUS_FLOW.indexOf(order.orderStatus) + 1]].label} →
                          </button>
                        )}
                        {!canProgress && (
                          <div className="px-6 py-3 bg-green-50 text-brand-success rounded-xl font-black text-sm flex items-center gap-2">
                            <CheckCircle2 size={16} /> FULFILLED
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
