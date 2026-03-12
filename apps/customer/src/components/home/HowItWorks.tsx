"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Package, RotateCcw } from "lucide-react";

const steps = [
  { 
    title: "Find Your Book", 
    desc: "Scan ISBN or search our local catalog for the titles you need.", 
    icon: Search, 
    color: "bg-blue-100 text-blue-600" 
  },
  { 
    title: "Place Order", 
    desc: "Choose condition & vendor. Pay securely or choose COD.", 
    icon: Package, 
    color: "bg-orange-100 text-brand-accent" 
  },
  { 
    title: "Eco-Reuse", 
    desc: "Get fast local delivery. Save environment & 60% wallet.", 
    icon: RotateCcw, 
    color: "bg-green-100 text-brand-success" 
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-brand-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-brand-primary tracking-tighter">Reuse in 3 Simple Steps</h2>
          <p className="text-gray-500 font-medium">Revolutionizing the way student community shares knowledge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[20%] left-0 w-full h-0.5 border-t-2 border-dashed border-gray-200 -z-1" />

          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className={`w-24 h-24 ${step.color} rounded-[2rem] flex items-center justify-center shadow-lg transform rotate-6 transition-transform hover:rotate-0 duration-500`}>
                <step.icon size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-brand-primary">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
