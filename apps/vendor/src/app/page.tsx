"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  Star,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { account, databases, DB_ID, COLLECTIONS, Query } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function VendorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState({
    revenue: 0,
    booksCount: 0,
    activeOrders: 0,
    rating: 4.8
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await account.get();
        const vendorDocs = await databases.listDocuments(DB_ID, COLLECTIONS.VENDORS, [Query.equal("userId", u.$id)]);
        
        if (vendorDocs.documents.length === 0) {
          toast.error("Not a vendor!");
          router.push("/login");
          return;
        }

        const v = vendorDocs.documents[0];
        setVendor(v);

        // Fetch Stats
        const [books, orders] = await Promise.all([
          databases.listDocuments(DB_ID, COLLECTIONS.BOOKS, [Query.equal("vendorId", v.$id)]),
          databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [Query.equal("vendorId", v.$id), Query.orderDesc("$createdAt")])
        ]);

        const totalRevenue = orders.documents.reduce((acc, o) => o.paymentStatus === "paid" ? acc + o.totalAmount : acc, 0);
        const activeOrders = orders.documents.filter(o => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length;

        setStats({
          revenue: totalRevenue,
          booksCount: books.total,
          activeOrders: activeOrders,
          rating: v.rating || 4.8
        });

        setRecentOrders(orders.documents.slice(0, 5));
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
  );

  const KPI_CARDS = [
    { label: "Total Revenue", value: `₹${stats.revenue}`, icon: IndianRupee, color: "bg-brand-primary", textColor: "text-white" },
    { label: "Books Listed", value: stats.booksCount.toString(), icon: Package, color: "bg-white", textColor: "text-brand-primary" },
    { label: "Active Orders", value: stats.activeOrders.toString(), icon: ShoppingBag, color: "bg-white", textColor: "text-brand-primary" },
    { label: "Avg. Rating", value: stats.rating.toString(), icon: Star, color: "bg-white", textColor: "text-brand-primary" },
  ];

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-primary tracking-tighter">
            Good Evening, {vendor?.shopName.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 font-medium">
            Here's what's happening at {vendor?.shopName} today.
          </p>
        </div>
        <Link
          href="/inventory/add"
          className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
        >
          + List a Book
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-all",
              kpi.color
            )}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", i === 0 ? "bg-white/20" : "bg-brand-background")}>
              <kpi.icon size={24} className={i === 0 ? "text-white" : "text-brand-primary"} />
            </div>
            <div className="space-y-1">
              <p className={cn("text-[10px] font-black uppercase tracking-widest", i === 0 ? "text-white/60" : "text-gray-400")}>{kpi.label}</p>
              <p className={cn("text-3xl font-black tracking-tight", kpi.textColor)}>{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-brand-primary">Recent Orders</h2>
            <Link href="/orders" className="text-xs font-black text-brand-secondary uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-center py-10 text-gray-400 font-bold italic">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.$id} className="flex items-center justify-between p-5 bg-brand-background rounded-2xl group hover:bg-white border-2 border-transparent hover:border-brand-primary/10 transition-all cursor-pointer">
                  <div className="space-y-1">
                    <p className="font-bold text-brand-primary text-sm">{order.bookTitle}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      #{order.$id.slice(-6)} · {order.customerName} · {new Date(order.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-brand-primary text-sm">₹{order.totalAmount}</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : 
                      order.orderStatus === "shipped" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    )}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden h-fit">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-brand-accent" />
            <h3 className="font-black italic text-lg relative z-10">Sales Tips</h3>
          </div>
          <div className="space-y-5 relative z-10 text-sm font-medium leading-relaxed">
            <p className="opacity-80">🔥 Best-selling categories this week are <span className="text-brand-accent font-black">NEET & JEE</span> Prep.</p>
            <p className="opacity-80">📦 Same-day dispatch increases seller rating by <span className="text-brand-accent font-black">20%</span>.</p>
            <p className="opacity-80">📸 Multiple images lead to <span className="text-brand-accent font-black">3x</span> more sales.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
