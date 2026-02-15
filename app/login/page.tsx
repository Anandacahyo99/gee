"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowRight, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau password salah.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-600">
      <div className="w-full max-w-[1100px] min-h-[700px] flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden m-4 bg-white border border-white">
        
        {/* LEFT SIDE: Immersive Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden md:flex md:w-[45%] bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-600 p-12 flex-col justify-between overflow-hidden"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" 
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 mb-12">
              <Leaf className="w-5 h-5 text-blue-200" />
              <span className="font-bold text-white tracking-wide">TebuApp</span>
            </div>
            
            <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
              Selamat <br /> Datang <span className="text-blue-200">Kembali.</span>
            </h2>
            <p className="text-blue-100/80 text-lg leading-relaxed max-w-[300px]">
              Masuk untuk melanjutkan analisis lahan dan manajemen data GEE Anda.
            </p>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative z-10 bg-white/5 backdrop-blur-xl p-8 rounded-[24px] border border-white/10 shadow-2xl"
          >
            <div className="flex gap-1 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Update Terbaru</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              "Sekarang integrasi Google Drive jauh lebih cepat dengan sistem sinkronisasi otomatis."
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Login Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-20 bg-white">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Login.</h1>
              <p className="text-slate-500 font-medium">
                Belum punya akun?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      placeholder="nama@tebu.com"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-[18px] focus:ring-[4px] focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-blue-600">
                      Password
                    </label>
                    <Link href="#" className="text-xs font-bold text-blue-500 hover:text-blue-700">Lupa Password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-[18px] focus:ring-[4px] focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-extrabold py-5 rounded-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.15)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 group mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-8 p-5 rounded-[20px] flex items-center gap-4 bg-red-50 text-red-700 border border-red-100"
                >
                  <div className="p-2 rounded-full bg-red-100">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}