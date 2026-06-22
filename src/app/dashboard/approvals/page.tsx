'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react';

type ApprovalRequest = {
  id: string;
  title: string;
  description: string;
  reasoning: string;
  risk_level: string;
  confidence_score: number;
  expected_roi: number;
  estimated_upside: string;
  estimated_downside: string;
  status: string;
  created_at: string;
  user_feedback: string;
  business_id: string;
  businesses?: { name: string };
};

const riskColor: Record<string, string> = {
  low: 'text-green-400 bg-green-400/10 border-green-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  high: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function ApprovalsPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    let query = supabase
      .from('approval_requests')
      .select('*, businesses(name)')
      .order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setRequests(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function approve(req: ApprovalRequest) {
    setActing(a => ({ ...a, [req.id]: true }));
    setFeedback(f => ({ ...f, [req.id]: 'Executing...' }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/execute-action`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` },
          body: JSON.stringify({ approval_id: req.id }),
        }
      );
      const data = await res.json();
      const msg = data.message || data.error || 'Done';
      setFeedback(f => ({ ...f, [req.id]: msg }));
      // Keep card visible for 4 seconds so user can read the result
      setTimeout(() => setRequests(r => r.filter(x => x.id !== req.id)), 4000);
    } catch (e) {
      setFeedback(f => ({ ...f, [req.id]: `Error: ${String(e)}` }));
    }
    setActing(a => ({ ...a, [req.id]: false }));
  }

  async function reject(id: string) {
    setActing(a => ({ ...a, [id]: true }));
    await supabase.from('approval_requests').update({ status: 'rejected' }).eq('id', id);
    setRequests(r => r.filter(x => x.id !== id));
    setActing(a => ({ ...a, [id]: false }));
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            Approval Center
            {requests.length > 0 && filter === 'pending' && (
              <span className="text-sm font-bold px-2.5 py-1 bg-white text-black rounded-full">{requests.length} pending</span>
            )}
          </h1>
          <p className="text-gray-500">Your AI agents are waiting for your decisions.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
              filter === tab ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500 gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🤖</div>
          <p className="font-bold mb-1">No {filter === 'all' ? '' : filter} requests</p>
          <p className="text-sm">Your agents are working. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="border border-white/10 rounded-xl bg-white/[0.03] overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-gray-500">
                        {req.businesses?.name || 'Unknown Business'} · {new Date(req.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${riskColor[req.risk_level] || riskColor.low}`}>
                        {req.risk_level} risk
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{req.title}</h3>
                    {req.description && (
                      <p className="text-sm text-gray-400">{req.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 mb-0.5">Confidence</p>
                      <p className="text-sm font-bold">{Math.round((req.confidence_score || 0) * 100)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 mb-0.5">Est. ROI</p>
                      <p className="text-sm font-bold text-green-400">+{req.expected_roi || 0}%</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(e => ({ ...e, [req.id]: !e[req.id] }))}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-white mt-3 transition-colors"
                >
                  {expanded[req.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {expanded[req.id] ? 'Hide' : 'Show'} reasoning
                </button>

                {expanded[req.id] && (
                  <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                    {req.reasoning && (
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Agent Reasoning</p>
                        <p className="text-sm text-gray-300">{req.reasoning}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-400/5 border border-green-400/10 rounded-lg p-3">
                        <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1">Best Case</p>
                        <p className="text-xs text-gray-300">{req.estimated_upside || 'Increased revenue'}</p>
                      </div>
                      <div className="bg-red-400/5 border border-red-400/10 rounded-lg p-3">
                        <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Worst Case</p>
                        <p className="text-xs text-gray-300">{req.estimated_downside || 'Minimal impact'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {feedback[req.id] && (
                  <div className="mt-3 text-xs text-green-400 flex items-center gap-1.5">
                    {acting[req.id] && <Loader2 size={11} className="animate-spin" />}
                    {feedback[req.id]}
                  </div>
                )}

                {req.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => approve(req)}
                      disabled={acting[req.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {acting[req.id] ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                      Approve
                    </button>
                    <button
                      onClick={() => reject(req.id)}
                      disabled={acting[req.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white/5 text-gray-400 text-xs font-bold rounded-lg hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={13} />
                      Reject
                    </button>
                  </div>
                )}

                {req.status === 'approved' && req.user_feedback && (
                  <p className="mt-3 text-xs text-green-400">✓ {req.user_feedback}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
