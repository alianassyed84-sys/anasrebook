"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useRouter, usePathname } from "next/navigation";
import { authActions } from "@rebookindia/appwrite/src/auth";
import { userActions } from "@rebookindia/appwrite/src/users";
import { Toaster } from "react-hot-toast";

export function VendorShell({ children }: { children: React.ReactNode }) {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = await authActions.getCurrentUser();
        if (!authUser) throw new Error("Not logged in");
        
        const profile = await userActions.getUserById(authUser.$id);
        if (profile.role !== "vendor") {
          throw new Error("Unauthorized");
        }
        
        if (pathname === "/login" || pathname === "/register") {
           setIsAuthChecking(false);
           router.push("/");
           return;
        }

        setIsAuthChecking(false);
      } catch (err) {
        if (pathname === "/login" || pathname === "/register") {
           setIsAuthChecking(false);
        } else {
           router.push("/login");
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

  if (pathname === "/login" || pathname === "/register") {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
