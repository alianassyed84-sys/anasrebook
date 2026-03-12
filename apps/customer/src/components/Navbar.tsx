"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShoppingCart, User, Menu, X, BookOpen, 
  LogOut, ShieldCheck, Store, ChevronDown, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authActions } from "@rebookindia/appwrite/src/auth";
import { userActions } from "@rebookindia/appwrite/src/users";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Categories", href: "/categories" },
  { name: "Sell Books", href: "/sell" },
  { name: "BookPass", href: "/bookpass", highlight: true },
];

type UserRole = "customer" | "vendor" | "admin" | "superAdmin" | null;

interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const appUser = await authActions.getCurrentUser();
        if (!appUser) { setAuthLoaded(true); return; }
        const profile = await userActions.getUserById(appUser.$id);
        setAuthUser({
          name: profile.name || appUser.name,
          email: profile.email || appUser.email,
          role: (profile.role as UserRole) || "customer",
        });
      } catch {
        setAuthUser(null);
      } finally {
        setAuthLoaded(true);
      }
    };
    loadUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = async () => {
    await authActions.signOut();
    setAuthUser(null);
    setProfileOpen(false);
    router.push("/");
  };

  const isAdmin = authUser?.role === "admin" || authUser?.role === "superAdmin";
  const isVendor = authUser?.role === "vendor";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/90 backdrop-blur-md py-3 shadow-sm border-gray-100"
          : "bg-white py-5 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-300">
              <BookOpen size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-brand-primary leading-none">REBOOK</span>
              <span className="text-xs font-semibold text-brand-accent tracking-widest uppercase">INDIA</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative group">
            <input
              type="text"
              placeholder="Search books by title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-background border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none"
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
            </button>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-secondary relative group",
                  pathname === link.href ? "text-brand-primary" : "text-gray-600",
                  link.highlight && "text-brand-accent font-bold"
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Cart */}
            <Link href="/cart" className="p-2 hover:bg-brand-background rounded-full transition-colors relative group">
              <ShoppingCart size={22} className="text-gray-600 group-hover:text-brand-primary transition-colors" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-accent text-[10px] font-bold text-white rounded-full flex items-center justify-center">0</span>
            </Link>

            {/* Admin Panel Button — only for admin/superAdmin */}
            {authLoaded && isAdmin && (
              <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:4002"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
              >
                <ShieldCheck size={15} />
                Admin Panel
              </a>
            )}

            {/* Vendor Panel Button — only for vendors */}
            {authLoaded && isVendor && (
              <a
                  href={process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:4001"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-brand-success text-white px-4 py-2 rounded-xl text-xs font-black hover:opacity-90 transition-all shadow-lg"
              >
                <Store size={15} />
                Vendor Panel
              </a>
            )}

            {/* Profile Dropdown OR Login */}
            {!authLoaded ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            ) : authUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-brand-background px-3 py-2 rounded-2xl hover:bg-gray-100 transition-all"
                >
                  <div className="w-7 h-7 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-black">
                    {authUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-bold text-brand-primary max-w-[100px] truncate">
                    {authUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={cn("text-gray-400 transition-transform", profileOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="p-5 border-b border-gray-50 space-y-1">
                        <p className="font-black text-brand-primary">{authUser.name}</p>
                        <p className="text-xs text-gray-400 font-medium truncate">{authUser.email}</p>
                        <span className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-1",
                          isAdmin ? "bg-brand-primary/10 text-brand-primary" :
                          isVendor ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          {authUser.role}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3 space-y-1">
                        <Link
                          href="/account"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-brand-background transition-all text-sm font-bold text-brand-primary"
                        >
                          <User size={16} /> My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-brand-background transition-all text-sm font-bold text-brand-primary"
                        >
                          <Package size={16} /> My Orders
                        </Link>

                        {/* Admin Panel Link — in dropdown */}
                        {isAdmin && (
                          <a
                            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:4002"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-brand-primary/5 transition-all text-sm font-black text-brand-primary"
                          >
                            <ShieldCheck size={16} className="text-brand-primary" />
                            Go to Admin Panel ↗
                          </a>
                        )}

                        {/* Vendor Panel Link — in dropdown */}
                        {isVendor && (
                          <a
                            href={process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:4001"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-green-50 transition-all text-sm font-black text-green-700"
                          >
                            <Store size={16} className="text-green-600" />
                            Go to Vendor Panel ↗
                          </a>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 transition-all text-sm font-bold text-red-500 mt-1"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-brand-secondary transition-all hover:shadow-lg hover:shadow-brand-secondary/20"
              >
                <User size={18} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 hover:bg-brand-background rounded-full lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b shadow-xl lg:hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium py-3 border-b border-gray-50",
                    pathname === link.href ? "text-brand-primary" : "text-gray-600",
                    link.highlight && "text-brand-accent"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Admin/Vendor Panel */}
              {isAdmin && (
                <a href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:4002"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 text-brand-primary font-black border-b border-gray-50">
                  <ShieldCheck size={18} /> Admin Panel ↗
                </a>
              )}
              {isVendor && (
                <a href={process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:4001"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 text-green-700 font-black border-b border-gray-50">
                  <Store size={18} /> Vendor Panel ↗
                </a>
              )}

              {authUser ? (
                <button onClick={handleLogout} className="flex items-center gap-3 py-3 text-red-500 font-bold text-lg">
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-3 text-brand-primary font-bold text-lg">
                  <User size={18} /> Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

