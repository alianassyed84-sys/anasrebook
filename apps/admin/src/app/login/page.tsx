"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, loginWithEmail, loginWithGoogle } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, BookOpen } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      // Check for the admin email from env if possible, or use the hardcoded one provided by user
      const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@rebookindia.in";
      if (u?.email === ADMIN_EMAIL)
        router.replace("/dashboard");
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Fill all fields"); return;
    }
    setLoading(true);
    const res = await loginWithEmail(email, password);
    if (!res.success) {
      toast.error(res.error!);
      setLoading(false); return;
    }
    
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@rebookindia.in";
    if (res.user.email !== ADMIN_EMAIL) {
      await auth.signOut();
      toast.error("Access denied. Admin only.");
      setLoading(false); return;
    }
    toast.success("Welcome Admin! 👋");
    router.push("/dashboard");
  }

  async function handleGoogle() {
    setGLoading(true);
    const res = await loginWithGoogle();
    if (!res.success) {
      toast.error(res.error!);
      setGLoading(false); return;
    }
    
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@rebookindia.in";
    if (res.user.email !== ADMIN_EMAIL) {
      await auth.signOut();
      toast.error("Access denied. Admin only.");
      setGLoading(false); return;
    }
    toast.success("Welcome Admin! 👋");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0F1F3D]
      flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A2744]
        border border-blue-800 rounded-2xl p-8
        shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center
            justify-center gap-2 mb-2">
            <BookOpen size={28}
              className="text-[#E8962E]"/>
            <span className="text-white text-xl
              font-bold">RebookIndia Admin</span>
          </div>
          <p className="text-blue-300 text-sm">
            Authorized Access Only
          </p>
        </div>

        <button type="button" onClick={handleGoogle}
          disabled={gLoading || loading}
          className="w-full flex items-center
            justify-center gap-3 bg-white
            hover:bg-gray-50 disabled:opacity-60
            text-gray-800 font-medium py-3
            rounded-xl mb-5 transition-all">
          {gLoading
            ? <span className="animate-spin">⏳</span>
            : <svg viewBox="0 0 24 24"
                className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>}
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-blue-800"/>
          <span className="text-blue-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-blue-800"/>
        </div>

        <form onSubmit={handleLogin}
          className="space-y-4">
          <input type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@rebookindia.in"
            disabled={loading || gLoading}
            className="w-full bg-[#0F1F3D] border
              border-blue-700 text-white rounded-xl
              px-4 py-3 text-sm outline-none
              focus:border-[#E8962E]"/>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              disabled={loading || gLoading}
              className="w-full bg-[#0F1F3D] border
                border-blue-700 text-white rounded-xl
                px-4 py-3 pr-11 text-sm outline-none
                focus:border-[#E8962E]"/>
            <button type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-3.5
                text-blue-400">
              {show
                ? <EyeOff size={18}/>
                : <Eye size={18}/>}
            </button>
          </div>
          <button type="submit"
            disabled={loading || gLoading}
            className="w-full bg-[#E8962E]
              hover:bg-orange-600 disabled:opacity-60
              text-white font-semibold py-3
              rounded-xl transition-colors">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 p-3 bg-[#0F1F3D]
          rounded-xl text-center border
          border-blue-900">
          <p className="text-white text-xs font-mono">
            admin@rebookindia.in / Admin@123456
          </p>
        </div>
      </div>
    </div>
  );
}
