"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import NdviLegend from "@/components/map/NdviLegend";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { 
  ssr: false,
  loading: () => <div style={styles.mapLoading}>🔄 Mempersiapkan Peta...</div>
});

export default function DashboardPage() {
  const [tileUrl, setTileUrl] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: -7.82, lng: 112.06 });
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.length > 0) {
        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        setTileUrl(""); 
        setArea(null);
      }
    } catch (err) {
      alert("Gagal menemukan lokasi.");
    }
  };

  const startAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gee/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });
      const data = await res.json();
      setTileUrl(data.tileUrl);
      setArea(data.area);
    } catch (e) {
      alert("Terjadi kesalahan pada server satelit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <main style={styles.mainContent}>
        {/* Header Section */}
        <header style={styles.header}>
          <div style={styles.branding}>
            <h1 style={styles.title}>Analisis Lahan Tebu</h1>
            <p style={styles.subtitle}>Sistem Monitoring Berbasis Citra Satelit Sentinel-2</p>
          </div>

          <div style={styles.actions}>
            <form onSubmit={handleSearch} style={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Cari desa/kecamatan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.searchBtn}>🔍</button>
            </form>

            <button 
              onClick={startAnalysis} 
              disabled={loading}
              style={loading ? {...styles.scanBtn, ...styles.btnDisabled} : styles.scanBtn}
            >
              {loading ? "⌛ Memproses..." : "🚀 Jalankan Analisis"}
            </button>
          </div>
        </header>

        {/* Info Cards */}
        <div style={styles.statsRow}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Titik Koordinat Aktif</span>
            <div style={styles.cardValue}>
              {coords.lat.toFixed(5)} <span style={styles.divider}>|</span> {coords.lng.toFixed(5)}
            </div>
          </div>
          <div style={{...styles.card, borderLeft: '4px solid #2ecc71'}}>
            <span style={styles.cardLabel}>Hasil Estimasi Luas</span>
            <div style={{...styles.cardValue, color: '#27ae60', fontSize: '24px'}}>
              {area ? `${area} Hektar` : "Menunggu Analisis..."}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section style={styles.mapCard}>
          <div style={styles.mapInfo}>
            <span>📍 Area Tampilan Sekarang</span>
            {tileUrl && <span style={styles.activeBadge}>Layer NDVI Aktif</span>}
          </div>
          <div style={styles.mapContainer}>
            <LeafletMap 
              tileUrl={tileUrl} 
              center={[coords.lat, coords.lng]} 
              setCoords={setCoords} 
            />
            {tileUrl && <NdviLegend />}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#1e293b",
    display: "flex",
    justifyContent: "center",
  },
  mainContent: {
    width: "100%",
    maxWidth: "1200px",
    padding: "40px 20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "20px",
  },
  branding: {
    flex: "1 1 300px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.025em",
    margin: "0 0 8px 0",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  searchBox: {
    display: "flex",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "4px 8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  input: {
    border: "none",
    padding: "10px 12px",
    outline: "none",
    fontSize: "14px",
    width: "220px",
    backgroundColor: "transparent",
  },
  searchBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0 10px",
    fontSize: "16px",
  },
  scanBtn: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
  },
  btnDisabled: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cardLabel: {
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748b",
  },
  cardValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
  },
  divider: {
    color: "#e2e8f0",
    margin: "0 8px",
  },
  mapCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  mapInfo: {
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
  },
  activeBadge: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "4px 12px",
    borderRadius: "99px",
    fontSize: "12px",
  },
  mapContainer: {
    position: "relative",
    height: "550px",
    width: "100%",
  },
  mapLoading: {
    height: "550px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    fontSize: "18px",
    fontWeight: "600",
  }
};