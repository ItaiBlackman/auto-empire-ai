"use client";

import React, { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  TrendingUp, ChevronLeft, Loader2, Bot, Zap,
  Settings, MessageCircle, BarChart3,
  DollarSign, RefreshCcw, Users, Shield, Mail, Save, CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { StatCard, AIControlCenter, LiveFeed, MetricWidget } from "@/components/AIOperatingSystem";
import { HedgeFundModule, YouTubeModule, AppFactoryModule, MediaNetworkModule } from "@/components/BusinessModules";
import { AICommandCenter } from "@/components/AICommandCenter";

export default function BusinessDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [business, setBusiness] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSystemRunning, setIsSystemRunning] = useState(true);
  const [isAutonomous, setIsAutonomous] = useState(true);
  const [emailOutreach, setEmailOutreach] = useState("");
  const [emailFollowup, setEmailFollowup] = useState("");
  const [emailClose, setEmailClose] = useState("");
  const [followupDays, setFollowupDays] = useState(3);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleOptimize = () => alert("AI agents are recalibrating strategy... Optimization will be complete in 60 seconds.");
  const handleChat = () => {
    const chatButton = document.querySelector('[aria-label="Open AI Chat"]') as HTMLElement;
    if (chatButton) chatButton.click();
  };
  const onAICommand = (cmd: string) => {
    if (cmd === 'rename') handleRename();
    if (cmd === 'optimize') handleOptimize();
  };
  const handleSettings = () => setActiveTab("settings");

  const handleRename = async () => {
    const newName = prompt("Enter new business name:", business.name);
    if (!newName || newName === business.name) return;
    const { error } = await supabase.from("businesses").update({ name: newName }).eq("id", id);
    if (!error) setBusiness({ ...business, name: newName });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this business? This cannot be undone.")) return;
    const { error } = await supabase.from("businesses").delete().eq("id", id);
    if (!error) router.push("/dashboard/businesses");
  };

  const handleSell = () => alert("Listing your business on the AutoEmpire Marketplace... Our team will contact you with valuation details.");
  const handleAddMember = () => {
    const email = prompt("Enter team member email:");
    if (email) alert(`Invitation sent to ${email}`);
  };

  const handleSaveEmails = async () => {
    setEmailSaving(true);
    await supabase.from("businesses").update({
      email_outreach: emailOutreach,
      email_followup: emailFollowup,
      email_close: emailClose,
      followup_days: followupDays,
    }).eq("id", id);
    setEmailSaving(false);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2000);
  };

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const [{ data: biz }, { data: prof }] = await Promise.all([
      supabase.from("businesses").select("*").eq("id", id).single(),
      supabase.from("profiles").select("*").eq("id", user.id).single(),
    ]);
    setBusiness(biz);
    setProfile(prof);
    if (biz) {
      setEmailOutreach(biz.email_outreach || "");
      setEmailFollowup(biz.email_followup || "");
      setEmailClose(biz.email_close || "");
      setFollowupDays(biz.followup_days || 3);
    }
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
        <button onClick={() => router.push("/dashboard/businesses")} className="px-6 py-2 bg-white text-black rounded-full font-bold">Back to Empire</button>
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

  const tabs = ["Overview", "Analytics", "Operations", "Emails", "Settings"];

  return (
    <Dashboard profile={profile}>
      <div className="flex flex-col h-full bg-black text-white">
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
            <button onClick={handleOptimize} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
              <RefreshCcw size={14} /> Optimize
            </button>
            <button
              onClick={() => setIsSystemRunning(!isSystemRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${isSystemRunning ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-white text-black hover:bg-gray-200'}`}>
              {isSystemRunning ? '⏸ Pause System' : '▶ Start System'}
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button onClick={handleSettings} className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Revenue" value={business.revenue || "$0"} change="+12.5%" trend="up" icon={<DollarSign size={18} />} />
              <StatCard label="Monthly Recurring" value="$0" change="+0%" trend="up" icon={<BarChart3 size={18} />} />
              <StatCard label="Active Leads" value={business.leads || "0"} change="+0" trend="up" icon={<Users size={18} />} />
              <StatCard label="AI Health Score" value="98.4%" change="-0.2%" trend="down" icon={<Shield size={18} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Business Intelligence</h2>
                    <div className="flex gap-1">
                      {tabs.map(t => (
                        <button key={t} onClick={() => setActiveTab(t.toLowerCase())}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${activeTab === t.toLowerCase() ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                          {t === "Emails" && <Mail size={10} />}{t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTab === "emails" ? (
                    <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold mb-1">Email Templates</h3>
                          <p className="text-xs text-gray-500">The agent uses these templates when contacting leads. Use {`{name}`}, {`{company}`} as placeholders.</p>
                        </div>
                        <button
                          onClick={handleSaveEmails}
                          disabled={emailSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {emailSaved ? <CheckCircle size={13} /> : emailSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                          {emailSaved ? "Saved!" : "Save Templates"}
                        </button>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
                            📧 Outreach Email — sent to new leads
                          </label>
                          <textarea
                            value={emailOutreach}
                            onChange={e => setEmailOutreach(e.target.value)}
                            rows={6}
                            placeholder={`Hi {name},\n\nI noticed {company} doesn't have a website yet. We build professional websites for local businesses starting from $500...\n\nWould you be open to a quick chat?\n\nBest,\nEliteSite Architects`}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-white/20 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
                            🔔 Follow-up Email — sent if no reply after 3 days
                          </label>
                          <textarea
                            value={emailFollowup}
                            onChange={e => setEmailFollowup(e.target.value)}
                            rows={5}
                            placeholder={`Hi {name},\n\nJust following up on my previous email. We'd love to help {company} get online and start attracting more customers.\n\nHappy to show you some examples of our work — takes 10 minutes.\n\nBest,\nEliteSite Architects`}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-white/20 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
                            🤝 Close Email — sent when lead shows interest
                          </label>
                          <textarea
                            value={emailClose}
                            onChange={e => setEmailClose(e.target.value)}
                            rows={5}
                            placeholder={`Hi {name},\n\nGreat to hear you're interested! Here's what we offer:\n\n• Professional website: $500 one-time\n• Monthly hosting & updates: $99/month\n\nTo get started, you can pay here: [STRIPE LINK]\n\nOnce payment is confirmed, we'll have your site live within 48 hours.\n\nBest,\nEliteSite Architects`}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-white/20 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : activeTab === "settings" ? (
                    <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-8">
                      <div>
                        <h3 className="text-lg font-bold mb-4">Business Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button onClick={handleRename} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                            <RefreshCcw size={18} className="text-blue-400" />
                            <div className="text-left">
                              <p className="text-sm font-bold">Rename Business</p>
                              <p className="text-[10px] text-gray-500">Change the display name of your empire.</p>
                            </div>
                          </button>
                          <button onClick={handleAddMember} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                            <Users size={18} className="text-purple-400" />
                            <div className="text-left">
                              <p className="text-sm font-bold">Manage Team</p>
                              <p className="text-[10px] text-gray-500">Add or remove AI operators and human members.</p>
                            </div>
                          </button>
                          <button onClick={handleSell} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                            <DollarSign size={18} className="text-green-400" />
                            <div className="text-left">
                              <p className="text-sm font-bold">Sell Business</p>
                              <p className="text-[10px] text-gray-500">List on the marketplace for immediate exit.</p>
                            </div>
                          </button>
                          <button onClick={handleDelete} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-4 hover:bg-red-500/10 transition-all group">
                            <Zap size={18} className="text-red-500 group-hover:animate-pulse" />
                            <div className="text-left">
                              <p className="text-sm font-bold text-red-500">Terminate Operations</p>
                              <p className="text-[10px] text-gray-500">Permanently delete all business data and assets.</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : renderBusinessModule()}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricWidget label="Conversion Rate" value="4.2%" subtext="1.2% vs last month" trend="up" color="bg-green-500" />
                  <MetricWidget label="Avg Order Value" value="$245" subtext="12% vs last month" trend="up" color="bg-blue-500" />
                  <MetricWidget label="Churn Rate" value="1.8%" subtext="0.4% vs last month" trend="down" color="bg-red-500" />
                </div>

                <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Automation Performance</h3>
                    <button className="text-[10px] font-bold text-blue-400 hover:underline">View All Logs</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Lead Finder Agent", status: "Active", success: "98%", tasks: 142 },
                      { name: "Outreach Agent", status: "Active", success: "94%", tasks: 85 },
                      { name: "Follow-up Agent", status: "Active", success: "89%", tasks: 210 },
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

              <div className="space-y-8">
                <AIControlCenter
                  status={isAutonomous ? "Autonomous Mode: ON" : "Manual Mode: ON"}
                  isAutonomous={isAutonomous}
                  onToggle={() => setIsAutonomous(!isAutonomous)}
                  goals={["Find businesses without websites", "Send cold outreach emails", "Build sites for interested leads"]}
                  actions={[
                    { agent: "Lead Finder", task: "Searching Google Maps for businesses without websites" },
                    { agent: "Outreach Agent", task: "Sending personalized cold emails to new leads" },
                    { agent: "Follow-up Agent", task: "Checking for replies and sending follow-ups" }
                  ]}
                />

                <LiveFeed
                  activities={[
                    { agent_name: "Lead Finder", time: "Just now", action: "Found 12 new businesses without websites in Tel Aviv" },
                    { agent_name: "Outreach Agent", time: "5m ago", action: "Sent cold email to Café Hamakolet" },
                    { agent_name: "Follow-up Agent", time: "1h ago", action: "Sent follow-up to 3 leads with no reply" },
                  ]}
                />

                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="font-bold mb-2">Need a new strategy?</h3>
                    <p className="text-xs text-gray-400 mb-4">Chat with your lead AI architect to redesign your business model.</p>
                    <button onClick={handleChat} className="w-full py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
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
      <AICommandCenter business={business} onCommand={onAICommand} />
    </Dashboard>
  );
}
