"use client";

import React from "react";
import { 
  Package, 
  ChevronRight, 
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BookCover } from "@rebookindia/ui";

const ORDERS = [
  { id: "RB-7341", date: "Oct 24, 2023", total: 315.00, status: "Shipped", items: 2, image: "https://picsum.photos/200/300?random=1" },
  { id: "RB-6512", date: "Sep 22, 2023", total: 120.00, status: "Delivered", items: 1, image: "https://picsum.photos/200/300?random=5" },
  { id: "RB-5109", date: "Aug 15, 2023", total: 450.00, status: "Delivered", items: 3, image: "https://picsum.photos/200/300?random=10" },
];

export default function OrdersHistoryPage() {
  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
             <Link href="/account" className="inline-flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-brand-primary transition-all">
                <ArrowLeft size={16} />
                Back to Profile
             </Link>
             <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Order History</h1>
          </div>
          <div className="relative group max-w-sm w-full">
            <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-brand-primary transition-colors">
               <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search orders..."
              className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 ring-brand-secondary/20 transition-all font-bold text-brand-primary shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-6 max-w-5xl">
           {ORDERS.map((order, index) => (
             <motion.div 
               key={order.id}
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-8 hover:shadow-2xl transition-all group"
             >
                <div className="flex flex-col md:flex-row gap-8">
                   
                   {/* Product Preview */}
                   <div className="w-full md:w-24 aspect-[3/4] bg-brand-background rounded-2xl overflow-hidden shrink-0 shadow-inner">
                      <BookCover coverUrl={order.image} title={`Order ${order.id}`} size="S" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>

                   {/* Info */}
                   <div className="flex-1 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">{order.date}</p>
                            <h3 className="text-2xl font-black text-brand-primary tracking-tight">Order {order.id}</h3>
                            <div className="flex items-center gap-2">
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                 order.status === "Shipped" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                               )}>
                                 {order.status}
                               </span>
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {order.items} {order.items > 1 ? "items" : "item"}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-black text-brand-primary italic">₹{order.total.toFixed(2)}</p>
                            <Link href={`/orders/1`} className="text-xs font-black text-brand-secondary uppercase tracking-[0.2em] hover:underline decoration-brand-secondary/30 underline-offset-4 flex items-center justify-end gap-1 pt-2">
                               Track Order <ChevronRight size={14} />
                            </Link>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-50">
                         {[
                           { label: "Delivery", val: order.status === "Shipped" ? "In Transit" : "Arrived", icon: Clock },
                           { label: "Reviews", val: order.status === "Delivered" ? "Rate Now" : "Pending", icon: Star, highlight: order.status === "Delivered" },
                           { label: "Help", val: "Get Support", icon: RotateCcw },
                           { label: "Return", val: "Eligible", icon: CheckCircle2 },
                         ].map(stat => (
                           <div key={stat.label} className="space-y-1 flex flex-col items-center md:items-start">
                              <div className="flex items-center gap-2">
                                 <stat.icon size={12} className="text-gray-300" />
                                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                              </div>
                              <p className={cn(
                                "text-xs font-black tracking-tight",
                                stat.highlight ? "text-brand-secondary underline decoration-brand-secondary/30" : "text-brand-primary"
                              )}>{stat.val}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-12 text-center text-gray-400 space-y-4">
           <p className="text-xs font-bold uppercase tracking-widest">Showing last 6 months of records</p>
           <button className="bg-white px-8 py-3 rounded-xl border border-gray-100 text-xs font-black uppercase tracking-widest text-brand-primary hover:bg-brand-background transition-all">
              Load Older Orders
           </button>
        </div>

      </div>
    </main>
  );
}
