import React from "react";

export default function FAQPage() {
  const faqs = [
    {
      q: "Are the second-hand books in good condition?",
      a: "Yes, we have a strict quality check process. We grade our books from 'Acceptable' to 'Like New' so you know exactly what you're getting."
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 3-7 business days across India. We also offer expedited shipping for select locations."
    },
    {
      q: "What is BookPass?",
      a: "BookPass is our premium subscription that gives you free shipping, priority support, and extra discounts on all purchases."
    },
    {
      q: "Can I sell my old books here?",
      a: "Yes! Click on 'Become a Vendor' to register as a seller and start listing your books."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Help Center & FAQs</h1>
      
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-2 text-brand-primary">{faq.q}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
        
        <div className="mt-12 text-center p-8 bg-brand-background rounded-xl">
          <p className="text-gray-700 font-medium mb-4">Still have questions?</p>
          <a href="/contact" className="inline-block bg-brand-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-primary/90">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
