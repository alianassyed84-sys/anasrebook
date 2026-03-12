"use client";

import React, { useState } from "react";
import { ShieldCheck, Key, Smartphone, AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const [twoFA, setTwoFA] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl space-y-10">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Security &amp; Privacy</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your account security settings.</p>
        </div>

        {/* Security Score */}
        <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white space-y-4">
          <div className="flex items-center gap-4">
            <ShieldCheck size={32} className="text-brand-accent" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-light/50">Security Score</p>
              <p className="text-4xl font-black">85<span className="text-xl text-brand-light/60">/100</span></p>
            </div>
          </div>   
          <p className="text-brand-light/70 text-sm font-bold">Your account is well protected. Enable login alerts to reach 100.</p>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-brand-primary flex items-center gap-2">
            <Key size={20} className="text-brand-secondary" /> Change Password
          </h2>
          <div className="space-y-4">
            {["Current Password", "New Password", "Confirm New Password"].map((f) => (
              <div key={f} className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{f}</label>
                <input type="password" placeholder="••••••••••" className="w-full px-6 py-4 bg-brand-background rounded-2xl border-2 border-transparent focus:border-brand-primary/20 outline-none font-bold text-brand-primary transition-all" />
              </div>
            ))}
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl flex items-center justify-center gap-3">
              {saved ? <><CheckCircle2 size={18} /> Password Updated!</> : <><Lock size={18} /> Update Password</>}
            </button>
          </div>
        </div>

        {/* 2FA */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-brand-primary flex items-center gap-2">
              <Smartphone size={20} className="text-brand-secondary" /> Two-Factor Authentication
            </h2>
            <button onClick={() => setTwoFA(!twoFA)}
              className={cn("w-14 h-8 rounded-full transition-all relative", twoFA ? "bg-brand-success" : "bg-gray-200")}>
              <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform", twoFA ? "translate-x-7" : "translate-x-1")} />
            </button>
          </div>
          <p className="text-sm font-bold text-gray-500">
            {twoFA ? "2FA is active. OTP will be sent to your registered phone for every login." : "Enable 2FA for extra account security."}
          </p>
        </div>

        {/* Login Alerts */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-brand-primary flex items-center gap-2">
            <AlertTriangle size={20} className="text-brand-accent" /> Login Alerts
          </h2>
          <div className="flex items-center justify-between py-2">
            <p className="font-bold text-brand-primary text-sm">Email me on new login</p>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-primary rounded" />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-50">
            <p className="font-bold text-brand-primary text-sm">SMS on suspicious activity</p>
            <input type="checkbox" className="w-5 h-5 accent-brand-primary rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
