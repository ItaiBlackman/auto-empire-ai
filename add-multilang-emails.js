const fs = require("fs");

// FILE 1: MultiLangEmailEditor component
fs.writeFileSync("src/components/MultiLangEmailEditor.tsx", `"use client";
import React, { useState } from "react";
import { Plus, X, RefreshCcw, ChevronDown, Loader2 } from "lucide-react";

const LANGUAGES = [
  "Hebrew", "Arabic", "English", "French", "German", "Spanish", "Italian",
  "Russian", "Portuguese", "Turkish", "Dutch", "Polish", "Japanese", "Chinese",
  "Hindi", "Korean", "Swedish", "Norwegian", "Danish", "Finnish", "Greek",
  "Romanian", "Hungarian", "Czech", "Ukrainian",
];

export type LangVersion = { language: string; content: string };

interface Props {
  label: string;
  badge: string;
  badgeColor: string;
  baseTemplate: string; // English version (the main textarea)
  versions: LangVersion[];
  onVersionsChange: (versions: LangVersion[]) => void;
}

export function MultiLangEmailEditor({ label, badge, badgeColor, baseTemplate, versions, onVersionsChange }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<string | null>(null);

  const addLanguage = async (lang: string) => {
    setShowDropdown(false);
    if (versions.find(v => v.language === lang)) {
      setActiveVersion(lang);
      return;
    }
    setGenerating(lang);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: \`You are a native \${lang} speaker writing a casual WhatsApp sales message to a local business owner.

Here is the English template to adapt into \${lang}:
---
\${baseTemplate}
---

Rules:
- Write it fresh in \${lang} as if you are a real local person, NOT a word-for-word translation
- Keep the exact same meaning, facts, structure, and placeholders ({name}, {company}, {industry}, {agent_name}, {setup_price}, {monthly_price})
- Sound casual and friendly, like a real WhatsApp message
- Keep all placeholders EXACTLY as they are in curly braces
- Keep brand names as-is (EliteSite Architects, AutoEmpire AI)
- Do not add or remove any facts

Return ONLY the \${lang} message. No labels, no explanations.\`
          }]
        })
      });
      const data = await res.json();
      const generated = data.content?.[0]?.text || baseTemplate;
      const newVersions = [...versions, { language: lang, content: generated }];
      onVersionsChange(newVersions);
      setActiveVersion(lang);
    } catch {
      const newVersions = [...versions, { language: lang, content: baseTemplate }];
      onVersionsChange(newVersions);
      setActiveVersion(lang);
    }
    setGenerating(null);
  };

  const removeLanguage = (lang: string) => {
    onVersionsChange(versions.filter(v => v.language !== lang));
    if (activeVersion === lang) setActiveVersion(null);
  };

  const updateContent = (lang: string, content: string) => {
    onVersionsChange(versions.map(v => v.language === lang ? { ...v, content } : v));
  };

  const regenerate = async (lang: string) => {
    setGenerating(lang);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: \`You are a native \${lang} speaker writing a casual WhatsApp sales message to a local business owner.

Here is the English template to adapt into \${lang}:
---
\${baseTemplate}
---

Rules:
- Write it fresh in \${lang} as if you are a real local person, NOT a word-for-word translation
- Keep the exact same meaning, facts, structure, and placeholders ({name}, {company}, {industry}, {agent_name}, {setup_price}, {monthly_price})
- Sound casual and friendly, like a real WhatsApp message
- Keep all placeholders EXACTLY as they are in curly braces
- Keep brand names as-is
- Do not add or remove any facts

Return ONLY the \${lang} message. No labels, no explanations.\`
          }]
        })
      });
      const data = await res.json();
      const generated = data.content?.[0]?.text || baseTemplate;
      onVersionsChange(versions.map(v => v.language === lang ? { ...v, content: generated } : v));
    } catch {}
    setGenerating(null);
  };

  const availableLanguages = LANGUAGES.filter(l => l !== "English" && !versions.find(v => v.language === l));
  const activeVersionData = versions.find(v => v.language === activeVersion);

  return (
    <div className="mt-3">
      {/* Language version pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {versions.map(v => (
          <button
            key={v.language}
            onClick={() => setActiveVersion(activeVersion === v.language ? null : v.language)}
            className={"flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all " +
              (activeVersion === v.language ? "bg-white text-black" : "bg-white/10 text-gray-300 hover:bg-white/20")}
          >
            {generating === v.language ? <Loader2 size={10} className="animate-spin" /> : null}
            {v.language}
            <span
              onClick={e => { e.stopPropagation(); removeLanguage(v.language); }}
              className="ml-0.5 text-gray-500 hover:text-red-400 cursor-pointer"
            >
              <X size={10} />
            </span>
          </button>
        ))}

        {/* Add language button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(o => !o)}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
          >
            <Plus size={10} /> Add language
            <ChevronDown size={10} />
          </button>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute z-50 top-full mt-1 left-0 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="max-h-56 overflow-y-auto p-1">
                  {availableLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => addLanguage(lang)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active version editor */}
      {activeVersion && activeVersionData && (
        <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <p className="text-xs font-bold text-gray-300">{activeVersion} version</p>
            <button
              onClick={() => regenerate(activeVersion)}
              disabled={generating === activeVersion}
              className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {generating === activeVersion
                ? <Loader2 size={10} className="animate-spin" />
                : <RefreshCcw size={10} />}
              Regenerate
            </button>
          </div>
          <textarea
            value={activeVersionData.content}
            onChange={e => updateContent(activeVersion, e.target.value)}
            rows={8}
            className="w-full bg-black/40 p-4 text-sm text-white resize-none focus:outline-none font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
`, "utf8");

console.log("1. Created MultiLangEmailEditor.tsx");

// FILE 2: Updated business page
fs.writeFileSync("src/app/dashboard/businesses/[id]/page.tsx", `"use client";

import React, { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { TrendingUp, ChevronLeft, Loader2, Bot, Zap, Settings, MessageCircle, BarChart3, DollarSign, RefreshCcw, Users, Shield, Mail, Save, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { StatCard, AIControlCenter, LiveFeed, MetricWidget } from "@/components/AIOperatingSystem";
import { HedgeFundModule, YouTubeModule, AppFactoryModule, MediaNetworkModule } from "@/components/BusinessModules";
import { AICommandCenter } from "@/components/AICommandCenter";
import { CurrencySettingsPanel, DEFAULT_CURRENCY_SETTINGS, type CurrencyRow } from "@/components/CurrencySettingsPanel";
import { MultiLangEmailEditor, type LangVersion } from "@/components/MultiLangEmailEditor";

export default function BusinessDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [business, setBusiness] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeEmailTab, setActiveEmailTab] = useState("outreach");
  const [isSystemRunning, setIsSystemRunning] = useState(true);
  const [isAutonomous, setIsAutonomous] = useState(true);
  const [emailOutreach, setEmailOutreach] = useState("");
  const [emailFollowup, setEmailFollowup] = useState("");
  const [emailClose, setEmailClose] = useState("");
  const [outreachVersions, setOutreachVersions] = useState<LangVersion[]>([]);
  const [followupVersions, setFollowupVersions] = useState<LangVersion[]>([]);
  const [closeVersions, setCloseVersions] = useState<LangVersion[]>([]);
  const [followupDays, setFollowupDays] = useState(3);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [currencySettings, setCurrencySettings] = useState<CurrencyRow[]>(DEFAULT_CURRENCY_SETTINGS);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingSaved, setPricingSaved] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleOptimize = () => alert("AI agents are recalibrating strategy...");
  const handleChat = () => { const b = document.querySelector('[aria-label="Open AI Chat"]') as HTMLElement; if (b) b.click(); };
  const onAICommand = (cmd: string) => { if (cmd === "rename") handleRename(); if (cmd === "optimize") handleOptimize(); };
  const handleSettings = () => setActiveTab("settings");

  const handleRename = async () => {
    const newName = prompt("Enter new business name:", business.name);
    if (!newName || newName === business.name) return;
    const { error } = await supabase.from("businesses").update({ name: newName }).eq("id", id);
    if (!error) setBusiness({ ...business, name: newName });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    const { error } = await supabase.from("businesses").delete().eq("id", id);
    if (!error) router.push("/dashboard/businesses");
  };

  const handleSell = () => alert("Listing on AutoEmpire Marketplace...");
  const handleAddMember = () => { const e = prompt("Enter team member email:"); if (e) alert("Invitation sent to " + e); };

  const handleSaveEmails = async () => {
    setEmailSaving(true);
    await supabase.from("businesses").update({
      email_outreach: emailOutreach,
      email_followup: emailFollowup,
      email_close: emailClose,
      followup_days: followupDays,
      outreach_versions: outreachVersions,
      followup_versions: followupVersions,
      close_versions: closeVersions,
    }).eq("id", id);
    setEmailSaving(false);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2000);
  };

  const handleSavePricing = async () => {
    setPricingSaving(true);
    await supabase.from("businesses").update({ currency_settings: currencySettings }).eq("id", id);
    setPricingSaving(false);
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 2000);
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
      setCurrencySettings(Array.isArray(biz.currency_settings) ? biz.currency_settings : DEFAULT_CURRENCY_SETTINGS);
      setOutreachVersions(Array.isArray(biz.outreach_versions) ? biz.outreach_versions : []);
      setFollowupVersions(Array.isArray(biz.followup_versions) ? biz.followup_versions : []);
      setCloseVersions(Array.isArray(biz.close_versions) ? biz.close_versions : []);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black">
      <Loader2 className="animate-spin text-white/20" size={48} />
    </div>
  );

  if (!business) return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Business not found</h2>
        <button onClick={() => router.push("/dashboard/businesses")} className="px-6 py-2 bg-white text-black rounded-full font-bold">Back</button>
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
        <p className="text-sm text-gray-500">Your AI agents are managing this business.</p>
      </div>
    );
  };

  const emailTypes = [
    { key: "outreach", label: "Outreach", badge: "#1", color: "text-blue-400 bg-blue-500/20" },
    { key: "followup", label: "Follow-up", badge: "#2", color: "text-yellow-400 bg-yellow-500/20" },
    { key: "close", label: "Close", badge: "#3", color: "text-green-400 bg-green-500/20" },
  ];

  const emailValues: Record<string, string> = { outreach: emailOutreach, followup: emailFollowup, close: emailClose };
  const emailSetters: Record<string, (v: string) => void> = { outreach: setEmailOutreach, followup: setEmailFollowup, close: setEmailClose };
  const versionsMap: Record<string, LangVersion[]> = { outreach: outreachVersions, followup: followupVersions, close: closeVersions };
  const versionSetters: Record<string, (v: LangVersion[]) => void> = { outreach: setOutreachVersions, followup: setFollowupVersions, close: setCloseVersions };

  return (
    <Dashboard profile={profile}>
      <div className="flex flex-col h-full bg-black text-white">
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push("/dashboard/businesses")} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
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
            <button onClick={() => setIsSystemRunning(!isSystemRunning)}
              className={"flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors " + (isSystemRunning ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-white text-black")}>
              {isSystemRunning ? "Pause" : "Start"}
            </button>
            <button onClick={handleSettings} className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
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
                      {["Overview", "Analytics", "Operations", "Emails", "Pricing", "Settings"].map(t => (
                        <button key={t} onClick={() => setActiveTab(t.toLowerCase())}
                          className={"px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 " + (activeTab === t.toLowerCase() ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400")}>
                          {t === "Emails" && <Mail size={10} />}
                          {t === "Pricing" && <DollarSign size={10} />}
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTab === "emails" && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                      <div className="px-6 pt-6">
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h3 className="font-bold text-base">Email Sequences</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Use {"{name}"}, {"{company}"}, {"{industry}"}, {"{setup_price}"}, {"{monthly_price}"}, {"{agent_name}"}</p>
                          </div>
                          <button onClick={handleSaveEmails} disabled={emailSaving}
                            className={"flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all disabled:opacity-50 " + (emailSaved ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-white text-black hover:bg-gray-200")}>
                            {emailSaved ? <CheckCircle size={13} /> : emailSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                            {emailSaved ? "Saved" : "Save"}
                          </button>
                        </div>
                        <div className="flex gap-1 border-b border-white/5 mb-0">
                          {emailTypes.map(t => (
                            <button key={t.key} onClick={() => setActiveEmailTab(t.key)}
                              className={"px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 " + (activeEmailTab === t.key ? "border-white text-white" : "border-transparent text-gray-500 hover:text-gray-300")}>
                              <span className={"text-[10px] px-1.5 py-0.5 rounded font-black " + t.color}>{t.badge}</span>
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-6">
                        <textarea
                          value={emailValues[activeEmailTab]}
                          onChange={e => emailSetters[activeEmailTab](e.target.value)}
                          rows={8}
                          placeholder="Write your English template here... Use {name} {company} {industry} {setup_price} {monthly_price} {agent_name}"
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-700 resize-none focus:outline-none focus:border-white/20 font-mono leading-relaxed"
                        />
                        <MultiLangEmailEditor
                          label={emailTypes.find(t => t.key === activeEmailTab)?.label || ""}
                          badge={emailTypes.find(t => t.key === activeEmailTab)?.badge || ""}
                          badgeColor={emailTypes.find(t => t.key === activeEmailTab)?.color || ""}
                          baseTemplate={emailValues[activeEmailTab]}
                          versions={versionsMap[activeEmailTab]}
                          onVersionsChange={versionSetters[activeEmailTab]}
                        />
                      </div>
                      <div className="px-6 pb-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/[0.07]">
                          <div>
                            <p className="text-xs font-bold">Follow-up delay</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Days with no reply before Email 2 is sent</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setFollowupDays(d => Math.max(1, d - 1))} className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center">-</button>
                            <span className="text-base font-bold w-6 text-center">{followupDays}</span>
                            <button onClick={() => setFollowupDays(d => Math.min(30, d + 1))} className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center">+</button>
                            <span className="text-xs text-gray-500 ml-1">days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "pricing" && (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <button onClick={handleSavePricing} disabled={pricingSaving}
                          className={"flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all disabled:opacity-50 " + (pricingSaved ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-white text-black hover:bg-gray-200")}>
                          {pricingSaved ? <CheckCircle size={13} /> : pricingSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                          {pricingSaved ? "Saved" : "Save Pricing"}
                        </button>
                      </div>
                      <CurrencySettingsPanel settings={currencySettings} onChange={setCurrencySettings} />
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-8">
                      <h3 className="text-lg font-bold">Business Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={handleRename} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                          <RefreshCcw size={18} className="text-blue-400" />
                          <div className="text-left"><p className="text-sm font-bold">Rename Business</p><p className="text-[10px] text-gray-500">Change the display name.</p></div>
                        </button>
                        <button onClick={handleAddMember} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                          <Users size={18} className="text-purple-400" />
                          <div className="text-left"><p className="text-sm font-bold">Manage Team</p><p className="text-[10px] text-gray-500">Add or remove members.</p></div>
                        </button>
                        <button onClick={handleSell} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                          <DollarSign size={18} className="text-green-400" />
                          <div className="text-left"><p className="text-sm font-bold">Sell Business</p><p className="text-[10px] text-gray-500">List on the marketplace.</p></div>
                        </button>
                        <button onClick={handleDelete} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-4 hover:bg-red-500/10 transition-all">
                          <Zap size={18} className="text-red-500" />
                          <div className="text-left"><p className="text-sm font-bold text-red-500">Terminate Operations</p><p className="text-[10px] text-gray-500">Permanently delete everything.</p></div>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab !== "emails" && activeTab !== "pricing" && activeTab !== "settings" && renderBusinessModule()}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricWidget label="Conversion Rate" value="4.2%" subtext="1.2% vs last month" trend="up" color="bg-green-500" />
                  <MetricWidget label="Avg Order Value" value="$245" subtext="12% vs last month" trend="up" color="bg-blue-500" />
                  <MetricWidget label="Churn Rate" value="1.8%" subtext="0.4% vs last month" trend="down" color="bg-red-500" />
                </div>

                <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Automation Performance</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Lead Finder Agent", status: "Active", success: "98%", tasks: 142 },
                      { name: "Outreach Agent", status: "Active", success: "94%", tasks: 85 },
                      { name: "Follow-up Agent", status: "Active", success: "89%", tasks: 210 },
                    ].map((bot, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div><p className="text-sm font-bold">{bot.name}</p><p className="text-[10px] text-gray-500">{bot.status}</p></div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right"><p className="text-[10px] text-gray-500 uppercase font-bold">Success</p><p className="text-xs font-bold">{bot.success}</p></div>
                          <div className="text-right"><p className="text-[10px] text-gray-500 uppercase font-bold">Tasks</p><p className="text-xs font-bold">{bot.tasks}</p></div>
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
                    { agent: "Follow-up Agent", task: "Checking for replies and sending follow-ups" },
                  ]}
                />
                <LiveFeed activities={[
                  { agent_name: "Lead Finder", time: "Just now", action: "Found 12 new businesses without websites in Tel Aviv" },
                  { agent_name: "Outreach Agent", time: "5m ago", action: "Sent cold email to a local business" },
                  { agent_name: "Follow-up Agent", time: "1h ago", action: "Sent follow-up to 3 leads with no reply" },
                ]} />
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold mb-2">Need a new strategy?</h3>
                    <p className="text-xs text-gray-400 mb-4">Chat with your AI architect to redesign your business model.</p>
                    <button onClick={handleChat} className="w-full py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                      <MessageCircle size={14} /> Open AI Chat
                    </button>
                  </div>
                  <Bot className="absolute -bottom-6 -right-6 w-24 h-24 text-white/5 rotate-12" />
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
`, "utf8");

console.log("2. Wrote page.tsx");

// FILE 3: Add columns to businesses table via SQL (just print reminder)
console.log("3. Run this SQL in Supabase to add version columns:");
console.log("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS outreach_versions jsonb DEFAULT '[]';");
console.log("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS followup_versions jsonb DEFAULT '[]';");
console.log("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS close_versions jsonb DEFAULT '[]';");
console.log("");
console.log("Done. Run: git add . && git commit -m 'multi-language email versions' && git push");
