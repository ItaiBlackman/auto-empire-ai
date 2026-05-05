"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TrendingUp, Loader2, DollarSign, ArrowUpRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default function RevenuePage() {
  const [profile, setProfile] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const [{ data: prof }, { data: biz }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(prof);
      setBusinesses(biz || []);
      setLoading(false);
    })();
  }, []);

  const parseRevenue = (r: any) => parseFloat((r || "$0").toString().replace(/[^0-9.]/g, "")) || 0;
  const totalRevenue = businesses.reduce((sum, b) => sum + parseRevenue(b.revenue), 0);
  const maxRevenue = Math.max(...businesses.map(b => parseRevenue(b.revenue)), 1);

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

        {/* Top stat cards */}
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

        {/* Bar chart */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] mb-6">
          <h2 className="font-bold mb-6 flex items-center gap-2"><BarChart3 size={16} /> Revenue by Business</h2>
          {businesses.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-sm">No businesses yet</div>
          ) : (
            <div className="space-y-4">
              {businesses.map((bus, i) => {
                const rev = parseRevenue(bus.revenue);
                const pct = (rev / maxRevenue) * 100;
                return (
                  <motion.div key={bus.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
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
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Business breakdown table */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
          <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={16} /> Business Breakdown</h2>
          <div className="overflow-x-auto">
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
      </div>
    </Dashboard>
  );
}