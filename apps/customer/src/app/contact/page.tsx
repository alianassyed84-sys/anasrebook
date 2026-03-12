import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"></textarea>
            </div>
            <button className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-primary/90 transition-all">
              Send Message
            </button>
          </form>
        </div>
        
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-background rounded-full flex items-center justify-center text-brand-primary shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Address</h3>
              <p className="text-gray-600">RebookIndia HQ, Hyderabad, Telangana, India</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-background rounded-full flex items-center justify-center text-brand-primary shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Phone</h3>
              <p className="text-gray-600">+91 90000 00000</p>
              <p className="text-sm text-gray-500">Mon-Fri, 9am - 6pm</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-background rounded-full flex items-center justify-center text-brand-primary shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Email</h3>
              <p className="text-gray-600">support@rebookindia.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
