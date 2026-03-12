"use client";

import React, { useEffect } from "react";
import { 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  TreePine, 
  Share2,
  Download,
  PartyPopper
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function OrderSuccessPage() {
  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white pt-12 pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-3xl mx-auto text-center space-y-12">
          
          {/* Header */}
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className="w-32 h-32 bg-brand-success/10 rounded-full mx-auto flex items-center justify-center text-brand-success shadow-2xl shadow-brand-success/20"
            >
              <CheckCircle2 size={64} strokeWidth={3} />
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-brand-primary tracking-tighter">Order Placed!</h1>
              <p className="text-xl text-gray-400 font-bold tracking-tight italic">Order ID: #RB-7341-8920</p>
            </div>
          </div>

          {/* Impact Banner */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-brand-primary rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-[100px] -z-0" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-[100px] -z-0 text-brand-primary" />
             
             <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center text-brand-accent backdrop-blur-md border border-white/20">
                   <TreePine size={32} />
                </div>
                <div className="space-y-2">
                   <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">You've Saved a Tree!</h2>
                   <p className="text-brand-light font-medium text-lg leading-relaxed max-w-md mx-auto">
                     By choosing to reuse instead of buying new, you've directly contributed to saving <span className="text-white font-black underline decoration-brand-accent underline-offset-8">1.2 kg of paper waste.</span>
                   </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                   <button className="w-full sm:w-auto bg-white text-brand-primary px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl">
                      <Share2 size={20} />
                      Share Impact
                   </button>
                   <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/5 transition-all">
                      <Download size={20} />
                      Download Invoice
                   </button>
                </div>
             </div>
          </motion.div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
             <div className="bg-brand-background p-8 rounded-[2.5rem] border border-gray-100 flex gap-6 group hover:bg-brand-light transition-colors cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-primary shrink-0 shadow-sm group-hover:rotate-12 transition-transform">
                   <Package size={28} />
                </div>
                <div className="space-y-1">
                   <h4 className="font-black text-brand-primary">Track Your Books</h4>
                   <p className="text-sm text-gray-500 font-medium">See live updates as your order moves from vendor to you.</p>
                   <Link href="/orders/1" className="inline-flex items-center gap-1 text-sm font-black text-brand-secondary pt-2 group-hover:underline">
                      View Status <ArrowRight size={14} />
                   </Link>
                </div>
             </div>

             <div className="bg-brand-background p-8 rounded-[2.5rem] border border-gray-100 flex gap-6 group hover:bg-brand-light transition-colors cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-primary shrink-0 shadow-sm group-hover:-rotate-12 transition-transform">
                   <PartyPopper size={28} />
                </div>
                <div className="space-y-1">
                   <h4 className="font-black text-brand-primary">Refer a Friend</h4>
                   <p className="text-sm text-gray-500 font-medium">Give ₹50, Get ₹50 for every friend who joins the revolution.</p>
                   <p className="inline-flex items-center gap-1 text-sm font-black text-brand-secondary pt-2 group-hover:underline">
                      Invite Now <ArrowRight size={14} />
                   </p>
                </div>
             </div>
          </div>

          <div className="pt-20">
             <Link href="/" className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                <ArrowRight size={16} className="rotate-180" />
                Back to Shopping
             </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
