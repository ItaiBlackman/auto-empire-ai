"use client";

import React, { useState, useEffect } from "react";
import { Search, Check, Plus, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Nango from "@nangohq/frontend";
import Dashboard from "@/components/Dashboard";

const INTEGRATIONS = [
  { id: "gmail", name: "Gmail", desc: "Send and receive emails", category: "Communication", logo: "📧", nangoId: "google-mail" },
  { id: "slack", name: "Slack", desc: "Team messaging and collaboration", category: "Communication", logo: "💬", nangoId: "slack" },
  { id: "whatsapp", name: "WhatsApp", desc: "Message leads via WhatsApp", category: "Communication", logo: "📱", nangoId: null },
  { id: "telegram", name: "Telegram", desc: "Bot and messaging automation", category: "Communication", logo: "✈️", nangoId: "telegram" },
  { id: "twilio", name: "Twilio", desc: "SMS and voice calls", category: "Communication", logo: "📞", nangoId: null },
  { id: "mailchimp", name: "Mailchimp", desc: "Email marketing campaigns", category: "Communication", logo: "🐵", nangoId: "mailchimp" },
  { id: "shopify", name: "Shopify", desc: "E-commerce store management", category: "E-commerce", logo: "🛍️", nangoId: "shopify" },
  { id: "stripe", name: "Stripe", desc: "Payment processing and billing", category: "Payments", logo: "💳", nangoId: "stripe" },
  { id: "paypal", name: "PayPal", desc: "Online payments", category: "Payments", logo: "🅿️", nangoId: null },
  { id: "hubspot", name: "HubSpot", desc: "CRM and marketing platform", category: "CRM & Sales", logo: "🧡", nangoId: "hubspot" },
  { id: "salesforce", name: "Salesforce", desc: "Enterprise CRM platform", category: "CRM & Sales", logo: "☁️", nangoId: "salesforce" },
  { id: "pipedrive", name: "Pipedrive", desc: "Sales pipeline management", category: "CRM & Sales", logo: "📊", nangoId: "pipedrive" },
  { id: "notion", name: "Notion", desc: "Docs, wikis, and databases", category: "Productivity", logo: "📝", nangoId: "notion" },
  { id: "airtable", name: "Airtable", desc: "Flexible database and spreadsheet", category: "Productivity", logo: "📋", nangoId: "airtable" },
  { id: "google_calendar", name: "Google Calendar", desc: "Calendar and scheduling", category: "Productivity", logo: "📆", nangoId: "google-calendar" },
  { id: "google_sheets", name: "Google Sheets", desc: "Spreadsheets and data", category: "Productivity", logo: "📊", nangoId: "google-sheet" },
  { id: "github", name: "GitHub", desc: "Code repository management", category: "Development", logo: "🐙", nangoId: "github" },
  { id: "instagram", name: "Instagram", desc: "Post and manage content", category: "Social Media", logo: "📸", nangoId: "instagram" },
  { id: "twitter", name: "X (Twitter)", desc: "Post and monitor tweets", category: "Social Media", logo: "𝕏", nangoId: "twitter" },
  { id: "linkedin", name: "LinkedIn", desc: "Professional network automation", category: "Social Media", logo: "💼", nangoId: "linkedin" },
  { id: "facebook", name: "Facebook", desc: "Pages and ad management", category: "Social Media", logo: "👥", nangoId: "facebook" },
  { id: "google_analytics", name: "Google Analytics", desc: "Website traffic analytics", category: "Analytics", logo: "📈", nangoId: "google-analytics" },
  { id: "zapier", name: "Zapier", desc: "Automate workflows between apps", category: "AI & Automation", logo: "⚡", nangoId: null },
  { id: "openai", name: "OpenAI", desc: "GPT-4 and DALL-E APIs", category: "AI & Automation", logo: "🧠", nangoId: null },
  { id: "claude", name: "Claude", desc: "AI assistant by Anthropic", category: "AI & Automation", logo: "🤖", nangoId: null },
];

const CATEGORIES = ["All", ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))];

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);

      // Get Nango session token
      const res = await fetch("/api/nango-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.token) setSessionToken(data.token);
    })();
  }, []);

  const connect = async (integration: any) => {
    if (connected.has(integration.id)) {
      setConnected(prev => { const next = new Set(prev); next.delete(integration.id); return next; });
      return;
    }

    setConnecting(integration.id);

    if (integration.nangoId && sessionToken) {
      try {
        const nango = new Nango({ connectSessionToken: sessionToken });
        await nango.auth(integration.nangoId);
        setConnected(prev => new Set(prev).add(integration.id));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback to Zapier for apps not in Nango
      const zapierUrls: Record<string, string> = {
        zapier: "https://zapier.com/app/dashboard",
        openai: "https://zapier.com/apps/openai/integrations",
        claude: "https://zapier.com/apps/claude-ai/integrations",
        whatsapp: "https://zapier.com/apps/whatsapp/integrations",
        twilio: "https://zapier.com/apps/twilio/integrations",
        paypal: "https://zapier.com/apps/paypal/integrations",
      };
      const url = zapierUrls[integration.id] || "https://zapier.com/app/dashboard";
      const popup = window.open(url, "_blank", "width=800,height=600");
      const checkClosed = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkClosed);
          setConnected(prev => new Set(prev).add(integration.id));
          setConnecting(null);
        }
      }, 500);
      return;
    }

    setConnecting(null);
  };

  const filtered = INTEGRATIONS.filter(i => {
    const matchCat = category === "All" || i.category === category;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-gray-500">Connect your favorite apps to supercharge your empire.</p>
        </div>

        {connected.size > 0 && (
          <div className="mb-6 p-4 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-center gap-3">
            <Check size={16} className="text-green-400 shrink-0" />
            <p className="text-sm text-green-400 font-bold">{connected.size} integration{connected.size > 1 ? 's' : ''} connected</p>
          </div>
        )}

        <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 mb-6">
          <Search size={16} className="text-gray-500 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="bg-transparent border-none outline-none text-sm w-full" />
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${category === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((integration, i) => {
            const isConnected = connected.has(integration.id);
            const isConnecting = connecting === integration.id;
            return (
              <motion.div key={integration.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className={`p-5 rounded-2xl border transition-all ${isConnected ? 'border-green-500/30 bg-green-500/[0.03]' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 border border-white/10">
                      {integration.logo}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{integration.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{integration.category}</p>
                    </div>
                  </div>
                  {isConnected && <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0" />}
                </div>
                <p className="text-xs text-gray-400 mb-4">{integration.desc}</p>
                <button onClick={() => connect(integration)} disabled={isConnecting}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${isConnected ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400 border border-green-500/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                  {isConnecting ? <span className="animate-pulse">Connecting...</span>
                    : isConnected ? <><Check size={12} /> Connected</>
                    : <><Plus size={12} /> Connect</>}
                </button>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Zap size={32} className="mx-auto mb-3 opacity-20" />
            <p>No integrations found for "{search}"</p>
          </div>
        )}
      </div>
    </Dashboard>
  );
}