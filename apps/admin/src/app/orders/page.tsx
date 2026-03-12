"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, Filter, Printer, ChevronRight, Eye, MoreVertical, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { orderActions } from "@rebookindia/appwrite/src/orders";
import type { Order, OrderStatus } from "@rebookindia/types";
import toast from "react-hot-toast";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  placed: { label: "Placed", class: "bg-blue-50 text-blue-700 border-blue-100" },
  packed: { label: "Packed", class: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  picked_up: { label: "Picked Up", class: "bg-purple-50 text-purple-700 border-purple-100" },
  in_transit: { label: "In Transit", class: "bg-orange-50 text-orange-700 border-orange-100" },
  delivered: { label: "Delivered", class: "bg-green-50 text-green-700 border-green-100" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-700 border-red-100" },
  returned: { label: "Returned", class: "bg-gray-50 text-gray-700 border-gray-100" },
};

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderActions.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    setProcessingId(id);
    const toastId = toast.loading(`Updating order to ${newStatus}...`);
    try {
      await orderActions.updateOrderStatus(id, newStatus);
      setOrders(p => p.map(o => o.orderId === id ? { ...o, orderStatus: newStatus } : o));
      toast.success("Order status updated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to update status.", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = orders
    .filter(o => filter === "all" || o.orderStatus === filter)
    .filter(o => 
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500">Track and manage platform sales</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <Printer size={16} /> Export Data
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search Order ID, Buyer, or Book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg overflow-x-auto no-scrollbar">
          {["all", "placed", "packed", "in_transit", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all capitalize whitespace-nowrap",
                filter === s 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Book Listing</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">#{order.orderId}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{format(new Date(order.createdAt), "MMM d, hh:mm a")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{order.buyerName}</span>
                        <span className="text-xs text-gray-500">{order.deliveryCity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center border border-gray-100">
                           <Package size={14} className="text-gray-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[200px]">{order.bookTitle}</span>
                          <span className="text-[10px] text-gray-500 truncate">qty: {order.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-black text-gray-900">₹{order.totalAmount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider",
                        STATUS_CONFIG[order.orderStatus || "placed"]?.class
                      )}>
                        {order.orderStatus || "placed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link href={`/orders/${order.orderId}`} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" title="View Details">
                            <Eye size={16} />
                         </Link>
                         <div className="relative group/menu">
                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                               <MoreVertical size={16} />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10 invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all">
                               {["placed", "packed", "in_transit", "delivered", "cancelled"].map(st => (
                                 <button
                                   key={st}
                                   disabled={order.orderStatus === st || processingId === order.orderId}
                                   onClick={() => updateStatus(order.orderId, st as OrderStatus)}
                                   className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                                 >
                                    Mark as {st.replace("_", " ")}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Loading Orders Portal...</div>}>
       <OrdersContent />
    </Suspense>
  )
}

