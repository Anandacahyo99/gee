"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, History, Leaf, ArrowLeft, Home } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-emerald-600 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-200">
            <Leaf className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            SUGAR<span className="text-emerald-600">SCAN</span>
          </span>
        </Link>

        {/* Navigation Links - Center */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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
                <item.icon size={14} className="relative z-10" />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Back to Home Button - Right */}
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="group flex items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white pl-4 pr-5 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
              <Home size={14} />
            </div>
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </motion.nav>
  );
}