"use client";

import React from "react";
import {
  IndianRupee,
  TrendingUp,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

const PAYOUTS = [
  { id: "PO-2310", amount: 2450, date: "Oct 20, 2023", status: "settled", orders: 8, net: 2082 },
  { id: "PO-2211", amount: 1890, date: "Sep 28, 2023", status: "settled", orders: 6, net: 1607 },
  { id: "PO-2108", amount: 3120, date: "Sep 05, 2023", status: "settled", orders: 11, net: 2652 },
];

const UPCOMING = { amount: 1245, orders: 4, eta: "Oct 28, 2023" };

const KPI = [
  { label: "Total Earned", value: "₹12,450", change: "+18% MoM", positive: true },
  { label: "Platform Commission (15%)", value: "₹1,867", note: "Deducted at source" },
  { label: "Net Payout", value: "₹10,583", change: "Across 6 payouts", positive: true },
  { label: "Avg. Per Book", value: "₹541", change: "+₹45 vs last month", positive: true },
];

export default function EarningsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Earnings</h1>
          <p className="text-gray-500 font-medium">Complete financial overview for PaperShop Books.</p>
        </div>
        <button className="bg-white border border-gray-200 text-brand-primary px-8 py-4 rounded-2xl font-black hover:bg-brand-background transition-all shadow-sm flex items-center gap-3">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {KPI.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4"
          >
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{kpi.label}</p>
            <p className="text-3xl font-black text-brand-primary tracking-tight">{kpi.value}</p>
            <p className={`text-xs font-bold flex items-center gap-1 ${kpi.positive ? "text-brand-success" : "text-brand-accent"}`}>
              {kpi.change || kpi.note}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Payout Banner */}
      <div className="bg-brand-primary rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-brand-accent" />
            <p className="text-[10px] font-black uppercase text-brand-light tracking-widest">Next Payout</p>
          </div>
          <h2 className="text-4xl font-black tracking-tighter italic">₹{UPCOMING.amount.toLocaleString()}</h2>
          <p className="text-brand-light font-medium">From {UPCOMING.orders} settled orders · ETA {UPCOMING.eta}</p>
        </div>
        <div className="relative z-10 text-center space-y-2">
          <p className="text-[10px] font-black uppercase text-brand-light tracking-widest">Commission Deduction</p>
          <p className="text-xl font-black text-brand-accent">−₹{Math.round(UPCOMING.amount * 0.15)}</p>
          <p className="text-3xl font-black text-brand-accent">Net ₹{Math.round(UPCOMING.amount * 0.85)}</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
        <h2 className="text-xl font-black text-brand-primary">Payout History</h2>
        <div className="space-y-4">
          {PAYOUTS.map((payout, i) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-brand-background rounded-2xl hover:bg-brand-light transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-success group-hover:rotate-6 transition-transform">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-brand-primary">{payout.id}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{payout.date} · {payout.orders} orders</p>
                </div>
              </div>
              <div className="flex items-center gap-8 md:text-right">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross</p>
                  <p className="font-black text-brand-primary">₹{payout.amount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Paid</p>
                  <p className="font-black text-brand-success text-xl">₹{payout.net}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Settled</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
