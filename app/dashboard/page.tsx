"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Rocket, MapPin, Sprout, Tent, 
  Loader2, Info, Calendar, ArrowRightLeft,
  BarChart3 // Tambahan icon
} from "lucide-react";
import NdviLegend from "@/components/map/NdviLegend";
import Footer from "@/components/layouts/footer";
import TrendChart from "@/components/history/TrendChart"; // Impor Komponen Grafik

// --- Type Definitions ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
}

interface Coords {
  lat: number;
  lng: number;
}

interface AreaData {
  tertanam: string;
  kosong: string;
}

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] w-full flex flex-col items-center justify-center bg-slate-100/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 animate-pulse">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
      <p className="font-semibold text-slate-500 tracking-wide">Menyiapkan Citra Satelit...</p>
    </div>
  ),
});

export default function DashboardPage() {
  const [tileUrl, setTileUrl] = useState<string>("");
  const [areas, setAreas] = useState<AreaData>({ tertanam: "0.00", kosong: "0.00" });
  const [loading, setLoading] = useState<boolean>(false);
  const [coords, setCoords] = useState<Coords>({ lat: -7.82, lng: 112.06 });
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State Baru untuk Grafik
  const [chartData, setChartData] = useState<any[]>([]);

  const [dateOld, setDateOld] = useState("2025-11-01");
  const [dateNew, setDateNew] = useState("2026-02-01");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const contextQuery = `${searchQuery}, Blitar, Jawa Timur`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(contextQuery)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        setTileUrl(""); 
        setAreas({ tertanam: "0.00", kosong: "0.00" });
        setChartData([]); // Reset grafik saat cari lokasi baru
      } else {
        alert("Lokasi tidak ditemukan.");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const startAnalysis = async () => {
    setLoading(true);
    setTileUrl("");
    setAreas({ tertanam: "0.00", kosong: "0.00" });

    try {
      const res = await fetch("/api/gee/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...coords, startDate: dateOld, endDate: dateNew }),
      });

      const data = await res.json();

      if (res.status === 404) {
        alert(`Peringatan: ${data.error}`);
        return;
      }

      if (data.tileUrl) {
        setTileUrl(data.tileUrl);
        setAreas({
          tertanam: data.areaTertanam || "0.00",
          kosong: data.areaKosong || "0.00",
        });
        // SIMPAN DATA GRAFIK DARI API
        if (data.chartData) {
          setChartData(data.chartData);
        }
      }
    } catch (e: any) {
      alert("Terjadi kesalahan pada sinkronisasi satelit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200/50">
      <main className="max-w-7xl mx-auto px-6 py-10 md:px-12">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-12 bg-emerald-500 rounded-full" />
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Analisis Geospasial</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">
              Monitoring <span className="text-emerald-600">Lahan Tebu</span>
            </h1>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari desa/kecamatan..."
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 w-full sm:w-80 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </header>

        {/* Date Range Selector */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Calendar size={20} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Rentang Waktu Analisis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kondisi Lama (Baseline)</span>
              <input 
                type="date" value={dateOld} 
                onChange={(e) => setDateOld(e.target.value)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="md:col-span-2 flex justify-center pt-4">
              <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                <ArrowRightLeft size={20} className="rotate-90 md:rotate-0" />
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kondisi Baru (Target)</span>
              <input 
                type="date" value={dateNew} 
                onChange={(e) => setDateNew(e.target.value)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
          <button
            onClick={startAnalysis}
            disabled={loading}
            className="w-full mt-10 flex items-center justify-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black transition-all active:scale-[0.98] disabled:bg-slate-200 shadow-xl shadow-slate-900/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
            {loading ? "Memproses Data Satelit..." : "Jalankan Analisis Banding"}
          </button>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<MapPin className="text-blue-500" />} label="Koordinat Pusat" value={`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`} />
          <StatCard icon={<Sprout className="text-emerald-500" />} label="Estimasi Tertanam" value={`${areas.tertanam} Ha`} color="border-emerald-500" />
          <StatCard icon={<Tent className="text-orange-500" />} label="Lahan Kosong" value={`${areas.kosong} Ha`} color="border-orange-500" />
        </div>

        {/* Visualisasi Grafik & Peta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Bagian Grafik (Muncul jika data ada) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <AnimatePresence>
              {chartData.length > 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                   <TrendChart data={chartData} />
                </motion.div>
              ) : (
                <div className="bg-white p-8 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <BarChart3 size={48} className="text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-tighter">
                    Grafik perbandingan <br /> muncul setelah analisis
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Bagian Peta */}
          <section className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-2 relative">
             <div className="absolute top-6 left-6 z-10">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase text-slate-600">Sentinel-2 Live View</span>
                </div>
             </div>
             <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden">
                <LeafletMap tileUrl={tileUrl} center={[coords.lat, coords.lng]} setCoords={setCoords} />
                {tileUrl && <NdviLegend />}
             </div>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  );
}

function StatCard({ icon, label, value, color = "border-slate-100", delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`bg-white p-8 rounded-[2.5rem] border-b-8 ${color} shadow-sm border border-slate-50 flex flex-col gap-6 hover:translate-y-[-4px] transition-all`}
    >
      <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
}