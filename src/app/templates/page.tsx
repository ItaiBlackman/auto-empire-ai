"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Users, Globe, Mail, Rocket, Zap, BarChart3, 
  TrendingUp, Home, Play, Layout, Gamepad2, 
  UserPlus, ShieldCheck, FileText, Music, ChevronRight
} from "lucide-react";

const ALL_TEMPLATES = [
  {
    title: "Lead Gen Agency",
    description: "Automated B2B lead generation with AI-driven outreach and CRM integration.",
    icon: <Users size={24} />,
    type: "Service"
  },
  {
    title: "Website Builder",
    description: "Instant high-conversion landing pages for local businesses using AI.",
    icon: <Globe size={24} />,
    type: "Automation"
  },
  {
    title: "Content Studio",
    description: "Multi-channel content creation and scheduling across all social platforms.",
    icon: <Mail size={24} />,
    type: "Marketing"
  },
  {
    title: "SaaS Outreach",
    description: "Cold email and LinkedIn automation for software startups.",
    icon: <Rocket size={24} />,
    type: "Sales"
  },
  {
    title: "E-com Dropshipping",
    description: "One-click store creation with trending product discovery and ads.",
    icon: <Zap size={24} />,
    type: "Commerce"
  },
  {
    title: "AI Support Team",
    description: "24/7 intelligent customer support agents for any website.",
    icon: <BarChart3 size={24} />,
    type: "Infrastructure"
  },
  {
    title: "AI Hedge Fund",
    description: "Fully autonomous AI that buys/sells stocks, ETFs, and options based on market analysis.",
    icon: <TrendingUp size={24} />,
    type: "Finance"
  },
  {
    title: "AI Real Estate Acquirer",
    description: "AI finds undervalued homes, Airbnb properties, or rental opportunities automatically.",
    icon: <Home size={24} />,
    type: "Real Estate"
  },
  {
    title: "AI YouTube Network",
    description: "AI runs dozens of faceless channels with automated video production.",
    icon: <Play size={24} />,
    type: "Content"
  },
  {
    title: "AI App Factory",
    description: "AI launches small SaaS/mobile apps continuously.",
    icon: <Layout size={24} />,
    type: "Software"
  },
  {
    title: "AI Game Studio",
    description: "AI creates mobile/Steam games, updates them, and monetizes with ads or purchases.",
    icon: <Gamepad2 size={24} />,
    type: "Gaming"
  },
  {
    title: "AI Recruiting Company",
    description: "AI matches employers with candidates and automates hiring.",
    icon: <UserPlus size={24} />,
    type: "HR"
  },
  {
    title: "AI Cybersecurity Scanner",
    description: "AI scans websites/businesses for vulnerabilities and sells protection monitoring.",
    icon: <ShieldCheck size={24} />,
    type: "Security"
  },
  {
    title: "AI Legal Document Company",
    description: "AI creates contracts, agreements, business documents, and compliance paperwork.",
    icon: <FileText size={24} />,
    type: "Legal"
  },
  {
    title: "AI Music Label",
    description: "AI creates songs, artists, beats, albums, and distributes them to Spotify/Apple Music.",
    icon: <Music size={24} />,
    type: "Entertainment"
  }
];

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <div className="w-4 h-4 bg-black rotate-45" />
            </div>
            AutoEmpire AI
          </a>
          <button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-white transition-colors">
            Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">Template Marketplace</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Choose your niche.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Browse our full library of AI-powered business models. Launch any of these in under 60 seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALL_TEMPLATES.map((template, index) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                router.push(`/signup?prompt=Build me a ${template.title.toLowerCase()} agency`);
              }}
              className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/30 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                {template.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{template.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {template.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{template.type}</span>
                <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold group-hover:bg-white group-hover:text-black transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1">
                  Select <ChevronRight size={12} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          © 2026 AutoEmpire AI. Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
