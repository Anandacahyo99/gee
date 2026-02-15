"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, History, Leaf, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Swal from 'sweetalert2';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const handleHistoryClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  
    setIsRedirecting(true);
  
    try {
      const res = await fetch(`/api/history/latest?t=${Date.now()}`);
      const data = await res.json();
  
      if (data && data.id) {
        // Notifikasi Toast kecil saat mengalihkan ke halaman laporan
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
  
        await Toast.fire({
          icon: 'success',
          title: 'Membuka laporan terakhir...',
          background: '#10b981',
          color: '#fff',
          iconColor: '#fff',
        });
  
        router.push(`/private/analytics/${data.id}`);
      } else {
        // Pop-up utama dengan desain yang lebih "clean"
        Swal.fire({
          title: '<span class="text-slate-900 font-black tracking-tighter uppercase">Riwayat Kosong</span>',
          html: '<p class="text-slate-500 font-medium text-sm">Anda belum melakukan analisis lahan. Silakan isi data di dashboard terlebih dahulu.</p>',
          icon: 'info',
          iconColor: '#10b981',
          confirmButtonText: 'MULAI ANALISIS SEKARANG',
          confirmButtonColor: '#10b981',
          background: '#ffffff',
          padding: '2rem',
          customClass: {
            popup: 'rounded-[32px] border-none shadow-2xl',
            confirmButton: 'rounded-2xl px-8 py-4 font-black text-xs tracking-widest transition-transform hover:scale-105 active:scale-95'
          },
          showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut animate__faster'
          }
        });
        
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Kesalahan Navigasi:", err);
      
      Swal.fire({
        icon: 'error',
        title: 'Masalah Koneksi',
        text: 'Gagal mengambil data dari server SugarScan.',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-[24px]'
        }
      });
    } finally {
      setIsRedirecting(false);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { 
      name: "History", 
      href: "#", 
      icon: History, 
      onClick: handleHistoryClick 
    },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-emerald-600 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-200">
            <Leaf className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            SUGAR<span className="text-emerald-600">SCAN</span>
          </span>
        </Link>

        {/* Menu Tengah */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
          {navItems.map((item) => {
            // Aktif jika di halaman dashboard atau sedang di dalam folder analytics
            const isActive = pathname === item.href || (item.name === "History" && pathname.includes("/private/analytics"));
            
            return (
              <button
                key={item.name}
                onClick={item.onClick ? item.onClick : () => router.push(item.href)}
                className={`relative px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  isActive ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white shadow-sm rounded-xl border border-slate-200/40"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {isRedirecting && item.name === "History" ? (
                  <Loader2 size={14} className="relative z-10 animate-spin text-emerald-600" />
                ) : (
                  <item.icon size={14} className="relative z-10" />
                )}
                <span className="relative z-10">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          ) : status === "unauthenticated" ? (
            <>
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm px-4 py-2 transition-colors">
                <LogIn size={16} />
                <span>Masuk</span>
              </Link>
              <Link href="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-100">
                <UserPlus size={16} />
                <span>Daftar</span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none">
                  {session?.user?.name}
                </span>
                <div className="flex items-center gap-1 mt-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Online</span>
                </div>
              </div>
              
              <button 
                onClick={() => signOut()}
                className="group flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all border border-slate-200/50"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}