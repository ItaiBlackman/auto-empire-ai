"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Check, Plus, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Dashboard from "@/components/Dashboard";

const INTEGRATIONS = [
  // AI & Automation
  { id: "claude", name: "Claude", desc: "AI assistant by Anthropic", category: "AI & Automation", color: "#D97706", logo: "🤖" },
  { id: "lovable", name: "Lovable", desc: "AI app builder", category: "AI & Automation", color: "#8B5CF6", logo: "💜" },
  { id: "zapier", name: "Zapier", desc: "Automate workflows between apps", category: "AI & Automation", color: "#FF4A00", logo: "⚡" },
  { id: "make", name: "Make", desc: "Visual automation platform", category: "AI & Automation", color: "#6D00CC", logo: "🔮" },
  { id: "n8n", name: "n8n", desc: "Open source automation", category: "AI & Automation", color: "#EA4B71", logo: "🔁" },
  { id: "openai", name: "OpenAI", desc: "GPT-4 and DALL-E APIs", category: "AI & Automation", color: "#10A37F", logo: "🧠" },

  // Communication
  { id: "slack", name: "Slack", desc: "Team messaging and collaboration", category: "Communication", color: "#4A154B", logo: "💬" },
  { id: "gmail", name: "Gmail", desc: "Send and receive emails", category: "Communication", color: "#EA4335", logo: "📧" },
  { id: "whatsapp", name: "WhatsApp", desc: "Message leads via WhatsApp", category: "Communication", color: "#25D366", logo: "📱" },
  { id: "telegram", name: "Telegram", desc: "Bot and messaging automation", category: "Communication", color: "#2CA5E0", logo: "✈️" },
  { id: "twilio", name: "Twilio", desc: "SMS and voice calls", category: "Communication", color: "#F22F46", logo: "📞" },
  { id: "mailchimp", name: "Mailchimp", desc: "Email marketing campaigns", category: "Communication", color: "#FFE01B", logo: "🐵" },
  { id: "sendgrid", name: "SendGrid", desc: "Transactional email service", category: "Communication", color: "#1A82E2", logo: "📨" },

  // E-commerce
  { id: "shopify", name: "Shopify", desc: "E-commerce store management", category: "E-commerce", color: "#96BF48", logo: "🛍️" },
  { id: "dropship", name: "Dropship.io", desc: "Dropshipping product research", category: "E-commerce", color: "#3B82F6", logo: "📦" },
  { id: "woocommerce", name: "WooCommerce", desc: "WordPress e-commerce", category: "E-commerce", color: "#7F54B3", logo: "🛒" },
  { id: "amazon", name: "Amazon Seller", desc: "Amazon marketplace integration", category: "E-commerce", color: "#FF9900", logo: "📦" },
  { id: "ebay", name: "eBay", desc: "eBay marketplace integration", category: "E-commerce", color: "#E53238", logo: "🏪" },
  { id: "etsy", name: "Etsy", desc: "Handmade and vintage marketplace", category: "E-commerce", color: "#F56400", logo: "🎨" },

  // Payments
  { id: "stripe", name: "Stripe", desc: "Payment processing and billing", category: "Payments", color: "#635BFF", logo: "💳" },
  { id: "paypal", name: "PayPal", desc: "Online payments", category: "Payments", color: "#003087", logo: "🅿️" },
  { id: "gumroad", name: "Gumroad", desc: "Sell digital products", category: "Payments", color: "#FF90E8", logo: "💰" },
  { id: "lemonsqueezy", name: "Lemon Squeezy", desc: "Payments for SaaS", category: "Payments", color: "#FFD234", logo: "🍋" },

  // CRM & Sales
  { id: "hubspot", name: "HubSpot", desc: "CRM and marketing platform", category: "CRM & Sales", color: "#FF7A59", logo: "🧡" },
  { id: "salesforce", name: "Salesforce", desc: "Enterprise CRM platform", category: "CRM & Sales", color: "#00A1E0", logo: "☁️" },
  { id: "pipedrive", name: "Pipedrive", desc: "Sales pipeline management", category: "CRM & Sales", color: "#28A745", logo: "📊" },
  { id: "apollo", name: "Apollo.io", desc: "Lead generation and outreach", category: "CRM & Sales", color: "#5C2D91", logo: "🚀" },

  // Productivity
  { id: "notion", name: "Notion", desc: "Docs, wikis, and databases", category: "Productivity", color: "#000000", logo: "📝" },
  { id: "airtable", name: "Airtable", desc: "Flexible database and spreadsheet", category: "Productivity", color: "#18BFFF", logo: "📋" },
  { id: "calendly", name: "Calendly", desc: "Schedule meetings automatically", category: "Productivity", color: "#006BFF", logo: "📅" },
  { id: "google_calendar", name: "Google Calendar", desc: "Calendar and scheduling", category: "Productivity", color: "#4285F4", logo: "📆" },
  { id: "google_sheets", name: "Google Sheets", desc: "Spreadsheets and data", category: "Productivity", color: "#0F9D58", logo: "📊" },
  { id: "trello", name: "Trello", desc: "Kanban project management", category: "Productivity", color: "#0052CC", logo: "📌" },

  // Analytics
  { id: "google_analytics", name: "Google Analytics", desc: "Website traffic analytics", category: "Analytics", color: "#E37400", logo: "📈" },
  { id: "mixpanel", name: "Mixpanel", desc: "Product analytics platform", category: "Analytics", color: "#7856FF", logo: "📉" },
  { id: "hotjar", name: "Hotjar", desc: "Heatmaps and user recordings", category: "Analytics", color: "#FD3A5C", logo: "🔥" },

  // Social Media
  { id: "instagram", name: "Instagram", desc: "Post and manage content", category: "Social Media", color: "#E1306C", logo: "📸" },
  { id: "twitter", name: "X (Twitter)", desc: "Post and monitor tweets", category: "Social Media", color: "#000000", logo: "𝕏" },
  { id: "linkedin", name: "LinkedIn", desc: "Professional network automation", category: "Social Media", color: "#0A66C2", logo: "💼" },
  { id: "tiktok", name: "TikTok", desc: "Short video content automation", category: "Social Media", color: "#010101", logo: "🎵" },
  { id: "facebook", name: "Facebook", desc: "Pages and ad management", category: "Social Media", color: "#1877F2", logo: "👥" },

  // Development
  { id: "github", name: "GitHub", desc: "Code repository management", category: "Development", color: "#181717", logo: "🐙" },
  { id: "vercel", name: "Vercel", desc: "Deploy and host web apps", category: "Development", color: "#000000", logo: "▲" },
  { id: "supabase", name: "Supabase", desc: "Open source Firebase alternative", category: "Development", color: "#3ECF8E", logo: "⚡" },
  { id: "webflow", name: "Webflow", desc: "No-code website builder", category: "Development", color: "#4353FF", logo: "🌊" },
];

const CATEGORIES = ["All", ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))];

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [connecting, setConnecting] = useState<string | null>(null);
  const router = useRouter();

  const toggle = async (id: string) => {
    setConnecting(id);
    await new Promise(r => setTimeout(r, 800));
    setConnected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setConnecting(null);
  };

  const filtered = INTEGRATIONS.filter(i => {
    const matchCat = category === "All" || i.category === category;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Dashboard>
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

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 flex-1">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search integrations..."
              className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
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
                <button onClick={() => toggle(integration.id)} disabled={isConnecting}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${isConnected ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400 border border-green-500/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                  {isConnecting ? (
                    <span className="animate-pulse">Connecting...</span>
                  ) : isConnected ? (
                    <><Check size={12} /> Connected</>
                  ) : (
                    <><Plus size={12} /> Connect</>
                  )}
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