"use client";

import React, { useState } from "react";
import { Camera, Save, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EditProfilePage() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl space-y-10">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Edit Profile</h1>
          <p className="text-gray-500 font-medium mt-1">Update your personal information.</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-8 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <div className="relative">
            <div className="w-24 h-24 bg-brand-light rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-brand-primary shadow-lg">
              R
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-colors">
              <Camera size={18} />
            </button>
          </div>
          <div className="space-y-1">
            <p className="font-black text-brand-primary text-lg">Rahul Sharma</p>
            <p className="text-sm font-bold text-gray-400">Member since Oct 2023</p>
            <button className="text-xs font-black text-brand-secondary uppercase tracking-widest hover:underline">Upload Photo</button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-brand-primary">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "First Name", value: "Rahul", placeholder: "Rahul" },
              { label: "Last Name", value: "Sharma", placeholder: "Sharma" },
              { label: "Email", value: "rahul@iit.edu.in", placeholder: "Email" },
              { label: "Phone", value: "+91 98765 43210", placeholder: "Phone" },
              { label: "City", value: "Hyderabad", placeholder: "City" },
              { label: "Pincode", value: "500081", placeholder: "Pincode" },
            ].map((f) => (
              <div key={f.label} className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{f.label}</label>
                <input defaultValue={f.value} className="w-full px-6 py-4 bg-brand-background rounded-2xl border-2 border-transparent focus:border-brand-primary/20 outline-none font-bold text-brand-primary transition-all" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">College / School</label>
            <input defaultValue="IIT Hyderabad" className="w-full px-6 py-4 bg-brand-background rounded-2xl border-2 border-transparent focus:border-brand-primary/20 outline-none font-bold text-brand-primary transition-all" />
          </div>

          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl flex items-center justify-center gap-3"
          >
            {saved ? <><CheckCircle2 size={20} /> Saved!</> : <><Save size={20} /> Save Changes</>}
          </motion.button>
        </div>
      </div>
    </main>
  );
}
