"use client";

import React, { useState } from "react";
import { ArrowLeft, Store, MapPin, Clock, ShieldCheck, Bell, CreditCard, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = ["Store", "Availability", "Notifications", "Security", "Payout"];

export default function SettingsPage() {
  const [tab, setTab] = useState("Store");

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Store Settings</h1>
        <p className="text-gray-500 font-medium">Manage your store profile, availability and payout preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-sm w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-black transition-all",
              tab === t
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                : "text-gray-500 hover:text-brand-primary"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Store Tab */}
      {tab === "Store" && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-brand-primary rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-white shadow-xl">P</div>
            <div>
              <h2 className="text-xl font-black text-brand-primary">PaperShop Books</h2>
              <p className="text-xs font-black text-brand-success uppercase tracking-widest">Verified · Gold Plan</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Store Name", val: "PaperShop Books" },
              { label: "Owner Name", val: "Ahmed Khan" },
              { label: "Phone", val: "+91 9988776655" },
              { label: "WhatsApp", val: "+91 9988776655" },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{field.label}</label>
                <input defaultValue={field.val} className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all" />
              </div>
            ))}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Store Address</label>
              <textarea rows={2} defaultValue="15, Book Lane, Abids, Hyderabad, Telangana 500001" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all resize-none" />
            </div>
          </div>
          <button className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl flex items-center gap-3">
            <Save size={18} /> Save Changes
          </button>
        </div>
      )}

      {/* Availability Tab */}
      {tab === "Availability" && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-brand-primary flex items-center gap-3"><Clock size={22} className="text-brand-secondary" /> Store Hours</h2>
            {["Mon–Fri", "Saturday", "Sunday"].map((day) => (
              <div key={day} className="flex items-center justify-between p-6 bg-brand-background rounded-2xl">
                <span className="font-bold text-brand-primary">{day}</span>
                <div className="flex items-center gap-4">
                  <input type="time" defaultValue="09:00" className="font-bold text-brand-primary bg-white px-3 py-2 rounded-xl border border-gray-100" />
                  <span className="text-gray-400">to</span>
                  <input type="time" defaultValue="20:00" className="font-bold text-brand-primary bg-white px-3 py-2 rounded-xl border border-gray-100" />
                </div>
              </div>
            ))}
          </div>
          <button className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl flex items-center gap-3">
            <Save size={18} /> Save Hours
          </button>
        </div>
      )}

      {/* Payout Tab */}
      {tab === "Payout" && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
          <h2 className="text-xl font-black text-brand-primary flex items-center gap-3"><CreditCard size={22} className="text-brand-secondary" /> Payout Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Bank Name</label>
              <input defaultValue="HDFC Bank" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account Holder Name</label>
              <input defaultValue="Ahmed Khan" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account Number</label>
              <input type="password" defaultValue="50100123456789" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">IFSC Code</label>
              <input defaultValue="HDFC0001234" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary transition-all" />
            </div>
          </div>
          <div className="p-5 bg-brand-light/30 rounded-2xl border border-brand-secondary/10 text-sm font-bold text-brand-primary flex items-center gap-3">
            <ShieldCheck size={20} className="text-brand-success shrink-0" />
            Your banking details are encrypted and stored securely. We process payouts every Monday.
          </div>
          <button className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl flex items-center gap-3">
            <Save size={18} /> Update Payout Details
          </button>
        </div>
      )}

      {(tab === "Notifications" || tab === "Security") && (
        <div className="bg-white rounded-[2.5rem] p-16 border border-gray-100 shadow-sm text-center space-y-4">
          <ShieldCheck size={48} className="mx-auto text-gray-200" />
          <p className="text-lg font-black text-gray-400">Coming Soon</p>
          <p className="text-sm font-medium text-gray-400">This section is under development.</p>
        </div>
      )}
    </div>
  );
}
