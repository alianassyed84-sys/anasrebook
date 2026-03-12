"use client";

import React, { useState, Suspense } from "react";
import { Megaphone, Mail, Tag, Gift, Save, CheckCircle2, Send, Users, MousePointer2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const CAMPAIGNS = [
  { id: 1, name: "Diwali Sale 2023", type: "Discount", status: "active", reach: 2400, dates: "Oct 20 – Nov 5", conversion: "12%" },
  { id: 2, name: "New Student Onboarding", type: "Email", status: "active", reach: 1540, dates: "Ongoing", conversion: "8%" },
  { id: 3, name: "BookPass Launch", type: "Push", status: "ended", reach: 8900, dates: "Sep 1 – Sep 15", conversion: "5%" },
];

function MarketingContent() {
  const [creating, setCreating] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const handleCreateCoupon = () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      toast.success(`Coupon ${couponCode} created successfully!`);
      setCouponCode("");
    }, 1500);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Marketing Portal</h1>
          <p className="text-sm text-gray-500">Engage customers and boost platform sales</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
           <Plus size={18} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign Management */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 px-2">
            <Megaphone size={16} className="text-orange-500" /> Active Campaigns
          </h2>
          <div className="space-y-4">
            {CAMPAIGNS.map((c, i) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
              >
                {c.status === "active" && (
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                     <div className="absolute top-2 right-[-24px] rotate-45 bg-green-500 text-white text-[8px] font-black py-1 px-8">LIVE</div>
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                   <div>
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{c.type} · {c.dates}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                         <Users size={12} />
                         <span className="text-[9px] font-bold uppercase tracking-wider">Reach</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{c.reach.toLocaleString()}</p>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                         <MousePointer2 size={12} />
                         <span className="text-[9px] font-bold uppercase tracking-wider">Conv.</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{c.conversion}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create Coupon Card */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
          <div className="space-y-2">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag size={20} className="text-orange-500" /> Coupon Architect
             </h2>
             <p className="text-xs text-gray-500">Design exclusive discounts for growth segments</p>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Unique Code</label>
              <input 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="REBOOK2024" 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-black text-gray-900 placeholder:text-gray-300 uppercase text-xl tracking-tighter focus:bg-white focus:border-orange-500 transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Benefit (%)</label>
                <div className="relative">
                   <input type="number" placeholder="20" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-900 focus:bg-white focus:border-orange-500 transition-all" />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Threshold (₹)</label>
                <input type="number" placeholder="499" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-900 focus:bg-white focus:border-orange-500 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Start Date</label>
                <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-bold text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Expiry Date</label>
                <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-bold text-gray-900" />
              </div>
            </div>

            <button
               onClick={handleCreateCoupon}
               disabled={creating}
               className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
            >
               {creating ? (
                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               ) : (
                 <><Save size={18} /> Deploy Coupon</>
               )}
            </button>
          </div>

          <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
             <Tag size={160} className="text-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMarketingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold italic">Loading Creative Suite...</div>}>
       <MarketingContent />
    </Suspense>
  )
}

