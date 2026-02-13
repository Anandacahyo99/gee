"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

export default function DashboardPage() {
  const [tileUrl, setTileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const startAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gee/analyze", {
        method: "POST",
        body: JSON.stringify({ lat: -7.82, lng: 112.06 }),
      });
      const data = await res.json();
      setTileUrl(data.tileUrl);
    } catch (e) {
      alert("Gagal memuat data satelit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Monitoring Lahan Tebu - Kediri</h1>
      <button 
        onClick={startAnalysis} 
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer", background: "#0070f3", color: "white", border: "none", borderRadius: "5px" }}
      >
        {loading ? "Menghubungi Satelit..." : "Deteksi Lahan Tebu"}
      </button>

      <LeafletMap tileUrl={tileUrl} />
    </div>
  );
}