"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { account } from "@rebookindia/firebase/src/client";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Store,
  BookOpen,
  ShoppingBag,
  AlertCircle,
  CreditCard,
  BarChart3,
  Megaphone,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Vendors", icon: Store, href: "/vendors" },
  { label: "Books", icon: BookOpen, href: "/books" },
  { label: "Orders", icon: ShoppingBag, href: "/orders" },
  { label: "Disputes", icon: AlertCircle, href: "/disputes" },
  { label: "Payments", icon: CreditCard, href: "/payments" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Marketing", icon: Megaphone, href: "/marketing" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();



  return (
    <aside className="hidden md:flex flex-col w-[260px] bg-brand-primary h-screen sticky top-0 shrink-0 shadow-lg">
      {/* Logo */}
      <div className="p-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center font-black text-brand-primary shadow-lg text-lg">
            R
          </div>
          <div className="leading-none">
            <span className="text-xl font-black text-white tracking-tighter block italic">REBOOK</span>
            <span className="text-[10px] font-black text-brand-light/60 tracking-[0.3em] uppercase">Admin</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all group",
                isActive 
                  ? "bg-white/10 text-white font-bold" 
                  : "text-brand-light/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn("shrink-0", isActive ? "text-brand-accent" : "text-brand-light/50 group-hover:text-white")} />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-white/10">
          <a 
            href={process.env.NEXT_PUBLIC_CUSTOMER_URL || "http://localhost:4000"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-light/70 hover:bg-white/5 hover:text-white transition-all group"
          >
            <LayoutDashboard size={18} className="text-brand-light/50 group-hover:text-brand-accent" />
            <span className="text-sm font-bold">View Website ↗</span>
          </a>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 shrink-0">
        <div className="bg-white/5 rounded-2xl p-4 space-y-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center font-black text-brand-primary">
              SA
            </div>
            <div>
              <p className="text-sm font-bold text-white">Super Admin</p>
              <p className="text-[10px] font-black text-brand-light/40 uppercase tracking-widest flex items-center gap-1">
                <Shield size={10} /> Full Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
