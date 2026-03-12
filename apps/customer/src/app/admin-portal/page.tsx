import React from "react";
import { ShieldCheck, ArrowRight, ShieldAlert, Lock } from "lucide-react";

export default function AdminPortalInfoPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary mx-auto">
          <ShieldCheck size={48} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-brand-primary tracking-tighter">Admin Portal Access</h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            The RebookIndia Admin Portal is a restricted management environment for platform moderation, 
            vendor verification, and system telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left">
          <div className="p-6 bg-brand-background rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg text-brand-primary shadow-sm"><ShieldAlert size={20} /></div>
            <div>
              <p className="font-bold text-brand-primary">Authorised Access Only</p>
              <p className="text-sm text-gray-500">You must have an Admin or Super Admin role assigned to your account.</p>
            </div>
          </div>
          <div className="p-6 bg-brand-background rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg text-brand-primary shadow-sm"><Lock size={20} /></div>
            <div>
              <p className="font-bold text-brand-primary">Secure Credentials</p>
              <p className="text-sm text-gray-500">Multifactor authentication and audit logging are active for all sessions.</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <a 
            href="http://localhost:4002" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-primary text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-brand-secondary transition-all shadow-2xl shadow-brand-primary/30"
          >
            Go to Admin Dashboard <ArrowRight size={24} />
          </a>
        </div>
        
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Protocol Protected Mode · Internal Network
        </p>
      </div>
    </div>
  );
}
