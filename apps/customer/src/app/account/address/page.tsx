"use client";

import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2, MapPin, Home, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ADDRESSES = [
  { id: 1, type: "Home", name: "Rahul Sharma", line1: "Flat 4B, Sai Residency", line2: "Madhapur, Hyderabad", pin: "500081", default: true },
  { id: 2, type: "College", name: "Rahul Sharma", line1: "IIT Hyderabad, Kandi Campus", line2: "Sangareddy, Telangana", pin: "502285", default: false },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState(ADDRESSES);
  const removeAddress = (id: number) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Saved Addresses</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your delivery addresses.</p>
          </div>
          <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 text-sm">
            <Plus size={18} /> Add New
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className={cn(
                  "bg-white rounded-[2rem] p-8 border-2 shadow-sm relative transition-all",
                  addr.default ? "border-brand-primary/30" : "border-gray-100"
                )}
              >
                {addr.default && (
                  <span className="absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest bg-brand-light text-brand-primary px-3 py-1 rounded-full">
                    Default
                  </span>
                )}
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-brand-background rounded-xl flex items-center justify-center shrink-0">
                    {addr.type === "Home" ? <Home size={22} className="text-brand-primary" /> : <Building size={22} className="text-brand-primary" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-light px-2 py-0.5 rounded-md">{addr.type}</span>
                    </div>
                    <p className="font-black text-brand-primary text-lg">{addr.name}</p>
                    <p className="text-sm font-bold text-gray-500">{addr.line1}</p>
                    <p className="text-sm font-bold text-gray-500">{addr.line2} - {addr.pin}</p>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {!addr.default && (
                      <button onClick={() => removeAddress(addr.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
