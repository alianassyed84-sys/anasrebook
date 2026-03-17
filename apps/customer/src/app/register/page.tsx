"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";
import { account, databases, DB_ID, COLLECTIONS, ID } from "@rebookindia/firebase";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth Account
      const authUser = await account.create(ID.unique(), email, password, name);
      
      // 2. Create Session
      await account.createEmailPasswordSession(email, password);

      // 3. Create User Document in DB
      await databases.createDocument(DB_ID, COLLECTIONS.USERS, ID.unique(), {
        userId: authUser.$id,
        name,
        email,
        phone,
        isBookPass: false,
        totalOrders: 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created! Welcome 🎉");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Left Branding */}
        <div className="bg-brand-primary p-12 md:p-16 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] mb-8">
              Join the<br />
              <span className="italic text-brand-accent">Revolution.</span>
            </h2>
            <p className="text-brand-light/70 font-medium max-w-xs">
              Save up to 70% on books and contribute to a greener planet.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center space-y-6">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">Create Account</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full pl-12 pr-5 py-4 bg-brand-background rounded-2xl border-none outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full pl-12 pr-5 py-4 bg-brand-background rounded-2xl border-none outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9988776655"
                  className="w-full pl-12 pr-5 py-4 bg-brand-background rounded-2xl border-none outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-brand-background rounded-2xl border-none outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-center text-sm font-bold text-gray-400">
            Already have an account?{" "}
            <button onClick={() => router.push("/login")} className="text-brand-secondary font-black hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </main>
  );
}
