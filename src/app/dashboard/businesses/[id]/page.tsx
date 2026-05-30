"use client";

import React, { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  TrendingUp, ChevronLeft, Loader2, Bot, Zap, 
  Settings, MessageCircle, BarChart3, Clock,
  DollarSign, Globe, PieChart, Layers, Share2,
  ExternalLink, Play, Pause, RefreshCcw, Search, Bell, Users, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { 
  StatCard, AIControlCenter, LiveFeed, MetricWidget 
} from "@/components/AIOperatingSystem";
import { 
  HedgeFundModule, YouTubeModule, AppFactoryModule, MediaNetworkModule 
} from "@/components/BusinessModules";

export default function BusinessDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [business, setBusiness] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const [{ data: biz }, { data: prof }] = await Promise.all([
      supabase.from("businesses").select("*").eq("id", id).single(),
      supabase.from("profiles").select("*").eq("id", user.id).single(),
    ]);

    setBusiness(biz);
    setProfile(prof);
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-center">
        <Loader2 className="animate-spin text-white/20 mx-auto mb-4" size={48} />
        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Initializing AI OS...</p>
      </div>
    </div>
  );

  if (!business) return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Business not found</h2>
        <button onClick={() => router.push("/dashboard/businesses")} className="px-6 py-2 bg-white text-black rounded-full font-bold">
          Back to Empire
        </button>
      </div>
    </div>
  );

  const renderBusinessModule = () => {
    const name = business.name.toLowerCase();
    if (name.includes("hedge") || name.includes("fund")) return <HedgeFundModule />;
    if (name.includes("youtube") || name.includes("video")) return <YouTubeModule />;
    if (name.includes("app") || name.includes("factory")) return <AppFactoryModule />;
    if (name.includes("media") || name.includes("news") || name.includes("content")) return <MediaNetworkModule />;
    return (
      <div className="p-12 rounded-3xl border border-dashed border-white/10 text-center">
        <Bot size={40} className="text-gray-600 mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2">Standard AI Module</h3>
        <p className="text-sm text-gray-500">Your AI agents are managing this business using standard protocols.</p>
      </div>
    );
  };

  return (
    <Dashboard profile={profile}>
      <div className="flex flex-col h-full bg-black text-white">
        {/* Sub-Header / Navigation */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push("/dashboard/businesses")} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{business.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">System Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
              <RefreshCcw size={14} /> Optimize
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
              <Play size={14} /> Start System
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Revenue" value={business.revenue || "$0"} change="+12.5%" trend="up" icon={<DollarSign size={18} />} />
              <StatCard label="Monthly Recurring" value="$4,250" change="+8.2%" trend="up" icon={<BarChart3 size={18} />} />
              <StatCard label="Active Leads" value={business.leads || "0"} change="+4" trend="up" icon={<Users size={18} />} />
              <StatCard label="AI Health Score" value="98.4%" change="-0.2%" trend="down" icon={<Shield size={18} />} />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Business Modules & Charts */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Dynamic Module */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Business Intelligence</h2>
                    <div className="flex gap-1">
                      {["Overview", "Analytics", "Operations"].map(t => (
                        <button key={t} onClick={() => setActiveTab(t.toLowerCase())}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === t.toLowerCase() ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {renderBusinessModule()}
                </section>

                {/* Secondary Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricWidget label="Conversion Rate" value="4.2%" subtext="1.2% vs last month" trend="up" color="bg-green-500" />
                  <MetricWidget label="Avg Order Value" value="$245" subtext="12% vs last month" trend="up" color="bg-blue-500" />
                  <MetricWidget label="Churn Rate" value="1.8%" subtext="0.4% vs last month" trend="down" color="bg-red-500" />
                </div>

                {/* Automation Log */}
                <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Automation Performance</h3>
                    <button className="text-[10px] font-bold text-blue-400 hover:underline">View All Logs</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Lead Qualification Bot", status: "Optimal", success: "98%", tasks: 142 },
                      { name: "Content Distribution AI", status: "Scaling", success: "94%", tasks: 85 },
                      { name: "Customer Support Agent", status: "Learning", success: "89%", tasks: 210 },
                    ].map((bot, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          <div>
                            <p className="text-sm font-bold">{bot.name}</p>
                            <p className="text-[10px] text-gray-500">{bot.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Success</p>
                            <p className="text-xs font-bold">{bot.success}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Tasks</p>
                            <p className="text-xs font-bold">{bot.tasks}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI OS & Live Feed */}
              <div className="space-y-8">
                <AIControlCenter 
                  status="Autonomous Mode: ON" 
                  goals={["Increase MRR by 15%", "Optimize ad spend", "Scale content reach"]}
                  actions={[
                    { agent: "Growth Bot", task: "Adjusted bidding strategy for Google Ads campaign" },
                    { agent: "Content AI", task: "Generated 12 new social media assets" },
                    { agent: "Support Agent", task: "Resolved 4 high-priority customer tickets" }
                  ]}
                />
                
                <LiveFeed 
                  activities={[
                    { agent_name: "System", time: "Just now", action: "Recalibrating neural networks for market shift" },
                    { agent_name: "Lead Bot", time: "2m ago", action: "Identified 3 high-intent prospects in London" },
                    { agent_name: "Content AI", time: "12m ago", action: "Published 'The Future of AI' to Media Network" },
                    { agent_name: "Finance Bot", time: "45m ago", action: "Rebalanced portfolio weights based on volatility" },
                    { agent_name: "System", time: "1h ago", action: "Backup successfully stored on decentralized node" }
                  ]}
                />

                {/* Quick Action Widget */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="font-bold mb-2">Need a new strategy?</h3>
                    <p className="text-xs text-gray-400 mb-4">Chat with your lead AI architect to redesign your business model.</p>
                    <button className="w-full py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                      <MessageCircle size={14} /> Open AI Chat
                    </button>
                  </div>
                  <Bot className="absolute -bottom-6 -right-6 w-24 h-24 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </Dashboard>
  );
}
