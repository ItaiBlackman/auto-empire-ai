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
  // Communication
  { id: "gmail", name: "Gmail", desc: "Send and receive emails", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg", nangoId: "google-mail", status: "oauth" },
  { id: "slack", name: "Slack", desc: "Team messaging and collaboration", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", nangoId: "slack", status: "oauth" },
  { id: "whatsapp", name: "WhatsApp", desc: "Message leads via WhatsApp", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", nangoId: null, status: "coming_soon" },
  { id: "telegram", name: "Telegram", desc: "Bot and messaging automation", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "twilio", name: "Twilio", desc: "SMS and voice calls", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg", nangoId: null, status: "apikey" },
  { id: "discord", name: "Discord", desc: "Communities and bot integrations", category: "Communication", logo: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png", nangoId: null, status: "coming_soon" },
  { id: "zoom", name: "Zoom", desc: "Video meetings and webinars", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Zoom_Logo_2022.svg", nangoId: null, status: "coming_soon" },
  { id: "intercom", name: "Intercom", desc: "Customer messaging platform", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Intercom_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "calendly", name: "Calendly", desc: "Appointment booking automation", category: "Communication", logo: "https://asset.brandfetch.io/idZFkEXLNa/idxMCGQyAN.svg", nangoId: null, status: "coming_soon" },
  { id: "mailchimp", name: "Mailchimp", desc: "Email marketing campaigns", category: "Communication", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mailchimp_logo.svg/1024px-Mailchimp_logo.svg.png", nangoId: null, status: "coming_soon" },

  // CRM & Sales
  { id: "hubspot", name: "HubSpot", desc: "CRM and marketing platform", category: "CRM & Sales", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "salesforce", name: "Salesforce", desc: "Enterprise CRM platform", category: "CRM & Sales", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", nangoId: "salesforce", status: "oauth" },
  { id: "pipedrive", name: "Pipedrive", desc: "Sales pipeline management", category: "CRM & Sales", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Pipedrive_logo.svg", nangoId: "pipedrive", status: "oauth" },
  { id: "apollo", name: "Apollo.io", desc: "B2B lead database and outreach", category: "CRM & Sales", logo: "https://asset.brandfetch.io/idM4SN0sFD/idyqnF_VHq.png", nangoId: null, status: "apikey" },
  { id: "gohighlevel", name: "GoHighLevel", desc: "Agency CRM platform", category: "CRM & Sales", logo: "https://asset.brandfetch.io/id2sP3v8cU/idxuTNDQlE.png", nangoId: null, status: "coming_soon" },
  { id: "close", name: "Close", desc: "Sales CRM for startups", category: "CRM & Sales", logo: "https://asset.brandfetch.io/idHYa8oZpd/idFivZqJVJ.svg", nangoId: null, status: "coming_soon" },
  { id: "instantly", name: "Instantly", desc: "Cold email outreach platform", category: "CRM & Sales", logo: "https://asset.brandfetch.io/idgX_1HuGB/idWa9P0s0v.png", nangoId: null, status: "apikey" },
  { id: "lemlist", name: "Lemlist", desc: "Personalized outreach automation", category: "CRM & Sales", logo: "https://asset.brandfetch.io/id-gsCCnDL/idT_rCWNqG.png", nangoId: null, status: "coming_soon" },

  // Productivity
  { id: "notion", name: "Notion", desc: "Docs, wikis, and databases", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", nangoId: "notion", status: "oauth" },
  { id: "google_calendar", name: "Google Calendar", desc: "Calendar and scheduling", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg", nangoId: "google-calendar", status: "oauth" },
  { id: "google_sheets", name: "Google Sheets", desc: "Spreadsheets and data", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg", nangoId: "google-sheet", status: "oauth" },
  { id: "airtable", name: "Airtable", desc: "Flexible database and spreadsheet", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "clickup", name: "ClickUp", desc: "Project and task management", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/ClickUp_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "asana", name: "Asana", desc: "Team and project tracking", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "trello", name: "Trello", desc: "Visual task boards", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/en/8/8c/Trello_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "monday", name: "Monday.com", desc: "Operations and work management", category: "Productivity", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Monday_logo.png", nangoId: null, status: "coming_soon" },
  { id: "linear", name: "Linear", desc: "Product development management", category: "Productivity", logo: "https://asset.brandfetch.io/idvBO9LTMU/idRcRJiRMH.svg", nangoId: null, status: "coming_soon" },

  // AI & Automation
  { id: "openai", name: "OpenAI", desc: "GPT-4 and DALL-E APIs", category: "AI & Automation", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", nangoId: null, status: "apikey" },
  { id: "claude", name: "Claude", desc: "AI assistant by Anthropic", category: "AI & Automation", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/1024px-Claude_AI_logo.svg.png", nangoId: null, status: "apikey" },
  { id: "gemini", name: "Google AI Studio", desc: "Gemini AI models", category: "AI & Automation", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg", nangoId: null, status: "apikey" },
  { id: "elevenlabs", name: "ElevenLabs", desc: "AI voice generation", category: "AI & Automation", logo: "https://asset.brandfetch.io/id9BCxNEbP/idVAv0isFI.png", nangoId: null, status: "apikey" },
  { id: "perplexity", name: "Perplexity AI", desc: "AI search and research", category: "AI & Automation", logo: "https://asset.brandfetch.io/idpL3S-7GN/idHEFPnHrh.png", nangoId: null, status: "apikey" },
  { id: "huggingface", name: "Hugging Face", desc: "Open-source AI models", category: "AI & Automation", logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", nangoId: null, status: "apikey" },
  { id: "replicate", name: "Replicate", desc: "Run AI models via API", category: "AI & Automation", logo: "https://asset.brandfetch.io/idEHJBjLmU/idwX9wHOkG.png", nangoId: null, status: "apikey" },
  { id: "mistral", name: "Mistral AI", desc: "LLM APIs", category: "AI & Automation", logo: "https://asset.brandfetch.io/idkAJgGNhM/idoR6bWMOh.png", nangoId: null, status: "apikey" },
  { id: "zapier", name: "Zapier", desc: "Automate workflows between apps", category: "AI & Automation", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "make", name: "Make", desc: "Advanced workflow automation", category: "AI & Automation", logo: "https://asset.brandfetch.io/idAnlOahxc/idHTdFDM6J.svg", nangoId: null, status: "coming_soon" },

  // Payments
  { id: "stripe", name: "Stripe", desc: "Payment processing and billing", category: "Payments", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", nangoId: null, status: "apikey" },
  { id: "paypal", name: "PayPal", desc: "Online payments", category: "Payments", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", nangoId: null, status: "coming_soon" },
  { id: "wise", name: "Wise", desc: "International money transfers", category: "Payments", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wise_logo_2022.svg/1024px-Wise_logo_2022.svg.png", nangoId: null, status: "coming_soon" },
  { id: "plaid", name: "Plaid", desc: "Banking and financial APIs", category: "Payments", logo: "https://asset.brandfetch.io/idVfgd8YFc/idR7mFGZ7r.svg", nangoId: null, status: "coming_soon" },
  { id: "coinbase", name: "Coinbase", desc: "Crypto integrations", category: "Payments", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/24px-Coinbase_logo.png", nangoId: null, status: "coming_soon" },
  { id: "binance", name: "Binance", desc: "Crypto trading APIs", category: "Payments", logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png", nangoId: null, status: "apikey" },
  { id: "alpaca", name: "Alpaca", desc: "Stock trading API", category: "Payments", logo: "https://asset.brandfetch.io/idpjGkpJlh/idC3u-xL1j.png", nangoId: null, status: "apikey" },

  // E-commerce
  { id: "shopify", name: "Shopify", desc: "E-commerce store management", category: "E-commerce", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg", nangoId: "shopify", status: "oauth" },
  { id: "woocommerce", name: "WooCommerce", desc: "WordPress e-commerce", category: "E-commerce", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/WooCommerce_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "gumroad", name: "Gumroad", desc: "Sell digital products", category: "E-commerce", logo: "https://asset.brandfetch.io/idmhN0PwIy/idmBXDPZ4p.png", nangoId: null, status: "coming_soon" },
  { id: "lemonsqueezy", name: "Lemon Squeezy", desc: "SaaS payments and subscriptions", category: "E-commerce", logo: "https://asset.brandfetch.io/idSO7iLLhz/id-6E5PjNK.png", nangoId: null, status: "coming_soon" },
  { id: "printful", name: "Printful", desc: "Print-on-demand fulfillment", category: "E-commerce", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Printful_logo.svg", nangoId: null, status: "coming_soon" },

  // Social Media
  { id: "instagram", name: "Instagram", desc: "Post and manage content", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png", nangoId: null, status: "coming_soon" },
  { id: "twitter", name: "X (Twitter)", desc: "Post and monitor tweets", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg", nangoId: null, status: "coming_soon" },
  { id: "linkedin", name: "LinkedIn", desc: "Professional network automation", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", nangoId: null, status: "coming_soon" },
  { id: "facebook", name: "Facebook", desc: "Pages and ad management", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", nangoId: null, status: "coming_soon" },
  { id: "tiktok", name: "TikTok", desc: "Short video content automation", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.svg", nangoId: null, status: "coming_soon" },
  { id: "youtube", name: "YouTube", desc: "Video publishing and analytics", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg", nangoId: null, status: "coming_soon" },
  { id: "spotify", name: "Spotify", desc: "Music and podcast integration", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg", nangoId: null, status: "coming_soon" },
  { id: "buffer", name: "Buffer", desc: "Social media scheduling", category: "Social Media", logo: "https://asset.brandfetch.io/idhjdAXpuB/idTB_xvYX0.svg", nangoId: null, status: "coming_soon" },
  { id: "hootsuite", name: "Hootsuite", desc: "Social media management", category: "Social Media", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Hootsuite_owl_logo.svg", nangoId: null, status: "coming_soon" },

  // Analytics & SEO
  { id: "google_analytics", name: "Google Analytics", desc: "Website traffic analytics", category: "Analytics & SEO", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Logo_Google_Analytics.svg", nangoId: null, status: "coming_soon" },
  { id: "ahrefs", name: "Ahrefs", desc: "SEO research and backlinks", category: "Analytics & SEO", logo: "https://asset.brandfetch.io/idxNBf9kej/idM1HYc_lO.png", nangoId: null, status: "apikey" },
  { id: "semrush", name: "SEMrush", desc: "SEO and competitor analysis", category: "Analytics & SEO", logo: "https://asset.brandfetch.io/idMpTwH1G4/idHrWjBfz5.png", nangoId: null, status: "apikey" },
  { id: "hotjar", name: "Hotjar", desc: "User behavior tracking", category: "Analytics & SEO", logo: "https://asset.brandfetch.io/idHNSB_Bw5/idRuuA2EHp.svg", nangoId: null, status: "coming_soon" },
  { id: "mixpanel", name: "Mixpanel", desc: "Product and event analytics", category: "Analytics & SEO", logo: "https://asset.brandfetch.io/idqJaJEJkK/idBfazMLzT.png", nangoId: null, status: "coming_soon" },
  { id: "posthog", name: "PostHog", desc: "Open-source product analytics", category: "Analytics & SEO", logo: "https://asset.brandfetch.io/idBGkA4vEV/idhg5NYRWB.png", nangoId: null, status: "coming_soon" },

  // Development
  { id: "github", name: "GitHub", desc: "Code repository management", category: "Development", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", nangoId: "github", status: "oauth" },
  { id: "gitlab", name: "GitLab", desc: "DevOps platform", category: "Development", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/GitLab_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "vercel", name: "Vercel", desc: "Frontend deployment platform", category: "Development", logo: "https://asset.brandfetch.io/idYnZDaUOa/idFMBBiLGS.svg", nangoId: null, status: "coming_soon" },
  { id: "supabase", name: "Supabase", desc: "Backend and database services", category: "Development", logo: "https://asset.brandfetch.io/id5hfWJKKN/idtYAMKGLZ.svg", nangoId: null, status: "coming_soon" },
  { id: "firebase", name: "Firebase", desc: "Google backend services", category: "Development", logo: "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "mongodb", name: "MongoDB", desc: "NoSQL database", category: "Development", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "cloudflare", name: "Cloudflare", desc: "CDN, security and workers", category: "Development", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg", nangoId: null, status: "coming_soon" },

  // Content & Media
  { id: "canva", name: "Canva", desc: "Graphic design and content", category: "Content & Media", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Canva_Logo.svg", nangoId: null, status: "coming_soon" },
  { id: "elevenlabs2", name: "ElevenLabs", desc: "AI voice generation", category: "Content & Media", logo: "https://asset.brandfetch.io/idnF4aVNE5/idR1SV-Sss.png", nangoId: null, status: "apikey" },
  { id: "heygen", name: "HeyGen", desc: "AI avatar video creation", category: "Content & Media", logo: "https://asset.brandfetch.io/id2uJiSJDt/idmC7jmNdY.png", nangoId: null, status: "coming_soon" },
  { id: "runway", name: "Runway", desc: "AI video generation", category: "Content & Media", logo: "https://asset.brandfetch.io/idDhbCjBR_/idxFk18M0W.png", nangoId: null, status: "coming_soon" },
  { id: "synthesia", name: "Synthesia", desc: "AI presenter videos", category: "Content & Media", logo: "https://asset.brandfetch.io/idkYR3J-VT/id1zH8bIPM.png", nangoId: null, status: "coming_soon" },
  { id: "descript", name: "Descript", desc: "AI editing and transcription", category: "Content & Media", logo: "https://asset.brandfetch.io/idRq0V3xgK/idKpGlU8qH.png", nangoId: null, status: "coming_soon" },
];

// Remove duplicate elevenlabs entry
const UNIQUE_INTEGRATIONS = INTEGRATIONS.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

const CATEGORIES = ["All", ...Array.from(new Set(UNIQUE_INTEGRATIONS.map(i => i.category)))];

function IntegrationLogo({ src, name }: { src: string; name: string }) {
  const [error, setError] = React.useState(false);
  if (error) {
    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 text-xs font-bold text-white">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-8 h-8 object-contain"
      onError={() => setError(true)}
    />
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
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      const res = await fetch("/api/nango-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.token) setSessionToken(data.token);
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

    setConnecting(integration.id);
    if (integration.nangoId && sessionToken) {
      try {
        const nango = new Nango({ connectSessionToken: sessionToken });
        await nango.auth(integration.nangoId);
        setConnected(prev => new Set(prev).add(integration.id));
      } catch (e) {
        console.error(e);
      }
    }
    setConnecting(null);
  };

  const saveApiKey = () => {
    if (!apiKeyModal || !apiKeyInput.trim()) return;
    setConnected(prev => new Set(prev).add(apiKeyModal.id));
    setApiKeyModal(null);
    setApiKeyInput("");
  };

  const filtered = UNIQUE_INTEGRATIONS.filter(i => {
    const matchCat = category === "All" || i.category === category;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const statusBadge = (integration: Integration) => {
    const isConnected = connected.has(integration.id);
    if (isConnected) return null;
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
  };

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

      {/* API Key Modal */}
      {apiKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 p-1.5">
                <IntegrationLogo src={apiKeyModal.logo} name={apiKeyModal.name} />
              </div>
              <div>
                <p className="font-bold">Connect {apiKeyModal.name}</p>
                <p className="text-xs text-gray-500">Enter your API key to connect</p>
              </div>
            </div>
            <input
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder={`Paste your ${apiKeyModal.name} API key...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setApiKeyModal(null); setApiKeyInput(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10">
                Cancel
              </button>
              <button onClick={saveApiKey}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-100">
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
}
