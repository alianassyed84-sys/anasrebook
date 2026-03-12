"use client";

import React from "react";
import { motion } from "framer-motion";
import { Apple, PlayCircle, Smartphone } from "lucide-react";

export const AppDownload = () => {
  return (
    <section className="py-24 bg-brand-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-br from-brand-secondary to-brand-primary rounded-[3rem] p-8 md:p-20 text-white relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                RebookIndia <br />
                <span className="text-brand-accent italic underline decoration-white/20 underline-offset-8">In Your Pocket.</span>
              </h2>
              <p className="text-lg text-brand-light leading-relaxed max-w-sm">
                Get the app for a faster checkout experience, instant book drop alerts, and exclusive app-only discounts.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-white text-brand-primary px-8 py-4 rounded-2xl flex items-center gap-3 font-bold hover:scale-105 transition-all shadow-xl">
                  <PlayCircle size={24} />
                  <div className="text-left leading-none">
                    <span className="text-[10px] uppercase font-black opacity-50 block mb-1">Get it on</span>
                    <span className="text-lg">Google Play</span>
                  </div>
                </button>
                <button className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold hover:bg-white/5 transition-all">
                  <Apple size={24} />
                  <div className="text-left leading-none">
                    <span className="text-[10px] uppercase font-black opacity-50 block mb-1">Download on</span>
                    <span className="text-lg">App Store</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="relative">
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-10 mx-auto w-full max-w-[300px]"
              >
                {/* Visual mock of the phone */}
                <div className="bg-brand-primary border-4 border-white/10 rounded-[3rem] p-4 shadow-2xl relative">
                  <div className="aspect-[9/19.5] bg-white rounded-[2.5rem] overflow-hidden p-6 text-brand-primary text-center">
                    <Smartphone size={100} className="mx-auto mt-20 text-brand-secondary opacity-20" />
                    <p className="mt-8 font-black text-2xl tracking-tighter">REBOOK <br /> INDIA</p>
                    <p className="mt-2 text-xs font-bold text-gray-400 italic">Coming Soon</p>
                  </div>
                  <div className="mt-4 w-12 h-1.5 bg-white/20 rounded-full mx-auto" />
                </div>
              </motion.div>
              
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary/30 rounded-full border border-white/10 animate-pulse -z-1" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
