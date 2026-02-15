"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, User, Loader2, CheckCircle2, AlertCircle, ArrowRight, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | ""; message: string }>({
    type: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({ type: "success", message: "Akun berhasil dibuat! Mengalihkan ke login..." });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setFeedback({ type: "error", message: data.message || "Terjadi kesalahan." });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Koneksi ke server gagal." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-600">
      <div className="w-full max-w-[1100px] min-h-[700px] flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden m-4 bg-white border border-white">
        
        {/* LEFT SIDE: Immersive Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden md:flex md:w-[45%] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between overflow-hidden"
        >
          {/* Animated Background Elements */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" 
          />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 mb-12">
              <Leaf className="w-5 h-5 text-blue-200 fill-blue-200/20" />
              <span className="font-bold text-white tracking-wide">TebuApp</span>
            </div>
            
            <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-sm">
              Masa Depan <br /> <span className="text-blue-200">Agrikultur</span> <br /> Presisi.
            </h2>
            <p className="text-blue-100/80 text-lg leading-relaxed max-w-[320px]">
              Analisis kesehatan lahan tebu Anda secepat kilat dengan GEE Integration.
            </p>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="relative z-10 bg-white/5 backdrop-blur-xl p-8 rounded-[24px] border border-white/10 shadow-2xl"
          >
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Sparkles key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
              "Laporan otomatis ke Google Drive sangat membantu efisiensi tim IT kami di lapangan selama PKL."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 p-0.5">
                <div className="w-full h-full rounded-full bg-blue-600 border-2 border-white/20" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Staff IT PKL</p>
                <p className="text-blue-200 text-xs">Pabrik Gula Nasional</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Elegant Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-20 bg-white">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                Bergabung <span className="text-blue-600">Sekarang.</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                {[
                  { label: "Nama Lengkap", icon: User, type: "text", key: "name", placeholder: "Ahmad Suganda" },
                  { label: "Email Address", icon: Mail, type: "email", key: "email", placeholder: "ahmad@tebu.com" },
                  { label: "Secure Password", icon: Lock, type: "password", key: "password", placeholder: "••••••••" }
                ].map((input) => (
                  <div key={input.key} className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
                      {input.label}
                    </label>
                    <div className="relative">
                      <input.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-[18px] focus:ring-[4px] focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-300 font-medium"
                        value={formData[input.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-extrabold py-5 rounded-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.15)] hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Buat Akun Gratis</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {feedback.message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mt-8 p-5 rounded-[20px] flex items-center gap-4 border ${
                    feedback.type === "success" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  <div className={`p-2 rounded-full ${feedback.type === "success" ? "bg-emerald-100" : "bg-red-100"}`}>
                    {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <p className="text-sm font-bold">{feedback.message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}