"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Map, Zap, ShieldCheck, ArrowRight, 
  BarChart3, Globe, Layers, MousePointerClick 
} from "lucide-react";

export default function HomePage() {
  return (
    // Wrapper dengan warna background abu-abu terang yang dikunci (anti-dark mode)
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-emerald-100">
      
      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
              <Map size={24} className="text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight">
              Geo-GIS <span className="text-emerald-600 italic">Blitar</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-10">
            <Link href="#fitur" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Fitur</Link>
            <Link href="#teknologi" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Teknologi</Link>
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 text-sm"
            >
              Buka Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#ecfdf5_0%,#f8fafc_100%)] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-5 py-2 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
              🛰️ Sentinel-2 & GEE Integration
            </span>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
              Pantau Lahan Tebu <br /> 
              <span className="text-emerald-600 relative">
                Lebih Presisi.
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Analisis vegetasi real-time berbasis <span className="text-slate-900 font-bold">Google Earth Engine</span>. 
              Membantu efisiensi pertanian di Jawa Timur dengan data satelit akurat.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 active:scale-95 group"
              >
                Mulai Analisis <Zap size={20} className="fill-white group-hover:animate-pulse" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all">
                Dokumentasi Sistem
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="fitur" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap size={26} />} 
              title="Analisis Cepat" 
              desc="Pemrosesan ribuan citra satelit dilakukan di cloud GEE dalam hitungan detik." 
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck size={26} />} 
              title="Akurasi Tinggi" 
              desc="Kalibrasi NDVI yang dioptimalkan khusus untuk fase pertumbuhan tebu." 
              delay={0.2}
            />
            <FeatureCard 
              icon={<BarChart3 size={26} />} 
              title="Data Hektar" 
              desc="Konversi otomatis dari piksel satelit menjadi satuan luas lahan yang akurat." 
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Tech Highlight - Dark Section */}
      <section id="teknologi" className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full" />
          
          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Teknologi <span className="text-emerald-400">Big Data</span> Geospasial
              </h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">
                Aplikasi ini berjalan di atas infrastruktur server Google, memastikan perangkat Anda tidak terbebani saat melakukan komputasi berat.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Globe size={20} />
                  </div>
                  <span className="font-bold">Cloud Computing</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Layers size={20} />
                  </div>
                  <span className="font-bold">Multi-Layer Data</span>
                </div>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex-1 w-full bg-slate-800 aspect-video rounded-3xl border border-slate-700 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:border-emerald-500/50 transition-all shadow-2xl"
            >
              <MousePointerClick size={40} className="mb-4 opacity-20" />
              <span className="font-bold text-sm tracking-widest uppercase opacity-40">Preview Dashboard</span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-komponen Card untuk Reusability & Clean Code
function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group"
    >
      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

