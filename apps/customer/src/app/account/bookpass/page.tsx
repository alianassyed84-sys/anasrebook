"use client";

import React from "react";
import { 
  Zap, 
  CreditCard, 
  ArrowLeft, 
  ShieldCheck, 
  Gift, 
  Trophy,
  History,
  TrendingUp,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SAVINGS = [
  { id: 1, type: "Delivery", amount: "₹49", date: "Oct 24", order: "#RB-7341" },
  { id: 2, type: "Delivery", amount: "₹49", date: "Oct 22", order: "#RB-6512" },
  { id: 3, type: "Delivery", amount: "₹65", date: "Oct 15", order: "#RB-5109" },
];

export default function BookPassDashboard() {
  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/profile" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100">
            <ArrowLeft size={20} className="text-brand-primary" />
          </Link>
          <div className="space-y-1">
             <h1 className="text-3xl font-black text-brand-primary tracking-tighter italic flex items-center gap-3">
               <Zap size={28} className="text-brand-accent" fill="currentColor" />
               RebookIndia BookPass
             </h1>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Membership Dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Status Card */}
            <div className="bg-brand-primary rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-[100px] -z-0" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-[100px] -z-0" />
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-accent text-sm font-bold">
                        <ShieldCheck size={16} />
                        <span>Active Membership</span>
                     </div>
                     <h2 className="text-4xl font-black tracking-tight leading-tight">
                        You've Saved <br />
                        <span className="text-brand-accent text-5xl italic tracking-tighter underline underline-offset-8">₹450.00</span>
                     </h2>
                     <p className="text-brand-light font-medium leading-relaxed opacity-80">
                        Renewing on <span className="text-white font-bold">Nov 24, 2023</span> via UPI.
                     </p>
                  </div>

                  <div className="bg-white/10 rounded-[2rem] border border-white/20 p-8 backdrop-blur-md">
                     <div className="space-y-6">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-brand-light">
                           <span>Monthly Progress</span>
                           <span>8/10 Deliveries</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full w-[80%] bg-brand-accent rounded-full" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                           {[1,2,3,4,5,6,7,8].map(i => (
                             <div key={i} className="aspect-square bg-brand-accent rounded-lg flex items-center justify-center text-brand-primary">
                               <Gift size={12} strokeWidth={3} />
                             </div>
                           ))}
                           <div className="aspect-square bg-white/5 rounded-lg border border-dashed border-white/20" />
                           <div className="aspect-square bg-white/5 rounded-lg border border-dashed border-white/20" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Savings History */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-brand-primary flex items-center gap-3">
                     <History size={24} className="text-brand-secondary" />
                     Savings History
                  </h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total 12 Orders</span>
               </div>

               <div className="space-y-4">
                  {SAVINGS.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-brand-background rounded-2xl group hover:bg-brand-light transition-colors">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-success rotate-6 group-hover:rotate-0 transition-transform">
                             <TrendingUp size={20} />
                          </div>
                          <div>
                             <p className="font-bold text-brand-primary">Delivery Charge Waived</p>
                             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.date} • {item.order}</p>
                          </div>
                       </div>
                       <p className="text-xl font-black text-brand-success">+{item.amount}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Perks */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Active Perks</h4>
                <div className="space-y-6">
                   {[
                     { title: "Free Delivery", desc: "Uncapped across all 100K+ books.", icon: Zap, color: "text-brand-accent" },
                     { title: "Priority Support", desc: "Bypass the queue on all help tickets.", icon: ShieldCheck, color: "text-brand-success" },
                     { title: "Early Bird Access", desc: "Shop best deals 2h before anyone.", icon: Trophy, color: "text-brand-secondary" },
                   ].map(perk => (
                     <div key={perk.title} className="flex gap-4">
                        <div className={cn("shrink-0 pt-1", perk.color)}>
                           <perk.icon size={20} fill={perk.title === "Free Delivery" ? "currentColor" : "none"} />
                        </div>
                        <div className="space-y-1">
                           <p className="font-bold text-brand-primary">{perk.title}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-wider">{perk.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 group cursor-pointer hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                   <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Payment Method</h4>
                   <CreditCard size={18} className="text-brand-primary" />
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-8 bg-brand-primary rounded flex items-center justify-center text-[10px] font-black text-white italic">
                      UPI
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-brand-primary">rahul@okaxis</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AutoPay Enabled</p>
                   </div>
                </div>
             </div>

             <button className="w-full py-6 rounded-[2rem] border-2 border-dashed border-red-200 text-red-400 font-black text-sm uppercase tracking-widest hover:bg-red-50 hover:border-red-400 transition-all">
                Cancel Membership
             </button>
          </div>

        </div>
      </div>
    </main>
  );
}
