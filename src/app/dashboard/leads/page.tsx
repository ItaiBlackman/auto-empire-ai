"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Loader2, Mail, Building2, MessageSquare, X, Send } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-yellow-500/10 text-yellow-400",
  qualified: "bg-purple-500/10 text-purple-400",
  converted: "bg-green-500/10 text-green-400",
  interested: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

const ZAPIER_WEBHOOK = "https://hooks.zapier.com/hooks/catch/27543221/4y5sj8q/";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

async function triggerZapier(event: string, data: any) {
  try {
    await fetch(ZAPIER_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, source: "AutoEmpire AI", timestamp: new Date().toISOString(), data }),
      mode: "no-cors",
    });
  } catch (e) {}
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [simulateLead, setSimulateLead] = useState<any | null>(null);
  const [simulateText, setSimulateText] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchLeads();
    const channel = supabase
      .channel("leads-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, async (payload) => {
        const newLead = payload.new;
        setLeads(prev => [newLead, ...prev]);
        await triggerZapier("new_lead", {
          lead_name: newLead.name,
          lead_email: newLead.email,
          lead_company: newLead.company,
          business_id: newLead.business_id,
          notification_email: "itaimanunited@gmail.com",
          message: `New lead: ${newLead.name} just came in!`,
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchLeads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: businesses } = await supabase.from("businesses").select("id").eq("user_id", user.id);
    if (!businesses?.length) { setLoading(false); return; }
    const ids = businesses.map(b => b.id);
    const { data } = await supabase
      .from("leads")
      .select("*, businesses(name)")
      .in("business_id", ids)
      .order("created_at", { ascending: false });
    setLeads(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleSimulate = async () => {
    if (!simulateLead || !simulateText.trim()) return;
    setSimulating(true);
    setSimResult(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/reply-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: simulateLead.id,
          reply_text: simulateText,
          channel: simulateLead.phone ? "whatsapp" : "email",
        }),
      });
      const data = await res.json();
      setSimResult(data);
      // Refresh leads to show status change
      fetchLeads();
    } catch (e) {
      setSimResult({ error: String(e) });
    }
    setSimulating(false);
  };

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
      <Loader2 className="animate-spin text-white/20" size={48} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-gray-500">{leads.length} total leads across all businesses.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "new", "contacted", "interested", "rejected", "converted"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${filter === s ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <Users size={40} className="text-gray-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">No leads yet</h3>
          <p className="text-sm text-gray-500">Your AI agents will add leads here automatically.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Address</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Business</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Test</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                        {lead.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{lead.name}</p>
                        {lead.phone && <p className="text-xs text-gray-500">{lead.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-xs text-gray-400">{lead.address || "—"}</p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-xs text-gray-500">{lead.businesses?.name || "—"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status] || "bg-white/10 text-gray-400"}`}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interested">Interested</option>
                      <option value="rejected">Rejected</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSimulateLead(lead); setSimulateText(""); setSimResult(null); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                    >
                      <MessageSquare size={11} /> Simulate Reply
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Simulate Reply Modal */}
      {simulateLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSimulateLead(null)}>
          <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">Simulate Lead Reply</h3>
                <p className="text-xs text-gray-500 mt-0.5">{simulateLead.name}</p>
              </div>
              <button onClick={() => setSimulateLead(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <p className="text-xs text-gray-500 mb-3">Type what the lead would say, and watch the full agent pipeline fire:</p>

            <div className="flex gap-2 mb-3 flex-wrap">
              {["כן, מעניין אותי!", "Yes, I am interested!", "How much does it cost?", "Not interested thanks", "Maybe, tell me more"].map(t => (
                <button key={t} onClick={() => setSimulateText(t)}
                  className="px-2 py-1 text-[10px] font-bold rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors">
                  {t}
                </button>
              ))}
            </div>

            <textarea
              value={simulateText}
              onChange={e => setSimulateText(e.target.value)}
              rows={3}
              placeholder="Type the lead's reply..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-white/20 mb-4"
              dir="auto"
            />

            <button
              onClick={handleSimulate}
              disabled={simulating || !simulateText.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {simulating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {simulating ? "Running pipeline..." : "Fire Reply Agent"}
            </button>

            {simResult && (
              <div className={`mt-4 p-4 rounded-xl text-xs ${simResult.error ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 border border-white/10"}`}>
                {simResult.error ? (
                  <p>{simResult.error}</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${simResult.intent === "yes" ? "bg-green-500/20 text-green-400" : simResult.intent === "no" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {simResult.intent?.toUpperCase()}
                      </span>
                      <span className="text-gray-400">{simResult.sentiment}</span>
                      {simResult.pipeline_triggered && <span className="text-purple-400 font-bold">Pipeline triggered!</span>}
                    </div>
                    {simResult.reply_message && (
                      <div className="mt-2">
                        <p className="text-gray-500 mb-1">Agent replied:</p>
                        <p className="text-white whitespace-pre-wrap" dir="auto">{simResult.reply_message}</p>
                      </div>
                    )}
                    {simResult.pipeline_triggered && (
                      <p className="text-purple-400 mt-2">Research + website generation started. Check Approvals tab in ~30 seconds.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
