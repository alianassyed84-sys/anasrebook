"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, BookOpen, Send } from "lucide-react";

export const Newsletter = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative p-12 md:p-20 rounded-[4rem] bg-brand-light/30 border border-brand-secondary/5 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-brand-accent/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-secondary/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand-primary">
              <Mail size={32} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-brand-primary tracking-tighter">Never Miss a Book Drop</h2>
              <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                Subscribe to get alerts for new NCERT arrivals, university book drops, and exclusive community discounts.
              </p>
            </div>

            <form className="w-full max-w-lg relative group pt-4">
              <div className="absolute -inset-1 bg-brand-primary rounded-3xl blur opacity-10 group-focus-within:opacity-20 transition duration-500" />
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 p-2 overflow-hidden">
                <input 
                  type="email" 
                  placeholder="Enter your student email..."
                  className="flex-1 px-4 py-4 bg-transparent outline-none text-brand-primary font-bold"
                />
                <button 
                  type="submit"
                  className="bg-brand-primary text-white p-4 rounded-xl hover:bg-brand-secondary transition-all flex items-center justify-center shadow-lg"
                >
                  <Send size={24} />
                </button>
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Join 50,000+ Students already subscribed.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
