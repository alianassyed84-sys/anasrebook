"use client";

import React, { useState, useEffect } from "react";
import { Save, Percent, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { databases, DB_ID, COLLECTIONS, Query } from "@/lib/appwrite";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsDoc, setSettingsDoc] = useState<any>(null);

  // Stats for display
  const [commissionRate, setCommissionRate] = useState(15);
  const [platformName, setPlatformName] = useState("RebookIndia");
  const [supportEmail, setSupportEmail] = useState("support@rebookindia.in");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, COLLECTIONS.SETTINGS);
        if (res.documents.length > 0) {
          const doc = res.documents[0];
          setSettingsDoc(doc);
          setCommissionRate(doc.commissionRate || 15);
          setPlatformName(doc.platformName || "RebookIndia");
          setSupportEmail(doc.supportEmail || "support@rebookindia.in");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (settingsDoc) {
        await databases.updateDocument(DB_ID, COLLECTIONS.SETTINGS, settingsDoc.$id, {
          commissionRate,
          platformName,
          supportEmail,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create if not exists (unlikely in admin but good for safety)
        const newDoc = await databases.createDocument(DB_ID, COLLECTIONS.SETTINGS, "system_settings", {
          commissionRate,
          platformName,
          supportEmail,
          createdAt: new Date().toISOString()
        });
        setSettingsDoc(newDoc);
      }
      toast.success("Settings updated successfully! ✅");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-brand-primary" size={48} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-4 md:p-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-brand-primary tracking-tighter">System Settings</h1>
        <p className="text-gray-500 font-medium">Configure global platform parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-black text-brand-primary flex items-center gap-3">
                <Percent size={24} className="text-brand-secondary" />
                Economics
              </h2>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Platform Commission Rate (%)</label>
                <div className="relative">
                  <input 
                    type="number" value={commissionRate} onChange={e => setCommissionRate(parseFloat(e.target.value))}
                    className="w-full pl-6 pr-12 py-4 bg-brand-background rounded-2xl border-none outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" 
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black">%</span>
                </div>
                <p className="text-xs text-gray-400 font-medium italic">This rate is applied to every sale on the platform.</p>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-gray-50">
              <h2 className="text-xl font-black text-brand-primary flex items-center gap-3">
                <Globe size={24} className="text-brand-secondary" />
                Platform Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Platform Name</label>
                  <input 
                    type="text" value={platformName} onChange={e => setPlatformName(e.target.value)}
                    className="w-full px-6 py-4 bg-brand-background rounded-2xl border-none outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Support Email</label>
                  <input 
                    type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-brand-background rounded-2xl border-none outline-none focus:ring-4 ring-brand-primary/5 font-bold text-brand-primary" 
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={saving}
              className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Save Platform Configuration
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white space-y-6">
            <h3 className="font-black italic text-lg">System Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold opacity-60">Database Connection</span>
                <span className="font-black text-brand-accent flex items-center gap-1"><CheckCircle2 size={12} /> ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold opacity-60">Storage Bucket (book-images)</span>
                <span className="font-black text-brand-accent flex items-center gap-1"><CheckCircle2 size={12} /> ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold opacity-60">Auth Service</span>
                <span className="font-black text-brand-accent flex items-center gap-1"><CheckCircle2 size={12} /> ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
