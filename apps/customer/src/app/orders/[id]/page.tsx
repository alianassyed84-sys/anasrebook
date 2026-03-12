"use client";

import React from "react";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Phone,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BookCover } from "@rebookindia/ui";

const ORDER = {
  id: "RB-7341-8920",
  date: "Oct 24, 2023",
  status: "Shipped",
  eta: "Tomorrow by 8 PM",
  items: [
    { title: "NCERT Maths 10", qty: 1, price: 35, image: "https://picsum.photos/400/600?random=1" },
    { title: "DC Pandey Physics", qty: 1, price: 280, image: "https://picsum.photos/400/600?random=8" },
  ],
  total: 315.00,
  address: "Plot 24, MIG 1, Phase 2, KPHB, Hyderabad, 500072",
};

const TIMELINE = [
  { status: "Order Placed", date: "Oct 24, 10:30 AM", completed: true, icon: CheckCircle2 },
  { status: "Confirmed", date: "Oct 24, 11:45 AM", completed: true, icon: ShieldCheck },
  { status: "Shipped", date: "Oct 24, 4:20 PM", completed: true, icon: Truck, active: true },
  { status: "Out for Delivery", date: "Expected Tomorrow", completed: false, icon: Package },
  { status: "Delivered", date: "Expected Oct 25", completed: false, icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/account" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100">
            <ArrowLeft size={20} className="text-brand-primary" />
          </Link>
          <div className="space-y-1">
             <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Order Tracking</h1>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{ORDER.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Timeline Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-3xl -z-0" />
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Estimated Arrival</p>
                     <h2 className="text-2xl font-black text-brand-primary italic">{ORDER.eta}</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-light/40 px-6 py-3 rounded-2xl">
                     <Clock size={20} className="text-brand-primary" />
                     <span className="font-bold text-brand-primary underline ring-brand-secondary/30">Standard Delivery</span>
                  </div>
               </div>

               {/* Tracking Timeline */}
               <div className="relative space-y-12">
                  <div className="absolute top-0 left-[19px] w-0.5 h-full bg-gray-100" />
                  {TIMELINE.map((step, i) => (
                    <motion.div 
                      key={step.status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-8 relative"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
                        step.completed ? "bg-brand-primary text-white shadow-lg" : "bg-white border-4 border-gray-100 text-gray-200"
                      )}>
                        <step.icon size={20} strokeWidth={3} />
                      </div>
                      <div className="flex-1 space-y-1">
                         <h4 className={cn("font-bold text-lg", step.active ? "text-brand-primary" : step.completed ? "text-brand-primary opacity-60" : "text-gray-300")}>
                           {step.status}
                         </h4>
                         <p className="text-xs font-bold text-gray-400">{step.date}</p>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Courier Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-background rounded-2xl flex items-center justify-center text-brand-primary">
                     <Package size={32} />
                  </div>
                  <div>
                     <h4 className="font-black text-brand-primary text-lg">Delivering via SpeedPost</h4>
                     <p className="text-sm font-medium text-gray-500">AWB: rb_sp_73418920</p>
                  </div>
               </div>
               <div className="flex gap-4 w-full md:w-auto">
                  <button className="flex-1 md:flex-none border border-gray-200 p-4 rounded-xl hover:bg-brand-background transition-all">
                     <Phone size={20} className="text-brand-primary" />
                  </button>
                  <button className="flex-1 md:flex-none bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-secondary transition-all">
                     Track live
                  </button>
               </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             {/* Order Summary Widget */}
             <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Shipment Details</h4>
                <div className="space-y-4">
                   {ORDER.items.map((item, i) => (
                      <div key={i} className="flex gap-4">
                         <div className="w-12 h-16 bg-brand-background rounded-lg overflow-hidden shrink-0">
                            <BookCover coverUrl={item.image} title={item.title} size="S" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <p className="text-xs font-bold text-brand-primary line-clamp-2">{item.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 italic">Qty: {item.qty} × ₹{item.price}</p>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center font-black text-brand-primary">
                   <span>Paid Total</span>
                   <span className="text-xl">₹{ORDER.total}</span>
                </div>
             </div>

             {/* Shipping Address */}
             <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                   <MapPin size={18} className="text-brand-accent" />
                   <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Delivery To</h4>
                </div>
                <p className="text-sm font-bold text-brand-primary leading-relaxed italic">
                   {ORDER.address}
                </p>
             </div>

             {/* Support CTA */}
             <div className="bg-brand-primary rounded-3xl p-8 text-white space-y-4 relative overflow-hidden group border border-brand-primary">
                <div className="relative z-10 space-y-2">
                   <h4 className="font-bold">Need Help?</h4>
                   <p className="text-xs text-brand-light font-medium">Something wrong with this order? Our support is 24/7.</p>
                </div>
                <button className="relative z-10 w-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 py-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm">
                   <HelpCircle size={16} />
                   Contact Support
                </button>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}
