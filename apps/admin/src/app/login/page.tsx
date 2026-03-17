"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle, logout, getCurrentUser } from "@rebookindia/firebase";
import toast from "react-hot-toast";
import { Eye, EyeOff, BookOpen, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  // Use environment variable or fallback for admin email
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@rebookindia.in";

  // Check if already logged in
  useEffect(() => {
    getCurrentUser()
      .then(user => {
        if (user && user.email === ADMIN_EMAIL) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [router, ADMIN_EMAIL]);

  async function handleLoginSuccess(user: any) {
    if (user.email !== ADMIN_EMAIL) {
      await logout();
      toast.error("Access denied. Admin only.");
      setLoading(false);
      setGLoading(false);
      return;
    }
    toast.success("Welcome, Admin! 👋");
    router.push("/dashboard");
  }

  // ── Email + Password Login ──────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithEmail(email.trim(), password);
      await handleLoginSuccess(user);
    } catch (err: any) {
      toast.error("Login failed: " + (err.message || "Try again"));
      setLoading(false);
    }
  }

  // ── Google Login ────────────────────────────────────────────
  async function handleGoogleLogin() {
    setGLoading(true);
    try {
      const user = await loginWithGoogle();
      await handleLoginSuccess(user);
    } catch (err) {
      toast.error("Google login failed. Try again.");
      setGLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1F3D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen size={30} className="text-[#E8962E]" />
            <span className="text-white text-2xl font-bold">RebookIndia</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-blue-300 text-sm">
            <Lock size={13} />
            <span>Admin Panel — Authorized Access Only</span>
          </div>
        </div>

        <div className="bg-[#1A2744] border border-blue-800 rounded-2xl p-8 shadow-2xl">

          {/* ── Google Login Button ── */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={gLoading || loading}
            className="w-full flex items-center justify-center gap-3
              bg-white hover:bg-gray-50 disabled:opacity-60
              text-gray-800 font-medium py-3 rounded-xl
              transition-all duration-200 border border-gray-200
              shadow-sm mb-6">
            {gLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
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
            {gLoading ? "Redirecting to Google..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-blue-800"/>
            <span className="text-blue-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-blue-800"/>
          </div>

          {/* Email + Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-blue-200 text-sm block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@rebookindia.in"
                autoComplete="email"
                disabled={loading || gLoading}
                className="w-full bg-[#0F1F3D] border border-blue-700
                  text-white rounded-xl px-4 py-3 text-sm outline-none
                  focus:border-[#E8962E] transition-colors"
             />
            </div>
            <div>
              <label className="text-blue-200 text-sm block mb-1">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  disabled={loading || gLoading}
                  className="w-full bg-[#0F1F3D] border border-blue-700
                    text-white rounded-xl px-4 py-3 pr-11 text-sm
                    outline-none focus:border-[#E8962E] transition-colors"
               />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-3.5 text-blue-400 hover:text-white">
                  {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || gLoading}
              className="w-full bg-[#E8962E] hover:bg-orange-600
                disabled:opacity-60 text-white font-semibold py-3
                rounded-xl transition-colors flex items-center
                justify-center gap-2">
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              )}
              {loading ? "Signing in..." : "Login with Email"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-[#0F1F3D] rounded-xl border border-blue-900 text-center">
            <p className="text-blue-400 text-xs mb-1">Demo Credentials</p>
            <p className="text-white text-xs font-mono">
              admin@rebookindia.in / Admin@123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
