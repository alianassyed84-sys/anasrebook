"use client";

import React, { useState, useEffect, Suspense } from "react";
import { IndianRupee, TrendingUp, ArrowUpRight, Download, CheckCircle2, Clock, Wallet, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { orderActions } from "@rebookindia/firebase/src/orders";
import type { Order } from "@rebookindia/types";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function PaymentsContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const data = await orderActions.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch financial data.");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    gmv: orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
    commission: orders.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0),
    paid: orders.filter(o => o.isPayoutReleased).reduce((acc, curr) => acc + (curr.vendorPayout || 0), 0),
    pending: orders.filter(o => !o.isPayoutReleased && o.orderStatus === "delivered").reduce((acc, curr) => acc + (curr.vendorPayout || 0), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financials</h1>
          <p className="text-sm text-gray-500">Revenue, commissions, and vendor payouts</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total GMV", value: `₹${stats.gmv.toLocaleString()}`, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Platform Comm.", value: `₹${stats.commission.toLocaleString()}`, icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Paid Out", value: `₹${stats.paid.toLocaleString()}`, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Payout", value: `₹${stats.pending.toLocaleString()}`, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", kpi.bg)}>
               <kpi.icon size={20} className={kpi.color} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <p className="text-xl font-black text-gray-900 mt-1">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
           <h2 className="text-sm font-bold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Order/Ref</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Gross (GMV)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Net Payout</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Release Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-50 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium italic">No financial data recorded yet.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <p className="text-xs font-bold text-gray-900">#{o.orderId}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[150px]">Vendor: {o.vendorId}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">₹{o.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-red-500">-₹{o.commissionAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-black text-green-600">₹{o.vendorPayout.toLocaleString()}</td>
                    <td className="px-6 py-4">
                       <span className={cn(
                         "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                         o.isPayoutReleased ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                       )}>
                         {o.isPayoutReleased ? "Settled" : "Pending"}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase">
                       {format(new Date(o.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminFinancialsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Initializing Ledger...</div>}>
       <PaymentsContent />
    </Suspense>
  )
}

