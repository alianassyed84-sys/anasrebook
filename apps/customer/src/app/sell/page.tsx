import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BecomeVendorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Become a Vendor on RebookIndia</h1>
        <p className="text-xl text-gray-600 mb-8">
          Join India's fastest-growing second-hand book marketplace. Add your inventory,
          manage your orders, and grow your business with our dedicated vendor portal.
        </p>
        <a 
          href="http://localhost:4001" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
        >
          Go to Vendor Portal <ArrowRight size={20} />
        </a>
      </div>
    </div>
  );
}
