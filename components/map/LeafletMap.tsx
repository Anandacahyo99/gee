"use client";
import { MapContainer, TileLayer, useMap, useMapEvents, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

function MapController({ center, setCoords }: { center: [number, number], setCoords: any }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  // 1. Sinkronisasi tampilan saat koordinat berubah (Pencarian atau pindah posisi)
  useEffect(() => {
    // Ambil zoom saat ini agar tidak memaksa balik ke 14 saat digeser manual
    const currentZoom = map.getZoom();
    
    // Jika ini adalah perubahan koordinat (misal dari pencarian), 
    // kita bisa menentukan zoom default (misal 14), 
    // tapi jika user sedang eksplorasi, kita biarkan zoom yang ada.
    map.setView(center, isFirstRender.current ? 13 : currentZoom, {
      animate: true,
      duration: 1.0
    });

    isFirstRender.current = false;
  }, [center, map]);

  // 2. Event Handler untuk menangkap pergerakan manual user
  useMapEvents({
    moveend: () => {
      const newCenter = map.getCenter();
      // Update koordinat ke state parent tanpa mengubah level zoom
      setCoords({ lat: newCenter.lat, lng: newCenter.lng });
    },
  });

  return null;
}

export default function LeafletMap({ tileUrl, center, setCoords }: any) {
  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      scrollWheelZoom={true}
    >
      {/* Pengganti ChangeView yang lebih cerdas */}
      <MapController center={center} setCoords={setCoords} />
      
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Mode Jalan">
          <TileLayer 
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Satelit Asli">
          <TileLayer 
            attribution='&copy; Esri'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
          />
        </LayersControl.BaseLayer>

        {tileUrl && (
          <LayersControl.Overlay checked name="Hasil Scan Tebu">
            <TileLayer 
              url={tileUrl} 
              key={tileUrl} 
              opacity={0.7} 
              // Penting agar tile dari GEE tidak terlihat pecah saat di-zoom dekat
              maxNativeZoom={14} 
              maxZoom={20}
            />
          </LayersControl.Overlay>
        )}
      </LayersControl>
    </MapContainer>
  );
}