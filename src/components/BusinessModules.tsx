"use client";

import React from "react";
import { 
  TrendingUp, Home, Play, Layout, Gamepad2, 
  UserPlus, ShieldCheck, FileText, Music, 
  PieChart, Layers, Globe, Activity, Search,
  Zap, DollarSign, Users, BarChart3, Clock
} from "lucide-react";

export const HedgeFundModule = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><PieChart size={18} className="text-green-400" /> Portfolio Allocation</h3>
      <div className="space-y-4">
        {[
          { asset: "BTC/USD", weight: "42%", profit: "+12.4%", color: "bg-orange-500" },
          { asset: "NVDA", weight: "28%", profit: "+8.2%", color: "bg-green-500" },
          { asset: "TSLA Options", weight: "15%", profit: "-2.1%", color: "bg-red-500" },
          { asset: "Cash (USDT)", weight: "15%", profit: "0.0%", color: "bg-gray-500" },
        ].map(item => (
          <div key={item.asset}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-bold">{item.asset}</span>
              <span className={item.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{item.profit}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${item.color}`} style={{ width: item.weight }} />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-400" /> AI Trading Signals</h3>
      <div className="space-y-3">
        {[
          { pair: "ETH/USD", signal: "STRONG BUY", confidence: "94%", time: "2m ago" },
          { pair: "SPY 450C", signal: "SCALPING", confidence: "82%", time: "15m ago" },
          { pair: "AAPL", signal: "HOLD", confidence: "71%", time: "1h ago" },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-400">{s.signal}</p>
              <p className="text-sm font-bold">{s.pair}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold">{s.confidence}</p>
              <p className="text-[10px] text-gray-500">{s.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const YouTubeModule = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Play size={18} className="text-red-500" /> Channel Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Views", value: "1.2M", sub: "+14%" },
          { label: "Subscribers", value: "42.8K", sub: "+2.1K" },
          { label: "Watch Time", value: "85K hrs", sub: "+8%" },
          { label: "Revenue", value: "$8,420", sub: "+12%" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-gray-500 uppercase font-bold">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-[10px] text-green-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Play size={18} className="text-white" /> Production Pipeline</h3>
      <div className="space-y-3">
        {[
          { title: "Top 10 AI Tools 2026", status: "Rendering", progress: 85 },
          { title: "Future of Neuralink", status: "Scripting", progress: 40 },
          { title: "Tesla Bot Update", status: "Researching", progress: 15 },
        ].map((v, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-bold truncate">{v.title}</span>
              <span className="text-gray-500">{v.status}</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${v.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AppFactoryModule = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Layout size={18} className="text-purple-400" /> Active Portfolio</h3>
      <div className="space-y-3">
        {[
          { name: "MindFlow AI", users: "12.5K", mrr: "$2.4K", status: "Healthy" },
          { name: "TaskMaster Pro", users: "8.2K", mrr: "$1.8K", status: "Scaling" },
          { name: "ZenGarden", users: "4.1K", mrr: "$950", status: "Updating" },
        ].map((app, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{app.name}</p>
              <p className="text-[10px] text-gray-500">{app.users} users</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-400">{app.mrr}</p>
              <p className="text-[9px] uppercase font-black text-purple-400">{app.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-purple-400" /> User Analytics</h3>
      <div className="h-40 flex items-end justify-between gap-2 px-2">
        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
          <div key={i} className="flex-1 bg-purple-500/20 rounded-t-lg relative group">
            <div className="absolute inset-0 bg-purple-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }} />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
              {h}k
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-[10px] text-gray-600 font-bold px-1">
        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
      </div>
    </div>
  </div>
);

export const MediaNetworkModule = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-orange-400" /> Traffic & SEO</h3>
      <div className="space-y-4">
        {[
          { site: "TechPulse.ai", traffic: "240K", seo: "84/100", change: "+12%" },
          { site: "FutureFinance.io", traffic: "185K", seo: "91/100", change: "+5%" },
          { site: "EcoLife.news", traffic: "92K", seo: "76/100", change: "-2%" },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{s.site}</p>
              <p className="text-[10px] text-gray-500">SEO Score: {s.seo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{s.traffic}</p>
              <p className={`text-[10px] font-bold ${s.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{s.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
      <h3 className="font-bold mb-4 flex items-center gap-2"><FileText size={18} className="text-orange-400" /> Content Engine</h3>
      <div className="space-y-3">
        {[
          { topic: "AI Regulations 2026", status: "Published", reach: "12K" },
          { topic: "Quantum Computing Stocks", status: "Published", reach: "45K" },
          { topic: "Sustainable Cities", status: "In Review", reach: "---" },
        ].map((c, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <p className="text-xs font-bold truncate max-w-[140px]">{c.topic}</p>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase text-gray-500">{c.status}</span>
              <span className="text-xs font-bold text-orange-400">{c.reach}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
