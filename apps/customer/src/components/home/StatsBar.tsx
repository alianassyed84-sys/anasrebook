"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, TreePine, IndianRupee, Star } from "lucide-react";

const stats = [
  { label: "Active Students", value: "10,000+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Trees Saved", value: "5,000+", icon: TreePine, iconColor: "text-green-600", bg: "bg-green-50" },
  { label: "Avg. Savings", value: "65%", icon: IndianRupee, iconColor: "text-brand-accent", bg: "bg-orange-50" },
  { label: "Quality Rating", value: "4.8/5", icon: Star, iconColor: "text-yellow-500", bg: "bg-yellow-50" },
];

export const StatsBar = () => {
  return (
    <section className="py-12 bg-white relative z-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 -mt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-x-0 lg:divide-x divide-gray-100">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 lg:px-6"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.iconColor || stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-primary tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
