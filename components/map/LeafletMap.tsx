"use client";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

function GeeLayer({ url }: { url: string }) {
  const map = useMap();
  useEffect(() => {
    if (!url) return;
    const layer = L.tileLayer(url);
    layer.addTo(map);
    return () => { map.removeLayer(layer); };
  }, [url, map]);
  return null;
}

export default function LeafletMap({ tileUrl }: { tileUrl: string }) {
  return (
    <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
      <MapContainer center={[-7.82, 112.06]} zoom={13} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {tileUrl && <GeeLayer url={tileUrl} />}
      </MapContainer>
    </div>
  );
}