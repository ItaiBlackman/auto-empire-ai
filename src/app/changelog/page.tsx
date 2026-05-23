"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Check, ArrowUpRight } from "lucide-react";

const CHANGELOG = [
  {
    version: "1.5.0",
    date: "May 20, 2026",
    tag: "Feature Update",
    tagColor: "bg-blue-500/10 text-blue-400",
    changes: [
      "Expanded business templates from 6 to 15, including SEO, Video Ads, and LinkedIn Ghostwriting",
      "Enhanced dashboard with 'Scroll to Upgrade' button and dedicated upgrade section",
      "Updated integration branding with official SVG icons for Slack, GitHub, Stripe, and more",
      "Added Business Management features: Rename, Delete, Sell, and Add Members directly from the dashboard",
      "Audited all platform pages for data accuracy and brand consistency",
    ]
  },
  {
    version: "1.4.0",
    date: "May 16, 2026",
    tag: "Major Release",
    tagColor: "bg-green-500/10 text-green-400",
    changes: [
      "Added Zapier webhook integration — connect AutoEmpire to 6,000+ apps",
      "Added custom email templates per business — write your own outreach, welcome, and reminder emails",
      "Added Integrations page with 40+ app connectors",
      "Added Google Maps API integration for real lead finding across Israel",
      "Added Resend email API for direct email sending without Zapier",
      "Added email queue system for automated 24-hour reminder emails",
    ]
  },
  {
    version: "1.3.0",
    date: "May 10, 2026",
    tag: "Feature Update",
    tagColor: "bg-blue-500/10 text-blue-400",
    changes: [
      "Added Settings page with profile, security, notifications, and billing sections",
      "Added Two-factor authentication toggle",
      "Added notifications dropdown in dashboard header",
      "Added Pricing page with Free, Pro, and Unlimited plans",
      "Fixed sidebar navigation for all dashboard pages",
      "Added Revenue page with bar charts and business breakdown",
    ]
  },
  {
    version: "1.2.0",
    date: "May 5, 2026",
    tag: "Feature Update",
    tagColor: "bg-blue-500/10 text-blue-400",
    changes: [
      "Added Businesses, Leads, Messages, Tasks, and Settings pages",
      "Added stat cards on overview — each links to its own detailed page",
      "Added real-time lead tracking with Supabase subscriptions",
      "Added business detail modal with tasks and recent activity",
      "Added lead status management (New, Contacted, Qualified, Converted)",
    ]
  },
  {
    version: "1.1.0",
    date: "April 30, 2026",
    tag: "Feature Update",
    tagColor: "bg-blue-500/10 text-blue-400",
    changes: [
      "Launched Empire Overview dashboard",
      "Added AI Agents live activity feed",
      "Added Active Businesses panel",
      "Added notification bell and account dropdown",
      "Added upgrade flow and plan management",
    ]
  },
  {
    version: "1.0.0",
    date: "April 27, 2026",
    tag: "Launch",
    tagColor: "bg-orange-500/10 text-orange-400",
    changes: [
      "Initial launch of AutoEmpire AI",
      "6 business templates: Lead Gen, Website Builder, Content Studio, SaaS Outreach, E-com Dropshipping, AI Support Team",
      "Supabase authentication and database",
      "Landing page with marketplace and pricing",
      "Vercel deployment pipeline",
    ]
  },
];

export default function ChangelogPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <div className="w-4 h-4 bg-black rotate-45" />
            </div>
            AutoEmpire AI
          </a>
          <button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-white transition-colors">Back to Home</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">What's New</span>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">Changelog</h1>
          <p className="text-gray-400">Every update, improvement, and new feature we ship.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-12">
            {CHANGELOG.map((release, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="pl-12 relative">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold">v{release.version}</h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${release.tagColor}`}>{release.tag}</span>
                  <span className="text-xs text-gray-500 ml-auto">{release.date}</span>
                </div>
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <ul className="space-y-3">
                    {release.changes.map((change, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-400">
                        <Check size={14} className="text-green-400 shrink-0 mt-0.5" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          © 2026 AutoEmpire AI. Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}