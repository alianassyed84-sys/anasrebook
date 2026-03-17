"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import { loginWithEmail, loginWithGoogle, getDocument, setDocument, COLLECTIONS, getCurrentUser } from "@rebookindia/firebase";

export default function CustomerLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) router.replace("/");
    }).catch(() => {});
  }, [router]);

  async function syncUserToFirestore(user: any, additionalData: any = {}) {
    try {
      const userDoc = await getDocument(COLLECTIONS.USERS, user.uid);
      if (!userDoc) {
        await setDocument(COLLECTIONS.USERS, user.uid, {
          uid: user.uid,
          name: user.displayName || additionalData.name || "Customer",
          email: user.email,
          phone: user.phoneNumber || additionalData.phone || "",
          city: "",
          pincode: "",
          isBookPass: false,
          totalOrders: 0,
          role: "customer"
        });
      }
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithEmail(email.trim(), password);
      await syncUserToFirestore(user);
      toast.success("Welcome back! 📚");
      router.push("/");
    } catch (err: any) {
      toast.error("Login failed: " + (err.message || "Try again"));
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGLoading(true);
    try {
      const user = await loginWithGoogle();
      await syncUserToFirestore(user);
      toast.success("Welcome back! 📚");
      router.push("/");
    } catch (err: any) {
      toast.error("Google login failed. Try again.");
      setGLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2">
            <BookOpen size={28} className="text-[#E8962E]" />
            <span className="text-[#1B3A6B] text-2xl font-bold">
              RebookIndia
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to buy books at 40–70% off
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={gLoading || loading}
            className="w-full flex items-center justify-center gap-3
              bg-white hover:bg-gray-50 disabled:opacity-60
              text-gray-700 font-medium py-3 rounded-xl border-2
              border-gray-200 hover:border-gray-300 transition-all
              shadow-sm mb-5">
            {gLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {gLoading ? "Login..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100"/>
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-100"/>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-medium block mb-1">Email</label>
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                disabled={loading || gLoading}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1B3A6B] transition-colors"/>
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium block mb-1">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  disabled={loading || gLoading}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-[#1B3A6B] transition-colors"/>
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-3.5 text-gray-400">
                  {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading || gLoading}
              className="w-full bg-[#1B3A6B] hover:bg-[#2E75B6] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              )}
              {loading ? "Signing in..." : "Login with Email"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            No account?{" "}
            <Link href="/register" className="text-[#E8962E] font-medium hover:underline">
              Register here
            </Link>
          </p>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-center">
            <p className="text-xs text-blue-600 font-mono">
              student@rebookindia.in / Student@123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
