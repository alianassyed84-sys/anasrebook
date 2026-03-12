import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
        <div className="prose prose-brand max-w-none text-gray-700 space-y-4">
          <p>
            At RebookIndia, we are committed to delivering your books quickly and safely. 
            We ship to almost all pincodes across India through our trusted delivery partners like Shiprocket.
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Processing Time</h3>
          <p>
            All orders are processed within 24-48 hours. Orders are not shipped or delivered on Sundays or public holidays.
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Shipping Rates & Delivery Estimates</h3>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Standard Shipping:</strong> 3-7 business days (₹50 flat rate, free for BookPass members).</li>
            <li><strong>Expedited Shipping:</strong> 1-3 business days (Available in select metro cities).</li>
          </ul>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Order Tracking</h3>
          <p>
            You will receive a shipment confirmation email containing your tracking number(s) once your order has shipped. 
            The tracking number will be active within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
