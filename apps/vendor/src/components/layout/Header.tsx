import React from "react";
import { 
  Search, 
  Bell, 
  Settings, 
  ExternalLink,
  ChevronDown,
  Circle
} from "lucide-react";

export const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="relative group w-96">
         <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-brand-primary transition-colors">
            <Search size={18} />
         </div>
         <input 
           type="text" 
           placeholder="Search orders, books, or settings..."
           className="w-full pl-12 pr-6 py-3 bg-brand-background rounded-xl border border-transparent focus:bg-white focus:border-gray-100 focus:ring-4 ring-brand-primary/5 outline-none font-medium text-sm transition-all"
         />
      </div>

      <div className="flex items-center gap-6">
         <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100 text-green-700">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Store Open</span>
         </div>
         
         <div className="h-6 w-px bg-gray-100" />

         <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-400 hover:bg-brand-background hover:text-brand-primary rounded-xl transition-all relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <a href="https://rebookindia.in" target="_blank" className="p-2.5 text-gray-400 hover:bg-brand-background hover:text-brand-primary rounded-xl transition-all">
               <ExternalLink size={20} />
            </a>

            <div className="h-6 w-px bg-gray-100" />

            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
               <div className="text-right hidden md:block">
                  <p className="text-xs font-black text-brand-primary leading-none mb-1">Ahmed Khan</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gold Vendor</p>
               </div>
               <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center font-black text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  AK
               </div>
               <ChevronDown size={14} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
            </div>
         </div>
      </div>
    </header>
  );
};
