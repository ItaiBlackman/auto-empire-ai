
"use client";

import React, { useState, useEffect } from "react";
import { Search, Check, Plus, Zap, Key, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Nango from "@nangohq/frontend";
import Dashboard from "@/components/Dashboard";

type IntegrationStatus = "oauth" | "apikey" | "coming_soon";

interface Integration {
  id: string;
  name: string;
  desc: string;
  category: string;
  logo: string;
  nangoId: string | null;
  status: IntegrationStatus;
}

const INTEGRATIONS: Integration[] = [
  { id: "gmail", name: "Gmail", desc: "Send and receive emails", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg", nangoId: "google-mail", status: "oauth" },
  { id: "slack", name: "Slack", desc: "Team messaging and collaboration", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", nangoId: "slack", status: "oauth" },
  { id: "whatsapp", name: "WhatsApp", desc: "Message leads via WhatsApp", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", nangoId: null, status: "coming_soon" },
  { id: "telegram", name: "Telegram", desc: "Bot and messaging automation", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "twilio", name: "Twilio", desc: "SMS and voice calls", category: "Communication", logo: "https://cdn.worldvectorlogo.com/logos/twilio.svg", nangoId: null, status: "apikey" },
  { id: "discord", name: "Discord", desc: "Communities and bot integrations", category: "Communication", logo: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png", nangoId: null, status: "coming_soon" },
  { id: "zoom", name: "Zoom", desc: "Video meetings and webinars", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Zoom_Logo_2022.svg", nangoId: null, status: "coming_soon" },
  { id: "intercom", name: "Intercom", desc: "Customer messaging platform", category: "Communication", logo: "https://cdn.worldvectorlogo.com/logos/intercom-1.svg", nangoId: null, status: "coming_soon" },
  { id: "calendly", name: "Calendly", desc: "Appointment booking automation", category: "Communication", logo: "https://cdn.worldvectorlogo.com/logos/calendly-1.svg", nangoId: null, status: "coming_soon" },
  { id: "mailchimp", name: "Mailchimp", desc: "Email marketing campaigns", category: "Communication", logo: "https://cdn.worldvectorlogo.com/logos/mailchimp.svg", nangoId: null, status: "coming_soon" },
  { id: "hubspot", name: "HubSpot", desc: "CRM and marketing platform", category: "CRM & Sales", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "salesforce", name: "Salesforce", desc: "Enterprise CRM platform", category: "CRM & Sales", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", nangoId: "salesforce", status: "oauth" },
  { id: "pipedrive", name: "Pipedrive", desc: "Sales pipeline management", category: "CRM & Sales", logo: "https://cdn.worldvectorlogo.com/logos/pipedrive.svg", nangoId: "pipedrive", status: "oauth" },
  { id: "apollo", name: "Apollo.io", desc: "B2B lead database and outreach", category: "CRM & Sales", logo: "https://cdn.worldvectorlogo.com/logos/apollo-io.svg", nangoId: null, status: "apikey" },
  { id: "gohighlevel", name: "GoHighLevel", desc: "Agency CRM platform", category: "CRM & Sales", logo: "https://cdn.worldvectorlogo.com/logos/gohighlevel.svg", nangoId: null, status: "coming_soon" },
  { id: "close", name: "Close", desc: "Sales CRM for startups", category: "CRM & Sales", logo: "https://cdn.worldvectorlogo.com/logos/close-crm.svg", nangoId: null, status: "coming_soon" },
  { id: "instantly", name: "Instantly", desc: "Cold email outreach platform", category: "CRM & Sales", logo: "https://instantly.ai/favicon.ico", nangoId: null, status: "apikey" },
  { id: "lemlist", name: "Lemlist", desc: "Personalized outreach automation", category: "CRM & Sales", logo: "https://cdn.worldvectorlogo.com/logos/lemlist.svg", nangoId: null, status: "coming_soon" },
  { id: "notion", name: "Notion", desc: "Docs, wikis, and databases", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", nangoId: "notion", status: "oauth" },
  { id: "google_calendar", name: "Google Calendar", desc: "Calendar and scheduling", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg", nangoId: "google-calendar", status: "oauth" },
  { id: "google_sheets", name: "Google Sheets", desc: "Spreadsheets and data", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg", nangoId: "google-sheet", status: "oauth" },
  { id: "airtable", name: "Airtable", desc: "Flexible database and spreadsheet", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "clickup", name: "ClickUp", desc: "Project and task management", category: "Productivity", logo: "https://cdn.worldvectorlogo.com/logos/clickup-symbol-1.svg", nangoId: null, status: "coming_soon" },
  { id: "asana", name: "Asana", desc: "Team and project tracking", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "trello", name: "Trello", desc: "Visual task boards", category: "Productivity", logo: "https://cdn.worldvectorlogo.com/logos/trello.svg", nangoId: null, status: "coming_soon" },
  { id: "monday", name: "Monday.com", desc: "Operations and work management", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Monday_logo.png", nangoId: null, status: "coming_soon" },
  { id: "linear", name: "Linear", desc: "Product development management", category: "Productivity", logo: "https://cdn.worldvectorlogo.com/logos/linear-app.svg", nangoId: null, status: "coming_soon" },
  { id: "openai", name: "OpenAI", desc: "GPT-4 and DALL-E APIs", category: "AI & Automation", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", nangoId: null, status: "apikey" },
  { id: "claude", name: "Claude", desc: "AI assistant by Anthropic", category: "AI & Automation", logo: "https://cdn.worldvectorlogo.com/logos/claude-ai-icon.svg", nangoId: null, status: "apikey" },
  { id: "gemini", name: "Google AI Studio", desc: "Gemini AI models", category: "AI & Automation", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg", nangoId: null, status: "apikey" },
  { id: "elevenlabs", name: "ElevenLabs", desc: "AI voice generation", category: "AI & Automation", logo: "https://cdn.worldvectorlogo.com/logos/elevenlabs-2.svg", nangoId: null, status: "apikey" },
  { id: "perplexity", name: "Perplexity AI", desc: "AI search and research", category: "AI & Automation", logo: "https://cdn.worldvectorlogo.com/logos/perplexity-ai.svg", nangoId: null, status: "apikey" },
  { id: "huggingface", name: "Hugging Face", desc: "Open-source AI models", category: "AI & Automation", logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", nangoId: null, status: "apikey" },
  { id: "replicate", name: "Replicate", desc: "Run AI models via API", category: "AI & Automation", logo: "https://cdn.worldvectorlogo.com/logos/replicate.svg", nangoId: null, status: "apikey" },
  { id: "mistral", name: "Mistral AI", desc: "LLM APIs", category: "AI & Automation", logo: "https://cdn.worldvectorlogo.com/logos/mistral-ai.svg", nangoId: null, status: "apikey" },
  { id: "zapier", name: "Zapier", desc: "Automate workflows between apps", category: "AI & Automation", logo: "https://cdn.worldvectorlogo.com/logos/zapier-1.svg", nangoId: null, status: "coming_soon" },
  { id: "make", name: "Make", desc: "Advanced workflow automation", category: "AI & Automation", logo: "https://cdn.worldvectorlogo.com/logos/make-seeklogo.svg", nangoId: null, status: "coming_soon" },
  { id: "stripe", name: "Stripe", desc: "Payment processing and billing", category: "Payments", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", nangoId: null, status: "apikey" },
  { id: "paypal", name: "PayPal", desc: "Online payments", category: "Payments", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", nangoId: null, status: "coming_soon" },
  { id: "wise", name: "Wise", desc: "International money transfers", category: "Payments", logo: "https://cdn.worldvectorlogo.com/logos/wise-1.svg", nangoId: null, status: "coming_soon" },
  { id: "plaid", name: "Plaid", desc: "Banking and financial APIs", category: "Payments", logo: "https://cdn.worldvectorlogo.com/logos/plaid.svg", nangoId: null, status: "coming_soon" },
  { id: "coinbase", name: "Coinbase", desc: "Crypto integrations", category: "Payments", logo: "https://cdn.worldvectorlogo.com/logos/coinbase-1.svg", nangoId: null, status: "coming_soon" },
  { id: "binance", name: "Binance", desc: "Crypto trading APIs", category: "Payments", logo: "https://cdn.worldvectorlogo.com/logos/binance-logo.svg", nangoId: null, status: "apikey" },
  { id: "alpaca", name: "Alpaca", desc: "Stock trading API", category: "Payments", logo: "https://alpaca.markets/favicon.ico", nangoId: null, status: "apikey" },
  { id: "shopify", name: "Shopify", desc: "E-commerce store management", category: "E-commerce", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg", nangoId: "shopify", status: "oauth" },
  { id: "woocommerce", name: "WooCommerce", desc: "WordPress e-commerce", category: "E-commerce", logo: "https://cdn.worldvectorlogo.com/logos/woocommerce.svg", nangoId: null, status: "coming_soon" },
  { id: "gumroad", name: "Gumroad", desc: "Sell digital products", category: "E-commerce", logo: "https://cdn.worldvectorlogo.com/logos/gumroad.svg", nangoId: null, status: "coming_soon" },
  { id: "lemonsqueezy", name: "Lemon Squeezy", desc: "SaaS payments and subscriptions", category: "E-commerce", logo: "https://www.lemonsqueezy.com/favicon.ico", nangoId: null, status: "coming_soon" },
  { id: "printful", name: "Printful", desc: "Print-on-demand fulfillment", category: "E-commerce", logo: "https://cdn.worldvectorlogo.com/logos/printful.svg", nangoId: null, status: "coming_soon" },
  { id: "instagram", name: "Instagram", desc: "Post and manage content", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png", nangoId: null, status: "coming_soon" },
  { id: "twitter", name: "X (Twitter)", desc: "Post and monitor tweets", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg", nangoId: null, status: "coming_soon" },
  { id: "linkedin", name: "LinkedIn", desc: "Professional network automation", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", nangoId: null, status: "coming_soon" },
  { id: "facebook", name: "Facebook", desc: "Pages and ad management", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", nangoId: null, status: "coming_soon" },
  { id: "tiktok", name: "TikTok", desc: "Short video content automation", category: "Social Media", logo: "https://cdn.worldvectorlogo.com/logos/tiktok-icon2.svg", nangoId: null, status: "coming_soon" },
  { id: "youtube", name: "YouTube", desc: "Video publishing and analytics", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg", nangoId: null, status: "coming_soon" },
  { id: "spotify", name: "Spotify", desc: "Music and podcast integration", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg", nangoId: null, status: "coming_soon" },
  { id: "buffer", name: "Buffer", desc: "Social media scheduling", category: "Social Media", logo: "https://cdn.worldvectorlogo.com/logos/buffer-2.svg", nangoId: null, status: "coming_soon" },
  { id: "hootsuite", name: "Hootsuite", desc: "Social media management", category: "Social Media", logo: "https://cdn.worldvectorlogo.com/logos/hootsuite.svg", nangoId: null, status: "coming_soon" },
  { id: "google_analytics", name: "Google Analytics", desc: "Website traffic analytics", category: "Analytics & SEO", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Logo_Google_Analytics.svg", nangoId: null, status: "coming_soon" },
  { id: "ahrefs", name: "Ahrefs", desc: "SEO research and backlinks", category: "Analytics & SEO", logo: "https://cdn.worldvectorlogo.com/logos/ahrefs.svg", nangoId: null, status: "apikey" },
  { id: "semrush", name: "SEMrush", desc: "SEO and competitor analysis", category: "Analytics & SEO", logo: "https://cdn.worldvectorlogo.com/logos/semrush.svg", nangoId: null, status: "apikey" },
  { id: "hotjar", name: "Hotjar", desc: "User behavior tracking", category: "Analytics & SEO", logo: "https://cdn.worldvectorlogo.com/logos/hotjar-1.svg", nangoId: null, status: "coming_soon" },
  { id: "mixpanel", name: "Mixpanel", desc: "Product and event analytics", category: "Analytics & SEO", logo: "https://cdn.worldvectorlogo.com/logos/mixpanel.svg", nangoId: null, status: "coming_soon" },
  { id: "posthog", name: "PostHog", desc: "Open-source product analytics", category: "Analytics & SEO", logo: "https://posthog.com/favicon.ico", nangoId: null, status: "coming_soon" },
  { id: "github", name: "GitHub", desc: "Code repository management", category: "Development", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", nangoId: "github", status: "oauth" },
  { id: "gitlab", name: "GitLab", desc: "DevOps platform", category: "Development", logo: "https://cdn.worldvectorlogo.com/logos/gitlab.svg", nangoId: null, status: "coming_soon" },
  { id: "vercel", name: "Vercel", desc: "Frontend deployment platform", category: "Development", logo: "https://cdn.worldvectorlogo.com/logos/vercel.svg", nangoId: null, status: "coming_soon" },
  { id: "supabase", name: "Supabase", desc: "Backend and database services", category: "Development", logo: "https://cdn.worldvectorlogo.com/logos/supabase.svg", nangoId: null, status: "coming_soon" },
  { id: "firebase", name: "Firebase", desc: "Google backend services", category: "Development", logo: "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "mongodb", name: "MongoDB", desc: "NoSQL database", category: "Development", logo: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg", nangoId: null, status: "coming_soon" },
  { id: "cloudflare", name: "Cloudflare", desc: "CDN, security and workers", category: "Development", logo: "https://cdn.worldvectorlogo.com/logos/cloudflare.svg", nangoId: null, status: "coming_soon" },
  { id: "canva", name: "Canva", desc: "Graphic design and content", category: "Content & Media", logo: "https://cdn.worldvectorlogo.com/logos/canva-1.svg", nangoId: null, status: "coming_soon" },
  { id: "heygen", name: "HeyGen", desc: "AI avatar video creation", category: "Content & Media", logo: "https://www.heygen.com/favicon.ico", nangoId: null, status: "coming_soon" },
  { id: "runway", name: "Runway", desc: "AI video generation", category: "Content & Media", logo: "https://runwayml.com/favicon.ico", nangoId: null, status: "coming_soon" },
  { id: "synthesia", name: "Synthesia", desc: "AI presenter videos", category: "Content & Media", logo: "https://cdn.worldvectorlogo.com/logos/synthesia.svg", nangoId: null, status: "coming_soon" },
  { id: "descript", name: "Descript", desc: "AI editing and transcription", category: "Content & Media", logo: "https://www.descript.com/favicon.ico", nangoId: null, status: "coming_soon" },
  { id: "capcut", name: "CapCut", desc: "Video editing platform", category: "Content & Media", logo: "https://cdn.worldvectorlogo.com/logos/capcut.svg", nangoId: null, status: "coming_soon" },
];const CATEGORIES = ["All", ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))];

function IntegrationLogo({ src, name }: { src: string; name: string }) {
  const [error, setError] = React.useState(false);
  if (error) {
    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5 text-xs font-bold text-white">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img src={src} alt={name} className="w-8 h-8 object-contain"
      onError={() => setError(true)} />
  );
}

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [apiKeyModal, setApiKeyModal] = useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);

      try {
        const res = await fetch("/api/nango-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await res.json();
        if (data.token) setSessionToken(data.token);
      } catch (e) {
        console.error("Nango session error:", e);
      }

      const { data: keys } = await supabase
        .from("integration_keys")
        .select("integration_id")
        .eq("user_id", user.id);
      if (keys) setConnected(new Set(keys.map((k: any) => k.integration_id)));
    })();
  }, []);

  const connect = async (integration: Integration) => {
    if (integration.status === "coming_soon") return;

    if (connected.has(integration.id)) {
      setConnected(prev => { const next = new Set(prev); next.delete(integration.id); return next; });
      return;
    }

    if (integration.status === "apikey") {
      setApiKeyModal(integration);
      return;
    }

    if (!sessionToken) {
      alert("Session not ready. Please refresh and try again.");
      return;
    }

    setConnecting(integration.id);
    try {
      const nango = new Nango({ connectSessionToken: sessionToken });
      await nango.auth(integration.nangoId!);
      setConnected(prev => new Set(prev).add(integration.id));
    } catch (e) {
      console.error("Nango auth error:", e);
    }
    setConnecting(null);
  };

  const saveApiKey = async () => {
    if (!apiKeyModal || !apiKeyInput.trim()) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("integration_keys").upsert({
          user_id: user.id,
          integration_id: apiKeyModal.id,
          api_key: apiKeyInput.trim(),
          updated_at: new Date().toISOString(),
        });
      }
      setConnected(prev => new Set(prev).add(apiKeyModal.id));
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
    setApiKeyModal(null);
    setApiKeyInput("");
  };

  const filtered = INTEGRATIONS.filter(i => {
    const matchCat = category === "All" || i.category === category;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const statusBadge = (integration: Integration) => {
    if (connected.has(integration.id)) return null;
    if (integration.status === "coming_soon") return (
      <span className="text-[9px] font-bold uppercase text-yellow-500/70 bg-yellow-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
        <Clock size={8} /> Soon
      </span>
    );
    if (integration.status === "apikey") return (
      <span className="text-[9px] font-bold uppercase text-blue-400/70 bg-blue-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
        <Key size={8} /> API Key
      </span>
    );
    return null;
  };return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-gray-500">Connect your favorite apps to supercharge your empire.</p>
        </div>

        {connected.size > 0 && (
          <div className="mb-6 p-4 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-center gap-3">
            <Check size={16} className="text-green-400 shrink-0" />
            <p className="text-sm text-green-400 font-bold">{connected.size} integration{connected.size > 1 ? "s" : ""} connected</p>
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
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${category === cat ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((integration, i) => {
            const isConnected = connected.has(integration.id);
            const isConnecting = connecting === integration.id;
            const isComingSoon = integration.status === "coming_soon";
            return (
              <motion.div key={integration.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}
                className={`p-5 rounded-2xl border transition-all ${isConnected ? "border-green-500/30 bg-green-500/[0.03]" : isComingSoon ? "border-white/5 bg-white/[0.01] opacity-60" : "border-white/10 bg-white/[0.02]"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 p-1.5">
                      <IntegrationLogo src={integration.logo} name={integration.name} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{integration.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{integration.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {statusBadge(integration)}
                    {isConnected && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">{integration.desc}</p>
                <button onClick={() => connect(integration)} disabled={isConnecting || isComingSoon}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2
                    ${isConnected ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400 border border-green-500/20"
                    : isComingSoon ? "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"}`}>
                  {isConnecting ? <span className="animate-pulse">Connecting...</span>
                    : isConnected ? <><Check size={12} /> Connected</>
                    : isComingSoon ? <><Clock size={12} /> Coming Soon</>
                    : integration.status === "apikey" ? <><Key size={12} /> Add API Key</>
                    : <><Plus size={12} /> Connect</>}
                </button>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Zap size={32} className="mx-auto mb-3 opacity-20" />
            <p>No integrations found for &quot;{search}&quot;</p>
          </div>
        )}
      </div>

      {apiKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 p-1.5">
                <IntegrationLogo src={apiKeyModal.logo} name={apiKeyModal.name} />
              </div>
              <div>
                <p className="font-bold">Connect {apiKeyModal.name}</p>
                <p className="text-xs text-gray-500">Your API key is encrypted and stored securely</p>
              </div>
            </div>
            <input
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder={`Paste your ${apiKeyModal.name} API key...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20 mb-4 font-mono"
            />
            <div className="flex gap-3">
              <button onClick={() => { setApiKeyModal(null); setApiKeyInput(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10">
                Cancel
              </button>
              <button onClick={saveApiKey} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-100 disabled:opacity-50">
                {saving ? "Saving..." : "Save Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
}