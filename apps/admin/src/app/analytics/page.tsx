"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { TrendingUp, IndianRupee, Users, BookOpen, ArrowUpRight, Target, TreePine, BarChart3, PieChart as PieChartIcon, Search, Download, Calendar } from "lucide-react";
import { orderActions } from "@rebookindia/firebase/src/orders";
import { userActions } from "@rebookindia/firebase/src/users";
import { bookActions } from "@rebookindia/firebase/src/books";
import type { Order, User, Book } from "@rebookindia/types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

function AnalyticsContent() {
  const [data, setData] = useState<{
    orders: Order[];
    users: User[];
    books: Book[];
  }>({ orders: [], users: [], books: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [allOrders, allUsers, allBooks] = await Promise.all([
        orderActions.getAllOrders(),
        userActions.getAllUsers(),
        bookActions.getAllBooks(),
      ]);
      setData({ orders: allOrders, users: allUsers, books: allBooks });
    } catch (error) {
      toast.error("Failed to load metrics.");
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalGMV = data.orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalBooksSold = data.orders.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  
  // Monthly Trends (Last 6 months)
  const monthlyTrends = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const label = format(date, "MMM");
    const monthOrders = data.orders.filter(o => {
       const oDate = new Date(o.createdAt);
       return isWithinInterval(oDate, {
          start: startOfMonth(date),
          end: endOfMonth(date)
       });
    });
    return {
      name: label,
      gmv: monthOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
      count: monthOrders.length
    };
  });

  // Category Distribution
  const categoryData = Object.entries(
    data.books.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.toUpperCase(), value }));

  // City Distribution
  const cityDistribution = Object.entries(
      data.orders.reduce((acc, o) => {
          acc[o.deliveryCity] = (acc[o.deliveryCity] || 0) + 1;
          return acc;
      }, {} as Record<string, number>)
  )
  .sort((a,b) => b[1] - a[1])
  .slice(0, 5)
  .map(([city, count]) => ({ city, count }));

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aggregating Life-time Data...</p>
     </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Insights</h1>
          <p className="text-sm text-gray-500">Real-time performance and ecosystem impact</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
             <Calendar size={16} /> Last 6 Months
           </button>
           <button className="bg-orange-500 text-white p-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
             <Download size={18} />
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₹${totalGMV.toLocaleString()}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active Users", value: data.users.length.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Circular Reuse", value: `${totalBooksSold} Books`, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Impact Score", value: (totalBooksSold * 0.2).toFixed(1), icon: TreePine, color: "text-emerald-600", bg: "bg-emerald-50", suffix: " Trees Saved" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm", kpi.bg)}>
               <kpi.icon size={24} className={kpi.color} />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{kpi.label}</p>
            <div className="flex items-baseline gap-1 mt-1">
               <span className="text-2xl font-black text-gray-900">{kpi.value}</span>
               {kpi.suffix && <span className="text-[10px] font-bold text-gray-500">{kpi.suffix}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                 <TrendingUp size={16} className="text-orange-500" />
                 Growth Trend (GMV)
              </h3>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    cursor={{ stroke: "#f97316", strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gmv" 
                    stroke="#f97316" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorGmv)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <PieChartIcon size={16} className="text-purple-500" />
              Category Mix
           </h3>
           <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-xl font-black text-gray-900">{data.books.length}</span>
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Total SKU</span>
              </div>
           </div>
           <div className="space-y-2">
              {categoryData.slice(0, 3).map((c, i) => (
                <div key={c.name} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-[10px] font-bold text-gray-600">{c.name}</span>
                   </div>
                   <span className="text-[10px] font-black text-gray-900">{c.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
               <Target size={16} className="text-blue-500" />
               Regional Performance
            </h3>
            <div className="space-y-4">
               {cityDistribution.map((city, i) => (
                 <div key={city.city} className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 w-24 truncate">{city.city}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(city.count / data.orders.length) * 100}%` }}
                          className="h-full bg-blue-500 rounded-full"
                          transition={{ delay: 0.5 + (i * 0.1) }}
                       />
                    </div>
                    <span className="text-[10px] font-black text-gray-900">{city.count}</span>
                 </div>
               ))}
               {cityDistribution.length === 0 && <p className="text-center text-xs text-gray-400 py-10">No geographical data yet.</p>}
            </div>
         </div>

         <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
               <BarChart3 size={32} className="text-orange-500" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900">Custom Reports</h3>
               <p className="text-xs text-gray-500 max-w-[240px] mx-auto mt-2">Generate deep-dive reports for tax audits, vendor performance, or logistics analysis.</p>
            </div>
            <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
               Build Report
            </button>
         </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Waking up Data Engines...</div>}>
       <AnalyticsContent />
    </Suspense>
  )
}

