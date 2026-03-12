"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, TreePine, Recycle, Star } from "lucide-react";

const IMPACT_STATS = [
  { icon: TreePine, label: "Trees Saved", value: 1.2, unit: "trees", color: "text-green-600", bg: "bg-green-50", target: 10 },
  { icon: Droplets, label: "Water Saved", value: 45.6, unit: "liters", color: "text-blue-600", bg: "bg-blue-50", target: 200 },
  { icon: Recycle, label: "Paper Recycled", value: 8.5, unit: "kg", color: "text-brand-primary", bg: "bg-brand-light/50", target: 50 },
  { icon: Leaf, label: "CO₂ Reduced", value: 3.2, unit: "kg", color: "text-brand-success", bg: "bg-green-50", target: 20 },
];

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black text-brand-primary tracking-tighter">Your Reuse Impact</h1>
          <p className="text-gray-500 font-medium">Every used book you buy instead of a new one saves resources. This is your impact.</p>
        </div>

        {/* Big Impact Card */}
        <div className="bg-brand-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10 text-center space-y-3">
            <TreePine size={48} className="text-green-400 mx-auto" />
            <p className="text-6xl font-black italic">1.2</p>
            <p className="text-brand-light/80 font-bold text-xl">Trees Saved so far</p>
            <p className="text-brand-light/50 text-sm font-medium">Just 8.8 more trees to reach your first milestone 🎯</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm space-y-4"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value} <span className="text-sm font-bold text-gray-400">{stat.unit}</span></p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">{stat.label}</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full bg-current ${stat.color}`} style={{ width: `${(stat.value / stat.target) * 100}%` }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center space-y-4">
          <Star size={32} className="text-brand-accent mx-auto" />
          <h3 className="text-xl font-black text-brand-primary">You're a RebookIndia Champion!</h3>
          <p className="text-gray-500 font-medium text-sm">Your 5 purchases have contributed directly to a greener India. Share your impact badge.</p>
          <button className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl">
            Share Impact Badge
          </button>
        </div>
      </div>
    </main>
  );
}
