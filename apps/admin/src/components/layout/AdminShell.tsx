"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./Sidebar";
import { Bell, Search, ExternalLink, CheckCircle } from "lucide-react";
import { databases, Query, ID } from "@rebookindia/appwrite/src/client";
import { APPWRITE_DB_ID, COLLECTIONS } from "@rebookindia/appwrite/src/config";
import { useRouter, usePathname } from "next/navigation";
import { authActions } from "@rebookindia/appwrite/src/auth";
import { userActions } from "@rebookindia/appwrite/src/users";
import { Toaster } from "react-hot-toast";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const router = useRouter();
  const pathname = usePathname();

  const fetchNotifications = async () => {
    try {
      const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.NOTIFICATIONS, [
        Query.equal("recipientType", "admin"),
        Query.orderDesc("$createdAt"),
        Query.limit(10)
      ]);
      setNotifications(res.documents);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = await authActions.getCurrentUser();
        if (!authUser) throw new Error("Not logged in");
        
        const profile = await userActions.getUserById(authUser.$id);
        if (profile.role !== "admin" && profile.role !== "superAdmin") {
          throw new Error("Unauthorized");
        }
        
        if (pathname === "/login") {
           setIsAuthChecking(false);
           router.push("/");
           return;
        }

        setIsAuthChecking(false);
        fetchNotifications();
      } catch (err) {
        if (pathname === "/login") {
           setIsAuthChecking(false); // Let them see the login page
        } else {
           router.push("/login"); // Admin app login page
        }
      }
    };
    checkAuth();
  }, [pathname, router]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === "/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  const markAsRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return;
    try {
      await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.NOTIFICATIONS, id, { isRead: true });
      setNotifications(prev => prev.map(n => (n.$id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const unreadList = notifications.filter(n => !n.isRead);
      for (const n of unreadList) {
        await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.NOTIFICATIONS, n.$id, { isRead: true });
      }
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setShowDropdown(false);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="relative group w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Search orders, vendors, books..."
              className="w-full pl-12 pr-6 py-2 bg-brand-background rounded-lg border border-transparent focus:bg-white focus:border-gray-100 focus:ring-2 ring-brand-primary/10 outline-none font-medium text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2.5 text-gray-400 hover:bg-brand-background hover:text-brand-primary rounded-xl transition-all"
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                   <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                     <h3 className="font-bold text-brand-primary">Notifications</h3>
                     <button onClick={markAllRead} className="text-xs font-bold text-brand-secondary hover:underline">Mark all read</button>
                   </div>
                   <div className="max-h-96 overflow-y-auto">
                     {notifications.length === 0 ? (
                       <p className="p-6 text-center text-sm text-gray-400">No new notifications</p>
                     ) : (
                       notifications.map(n => (
                         <div 
                           key={n.$id} 
                           onClick={() => markAsRead(n.$id, n.isRead)}
                           className={`p-4 border-b border-gray-50 flex items-start gap-3 cursor-pointer transition-colors ${n.isRead ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                         >
                           <div className="mt-0.5">
                              {n.type === 'order' ? <CheckCircle size={16} className="text-green-500" /> : <Bell size={16} className="text-brand-primary" />}
                           </div>
                           <div className="space-y-1">
                             <p className={`text-sm ${n.isRead ? 'text-gray-600' : 'text-brand-primary font-bold'}`}>{n.title}</p>
                             <p className="text-xs text-gray-400">{formatTimeAgo(n.$createdAt)}</p>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              )}
            </div>
            
            <a href="http://localhost:4000" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-brand-background hover:text-brand-primary rounded-xl transition-all font-bold text-xs">
              <ExternalLink size={18} />
              Visit Store
            </a>
            <div className="h-6 w-px bg-gray-100" />
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-black text-white text-sm">
              SA
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
