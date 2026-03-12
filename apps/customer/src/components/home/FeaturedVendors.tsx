"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const vendors = [
  { id: "v_1", name: "PaperShop Books", area: "Abids", city: "Hyderabad", rating: 4.8, reviews: 234, image: "https://picsum.photos/400/300?random=50" },
  { id: "v_2", name: "BookBazaar", area: "Adyar", city: "Chennai", rating: 4.6, reviews: 189, image: "https://picsum.photos/400/300?random=51" },
  { id: "v_3", name: "StudyZone Store", area: "Navrangpura", city: "Ahmedabad", rating: 4.5, reviews: 156, image: "https://picsum.photos/400/300?random=52" },
];

export const FeaturedVendors = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary tracking-tight text-brand-primary">Verified Hubs</h2>
            <p className="text-gray-500 font-medium text-brand-primary">Shop directly from trusted local bookshops across India.</p>
          </div>
          <Link href="/vendors" className="text-brand-secondary font-bold hover:underline flex items-center gap-1">
            Browse All Vendors
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vendors.map((vendor, index) => (
            <motion.div 
              key={vendor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-brand-background rounded-[2.5rem] p-4 border border-gray-100 hover:shadow-2xl transition-all"
            >
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-brand-primary shadow-lg text-brand-primary">
                  <Star size={14} className="text-yellow-500" fill="currentColor" />
                  {vendor.rating}
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-brand-success" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-success">Verified Partner</span>
                </div>
                <h3 className="text-xl font-bold text-brand-primary mb-1 text-brand-primary">{vendor.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-6 text-brand-primary">
                  <MapPin size={14} />
                  {vendor.area}, {vendor.city}
                </div>
                
                <Link href={`/vendors/${vendor.id}`} className="w-full py-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  Visit Shop
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
