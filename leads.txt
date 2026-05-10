"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Loader2, Mail, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-yellow-500/10 text-yellow-400",
  qualified: "bg-purple-500/10 text-purple-400",
  converted: "bg-green-500/10 text-green-400",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id);

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
        <div className="flex gap-2">
          {["all", "new", "contacted", "qualified", "converted"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${filter === s ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
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
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Company</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Business</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                        {lead.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{lead.name}</p>
                        {lead.email && <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} />{lead.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-400 flex items-center gap-1"><Building2 size={12} />{lead.company || '—'}</p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-xs text-gray-500">{lead.businesses?.name || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status] || 'bg-white/10 text-gray-400'} bg-opacity-100`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
