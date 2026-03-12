"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, account } from "@/lib/appwrite";
import { ID } from "appwrite";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "upi", name: "UPI (PhonePe, GPay)", icon: Zap, label: "Recommended" },
  { id: "card", name: "Credit / Debit Card", icon: CreditCard },
  { id: "cod", name: "Cash on Delivery", icon: Truck },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookIdParam = searchParams.get("bookId");
  
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("upi");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(49);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    account.get().then(setUser).catch(() => router.push("/login"));

    if (bookIdParam) {
      databases.getDocument(DB_ID, COLLECTIONS.BOOKS, bookIdParam)
        .then(book => setCartItems([book]))
        .catch(() => toast.error("Book not found"));
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
    }
  }, [bookIdParam, router]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.sellingPrice || item.price), 0);
  const totalAmount = subtotal + deliveryCharge;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const handlePincodeBlur = async () => {
    if (pincode.length !== 6) return;
    
    try {
      // 1. Get user coords
      const userRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`);
      const userData = await userRes.json();
      if (!userData[0]) throw new Error("Invalid pincode");
      
      const userLat = parseFloat(userData[0].lat);
      const userLon = parseFloat(userData[0].lon);

      // 2. Get vendor pincode (using first book's vendor as sample)
      const firstBook = cartItems[0];
      if (!firstBook) return;
      
      const vendor = await databases.getDocument(DB_ID, COLLECTIONS.VENDORS, firstBook.vendorId);
      const vendorRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${vendor.pincode}&country=India&format=json`);
      const vendorData = await vendorRes.json();
      
      if (vendorData[0]) {
        const vLat = parseFloat(vendorData[0].lat);
        const vLon = parseFloat(vendorData[0].lon);
        const dist = calculateDistance(userLat, userLon, vLat, vLon);
        setDistance(Math.round(dist));
        
        // 3. Match delivery zone (Simplified logic)
        if (dist < 10) setDeliveryCharge(20);
        else if (dist < 50) setDeliveryCharge(40);
        else setDeliveryCharge(60);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not calculate delivery distance");
    }
  };

  const handlePayNow = async () => {
    if (!address || !city || !pincode || !phone || !name) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const orderPromises = cartItems.map(item => 
        databases.createDocument(DB_ID, COLLECTIONS.ORDERS, ID.unique(), {
          userId: user.$id,
          bookId: item.$id,
          bookTitle: item.title,
          bookPrice: item.sellingPrice,
          totalAmount: (item.sellingPrice + (deliveryCharge / cartItems.length)),
          orderStatus: "placed",
          paymentStatus: method === "cod" ? "pending" : "paid",
          paymentMethod: method,
          deliveryAddress: address,
          deliveryCity: city,
          deliveryPincode: pincode,
          customerName: name,
          customerPhone: phone,
          vendorId: item.vendorId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );

      const results = await Promise.all(orderPromises);
      localStorage.removeItem("cart");
      toast.success("Order placed successfully! 🎉");
      router.push("/order-success?orderId=" + results[0].$id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-background pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Checkout Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0" />
            <div className={cn("absolute top-1/2 left-0 h-0.5 bg-brand-primary transition-all duration-500 -z-0", step === 1 ? "w-0" : step === 2 ? "w-1/2" : "w-full")} />
            
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500",
                  step >= s ? "bg-brand-primary text-white scale-110 shadow-lg" : "bg-white text-gray-300 border-2 border-gray-100"
                )}>
                  {step > s ? <CheckCircle2 size={24} /> : s}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  step >= s ? "text-brand-primary" : "text-gray-300"
                )}>
                  {s === 1 ? "Delivery" : s === 2 ? "Payment" : "Review"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            
            {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-brand-primary flex items-center gap-3">
                      <MapPin size={24} className="text-brand-accent" />
                      Delivery Address
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Full Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Rahul Sharma" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-2 ring-brand-secondary/20 transition-all font-bold text-brand-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Phone Number</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} type="text" placeholder="+91 9988776655" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-2 ring-brand-secondary/20 transition-all font-bold text-brand-primary" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Street Address</label>
                      <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Plot 24, MIG 1, Phase 2, KPHB" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-2 ring-brand-secondary/20 transition-all font-bold text-brand-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Pincode</label>
                      <input value={pincode} onChange={e => setPincode(e.target.value)} onBlur={handlePincodeBlur} type="text" placeholder="500072" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-2 ring-brand-secondary/20 transition-all font-bold text-brand-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">City</label>
                      <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="Hyderabad" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-2 ring-brand-secondary/20 transition-all font-bold text-brand-primary" />
                    </div>
                  </div>

                  {distance !== null && (
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-xs font-bold">
                      Delivery: ₹{deliveryCharge} (Distance: {distance} km)
                    </div>
                  )}

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                  >
                    Continue to Payment
                    <ArrowRight size={20} />
                  </button>
                </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-brand-primary flex items-center gap-3">
                    <CreditCard size={24} className="text-brand-accent" />
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  {PAYMENT_METHODS.map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "w-full p-6 bg-brand-background rounded-[2rem] border-2 transition-all flex items-center justify-between group",
                        method === m.id ? "border-brand-primary bg-white shadow-xl" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                          method === m.id ? "bg-brand-primary" : "bg-gray-300"
                        )}>
                          <m.icon size={28} fill={m.id === "upi" ? "currentColor" : "none"} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-lg text-brand-primary">{m.name}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        method === m.id ? "border-brand-primary bg-brand-primary text-white" : "border-gray-200"
                      )}>
                        {method === m.id && <CheckCircle2 size={16} />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                   <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-brand-primary transition-all">Go Back</button>
                   <button 
                    onClick={() => setStep(3)}
                    className="w-full md:w-auto px-12 py-5 bg-brand-primary text-white rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                  >
                    Review Order
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-success/10 rounded-full mx-auto flex items-center justify-center text-brand-success">
                    <ShieldCheck size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-brand-primary">Review & Pay</h2>
                </div>

                <div className="bg-brand-background rounded-3xl p-8 space-y-4 border border-gray-50">
                   <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                     <span>Payment via</span>
                     <span className="text-brand-primary uppercase">{method}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                     <span>Delivery to</span>
                     <span className="text-brand-primary italic">{city}</span>
                   </div>
                   <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                     <span className="text-lg font-black text-brand-primary">Payable Amount</span>
                     <span className="text-2xl font-black text-brand-primary">₹{totalAmount}</span>
                   </div>
                </div>

                <button 
                  disabled={isLoading}
                  onClick={handlePayNow}
                  className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-2xl hover:bg-brand-secondary transition-all shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  <Lock size={24} />
                  {isLoading ? "Processing..." : "Secure Pay & Order"}
                </button>
              </motion.div>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24 space-y-6">
              <h3 className="font-bold text-lg text-brand-primary">Order Summary</h3>
              <div className="space-y-4">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">{item.title}</span>
                    <span className="font-black text-brand-primary">₹{item.sellingPrice || item.price}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-primary">
                  <span>Delivery</span>
                  <span>₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-brand-primary pt-2">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
