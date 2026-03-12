"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Sparkles } from "lucide-react";

export const BookPassBanner = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-brand-primary rounded-[3rem] overflow-hidden p-8 md:p-16 text-white"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-secondary/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-accent text-sm font-bold">
                <Zap size={16} fill="currentColor" />
                <span>Most Popular Choice</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Stop Paying for <br />
                <span className="text-brand-accent italic">Delivery Forever.</span>
              </h2>
              
              <p className="text-xl text-brand-light leading-relaxed">
                Unlock <span className="text-white font-bold">Free Delivery</span> on 1,00,000+ books with <span className="border-b-2 border-brand-accent italic font-bold">RebookIndia BookPass</span>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  "Free Delivery with No Min Order",
                  "Priority Shipping (2X Faster)",
                  "Exclusive Member Only Sales",
                  "Early Access to NCERT Drops"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button className="bg-brand-accent text-brand-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                  Join BookPass Now
                  <ArrowRight size={20} />
                </button>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">₹149<span className="text-sm font-medium text-brand-light">/month</span></span>
                  <span className="text-[10px] uppercase tracking-tighter text-brand-light">Cancel Anytime</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-white/5 rounded-[2rem] -rotate-3 scale-105 backdrop-blur-sm" />
              <div className="relative bg-white/10 rounded-[2rem] border border-white/20 p-8 backdrop-blur-md">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center text-brand-primary">
                      <Sparkles size={24} fill="currentColor" />
                    </div>
                    <span className="font-black text-xl italic tracking-tighter">BOOKPASS</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Savings Wallet</p>
                    <p className="text-2xl font-black">₹450.00</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-brand-accent" />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-white/80">
                    <span>8 TOTAL ORDERS THIS MONTH</span>
                    <span>3 TREES PLANTED</span>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">
                    Certified Reuse Partner
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-brand-primary rotate-12 shadow-lg">
                    R
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
