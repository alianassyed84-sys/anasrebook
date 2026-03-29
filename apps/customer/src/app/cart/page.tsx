"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Trash2, 
  ArrowRight, 
  Zap, 
  ShoppingBag,
  ShieldCheck,
  Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, getStorageUrl, BUCKETS } from "@rebookindia/firebase";
import toast from "react-hot-toast";
import BookCover from "@/components/BookCover";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch fresh data for each book in cart to get updated prices/status
      const freshItems = await Promise.all(
        cart.map(async (item: any) => {
          try {
            const book = await databases.getDocument(DB_ID, COLLECTIONS.BOOKS, item.$id || item.id);
            return { ...book, quantity: item.quantity || 1 };
          } catch (err) {
            console.error(`Book ${item.id} not found`, err);
            return null;
          }
        })
      );
      
      const validItems = freshItems.filter(item => item !== null);
      setItems(validItems);
      // Update localStorage with fresh data
      localStorage.setItem("cart", JSON.stringify(validItems));
    } catch (err) {
      console.error("Cart fetch failed", err);
      setItems(cart); // Fallback to local data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const subtotal = items.reduce((acc, item) => acc + (item.sellingPrice || item.price) * (item.quantity || 1), 0);
  const savings = items.reduce((acc, item) => acc + ((item.mrp || 0) - (item.sellingPrice || item.price)) * (item.quantity || 1), 0);
  const delivery = subtotal > 500 ? 0 : 49;
  const total = subtotal + delivery;

  const removeItem = (id: string) => {
    const updated = items.filter(item => (item.$id || item.id) !== id);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-4 space-y-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
          <ShoppingBag size={48} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-brand-primary">Your cart is empty</h2>
          <p className="text-gray-500 font-medium tracking-tight italic">Knowledge is waiting to be shared. Fill 'er up!</p>
        </div>
        <Link href="/books" className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl">
          Start Shopping
        </Link>
      </main>
    );
  }

  const getImageUrl = (fileId: string) => {
    return getStorageUrl(BUCKETS.BOOK_IMAGES, fileId);
  };

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-black text-brand-primary mb-12 flex items-center gap-4">
          Shopping Cart 
          <span className="text-sm font-bold bg-white px-3 py-1 rounded-full border border-gray-100 text-gray-400">
            {items.length} items
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {items.map((item) => {
                const coverUrl = item.imageIds?.[0] ? getImageUrl(item.imageIds[0]) : (item.image || item.coverUrl);
                return (
                  <motion.div 
                    key={item.$id || item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="bg-white rounded-[2.5rem] p-6 border border-gray-100 flex flex-col md:flex-row gap-8 relative group"
                  >
                    <div className="w-full md:w-32 aspect-[3/4] bg-brand-background rounded-2xl overflow-hidden shrink-0">
                      {(() => {
                        const DUMMY_IMAGES = [
                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop"
                        ];
                        const charCode = item.title?.charCodeAt(0) || 0;
                        const dummySrc = DUMMY_IMAGES[charCode % DUMMY_IMAGES.length];
                        return (
                          <img
                            src={dummySrc}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <Link href={`/book/${item.$id || item.id}`}>
                            <h3 className="text-xl font-bold text-brand-primary hover:text-brand-secondary transition-colors underline-offset-4 line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>
                          <button 
                            onClick={() => removeItem(item.$id || item.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500">by <span className="text-brand-primary font-bold">{item.author}</span></p>
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest capitalize">
                          {item.condition?.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-gray-50 mt-4">
                        <div className="text-right flex-1 flex items-end justify-between md:justify-end gap-4">
                           <div className="text-left md:text-right">
                             <p className="text-xs text-gray-400 line-through font-bold">₹{item.mrp}</p>
                             <p className="text-2xl font-black text-brand-primary tracking-tighter">₹{item.sellingPrice || item.price}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* BookPass Promo */}
            <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl -z-0" />
              <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-primary shrink-0 rotate-12 group-hover:rotate-0 transition-transform shadow-xl">
                <Zap size={32} fill="currentColor" />
              </div>
              <div className="flex-1 space-y-1 relative z-10 text-center md:text-left">
                <h4 className="text-xl font-black tracking-tight italic">Join BookPass Membership</h4>
                <p className="text-brand-light text-sm font-medium">Unlock <span className="text-white font-bold">Free Delivery</span> on all current & future orders for just ₹149/mo.</p>
              </div>
              <button className="bg-white text-brand-primary px-8 py-3 rounded-xl font-black text-sm hover:bg-brand-accent hover:text-brand-primary transition-all shadow-lg whitespace-nowrap">
                Get BookPass
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm sticky top-24 space-y-8">
              <h3 className="text-xl font-black text-brand-primary flex items-center gap-2">
                Order Summary
                <ShieldCheck size={18} className="text-brand-success" />
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-brand-primary">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Delivery Charges</span>
                  <span className={cn(delivery === 0 ? "text-brand-success" : "text-brand-primary")}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-[10px] font-bold text-gray-400 italic">Add ₹{Math.max(0, 500 - subtotal)} more for FREE delivery</p>
                )}
                {savings > 0 && (
                  <div className="flex justify-between text-sm font-bold text-brand-success bg-green-50 px-4 py-3 rounded-xl">
                    <span>Total Savings</span>
                    <span>₹{savings}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Amount</span>
                    <span className="text-4xl font-black text-brand-primary tracking-tighter">₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>
                
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <Truck size={16} className="text-gray-400" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck size={16} className="text-gray-400" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Secure Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
