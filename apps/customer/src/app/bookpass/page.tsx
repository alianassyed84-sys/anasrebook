import React from "react";

export default function BookPassPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-brand-background rounded-3xl p-12 text-center border-2 border-brand-accent/20">
        <h1 className="text-4xl font-black text-brand-primary mb-6">Join RebookPass</h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Get unlimited access, free shipping, and exclusive discounts on all your textbook rentals and purchases with a BookPass subscription.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-2">Free Delivery</h3>
            <p className="text-gray-500 text-sm">Valid on all orders above ₹99.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10">
            <h3 className="font-bold text-xl mb-2">Priority Support</h3>
            <p className="text-gray-500 text-sm">24/7 dedicated customer service.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20">
            <h3 className="font-bold text-xl mb-2 text-brand-accent">Extra 10% Off</h3>
            <p className="text-gray-500 text-sm">Applied automatically at checkout.</p>
          </div>
        </div>
        <button className="mt-12 bg-brand-accent text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20">
          Subscribe Now - ₹199/month
        </button>
      </div>
    </div>
  );
}
