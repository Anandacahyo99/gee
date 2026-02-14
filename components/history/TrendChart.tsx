"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function TrendChart({ data }: { data: any[] }) {
  // Debugging: Cek di console apakah data sudah berupa angka (bukan teks dalam kutip)
  console.log("Data Grafik:", data);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full flex flex-col min-h-[400px]">
      <div className="mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Comparison Insight</h3>
        <p className="text-xl font-black text-slate-800 tracking-tight">Luas Lahan (Ha)</p>
      </div>
      
      {/* Container Grafik dengan Tinggi Pasti */}
      <div className="flex-1 w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              fontWeight="bold"
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Bar 
              dataKey="tertanam" 
              fill="#10b981" 
              radius={[6, 6, 0, 0]} 
              name="Tertanam" 
              barSize={35}
            />
            <Bar 
              dataKey="kosong" 
              fill="#f59e0b" 
              radius={[6, 6, 0, 0]} 
              name="Kosong" 
              barSize={35}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}