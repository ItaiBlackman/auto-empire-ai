"use client";

import React, { useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ChevronRight, Zap, Users, Globe, Mail, Rocket, BarChart, Search, Play, Star, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  { id: "leadgen", name: "Lead Gen Agency", desc: "Automated B2B lead generation with AI-driven outreach and CRM integration.", icon: Users, category: "SERVICE" },
  { id: "website", name: "Website Builder", desc: "Instant high-conversion landing pages for local businesses using AI.", icon: Globe, category: "AUTOMATION" },
  { id: "content", name: "Content Studio", desc: "Multi-channel content creation and scheduling across all social platforms.", icon: Mail, category: "MARKETING" },
  { id: "saas", name: "SaaS Outreach", desc: "Cold email and LinkedIn automation for software startups.", icon: Rocket, category: "SALES" },
  { id: "dropship", name: "E-com Dropshipping", desc: "One-click store creation with trending product discovery and ads.", icon: Zap, category: "COMMERCE" },
  { id: "support", name: "AI Support Team", desc: "24/7 intelligent customer support agents for any website.", icon: BarChart, category: "INFRASTRUCTURE" },
  { id: "seo", name: "SEO Authority", desc: "Automated backlink building and keyword-optimized content clusters.", icon: Search, category: "MARKETING" },
  { id: "video", name: "Video Ads Agency", desc: "AI-generated video scripts and production for high-ROAS social ads.", icon: Play, category: "CREATIVE" },
  { id: "newsletter", name: "Newsletter Empire", desc: "Curation and growth automation for niche-specific premium newsletters.", icon: Mail, category: "MEDIA" },
  { id: "linkedin", name: "LinkedIn Ghostwriting", desc: "Authority-building personal brand management for executives via AI.", icon: Users, category: "SERVICE" },
  { id: "amazon", name: "Amazon FBA Bot", desc: "Inventory management and review automation for e-commerce sellers.", icon: Zap, category: "COMMERCE" },
  { id: "realestate", name: "Real Estate Leads", desc: "Automated property valuation and lead qualification for realtors.", icon: Globe, category: "SALES" },
  { id: "appdev", name: "App Development", desc: "No-code app generation and deployment for small businesses.", icon: Rocket, category: "TECH" },
  { id: "influencer", name: "Influencer Matcher", desc: "AI-powered brand-to-influencer matchmaking and campaign tracking.", icon: Star, category: "MARKETING" },
  { id: "legal", name: "Legal Document Bot", desc: "Automated contract generation and review for startups and SMEs.", icon: Shield, category: "LEGAL" },
];

function OnboardingContent() {
  const [selected, setSelected] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const createBusiness = async (type?: any) => {
    const business_type = type || selected;
    if (!business_type && !prompt) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const name = business_type ? business_type.name : prompt;
    const desc = business_type ? business_type.desc : `AI-powered business: ${prompt}`;

    const { data: business } = await supabase.from("businesses").insert({
      user_id: user.id,
      name,
      description: desc,
      status: "active",
      leads: 0,
      revenue: "$0",
    }).select().single();

    setLoading(false);
    if (business) {
      router.push(`/dashboard/businesses/email-setup?business_id=${business.id}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/dashboard" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <div className="w-4 h-4 bg-black rotate-45" />
            </div>
            AutoEmpire AI
          </a>
          <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-white transition-colors">
            Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">
              Launch a New Business
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              What empire will you<br />build next?
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
              Pick a business model below or describe your own. Your AI agents will handle everything automatically.
            </p>

            {/* Prompt input */}
            <div className="max-w-2xl mx-auto mb-16 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/0 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl focus-within:border-white/30 transition-colors">
                <Zap className="ml-4 text-gray-500 shrink-0" size={20} />
                <input
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createBusiness()}
                  placeholder="e.g. Build me a social media agency for restaurants in Tel Aviv"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 placeholder:text-gray-600 outline-none"
                />
                <button
                  onClick={() => createBusiness()}
                  disabled={loading || !prompt}
                  className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Launch Now <ChevronRight size={18} /></>}
                </button>
              </div>
            </div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/10 blur-[120px] rounded-full -z-10" />
        </div>
      </section>

      {/* Business type grid */}
      <section className="pb-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4 pt-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Or choose a template</h2>
              <p className="text-gray-400">Ready-made AI business models you can launch instantly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUSINESS_TYPES.map((type, i) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => createBusiness(type)}
                  className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/30 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{type.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{type.category}</span>
                    <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold group-hover:bg-white group-hover:text-black transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      {loading ? <Loader2 size={12} className="animate-spin" /> : "Launch"} <ChevronRight size={12} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}