"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Clock, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Dashboard from "@/components/Dashboard";

interface ApprovalRequest {
  id: string;
  business_id: string;
  title: string;
  description: string;
  action_type: string;
  reasoning: string;
  confidence_score: number;
  expected_roi: number;
  estimated_upside: string;
  estimated_downside: string;
  risk_level: "low" | "medium" | "high";
  status: string;
  created_at: string;
  businesses?: { name: string; type: string };
}

const riskColors = {
  low: "text-green-400 bg-green-500/10 border-green-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  high: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof);
    let query = supabase
      .from("approval_requests")
      .select("*, businesses(name, type)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setRequests(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    setProcessing(id);
    await supabase.from("approval_requests").update({
      status: action,
      executed_at: action === "approved" ? new Date().toISOString() : null,
    }).eq("id", id);
    await loadData();
    setProcessing(null);
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">Approval Center</h1>
              {pendingCount > 0 && (
                <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </div>
            <p className="text-gray-500">Your AI agents are waiting for your decisions.</p>
          </div>
          <button onClick={loadData} className="text-xs text-gray-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg">
            Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {(["pending", "approved", "rejected", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${filter === f ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <Bot size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-gray-500 font-bold">No {filter === "all" ? "" : filter} requests</p>
            <p className="text-gray-600 text-sm mt-1">
              {filter === "pending" ? "Your agents are working. Check back soon." : "Nothing here yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-2xl border overflow-hidden ${
                    req.status === "pending" ? "border-white/10 bg-white/[0.02]" :
                    req.status === "approved" ? "border-green-500/20 bg-green-500/[0.02]" :
                    "border-red-500/20 bg-red-500/[0.02]"
                  }`}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot size={14} className="text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-bold text-sm">{req.title}</p>
                            {req.risk_level && (
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${riskColors[req.risk_level]}`}>
                                {req.risk_level} risk
                              </span>
                            )}
                            {req.status !== "pending" && (
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${req.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                {req.status}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {req.businesses?.name} · {new Date(req.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">{req.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {req.confidence_score && (
                          <div className="text-center">
                            <p className="text-lg font-bold">{Math.round(req.confidence_score * 100)}%</p>
                            <p className="text-[10px] text-gray-500 uppercase">Confidence</p>
                          </div>
                        )}
                        {req.expected_roi && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-400">+{req.expected_roi}%</p>
                            <p className="text-[10px] text-gray-500 uppercase">Est. ROI</p>
                          </div>
                        )}
                        <button onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                          className="text-gray-500 hover:text-white p-1">
                          {expanded === req.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    {req.status === "pending" && (
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => handleAction(req.id, "approved")} disabled={processing === req.id}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-2">
                          <Check size={14} />
                          {processing === req.id ? "Processing..." : "Approve"}
                        </button>
                        <button onClick={() => handleAction(req.id, "rejected")} disabled={processing === req.id}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-white/10 disabled:opacity-50 flex items-center justify-center gap-2">
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {expanded === req.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 overflow-hidden">
                        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Agent Reasoning</p>
                            <p className="text-sm text-gray-300 leading-relaxed">{req.reasoning}</p>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                              <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp size={12} className="text-green-400" />
                                <p className="text-[10px] text-green-400 uppercase font-bold">Best Case</p>
                              </div>
                              <p className="text-xs text-gray-300">{req.estimated_upside}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                              <div className="flex items-center gap-1.5 mb-1">
                                <AlertTriangle size={12} className="text-red-400" />
                                <p className="text-[10px] text-red-400 uppercase font-bold">Worst Case</p>
                              </div>
                              <p className="text-xs text-gray-300">{req.estimated_downside}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Dashboard>
  );
}