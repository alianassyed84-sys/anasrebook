"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Store, ArrowRight, CheckCircle2, 
  MapPin, Phone, Mail, ShieldCheck, Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authActions, userActions, databases, ID, DB_ID, COLLECTIONS } from "@rebookindia/firebase";
import toast, { Toaster } from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";

const STEPS = ["Store Details", "KYC Documents", "Bank Account", "Review & Submit"];
const PLANS = [
  { id: "silver", name: "Silver", price: "Free", commission: "18%", features: ["Up to 30 books", "Standard Support", "Weekly Payouts"] },
  { id: "gold", name: "Gold", price: "₹499/mo", commission: "15%", features: ["Unlimited books", "Priority Support", "Daily Payouts", "Analytics Dashboard"] },
];

export default function VendorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form Data
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankIFSC, setBankIFSC] = useState("");

  // Cloudinary photo states
  const [shopPhotoUrl, setShopPhotoUrl] = useState("");
  const [shopPhotoPublicId, setShopPhotoPublicId] = useState("");
  const [kycUrl, setKycUrl] = useState("");
  const [kycPublicId, setKycPublicId] = useState("");

  const [plan, setPlan] = useState("gold");

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!email || !password || !shopName || !ownerName || !phone) {
       toast.error("Please fill in all core fields!");
       return;
    }
    setLoading(true);
    try {
       // 1. Create Firebase Account (User)
       const user = await authActions.signUpWithEmail(email, password, ownerName, phone);
       // 2. Create User Profile with role 'vendor'
       await userActions.createUser({
         userId: user.$id,
         name: ownerName,
         email,
         phone,
         role: "vendor",
         city,
         pincode
       });
       // 3. Create Vendor Document
       await databases.createDocument(DB_ID, COLLECTIONS.VENDORS, ID.unique(), {
         userId: user.$id,
         vendorId: ID.unique(),
         shopName,
         ownerName,
         phone,
         email,
         address,
         city,
         state: "",
         pincode,
         latitude: 0,
         longitude: 0,
         shopPhotoUrl,
         shopPhotoPublicId,
         kycDocUrl: kycUrl,
         kycDocPublicId: kycPublicId,
         bankAccountNo,
         bankIFSC,
         bankName,
         status: "pending",
         subscriptionPlan: plan,
         createdAt: new Date().toISOString()
       });
       // 4. Login
       await authActions.signInWithEmail(email, password);
       toast.success("Application Submitted successfully!");
       // Navigate to step 3 to show success UI then maybe clear?
       next();
    } catch (error: any) {
       toast.error(error.message || "Failed to submit application.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 py-16 relative">
      <Toaster position="top-right" />
      <div className="w-full max-w-3xl space-y-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-brand-primary rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-brand-primary/20">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-brand-primary tracking-tighter">Become a Vendor</h1>
          <p className="text-gray-500 font-medium">Join 48+ bookshops earning on RebookIndia. Setup takes 5 minutes.</p>
        </div>

        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2 relative z-10 w-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all",
                  i < step ? "bg-brand-success text-white" :
                  i === step ? "bg-brand-primary text-white ring-4 ring-brand-primary/20" :
                  "bg-white text-gray-400 border-2 border-gray-200"
                )}>
                  {i < step ? <CheckCircle2 size={18} /> : i + 1}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-1 mx-[-10px] relative z-0", i < step ? "bg-brand-success" : "bg-gray-200")} />
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8"
        >
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-brand-primary">Tell us about your store</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Store / Shop Name *</label>
                  <input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. PaperShop Books" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Owner Name *</label>
                  <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Ahmed Khan" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9988776655" className="w-full pl-12 pr-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vendor@example.com" className="w-full pl-12 pr-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Store Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-5 text-gray-400" size={16} />
                    <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="15, Book Lane, Abids, Hyderabad 500001" className="w-full pl-12 pr-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary resize-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">City *</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Hyderabad" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pincode *</label>
                  <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="500001" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-brand-primary">KYC Verification</h2>
              <p className="text-gray-500 font-medium">Required for verification. Your documents are stored securely on Cloudinary.</p>
              <div className="space-y-6">
                <ImageUploader
                  label="Shop Photo"
                  folder="rebookindia/vendors/shops"
                  aspectRatio="wide"
                  currentUrl={shopPhotoUrl}
                  onUpload={(url, id) => { setShopPhotoUrl(url); setShopPhotoPublicId(id); }}
                  onRemove={() => { setShopPhotoUrl(""); setShopPhotoPublicId(""); }}
                />
                <ImageUploader
                  label="Aadhaar / Owner ID (for verification)"
                  folder="rebookindia/vendors/kyc"
                  aspectRatio="wide"
                  currentUrl={kycUrl}
                  onUpload={(url, id) => { setKycUrl(url); setKycPublicId(id); }}
                  onRemove={() => { setKycUrl(""); setKycPublicId(""); }}
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-brand-light/30 rounded-2xl border border-brand-secondary/10 text-sm font-bold text-brand-primary">
                <ShieldCheck size={20} className="text-brand-success shrink-0" />
                Documents are reviewed within 24 hours. We'll notify you by email.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-brand-primary">Choose Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlan(p.id)}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-left transition-all space-y-4",
                        plan === p.id ? "border-brand-primary bg-brand-light/20 shadow-lg" : "border-gray-100 bg-brand-background hover:border-gray-200"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-black text-brand-primary text-xl">{p.name}</span>
                        <span className={cn("text-[10px] font-black uppercase px-3 py-1 rounded-full", p.id === "gold" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600")}>{p.id}</span>
                      </div>
                      <p className="text-3xl font-black text-brand-primary">{p.price}</p>
                      <p className="text-xs font-bold text-gray-500">{p.commission} commission per sale</p>
                      <ul className="space-y-2">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                            <CheckCircle2 size={14} className="text-brand-success" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-brand-primary">Bank Account for Payouts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Bank Name</label>
                     <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="HDFC Bank" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account Number</label>
                     <input value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} placeholder="50100XXXXXXXXXX" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">IFSC Code</label>
                     <input value={bankIFSC} onChange={(e) => setBankIFSC(e.target.value)} placeholder="HDFC0001234" className="w-full px-6 py-4 bg-brand-background rounded-2xl outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center">
              <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} className="text-brand-success" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-brand-primary tracking-tighter">Application Ready!</h2>
                <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                  Your vendor application is complete. Our team will review and approve you within 24 hours.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {[
                  { label: "Store", val: shopName || "Pending" },
                  { label: "Plan", val: plan === "gold" ? "Gold Vendor" : "Silver Vendor" },
                  { label: "KYC", val: "Ready" },
                ].map((s) => (
                  <div key={s.label} className="p-5 bg-brand-background rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                    <p className="font-black text-brand-primary">{s.val}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push("/")} className="inline-flex items-center gap-3 bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-2xl">
                Go to Dashboard <ArrowRight size={20} />
              </button>
            </div>
          )}
        </motion.div>

        {step < 3 && (
          <div className="flex justify-between items-center">
            <button onClick={prev} disabled={step === 0 || loading} className="px-8 py-4 bg-white border border-gray-100 text-brand-primary rounded-2xl font-black hover:bg-brand-background transition-all disabled:opacity-40 shadow-sm">
              ← Back
            </button>
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div key={i} className={cn("w-2 h-2 rounded-full transition-all", i === step ? "bg-brand-primary w-6" : "bg-gray-200")} />
              ))}
            </div>
            {step === STEPS.length - 2 ? (
               <button onClick={handleSubmit} disabled={loading} className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex gap-2 items-center">
                 {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Submit Application"}
               </button>
            ) : (
               <button onClick={next} disabled={loading} className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20">
                 Continue →
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
