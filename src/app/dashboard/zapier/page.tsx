"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Zap, Plus, Trash2, Loader2, Check, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";

const ALL_EVENTS = [
  { id: "new_lead", label: "New Lead", desc: "Fires when a new lead is captured" },
  { id: "new_business", label: "New Business", desc: "Fires when a business is created" },
  { id: "revenue_update", label: "Revenue Update", desc: "Fires when revenue changes" },
  { id: "agent_activity", label: "AI Agent Activity", desc: "Fires when an AI agent takes action" },
  { id: "task_complete", label: "Task Completed", desc: "Fires when a task is marked done" },
];

export default function ZapierPage() {
  const [profile, setProfile] = useState<any>(null);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [tested, setTested] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const [{ data: prof }, { data: hooks }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("webhooks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(prof);
      setWebhooks(hooks || []);
      setLoading(false);
    })();
  }, []);

  const addWebhook = async () => {
    if (!name || !url || selectedEvents.length === 0) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from("webhooks").insert({
      user_id: user!.id, name, url, events: selectedEvents, active: true
    }).select().single();
    if (data) setWebhooks(prev => [data, ...prev]);
    setName(""); setUrl(""); setSelectedEvents([]); setShowForm(false);
    setSaving(false);
  };

  const deleteWebhook = async (id: string) => {
    await supabase.from("webhooks").delete().eq("id", id);
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const toggleWebhook = async (id: string, active: boolean) => {
    await supabase.from("webhooks").update({ active: !active }).eq("id", id);
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !active } : w));
  };

  const testWebhook = async (webhook: any) => {
    setTesting(webhook.id);
    try {
      await fetch(webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "test",
          source: "AutoEmpire AI",
          timestamp: new Date().toISOString(),
          data: { message: "Test webhook from AutoEmpire AI", business: "Test Business", lead: "Test Lead" }
        }),
        mode: "no-cors"
      });
      setTested(webhook.id);
      setTimeout(() => setTested(null), 3000);
    } catch (e) {}
    setTesting(null);
  };

  const toggleEvent = (id: string) => {
    setSelectedEvents(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  if (loading) return (
    <Dashboard profile={profile}>
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    </Dashboard>
  );

  return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Zap size={28} className="text-orange-400" /> Zapier Webhooks
            </h1>
            <p className="text-gray-500 mt-1">Connect AutoEmpire to 6,000+ apps via Zapier.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
            <Plus size={16} /> Add Webhook
          </button>
        </div>

        {/* How it works */}
        <div className="p-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 mb-8">
          <p className="text-sm font-bold text-orange-400 mb-2">How it works</p>
          <p className="text-xs text-gray-400 mb-3">1. Go to <a href="https://zapier.com" target="_blank" rel="noreferrer" className="text-orange-400 underline">zapier.com</a> and create a new Zap</p>
          <p className="text-xs text-gray-400 mb-3">2. Choose "Webhooks by Zapier" as the trigger → "Catch Hook"</p>
          <p className="text-xs text-gray-400 mb-3">3. Copy the webhook URL Zapier gives you and paste it below</p>
          <p className="text-xs text-gray-400">4. Choose which AutoEmpire events should trigger it — then connect any app (Slack, Gmail, HubSpot, etc.) as the action</p>
        </div>

        {/* Add webhook form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] mb-6">
            <h2 className="font-bold mb-5">New Webhook</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Webhook Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Notify Slack on new lead"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Zapier Webhook URL</label>
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors font-mono" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-3">Trigger Events</label>
                <div className="space-y-2">
                  {ALL_EVENTS.map(event => (
                    <div key={event.id} onClick={() => toggleEvent(event.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${selectedEvents.includes(event.id) ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/5'}`}>
                      <div>
                        <p className="text-sm font-bold">{event.label}</p>
                        <p className="text-xs text-gray-500">{event.desc}</p>
                      </div>
                      {selectedEvents.includes(event.id) && <Check size={16} className="text-green-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addWebhook} disabled={saving || !name || !url || selectedEvents.length === 0}
                  className="flex-1 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-40">
                  {saving ? "Saving..." : "Save Webhook"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-white/10 text-sm font-bold rounded-xl hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Webhook list */}
        {webhooks.length === 0 && !showForm ? (
          <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <Zap size={40} className="text-gray-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">No webhooks yet</h3>
            <p className="text-sm text-gray-500 mb-6">Add your first Zapier webhook to start automating.</p>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
              <Plus size={16} /> Add Webhook
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooks.map((webhook, i) => (
              <motion.div key={webhook.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${webhook.active ? 'bg-green-500' : 'bg-gray-600'}`} />
                    <div>
                      <p className="font-bold">{webhook.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5 truncate max-w-xs">{webhook.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => testWebhook(webhook)} disabled={testing === webhook.id}
                      className="px-3 py-1.5 text-xs font-bold border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1">
                      {testing === webhook.id ? <Loader2 size={12} className="animate-spin" /> : tested === webhook.id ? <><Check size={12} className="text-green-400" /> Sent!</> : "Test"}
                    </button>
                    <button onClick={() => toggleWebhook(webhook.id, webhook.active)}
                      className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors ${webhook.active ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>
                      {webhook.active ? "Active" : "Paused"}
                    </button>
                    <button onClick={() => deleteWebhook(webhook.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {webhook.events?.map((e: string) => (
                    <span key={e} className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {e.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Dashboard>
  );
}