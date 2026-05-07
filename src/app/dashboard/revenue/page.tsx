"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TrendingUp, Loader2, DollarSign, BarChart3, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default function RevenuePage() {
  const [profile, setProfile] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const [{ data: prof }, { data: biz }, { data: hist }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("revenue_history").select("*").eq("user_id", user.id).order("date", { ascending: true }),
      ]);
      setProfile(prof);
      setBusinesses(biz || []);
      setHistory(hist || []);
      setLoading(false);
    })();
  }, []);

  const parseRevenue = (r: any) => parseFloat((r || "$0").toString().replace(/[^0-9.]/g, "")) || 0;
  const totalRevenue = businesses.reduce((sum, b) => sum + parseRevenue(b.revenue), 0);
  const maxRevenue = Math.max(...businesses.map(b => parseRevenue(b.revenue)), 1);

  const chartData = history.length > 0
    ? (() => {
        const grouped: Record<string, number> = {};
        history.forEach(h => {
          const d = h.date?.slice(0, 7);
          if (d) grouped[d] = (grouped[d] || 0) + (h.amount || 0);
        });
        return Object.entries(grouped).map(([month, amount]) => ({ label: month, amount }));
      })()
    : businesses.map(b => ({ label: b.name, amount: parseRevenue(b.revenue) }));

  const maxChart = Math.max(...chartData.map(d => d.amount), 1);

  if (loading) return (
    <Dashboard profile={profile}>
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    </Dashboard>
  );

  return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
          <p className="text-gray-500">Track earnings across all your AI businesses.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: "text-green-400" },
            { label: "Active Businesses", value: businesses.filter(b => b.status === "active").length, icon: <TrendingUp size={18} />, color: "text-white" },
            { label: "Avg Per Business", value: businesses.length ? `$${(totalRevenue / businesses.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "$0", icon: <BarChart3 size={18} />, color: "text-white" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-gray-500 mb-3">{s.icon}<p className="text-xs uppercase font-bold">{s.label}</p></div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] mb-6">
          <h2 className="font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={16} /> {history.length > 0 ? "Revenue Over Time" : "Revenue by Business"}
          </h2>
          {chartData.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-sm">No data yet</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${Math.max(chartData.length * 80, 400)} 200`} className="w-full" style={{ minHeight: 200 }}>
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                  <line key={i} x1="40" y1={20 + (1 - t) * 140} x2={Math.max(chartData.length * 80, 400) - 20} y2={20 + (1 - t) * 140}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {[0, 0.5, 1].map((t, i) => (
                  <text key={i} x="35" y={20 + (1 - t) * 140 + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">
                    ${(maxChart * t).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </text>
                ))}
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${chartData.map((d, i) => `${40 + i * 80},${20 + (1 - d.amount / maxChart) * 140}`).join(" L ")} L ${40 + (chartData.length - 1) * 80} 160 L 40 160 Z`}
                  fill="url(#areaGrad)" />
                <polyline
                  points={chartData.map((d, i) => `${40 + i * 80},${20 + (1 - d.amount / maxChart) * 140}`).join(" ")}
                  fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {chartData.map((d, i) => (
                  <g key={i}>
                    <circle cx={40 + i * 80} cy={20 + (1 - d.amount / maxChart) * 140} r="4" fill="#22c55e" />
                    <text x={40 + i * 80} y="190" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">
                      {d.label.length > 8 ? d.label.slice(0, 8) + "…" : d.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] mb-6">
          <h2 className="font-bold mb-6 flex items-center gap-2"><TrendingUp size={16} /> Revenue by Business</h2>
          {businesses.map((bus, i) => {
            const rev = parseRevenue(bus.revenue);
            const pct = (rev / maxRevenue) * 100;
            return (
              <motion.div key={bus.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{bus.name}</span>
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${bus.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {bus.status === 'active' ? 'Running' : 'Creating'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 font-bold text-sm">
                    {bus.revenue || '$0'} <ArrowUpRight size={14} />
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
          <h2 className="font-bold mb-4">Business Breakdown</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-3 text-xs text-gray-500 uppercase font-bold">Business</th>
                <th className="pb-3 text-xs text-gray-500 uppercase font-bold">Status</th>
                <th className="pb-3 text-xs text-gray-500 uppercase font-bold text-right">Leads</th>
                <th className="pb-3 text-xs text-gray-500 uppercase font-bold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {businesses.map(bus => (
                <tr key={bus.id} onClick={() => router.push("/dashboard/businesses")}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="py-3 font-bold">{bus.name}</td>
                  <td className="py-3">
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${bus.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {bus.status === 'active' ? 'Running' : 'Creating'}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-400">{bus.leads || 0}</td>
                  <td className="py-3 text-right font-bold text-green-400">{bus.revenue || '$0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dashboard>
  );
}