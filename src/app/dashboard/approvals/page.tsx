"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle, XCircle, Loader2, Globe, Eye, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import Dashboard from "@/components/Dashboard";

export default function ApprovalsPage() {
  const [approvalsByBusiness, setApprovalsByBusiness] = useState<Record<string, { business: any; approvals: any[] }>>({});
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: prof }, { data: apps }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("approval_requests")
        .select("*, businesses(id, name)")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
    ]);
    setProfile(prof);

    // Group by business
    const grouped: Record<string, { business: any; approvals: any[] }> = {};
    for (const app of (apps || [])) {
      const bizId = app.business_id;
      if (!grouped[bizId]) {
        grouped[bizId] = { business: app.businesses, approvals: [] };
      }
      grouped[bizId].approvals.push(app);
    }
    setApprovalsByBusiness(grouped);
    setLoading(false);
  };

  const handleApprove = async (approval: any) => {
    setProcessing(approval.id);
    try {
      if (approval.type === "website_review") {
        const buildId = approval.metadata?.build_id;
        if (buildId) {
          await supabase.from("website_builds").update({ status: "approved" }).eq("id", buildId);
        }
        await supabase.from("approval_requests").update({
          status: "approved",
          executed_at: new Date().toISOString(),
          user_feedback: "Website approved for deployment.",
        }).eq("id", approval.id);
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/execute-action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approval_id: approval.id }),
        });
        const data = await res.json();
        await supabase.from("approval_requests").update({
          status: "approved",
          executed_at: new Date().toISOString(),
          user_feedback: data.message || "Approved.",
        }).eq("id", approval.id);
      }
      removeApproval(approval.id, approval.business_id);
    } catch (e) { console.error(e); }
    setProcessing(null);
  };

  const handleReject = async (approval: any) => {
    setProcessing(approval.id);
    await supabase.from("approval_requests").update({
      status: "rejected",
      executed_at: new Date().toISOString(),
      user_feedback: "Rejected by user.",
    }).eq("id", approval.id);
    removeApproval(approval.id, approval.business_id);
    setProcessing(null);
  };

  const removeApproval = (approvalId: string, bizId: string) => {
    setApprovalsByBusiness(prev => {
      const updated = { ...prev };
      if (updated[bizId]) {
        updated[bizId] = {
          ...updated[bizId],
          approvals: updated[bizId].approvals.filter(a => a.id !== approvalId),
        };
        if (updated[bizId].approvals.length === 0) delete updated[bizId];
      }
      return updated;
    });
  };

  const openPreview = async (approval: any) => {
    const buildId = approval.metadata?.build_id;
    if (!buildId) return;
    const { data: build } = await supabase.from("website_builds").select("generated_html").eq("id", buildId).single();
    if (build?.generated_html) {
      const blob = new Blob([build.generated_html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const toggleCollapse = (bizId: string) => {
    setCollapsed(prev => ({ ...prev, [bizId]: !prev[bizId] }));
  };

  const totalApprovals = Object.values(approvalsByBusiness).reduce((sum, b) => sum + b.approvals.length, 0);

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
          <p className="text-gray-500 mt-1">
            {totalApprovals === 0 ? "No pending approvals." : `${totalApprovals} pending approval${totalApprovals !== 1 ? "s" : ""} across ${Object.keys(approvalsByBusiness).length} business${Object.keys(approvalsByBusiness).length !== 1 ? "es" : ""}.`}
          </p>
        </div>

        {totalApprovals === 0 ? (
          <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <CheckCircle size={40} className="text-green-500/40 mb-4" />
            <h3 className="font-bold text-lg mb-2">All caught up</h3>
            <p className="text-sm text-gray-500">No pending approvals right now.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(approvalsByBusiness).map(([bizId, { business, approvals }]) => (
              <div key={bizId} className="rounded-2xl border border-white/10 overflow-hidden">
                {/* Business header */}
                <button
                  onClick={() => toggleCollapse(bizId)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                      <TrendingUp size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">{business?.name || "Unknown Business"}</p>
                      <p className="text-xs text-gray-500">{approvals.length} pending approval{approvals.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  {collapsed[bizId] ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronUp size={16} className="text-gray-500" />}
                </button>

                {/* Approvals list */}
                {!collapsed[bizId] && (
                  <div className="divide-y divide-white/5">
                    {approvals.map(approval => (
                      <div key={approval.id} className="px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {approval.type === "website_review" && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 uppercase shrink-0">Website</span>
                              )}
                              <h3 className="font-bold text-sm truncate">{approval.title}</h3>
                            </div>
                            <p className="text-xs text-gray-400 mb-3">{approval.description}</p>
                            {approval.metadata?.domain && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Globe size={11} /> <span className="text-white font-bold">{approval.metadata.domain}</span>
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                            {approval.type === "website_review" && (
                              <button
                                onClick={() => openPreview(approval)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                              >
                                <Eye size={12} /> Preview
                              </button>
                            )}
                            <button
                              onClick={() => handleReject(approval)}
                              disabled={processing === approval.id}
                              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                            <button
                              onClick={() => handleApprove(approval)}
                              disabled={processing === approval.id}
                              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                            >
                              {processing === approval.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              {approval.type === "website_review" ? "Approve & Deploy" : "Approve"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Dashboard>
  );
}

