"use client";

import React from "react";
import { CreditCard, Plus, Trash2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CARDS = [
  { id: 1, type: "VISA", last4: "4882", expiry: "09/26", holder: "Rahul Sharma", default: true },
];
const UPI = [
  { id: 1, vpa: "rahul@upi", app: "PhonePe", default: false },
];

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl space-y-10">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Payment Methods</h1>
          <p className="text-gray-500 font-medium mt-1">Your saved cards and UPI IDs.</p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Saved Cards</h3>
            <button className="flex items-center gap-2 text-brand-primary font-black text-sm hover:text-brand-secondary transition-colors">
              <Plus size={16} /> Add Card
            </button>
          </div>

          {CARDS.map((card, i) => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2rem] p-8 border-2 border-brand-primary/20 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                    <CreditCard size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-brand-primary">{card.type} ···· {card.last4}</p>
                    <p className="text-xs font-bold text-gray-400">Expires {card.expiry} · {card.holder}</p>
                  </div>
                </div>
                {card.default && <span className="text-[10px] font-black uppercase tracking-widest bg-brand-light text-brand-primary px-3 py-1 rounded-full">Default</span>}
              </div>
            </motion.div>
          ))}

          <div className="flex items-center justify-between mt-8">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">UPI IDs</h3>
            <button className="flex items-center gap-2 text-brand-primary font-black text-sm hover:text-brand-secondary transition-colors">
              <Plus size={16} /> Add UPI
            </button>
          </div>

          {UPI.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-brand-primary">{u.vpa}</p>
                  <p className="text-xs font-bold text-gray-400">{u.app}</p>
                </div>
                <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShieldCheck size={20} className="text-brand-success shrink-0" />
          <p className="text-xs font-bold text-gray-500">Your payment data is encrypted with 256-bit SSL. RebookIndia never stores your full card number.</p>
        </div>
      </div>
    </main>
  );
}
