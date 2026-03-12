import React from "react";
import Link from "next/link";
import { BookOpen, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary">
                <BookOpen size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none text-white">REBOOK</span>
                <span className="text-xs font-semibold text-brand-accent tracking-widest uppercase">INDIA</span>
              </div>
            </Link>
            <p className="text-brand-light text-sm leading-relaxed max-w-xs">
              India's first organized second-hand book marketplace for students. Join the book reuse revolution and save environment & money.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-secondary transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-secondary transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-secondary transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul className="space-y-4 text-brand-light text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Browse Books</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Become a Vendor</Link></li>
              <li><Link href="/bookpass" className="hover:text-white transition-colors text-brand-accent font-semibold">Join BookPass</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/admin-portal" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] pt-4 block">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Customer Care</h4>
            <ul className="space-y-4 text-brand-light text-sm">
              <li><Link href="/faq" className="hover:text-white transition-colors">Help Center / FAQs</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns-refunds" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Contact Info</h4>
            <ul className="space-y-4 text-brand-light text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="text-brand-accent shrink-0" />
                <span>Hyderabad, Telangana, India</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-brand-accent shrink-0" />
                <span>+91 90000 00000</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-brand-accent shrink-0" />
                <span>support@rebookindia.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Partners & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 grayscale opacity-50">
            <span className="text-[10px] uppercase tracking-widest font-bold">Trusted Partners:</span>
            <div className="h-6 w-20 bg-white/20 rounded-md flex items-center justify-center text-[10px] font-bold italic">RAZORPAY</div>
            <div className="h-6 w-20 bg-white/20 rounded-md flex items-center justify-center text-[10px] font-bold italic">SHIPROCKET</div>
          </div>
          <p className="text-brand-light text-xs">
            © {new Date().getFullYear()} RebookIndia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
