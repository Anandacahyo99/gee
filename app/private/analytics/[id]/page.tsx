"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  FileDown,
  ArrowLeft,
  Printer,
  Database,
  MapPin,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layouts/footer";

export default function AnalyticsResultPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/history/${id}`);
        const result = await res.json();

        if (res.ok) {
          // Parse string JSON dari database menjadi array untuk Recharts
          const parsedChartData = result.chartData
            ? JSON.parse(result.chartData)
            : [];
          setData({ ...result, chartItems: parsedChartData });
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-emerald-600 animate-pulse">
        MEMUAT LAPORAN...
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Data tidak ditemukan.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-bold text-sm mb-2 uppercase"
            >
              <ArrowLeft size={16} /> Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Laporan:{" "}
              <span className="text-emerald-600">{data.locationName}</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1">
              Dibuat pada {new Date(data.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
            >
              <Printer size={18} /> Cetak
            </button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:bg-emerald-600 transition-all">
              <FileDown size={18} /> Export Laporan
            </button>
          </div>
        </div>

        {/* Info Card - Data Asli Database */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <MapPin size={14} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Luas Tertanam
              </p>
            </div>
            <p className="text-xl font-bold text-slate-800">
              {data.areaTertanam}{" "}
              <span className="text-sm font-medium">Ha</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Sprout size={14} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Luas Kosong
              </p>
            </div>
            <p className="text-xl font-bold text-red-500">
              {data.areaKosong} <span className="text-sm font-medium">Ha</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Skor NDVI (Rata-rata)
            </p>
            <p
              className={`text-xl font-bold tracking-tight ${
                data.ndviAvg > 0.5 ? "text-emerald-600" : "text-orange-500"
              }`}
            >
              {data.ndviAvg}
            </p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Status Analisis
            </p>
            <p className="text-lg font-bold text-blue-600 tracking-tight flex items-center gap-2">
              <Database size={18} /> Finalized
            </p>
          </div>
        </div>

        {/* Charts Section - Menggunakan chartItems dari parse JSON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm"
        >
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight uppercase text-center">
            Analisis Pertumbuhan Lahan
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.chartItems}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  {/* Gradien untuk Area Tertanam (Emerald) */}
                  <linearGradient
                    id="colorTertanam"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  {/* Gradien untuk Area Kosong (Red) */}
                  <linearGradient id="colorKosong" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="8 8"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                  padding={{ left: 20, right: 20 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                />

                <Tooltip
                  cursor={{
                    stroke: "#10b981",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }}
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow:
                      "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                    padding: "12px 16px",
                  }}
                />

                {/* Kurva Area Tertanam - Menggunakan type="monotone" untuk kelengkungan alami */}
                <Area
                  type="monotone"
                  dataKey="tertanam"
                  name="Area Tertanam"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTertanam)"
                  animationDuration={2000} // Animasi lebih lambat agar terasa smooth
                />

                {/* Kurva Area Kosong - Menggunakan strokeDasharray untuk variasi visual */}
                <Area
                  type="monotone"
                  dataKey="kosong"
                  name="Area Kosong"
                  stroke="#ef4444"
                  strokeWidth={3}
                  strokeDasharray="10 10" // Garis putus-putus agar tidak bertabrakan secara visual
                  fillOpacity={1}
                  fill="url(#colorKosong)"
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Footer */}

        <p className="text-center text-slate-400 text-xs font-medium italic">
          SugarScan Engine • Laporan ID: {id} • Sumber: Copernicus Sentinel-2
        </p>
        <Footer />
      </div>
    </div>
  );
}
