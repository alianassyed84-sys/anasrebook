"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const reviews = [
  { name: "Rahul Sharma", role: "IIT Student", text: "Saved nearly ₹4000 on my semesters books. The NCERTs were like brand new!", rating: 5 },
  { name: "Anjali Gupta", role: "NEET Aspirant", text: "Finally an organized place for old books. Delivery was super fast within Hyderabad.", rating: 5 },
  { name: "Priya Reddy", role: "University Student", text: "Selling my old books was so easy. Better than local kabadiwalas for sure!", rating: 4 },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-brand-primary tracking-tighter text-brand-primary">Student Speak</h2>
          <p className="text-gray-500 font-medium text-brand-primary">Join thousands of students across India who trust RebookIndia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div 
              key={review.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-background p-10 rounded-[2.5rem] relative group hover:bg-brand-light transition-colors duration-500"
            >
              <Quote className="absolute top-8 right-8 text-brand-secondary opacity-10" size={60} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className="text-brand-accent" fill="currentColor" />)}
              </div>

              <p className="text-lg font-medium text-brand-primary mb-8 leading-relaxed italic text-brand-primary">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-brand-primary text-brand-primary">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-brand-primary text-brand-primary">{review.name}</h4>
                  <p className="text-xs font-bold text-brand-secondary uppercase tracking-widest text-brand-primary">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
