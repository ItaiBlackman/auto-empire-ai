"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TrendingUp, Plus, ChevronRight, Loader2, Bot, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setBusinesses(data || []);
    setLoading(false);
  };

  const openBusiness = async (bus: any) => {
    setSelected(bus);
    const [{ data: t }, { data: a }] = await Promise.all([
      supabase.from("business_tasks").select("*").eq("business_id", bus.id).order("due_date"),
      supabase.from("activities").select("*").eq("business_id", bus.id).order("created_at", { ascending: false }).limit(10),
    ]);
    setTasks(t || []);
    setActivities(a || []);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
      <Loader2 className="animate-spin text-white/20" size={48} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
          <p className="text-gray-500">Manage your AI-powered empire.</p>
        </div>
      </div>

      {businesses.length === 0 ? (
        <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <TrendingUp size={40} className="text-gray-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">No businesses yet</h3>
          <p className="text-sm text-gray-500">Go to Overview and click + New Business to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {businesses.map((bus, i) => (
            <motion.div
              key={bus.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => openBusiness(bus)}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{bus.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{bus.description}</p>
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full mt-1 inline-block ${bus.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {bus.status === 'active' ? 'Running' : 'Creating'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Leads</p>
                  <p className="font-bold">{bus.leads || 0}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Revenue</p>
                  <p className="font-bold text-green-400">{bus.revenue || '$0'}</p>
                </div>
                <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selected.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{selected.description}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Leads", value: selected.leads || 0 },
                { label: "Revenue", value: selected.revenue || '$0' },
                { label: "Status", value: selected.status === 'active' ? 'Running' : 'Creating' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">{s.label}</p>
                  <p className="font-bold text-lg">{s.value}</p>
                </div>
              ))}
            </div>

            {tasks.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Zap size={16} /> Tasks</h3>
                <div className="space-y-2">
                  {tasks.map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className={`w-2 h-2 rounded-full ${t.status === 'done' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <p className="text-sm">{t.title}</p>
                      <p className="text-xs text-gray-500 ml-auto">{new Date(t.due_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activities.length > 0 && (
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2"><Bot size={16} /> Recent Activity</h3>
                <div className="space-y-3">
                  {activities.map(a => (
                    <div key={a.id} className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1.5" />
                      <div>
                        <p className="text-xs font-bold">{a.agent_name}</p>
                        <p className="text-xs text-gray-400">{a.action}</p>
                      </div>
                      <p className="text-[10px] text-gray-600 ml-auto">{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
