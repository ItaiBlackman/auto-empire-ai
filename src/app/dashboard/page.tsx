"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { Plus, ArrowUpRight, TrendingUp, Loader2, Bot, Zap, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "@/components/Dashboard";

function DashboardContent() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [genStatus, setGenStatus] = useState("Initializing AI Agents...");
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptParam = searchParams.get("prompt");

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      const statsRes = await fetch("/api/dashboard/stats");
      if (statsRes.ok) { const data = await statsRes.json(); setStats(data.stats || []); setBusinesses(data.businesses || []); }
      const activitiesRes = await fetch("/api/activities");
      if (activitiesRes.ok) { const data = await activitiesRes.json(); setActivities(data || []); }
    }
    setLoading(false);
  }, [supabase]);

  const handleGenerateBusiness = useCallback(async (p: string) => {
    setIsGenerating(true);
    const statuses = ["Brainstorming Brand Name...","Designing Logo & Website...","Drafting Outreach Scripts...","Configuring AI Sales Manager...","Setting up CRM Dashboard...","Finding First 100 Leads..."];
    let i = 0;
    const t = setInterval(() => { if (i < statuses.length) { setGenStatus(statuses[i]); i++; } }, 3000);
    try {
      const res = await fetch("/api/generate-business", { method: "POST", body: JSON.stringify({ prompt: p }), headers: { "Content-Type": "application/json" } });
      if (res.ok) { setGenStatus("Empire Ready!"); await new Promise(r => setTimeout(r, 1500)); await fetchData(); router.replace("/dashboard"); }
      else throw new Error();
    } catch { alert("Something went wrong."); }
    finally { clearInterval(t); setIsGenerating(false); }
  }, [fetchData, router]);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 30000); return () => clearInterval(t); }, [fetchData]);
  useEffect(() => { if (promptParam && !isGenerating && !loading) handleGenerateBusiness(promptParam); }, [promptParam, isGenerating, loading]);

  return (
    <Dashboard profile={profile}>
      <AnimatePresence>
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-6 text-center">
            <Bot size={80} className="text-white animate-pulse mb-8" />
            <h2 className="text-4xl font-bold mb-4 italic uppercase">Building Your Empire</h2>
            <p className="text-gray-400 font-mono text-sm uppercase">{genStatus}</p>
            <div className="mt-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-white" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 20 }} /></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div><h1 className="text-3xl font-bold">Empire Overview</h1><p className="text-gray-500">Welcome back, {profile?.full_name || 'Emperor'}.</p></div>
          <button onClick={() => setShowNewModal(true)} className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-200 w-fit"><Plus size={16} /> New Business</button>
        </div>
        <AnimatePresence>
          {showNewModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-6" onClick={() => setShowNewModal(false)}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2">Launch New Business</h2>
                <p className="text-gray-500 mb-6 text-sm">Pick a niche and let the AI build your empire.</p>
                <textarea autoFocus placeholder="e.g. A content marketing agency..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none min-h-[100px] resize-none mb-4" value={newPrompt} onChange={e => setNewPrompt(e.target.value)} />
                <div className="flex gap-3">
                  <button onClick={() => setShowNewModal(false)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5">Cancel</button>
                  <button disabled={!newPrompt} onClick={() => { setShowNewModal(false); handleGenerateBusiness(newPrompt); setNewPrompt(""); }} className="flex-[2] py-3 rounded-xl font-bold text-sm bg-white text-black disabled:opacity-50">Launch Business</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.length > 0 ? stats.map((s, i) => <StatCard key={i} title={s.title} value={s.value} change={s.change} />) : <>
            <StatCard title="Total Revenue" value="$0" change="0%" />
            <StatCard title="Active Businesses" value="0" change="0" />
            <StatCard title="Total Leads" value="0" change="0" />
            <StatCard title="Messages Sent" value="0" change="0" />
          </>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Zap size={20} className="text-gray-400" /> Active Businesses</h2>
            {businesses.length > 0 ? businesses.map((b, i) => <BusinessItem key={b.id} name={b.name} status={b.status === 'active' ? 'Running' : 'Creating'} leads={String(b.leads)} revenue={b.revenue} />) : (
              <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center">
                <TrendingUp size={24} className="text-gray-500 mb-4 mx-auto" />
                <h3 className="font-bold mb-1">No businesses yet</h3>
                <p className="text-sm text-gray-500 mb-6">Launch your first AI business.</p>
                <button onClick={() => setShowNewModal(true)} className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold">Create Business</button>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Live AI Agents</h2>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              {activities.length > 0 ? activities.slice(0, 8).map(a => <AgentStatus key={a.id} name={a.agent_name} action={a.action} time={new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />) : <p className="text-sm text-gray-500 text-center py-12">No active agents.</p>}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-screen bg-black"><Loader2 className="animate-spin text-white/20" size={48} /></div>}><DashboardContent /></Suspense>;
}

const StatCard = ({ title, value, change }: { title: string, value: string, change: string }) => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
    <p className="text-xs text-gray-500 mb-2 uppercase">{title}</p>
    <div className="flex items-end justify-between"><h3 className="text-2xl font-bold">{value}</h3><span className="text-xs text-green-500 font-bold flex items-center">{change}<ArrowUpRight size={12} /></span></div>
  </div>
);

const BusinessItem = ({ name, status, leads, revenue }: { name: string, status: string, leads: string, revenue: string }) => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><TrendingUp size={18} className="text-gray-400" /></div>
      <div><h4 className="font-bold">{name}</h4><span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${status === 'Running' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{status}</span></div>
    </div>
    <div className="flex items-center gap-8">
      <div className="text-right hidden sm:block"><p className="text-[10px] text-gray-500 uppercase">Leads</p><p className="font-bold">{leads}</p></div>
      <div className="text-right hidden sm:block"><p className="text-[10px] text-gray-500 uppercase">Revenue</p><p className="font-bold text-green-400">{revenue}</p></div>
      <ChevronRight size={18} className="text-gray-500 group-hover:text-white" />
    </div>
  </div>
);

const AgentStatus = ({ name, action, time }: { name: string, action: string, time: string }) => (
  <div className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0"><Bot size={16} className="text-gray-400" /></div>
    <div className="text-sm"><p className="font-bold mb-0.5">{name}</p><p className="text-gray-400 text-xs">{action}</p><p className="text-[10px] text-gray-600 mt-1 font-mono">{time}</p></div>
  </div>
);