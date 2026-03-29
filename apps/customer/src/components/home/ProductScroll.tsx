"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import BookCover from "@/components/BookCover";

interface Book {
  id: string;
  title: string;
  author: string;
  mrp: number;
  price: number;
  discount: number;
  condition: string;
  image: string;
  isbn?: string;
  coverUrl?: string;
}

interface ProductScrollProps {
  title: string;
  subtitle: string;
  books: Book[];
  viewAllHref: string;
}

function BookCard({ book }: { book: Book }) {
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const ri_cart = JSON.parse(localStorage.getItem("ri_cart") || "[]");
    const exists = ri_cart.find((item: any) => item.id === book.id);
    
    if (!exists) {
      ri_cart.push(book);
      localStorage.setItem("ri_cart", JSON.stringify(ri_cart));
      toast.success("📚 Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      toast.error("Already in cart!");
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/checkout?bookId=" + book.id);
  };

  return (
    <div 
      className="block group/card bg-white dark:bg-[#1a2744] rounded-3xl border border-gray-100 dark:border-[#2d3f6b] p-4 hover:shadow-2xl hover:border-brand-secondary/20 transition-all cursor-pointer" 
      onClick={() => router.push(`/book/${book.id}`)}
    >
      <motion.div 
        whileHover={{ y: -10, rotateY: 5 }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-brand-background dark:from-[#0a0f1e] to-gray-100 dark:to-[#1a2744] shadow-lg group-hover/card:shadow-2xl transition-all duration-500"
      >
        {(() => {
          const DUMMY_IMAGES = [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop"
          ];
          const charCode = book.title.charCodeAt(0) || 0;
          const dummySrc = DUMMY_IMAGES[charCode % DUMMY_IMAGES.length];
          return (
            <img
              src={dummySrc}
              alt={book.title}
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
            />
          );
        })()}

        {/* Discount Badge */}
        {book.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {book.discount}% OFF
          </div>
        )}

        {/* Overlay Buttons */}
        <div className="absolute inset-0 bg-brand-primary/0 group-hover/card:bg-brand-primary/20 transition-all flex flex-col items-center justify-center gap-2 translate-y-full group-hover/card:translate-y-0 duration-500">
          <button 
            onClick={handleAddToCart}
            className="bg-white text-brand-primary px-4 py-2 rounded-full flex items-center gap-2 shadow-xl hover:scale-110 transition-transform font-bold text-sm"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
          <button 
            onClick={handleBuyNow}
            className="bg-brand-secondary text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl hover:scale-110 transition-transform font-bold text-sm"
          >
            <Zap size={18} fill="currentColor" />
            Buy Now
          </button>
        </div>
      </motion.div>

      <div className="space-y-1">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
          </div>
          <span className="text-[10px] text-gray-400 font-bold">(4.8)</span>
        </div>
        <h4 className="font-bold text-brand-primary dark:text-gray-100 line-clamp-1 group-hover/card:text-brand-secondary transition-colors underline-offset-4">{book.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{book.author}</p>

        <div className="pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 dark:text-gray-500 line-through font-bold">₹{book.mrp}</span>
            <span className="text-xl font-black text-brand-primary dark:text-brand-secondary">₹{book.price}</span>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            book.condition.toLowerCase().includes("new") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
            book.condition.toLowerCase().includes("good") ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
            "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
          )}>
            {book.condition.replace("_", " ")}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductScroll = ({ title, subtitle, books, viewAllHref }: ProductScrollProps) => {
  const router = useRouter();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (books.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-[#0a0f1e] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">{title}</h2>
            <p className="text-gray-500 font-medium">{subtitle}</p>
          </div>
          <button 
            onClick={() => router.push(viewAllHref)}
            className="bg-brand-light/40 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-secondary px-6 py-3 rounded-full font-bold hover:bg-brand-primary hover:text-white transition-all flex items-center gap-2"
          >
            See More
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative group/main">
        {/* Navigation Buttons - Appear on hover */}
        <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-4 opacity-0 group-hover/main:opacity-100 transition-opacity pointer-events-none">
          <button 
            className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100 text-brand-primary hover:bg-brand-secondary hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto"
            onClick={() => {
              scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
            }}
          >
            <ArrowRight className="rotate-180" size={24} />
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-4 opacity-0 group-hover/main:opacity-100 transition-opacity pointer-events-none">
          <button 
            className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100 text-brand-primary hover:bg-brand-secondary hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto"
            onClick={() => {
              scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
            }}
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            "flex gap-6 overflow-x-auto pb-12 pt-4 px-[5%] list-none no-scrollbar snap-x snap-mandatory scroll-smooth transition-all",
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          )}
        >
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              className="min-w-[300px] md:min-w-[340px] snap-start"
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};
