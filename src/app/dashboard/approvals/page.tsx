"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle, XCircle, Loader2, Globe, Eye, ChevronDown, ChevronUp } from "lucide-react";
import Dashboard from "@/components/Dashboard";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [previewBuild, setPreviewBuild] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: prof }, { data: apps }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("approval_requests").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    ]);
    setProfile(prof);
    setApprovals(apps || []);
    setLoading(false);
  };

  const handleApprove = async (approval: any) => {
    setProcessing(approval.id);
    try {
      if (approval.type === "website_review") {
        // Update build status to approved
        const buildId = approval.metadata?.build_id;
        if (buildId) {
          await supabase.from("website_builds").update({ status: "approved" }).eq("id", buildId);
        }
        await supabase.from("approval_requests").update({ status: "approved", executed_at: new Date().toISOString(), user_feedback: "Website approved for deployment." }).eq("id", approval.id);
      } else {
        // Standard action approval
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/execute-action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approval_id: approval.id }),
        });
        const data = await res.json();
        await supabase.from("approval_requests").update({ status: "approved", executed_at: new Date().toISOString(), user_feedback: data.message || "Approved." }).eq("id", approval.id);
      }
      setApprovals(prev => prev.filter(a => a.id !== approval.id));
    } catch (e) {
      console.error(e);
    }
    setProcessing(null);
  };

  const handleReject = async (approval: any) => {
    setProcessing(approval.id);
    await supabase.from("approval_requests").update({ status: "rejected", executed_at: new Date().toISOString(), user_feedback: "Rejected by user." }).eq("id", approval.id);
    setApprovals(prev => prev.filter(a => a.id !== approval.id));
    setProcessing(null);
  };

  const openPreview = async (approval: any) => {
    const buildId = approval.metadata?.build_id;
    if (!buildId) return;
    const { data: build } = await supabase.from("website_builds").select("*").eq("id", buildId).single();
    if (build) setPreviewBuild(build);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-gray-500 mt-1">Review and approve agent actions before they execute.</p>
        </div>

        {approvals.length === 0 ? (
          <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <CheckCircle size={40} className="text-green-500/40 mb-4" />
            <h3 className="font-bold text-lg mb-2">All caught up</h3>
            <p className="text-sm text-gray-500">No pending approvals right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map(approval => (
              <div key={approval.id} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {approval.type === "website_review" && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 uppercase">Website</span>
                      )}
                      <h3 className="font-bold text-base truncate">{approval.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{approval.description}</p>
                    {approval.metadata?.domain && (
                      <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                        <Globe size={12} /> Suggested domain: <span className="text-white font-bold">{approval.metadata.domain}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {approval.type === "website_review" && (
                      <button
                        onClick={() => openPreview(approval)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <Eye size={13} /> Preview
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(approval)}
                      disabled={processing === approval.id}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(approval)}
                      disabled={processing === approval.id}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    >
                      {processing === approval.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                      {approval.type === "website_review" ? "Approve & Deploy" : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Website Preview Modal */}
        {previewBuild && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col" onClick={() => setPreviewBuild(null)}>
            <div className="flex items-center justify-between px-6 py-4 bg-black/90 border-b border-white/10" onClick={e => e.stopPropagation()}>
              <div>
                <h2 className="font-bold">{previewBuild.lead_name}</h2>
                <p className="text-xs text-gray-500">{previewBuild.business_type} &bull; {previewBuild.domain}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {(previewBuild.colors || []).map((c: string, i: number) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <button onClick={() => setPreviewBuild(null)} className="text-gray-500 hover:text-white text-xl">x</button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden" onClick={e => e.stopPropagation()}>
              {previewBuild.generated_html ? (
                <iframe
                  srcDoc={previewBuild.generated_html}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <Loader2 className="animate-spin mr-2" size={20} /> Generating website...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
}
