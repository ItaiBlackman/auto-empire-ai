"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TrendingUp, Users, MessageSquare, CheckSquare, ArrowUpRight, Loader2, Bot, Plus, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default function OverviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ revenue: 0, businesses: 0, leads: 0, messages: 0 });
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const [{ data: prof }, { data: biz }, { data: leads }, { data: msgs }, { data: acts }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("businesses").select("*").eq("user_id", user.id),
      supabase.from("leads").select("id").eq("user_id", user.id),
      supabase.from("messages").select("id").eq("user_id", user.id),
      supabase.from("activities").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    ]);
    setProfile(prof);
    setBusinesses(biz || []);
    setActivities(acts || []);
    const totalRevenue = (biz || []).reduce((sum: number, b: any) => {
      const rev = parseFloat((b.revenue || "$0").replace(/[^0-9.]/g, "")) || 0;
      return sum + rev;
    }, 0);
    setStats({ revenue: totalRevenue, businesses: (biz || []).length, leads: (leads || []).length, messages: (msgs || []).length });
    setLoading(false);
  };

  if (loading) return (
    <Dashboard profile={profile}>
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    </Dashboard>
  );

  const statCards = [
    { label: "TOTAL REVENUE", value: `$${stats.revenue.toLocaleString()}`, change: "+100%", icon: <TrendingUp size={16} />, href: "/dashboard/revenue" },
    { label: "ACTIVE BUSINESSES", value: stats.businesses, change: `+${stats.businesses}`, icon: <TrendingUp size={16} />, href: "/dashboard/businesses" },
    { label: "TOTAL LEADS", value: stats.leads, change: `+${stats.leads}`, icon: <Users size={16} />, href: "/dashboard/leads" },
    { label: "MESSAGES SENT", value: stats.messages.toLocaleString(), change: `+${stats.messages}`, icon: <MessageSquare size={16} />, href: "/dashboard/messages" },
  ];

  const scrollToUpgrade = () => {
    const el = document.getElementById('upgrade-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empire Overview</h1>
            <p className="text-gray-500">Welcome back, {profile?.full_name}. Your AI agents are hard at work.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={scrollToUpgrade}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              <Zap size={16} className="text-yellow-400" /> Upgrade
            </button>
            <button onClick={() => router.push("/onboarding")} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
              <Plus size={16} /> New Business
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => router.push(card.href)}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">{card.change} <ArrowUpRight size={12} /></p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold mb-4 flex items-center gap-2"><Zap size={16} /> Active Businesses</h2>
            <div className="space-y-3">
              {businesses.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center text-gray-500 text-sm">No businesses yet</div>
              ) : businesses.map((bus) => (
                <div key={bus.id} onClick={() => router.push(`/dashboard/businesses/${bus.id}`)}
                  className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <TrendingUp size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{bus.name}</p>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${bus.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {bus.status === 'active' ? 'Running' : 'Creating'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Leads</p><p className="font-bold text-sm">{bus.leads || 0}</p></div>
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Revenue</p><p className="font-bold text-sm text-green-400">{bus.revenue || '$0'}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-4 flex items-center gap-2"><Bot size={16} /> Live AI Agents</h2>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center text-gray-500 text-sm">No activity yet</div>
              ) : activities.map((a) => (
                <div key={a.id} className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{a.agent_name}</p>
                    <p className="text-xs text-gray-400 truncate">{a.action}</p>
                  </div>
                  <p className="text-[10px] text-gray-600 shrink-0">{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
        <div id="upgrade-section" className="mt-20 p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Scale your Empire.</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Unlock unlimited AI agents, advanced business templates, and priority lead generation. 
              Our Pro and Unlimited plans are designed to help you scale from one business to an entire empire.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => router.push("/pricing")}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
              >
                View Pricing
              </button>
              <button 
                onClick={() => router.push("/dashboard/settings")}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
              >
                Manage Billing
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
        </div>
      </div>
    </Dashboard>
  );
}