"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  LogOut, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  CreditCard,
  Zap,
  ChevronRight,
  ShieldCheck,
  Star,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { account, databases, DB_ID, COLLECTIONS, Query } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await account.get();
        setUser(u);
        setNewName(u.name);
        
        // Fetch orders
        const ordersRes = await databases.listDocuments(
          DB_ID, 
          COLLECTIONS.ORDERS,
          [Query.equal("userId", u.$id), Query.orderDesc("$createdAt")]
        );
        setOrders(ordersRes.documents);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleUpdateProfile = async () => {
    try {
      await account.updateName(newName);
      toast.success("Profile updated ✅");
      setUser({ ...user, name: newName });
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Sidebar / Profile Summary */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm text-center space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-3xl -z-0" />
               
               <div className="relative mx-auto w-32 h-32 bg-brand-light rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-brand-primary shadow-xl">
                 {user?.name?.[0] || "U"}
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-success border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck size={18} />
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-center bg-gray-50 border-none outline-none focus:ring-2 ring-brand-secondary/20 rounded-xl px-4 py-2 font-black text-brand-primary w-full italic"
                   />
                   <button 
                    onClick={handleUpdateProfile}
                    className="text-xs font-black text-brand-secondary mt-2 uppercase tracking-widest hover:underline"
                   >
                     Update Profile
                   </button>
                 </div>
                 <p className="text-sm font-bold text-gray-400">{user?.email}</p>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                  <div className="text-center">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Orders</p>
                     <p className="text-lg font-black text-brand-primary">{orders.length}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Impact</p>
                     <p className="text-lg font-black text-brand-success">1.2 Trees</p>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-5 bg-red-50 text-red-500 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-red-100 transition-all"
            >
              <LogOut size={20} />
              Logout Account
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.4em] ml-2">Recent Orders</h3>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-bold italic">
                  No orders found yet.
                </div>
              ) : (
                orders.map((order, idx) => (
                  <div 
                    key={order.$id}
                    className={cn(
                      "p-6 flex items-center justify-between",
                      idx === orders.length - 1 ? "" : "border-b border-gray-50"
                    )}
                  >
                    <div>
                      <p className="font-bold text-brand-primary">{order.bookTitle}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order ID: #{order.$id.slice(-6)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-brand-primary italic">₹{order.totalAmount}</p>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        order.orderStatus === "delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.4em] ml-2">Account Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "BookPass Member", icon: Zap, href: "/account/bookpass", color: "text-brand-accent", sub: "Free Delivery Active" },
                  { label: "Wishlist", icon: Heart, href: "/account/wishlist", color: "text-pink-500", sub: "12 Items saved" },
                  { label: "Reviews", icon: Star, href: "/account/reviews", color: "text-yellow-500", sub: "Shared knowledge" },
                  { label: "Security", icon: ShieldCheck, href: "/account/security", color: "text-blue-500", sub: "Password & Privacy" },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6 hover:shadow-xl transition-all text-left"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-brand-background", item.color)}>
                      <item.icon size={22} />
                    </div>
                    <div>
                      <p className="font-black text-brand-primary">{item.label}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
