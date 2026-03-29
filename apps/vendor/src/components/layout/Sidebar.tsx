import React from "react";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  IndianRupee, 
  Settings, 
  LogOut,
  ChevronRight,
  Store
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Inventory", icon: Package, href: "/inventory" },
  { label: "Add New Book", icon: PlusCircle, href: "/inventory/add" },
  { label: "Orders", icon: ShoppingBag, href: "/orders", badge: "2" },
  { label: "Earnings", icon: IndianRupee, href: "/earnings" },
  { label: "Store Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
  // We'll use a hardcoded pathname for now since it's a client component requirement
  const pathname = usePathname(); 

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <Store size={24} />
          </div>
          <div className="leading-none">
            <span className="text-xl font-black text-brand-primary tracking-tighter block">VENDOR</span>
            <span className="text-[10px] font-black text-brand-secondary tracking-widest uppercase">Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <Link 
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
              pathname === item.href 
                ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20" 
                : "text-gray-500 hover:bg-brand-background hover:text-brand-primary"
            )}
          >
            <div className="flex items-center gap-4">
               <item.icon size={20} className={cn(pathname === item.href ? "text-brand-accent" : "group-hover:text-brand-primary")} />
               <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-brand-accent text-brand-primary text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4">
         <div className="bg-brand-background rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-brand-primary">
                  P
               </div>
               <div>
                  <p className="text-sm font-bold text-brand-primary">PaperShop</p>
                  <p className="text-[10px] font-bold text-brand-success uppercase tracking-widest">Active</p>
               </div>
            </div>
         </div>
      </div>
    </aside>
  );
};
