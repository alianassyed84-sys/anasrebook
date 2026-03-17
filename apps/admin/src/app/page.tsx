"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Store,
  BookOpen,
  ShoppingBag,
  IndianRupee,
  Clock,
  RefreshCcw,
  AlertCircle,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Info,
  Users,
  Megaphone
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format, subDays, startOfDay, isAfter, subMonths, subYears } from "date-fns";
import { databases, Query, DB_ID, COLLECTIONS } from "@rebookindia/firebase";
import toast from "react-hot-toast";

function AnimatedNumber({ value }: { value: number }) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!numberRef.current) return;
    const target = { val: 0 };
    gsap.to(target, {
      val: value,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.innerText = Math.round(target.val).toLocaleString("en-IN");
        }
      }
    });
  }, [value]);

  return <span ref={numberRef}>0</span>;
}

function OverviewContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Metrics state
  const [metrics, setMetrics] = useState({
    revenueToday: 0,
    ordersToday: 0,
    activeVendors: 0,
    liveBooks: 0,
    pendingVendorsCount: 0,
    openDisputesCount: 0,
    pendingPayoutsTotal: 0
  });

  const [lists, setLists] = useState<{
    pendingVendors: any[];
    topVendors: any[];
    recentOrders: any[];
  }>({
    pendingVendors: [],
    topVendors: [],
    recentOrders: []
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("7d");

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const todayStart = startOfDay(new Date()).toISOString();

      // Parallel fetching for performance
      const [
        ordersRes, 
        approvedVendorsRes, 
        pendingVendorsRes, 
        liveBooksRes, 
        disputesRes, 
        payoutsRes, 
        topVendorsRes, 
        recentRes
      ] = await Promise.all([
        databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [Query.greaterThanEqual("createdAt", todayStart), Query.limit(100)]),
        databases.listDocuments(DB_ID, COLLECTIONS.VENDORS, [Query.equal("status", "approved"), Query.limit(0)]),
        databases.listDocuments(DB_ID, COLLECTIONS.VENDORS, [Query.equal("status", "pending"), Query.orderDesc("createdAt"), Query.limit(3)]),
        databases.listDocuments(DB_ID, COLLECTIONS.BOOKS, [Query.equal("isAvailable", true), Query.limit(0)]),
        databases.listDocuments(DB_ID, COLLECTIONS.DISPUTES, [Query.equal("status", "open"), Query.limit(0)]),
        databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [Query.equal("isPayoutReleased", false), Query.equal("orderStatus", "delivered"), Query.limit(100)]),
        databases.listDocuments(DB_ID, COLLECTIONS.VENDORS, [Query.equal("status", "approved"), Query.orderDesc("totalEarnings"), Query.limit(4)]),
        databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [Query.orderDesc("createdAt"), Query.limit(4)])
      ]);

      const revToday = ordersRes.documents.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0);
      const payoutTotal = payoutsRes.documents.reduce((acc, curr) => acc + ((curr.totalAmount || 0) - (curr.commissionAmount || 0)), 0);

      setMetrics({
        revenueToday: revToday,
        ordersToday: ordersRes.total,
        activeVendors: approvedVendorsRes.total,
        liveBooks: liveBooksRes.total,
        pendingVendorsCount: pendingVendorsRes.total,
        openDisputesCount: disputesRes.total,
        pendingPayoutsTotal: payoutTotal
      });

      setLists({
        pendingVendors: pendingVendorsRes.documents,
        topVendors: topVendorsRes.documents,
        recentOrders: recentRes.documents
      });

      await fetchChartData(dateRange);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard intelligence.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChartData = async (range: string) => {
    setIsChartLoading(true);
    try {
      let startDateStr;
      const now = new Date();
      if (range === "7d") startDateStr = subDays(now, 7).toISOString();
      else if (range === "30d") startDateStr = subDays(now, 30).toISOString();
      else if (range === "3m") startDateStr = subMonths(now, 3).toISOString();
      else startDateStr = subYears(now, 1).toISOString();

      const chartOrders = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
        Query.greaterThanEqual("createdAt", startDateStr),
        Query.limit(500)
      ]);

      const grouped: Record<string, number> = {};
      chartOrders.documents.forEach(o => {
        const dateKey = format(new Date(o.createdAt), "MMM dd");
        grouped[dateKey] = (grouped[dateKey] || 0) + (o.commissionAmount || 0);
      });

      const formatted = Object.keys(grouped).map(date => ({
        date,
        revenue: grouped[date]
      })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setRevenueData(formatted);
    } catch(err) {
      console.error(err);
    } finally {
      setIsChartLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4 bg-red-50 rounded-[2.5rem] border border-red-100">
        <AlertCircle size={40} className="text-red-500" />
        <p className="font-bold text-red-900">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200"
        >
          Re-initialize Intelligence
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ecosystem Overview</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time health of the Rebook India economy</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="p-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-sm"
        >
          <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today Revenue", value: metrics.revenueToday, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50", isCurrency: true },
          { label: "Today Orders", value: metrics.ordersToday, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Vendors", value: metrics.activeVendors, icon: Store, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Live Inventory", value: metrics.liveBooks, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", kpi.bg)}>
               <kpi.icon size={24} className={kpi.color} />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{kpi.label}</p>
            <div className="text-2xl font-black text-gray-900 mt-1">
               {kpi.isCurrency && "₹"}<AnimatedNumber value={kpi.value} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                   <TrendingUp size={16} className="text-orange-500" />
                   Revenue performance
                </h3>
                <select 
                  value={dateRange}
                  onChange={(e) => { setDateRange(e.target.value); fetchChartData(e.target.value); }}
                  className="bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase rounded-lg px-3 py-1.5 outline-none tracking-widest"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="3m">3 Months</option>
                </select>
              </div>

              <div className="h-72 w-full">
                {isChartLoading ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Crunching Nodes...</span>
                   </div>
                ) : revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">No transactional data yet</div>
                )}
              </div>
           </div>

           {/* Tables Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">Execution Queue</h4>
                 <div className="space-y-4 flex-1">
                    {lists.recentOrders.map(order => (
                      <div key={order.$id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                         <div>
                            <p className="text-xs font-bold text-gray-900">₹{order.totalAmount}</p>
                            <p className="text-[10px] text-gray-500">{format(new Date(order.createdAt), "HH:mm")}</p>
                         </div>
                         <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                            order.orderStatus === "delivered" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                         )}>
                            {order.orderStatus}
                         </span>
                      </div>
                    ))}
                    {lists.recentOrders.length === 0 && <p className="text-center py-10 text-xs text-gray-400 italic">No recent flow</p>}
                 </div>
                 <Link href="/orders" className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-6 text-center hover:underline">Full stream</Link>
              </div>

              {/* Top Partners */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">Top Partners</h4>
                 <div className="space-y-4 flex-1">
                    {lists.topVendors.map((v, i) => (
                      <div key={v.$id} className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-400 text-xs">
                            #{i+1}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{v.shopName || v.ownerName}</p>
                            <p className="text-[10px] text-gray-500">Vol: ₹{(v.totalEarnings || 0).toLocaleString()}</p>
                         </div>
                      </div>
                    ))}
                    {lists.topVendors.length === 0 && <p className="text-center py-10 text-xs text-gray-400 italic">Calculating leaders...</p>}
                 </div>
              </div>
           </div>
        </div>

        {/* Action Column */}
        <div className="space-y-6">
           <div className="bg-gray-900 text-white rounded-[2rem] p-8 space-y-6 shadow-xl shadow-gray-200">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                 <ShieldCheck size={24} className="text-orange-400" />
              </div>
              <div>
                 <h3 className="text-lg font-bold">Admin Authority</h3>
                 <p className="text-xs text-gray-400 mt-2 leading-relaxed">System-wide control enabled. You have full access to override transactions and mediate disputes.</p>
              </div>
              <div className="pt-4 border-t border-white/10 space-y-3">
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-orange-400">
                    <span>Priority Actions</span>
                    <span>Count</span>
                 </div>
                 <button onClick={() => router.push("/vendors?tab=pending")} className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                    <span className="text-xs font-bold text-gray-200">Vendor Approvals</span>
                    <span className="px-2 py-0.5 bg-orange-500 rounded text-[10px] font-black">{metrics.pendingVendorsCount}</span>
                 </button>
                 <button onClick={() => router.push("/disputes")} className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                    <span className="text-xs font-bold text-gray-200">Open Disputes</span>
                    <span className="px-2 py-0.5 bg-red-500 rounded text-[10px] font-black">{metrics.openDisputesCount}</span>
                 </button>
                 <button onClick={() => router.push("/payments")} className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                    <span className="text-xs font-bold text-gray-200">Pending Payouts</span>
                    <span className="text-xs font-black text-gray-200">₹{metrics.pendingPayoutsTotal.toLocaleString()}</span>
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 gap-3">
                 {[
                    { label: "Inventory", href: "/books", icon: BookOpen },
                    { label: "Settings", href: "/settings", icon: Info },
                    { label: "Vendors", href: "/vendors", icon: Store },
                    { label: "Marketing", href: "/marketing", icon: Megaphone },
                 ].map(link => (
                    <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all gap-2 border border-transparent hover:border-gray-200">
                       <link.icon size={20} className="text-gray-400" />
                       <span className="text-[10px] font-bold text-gray-900">{link.label}</span>
                    </Link>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400 font-bold">Syncing Ledger...</div>}>
       <OverviewContent />
    </Suspense>
  )
}

