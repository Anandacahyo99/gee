"use client";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Komponen untuk menangani perpindahan posisi peta
function MapController({ center, setCoords }: { center: [number, number], setCoords: any }) {
  const map = useMap();

  // Berpindah jika ada pencarian lokasi baru
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  // Menangkap koordinat tengah saat peta berhenti digeser
  useMapEvents({
    moveend: () => {
      const newCenter = map.getCenter();
      setCoords({ lat: newCenter.lat, lng: newCenter.lng });
    },
  });

  return null;
}

export default function LeafletMap({ tileUrl, center, setCoords }: any) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController center={center} setCoords={setCoords} />
      {tileUrl && <TileLayer url={tileUrl} key={tileUrl} />}
    </MapContainer>
  );
}