"use client";

import React from "react";
import { 
  Map as MapIcon, 
  Cpu, 
  ExternalLink, 
  Linkedin, 
  ShieldCheck, 
  Layers 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      {/* CSS Manual menggunakan Styled JSX */}
      <style jsx>{`
        .footer-wrapper {
          background-color: #f1f5f9 !important; /* Warna abu-abu lembut */
          border-top: 1px solid #e2e8f0;
          padding: 60px 20px 40px 20px;
          margin-top: 60px;
          width: 100%;
          font-family: 'Inter', system-ui, sans-serif;
          color: #0f172a !important; /* Paksa teks tetap gelap */
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 60px;
          padding-bottom: 40px;
          border-bottom: 1px solid #cbd5e1;
        }
        .brand-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .icon-box {
          background-color: #059669; /* Emerald 600 */
          padding: 10px;
          border-radius: 12px;
          display: flex;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .brand-title {
          font-size: 22px;
          font-weight: 900;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .brand-title span {
          color: #059669;
        }
        .brand-desc {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          max-width: 320px;
          margin: 0;
        }
        .link-column h4 {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0 0 20px 0;
          color: #1e293b;
        }
        .footer-nav {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-nav li {
          margin-bottom: 12px;
        }
        .footer-nav a {
          color: #64748b;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .footer-nav a:hover {
          color: #059669;
        }
        .footer-bottom {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .copy-text {
          font-size: 13px;
          font-weight: 700;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .stack-badge {
          background-color: #ffffff;
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          font-size: 11px;
          font-weight: 800;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .student-badge {
          text-align: center;
          margin-top: 40px;
          font-size: 10px;
          font-weight: 800;
          color: #cbd5e1;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Area */}
          <div className="brand-section">
            <div className="brand-header">
              <div className="icon-box">
                <MapIcon size={22} color="white" />
              </div>
              <h3 className="brand-title">Geo-GIS <span>Blitar</span></h3>
            </div>
            <p className="brand-desc">
              Sistem informasi geospasial cerdas untuk pemantauan kesehatan lahan tebu 
              menggunakan integrasi Google Earth Engine.
            </p>
          </div>

          {/* Navigation */}
          <div className="link-column">
            <h4>Platform</h4>
            <ul className="footer-nav">
              <li><a href="#">Dashboard Utama</a></li>
              <li><a href="#">Analisis Vegetasi</a></li>
              <li><a href="#">Laporan Wilayah</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="link-column">
            <h4>Resources</h4>
            <ul className="footer-nav">
              <li><a href="#">Dokumentasi <ExternalLink size={14} /></a></li>
              <li><a href="#">Data Sentinel-2</a></li>
              <li><a href="https://linkedin.com" target="_blank">LinkedIn <Linkedin size={14} /></a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="footer-bottom">
          <div className="copy-text">
            <Cpu size={16} />
            <span>PKL TEKNIK INFORMATIKA &copy; {currentYear}</span>
          </div>
          
          <div className="stack-badge">
            <Layers size={14} color="#10b981" />
            Built with Next.js 15 & GEE
          </div>
        </div>

        <div className="student-badge">
          Proyek Prakerin Semester 5 — 2026
        </div>
      </div>
    </footer>
  );
}