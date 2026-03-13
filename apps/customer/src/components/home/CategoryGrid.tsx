"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, School, Book, Library, Zap } from "lucide-react";

const categories = [
  { name: "School Books", icon: School, count: "2,500+", slug: "school", color: "bg-blue-500" },
  { name: "NEET / JEE", icon: Zap, count: "1,200+", slug: "neet", color: "bg-orange-500" },
  { name: "College / Uni", icon: GraduationCap, count: "4,000+", slug: "college", color: "bg-brand-primary" },
  { name: "UPSC / Govt", icon: Library, count: "800+", slug: "upsc", color: "bg-green-600" },
  { name: "Novels / Fiction", icon: Book, count: "1,500+", slug: "novel", color: "bg-pink-500" },
];

export const CategoryGrid = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-brand-background dark:bg-gray-950 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary dark:text-gray-100 tracking-tight">Browse by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Find exactly what you need for your studies.</p>
          </div>
          <button 
            onClick={() => router.push("/books")}
            className="text-brand-secondary font-bold hover:underline flex items-center gap-1"
          >
            View All Categories
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ delay: index * 0.05 }}
            >
              <button 
                onClick={() => router.push("/books?category=" + cat.slug)}
                className="w-full group block bg-white dark:bg-[#1a2744] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2d3f6b] hover:shadow-xl hover:border-brand-secondary/20 transition-all text-center"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-2xl mx-auto flex items-center justify-center text-white mb-6 transform group-hover:rotate-6 transition-transform`}>
                  <cat.icon size={30} />
                </div>
                <h4 className="text-lg font-bold text-brand-primary dark:text-gray-100 mb-1">{cat.name}</h4>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500">{cat.count} listings</p>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
