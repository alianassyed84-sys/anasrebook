"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useRouter, usePathname } from "next/navigation";
import { authActions } from "@rebookindia/firebase/src/auth";
import { userActions } from "@rebookindia/firebase/src/users";
import { Toaster } from "react-hot-toast";

export function VendorShell({ children }: { children: React.ReactNode }) {
  const [isAuthChecking, setIsAuthChecking] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkAuth = async () => {
      setIsAuthChecking(true);
      const user = await authActions.getCurrentUser();
      if (user) {
        if (pathname === "/login" || pathname === "/register") {
           router.push("/");
        }
      } else {
        if (pathname !== "/login" && pathname !== "/register") {
           router.push("/login");
        }
      }
      setIsAuthChecking(false);
    };
    checkAuth();
  }, [pathname, router]);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

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
