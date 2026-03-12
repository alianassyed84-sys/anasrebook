"use client";

import React from "react";
import { motion } from "framer-motion";
import { TreePine, BookOpen, Users, Globe } from "lucide-react";

const counters = [
  { label: "Trees Saved", value: "5,432", icon: TreePine, color: "text-green-600" },
  { label: "Books Reused", value: "24,561", icon: BookOpen, color: "text-blue-600" },
  { label: "Student Savings", value: "₹12.5L+", icon: Globe, color: "text-brand-accent" },
];

export const ImpactCounter = () => {
  return (
    <section className="py-24 bg-brand-primary text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tighter">Our Growing Impact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {counters.map((counter, index) => (
            <motion.div 
              key={counter.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="space-y-4"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full mx-auto flex items-center justify-center backdrop-blur-md">
                <counter.icon size={40} className="text-brand-accent" />
              </div>
              <h3 className="text-4xl md:text-6xl font-black">{counter.value}</h3>
              <p className="text-lg font-bold text-brand-light uppercase tracking-widest">{counter.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
