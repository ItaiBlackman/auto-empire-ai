"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp, Zap, Users, Mail, CreditCard, Settings, Globe } from "lucide-react";

const CATEGORIES = [
  {
    icon: <Zap size={20} />,
    title: "Getting Started",
    articles: [
      {
        q: "How do I create my first business?",
        a: "From your dashboard, click the '+ New Business' button in the top right. You'll be taken to the onboarding page where you can choose from 15 business templates or create a custom one. After selecting your business type, you'll be prompted to write your email templates, then your AI agents will start working automatically."
      },
      {
        q: "How do AI agents find leads?",
        a: "AutoEmpire's AI agents use Google Maps and other data sources to find real local businesses in your target area. They search for businesses that match your business type — for example, if you run a Website Builder business, they look for local businesses without websites. New leads are added to your dashboard automatically every hour."
      },
      {
        q: "When do emails start sending?",
        a: "Emails start sending automatically once you've saved your email templates and your business is set to active. The AI agent runs every hour, finds new leads, and sends your outreach, welcome, and reminder emails automatically. In test mode, all emails go to your own inbox so you can review them before going live."
      },
      {
        q: "What is test mode?",
        a: "Test mode sends all automated emails to your own email address instead of to real prospects. This lets you review exactly what your leads will receive before going live. When you're happy with everything, contact support to switch to live mode."
      },
    ]
  },
  {
    icon: <Mail size={20} />,
    title: "Email Templates",
    articles: [
      {
        q: "How do I write my email templates?",
        a: "Go to your Businesses page, click on any business, and click 'Edit Emails'. You'll see three tabs: Outreach (cold email to prospects), Welcome (sent when a lead is added), and Reminder (sent 24 hours after welcome). Write your emails and use variables like {{name}}, {{company}}, {{city}} to personalize each one."
      },
      {
        q: "What are email variables?",
        a: "Variables are placeholders that get replaced with real data for each lead. Available variables are:\n• {{name}} — the business or person's name\n• {{company}} — the company name\n• {{city}} — the city they're located in\n• {{business_name}} — your AutoEmpire business name"
      },
      {
        q: "When does the reminder email send?",
        a: "The reminder email sends automatically 24 hours after the welcome email. It's queued in our system and fires on the next agent run after 24 hours have passed. You don't need to do anything — it's fully automated."
      },
      {
        q: "Can I have different emails for different businesses?",
        a: "Yes! Every business has its own email templates. Go to each business and click 'Edit Emails' to write unique outreach, welcome, and reminder emails for that specific business."
      },
    ]
  },
  {
    icon: <Globe size={20} />,
    title: "Integrations",
    articles: [
      {
        q: "How do I connect Zapier?",
        a: "Go to the Zapier page in your dashboard sidebar. Click 'Add Webhook', give it a name, paste your Zapier webhook URL (from Webhooks by Zapier → Catch Hook), select which events should trigger it, and save. Then in Zapier, add a Gmail action to send emails using the {{data__to_email}}, {{data__subject}}, and {{data__body}} fields."
      },
      {
        q: "What apps can I connect?",
        a: "AutoEmpire integrates with 40+ apps including Gmail, Slack, WhatsApp, Stripe, Shopify, HubSpot, Salesforce, Notion, Google Sheets, Calendly, and many more. Go to the Integrations page in your dashboard to see the full list and connect them."
      },
      {
        q: "Does AutoEmpire work without Zapier?",
        a: "Yes! AutoEmpire uses Resend to send emails directly without needing Zapier. Zapier is optional and useful if you want to connect other apps like Slack notifications or CRM updates when leads come in."
      },
    ]
  },
  {
    icon: <CreditCard size={20} />,
    title: "Billing & Plans",
    articles: [
      {
        q: "What's included in the free plan?",
        a: "The free plan includes 1 AI business, up to 100 leads per month, basic AI agents, and email support. It's a great way to test AutoEmpire before upgrading."
      },
      {
        q: "How do I upgrade my plan?",
        a: "Click the 'Upgrade' button in the bottom left of your dashboard sidebar, or go to Settings → Billing → Upgrade Plan. You can choose between Pro (₪49/month) and Unlimited (₪149/month)."
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes, you can cancel your subscription at any time from Settings → Billing → Cancel Subscription. Your plan will remain active until the end of your current billing period."
      },
      {
        q: "Do you offer refunds?",
        a: "We offer refunds within 7 days of your first payment if you're not satisfied. After that, all payments are non-refundable. Contact support@autoempire.ai to request a refund."
      },
    ]
  },
  {
    icon: <Settings size={20} />,
    title: "Account & Settings",
    articles: [
      {
        q: "How do I change my password?",
        a: "Go to Settings → Security → Change Password. We'll send a password reset link to your email address. Click the link and follow the instructions to set a new password."
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings → Danger Zone → Delete Account. This action is permanent and cannot be undone. All your businesses, leads, and data will be permanently deleted."
      },
      {
        q: "How do I update my name or email?",
        a: "Go to Settings → Profile. You can update your full name there and click Save Changes. Your email address cannot be changed — it's tied to your login."
      },
    ]
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (key: string) => {
    setOpenItems(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    articles: cat.articles.filter(a =>
      a.q.toLowerCase().includes(search.toLowerCase()) ||
      a.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.articles.length > 0);

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">Help Center</span>
          <h1 className="text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">How can we help?</h1>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10 max-w-lg mx-auto">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600" />
          </div>
        </motion.div>

        <div className="space-y-8">
          {filtered.map((cat, ci) => (
            <motion.div key={ci} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.05 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {cat.icon}
                </div>
                <h2 className="font-bold text-lg">{cat.title}</h2>
              </div>
              <div className="space-y-2">
                {cat.articles.map((article, ai) => {
                  const key = `${ci}-${ai}`;
                  const isOpen = openItems.includes(key);
                  return (
                    <div key={ai} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                      <button onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors">
                        <span className="font-bold text-sm pr-4">{article.q}</span>
                        {isOpen ? <ChevronUp size={16} className="text-gray-500 shrink-0" /> : <ChevronDown size={16} className="text-gray-500 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-gray-400 whitespace-pre-line border-t border-white/5 pt-4">
                          {article.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-16 text-center p-12 rounded-3xl border border-white/10 bg-white/[0.02]">
          <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
          <p className="text-gray-400 mb-6">Our support team is available 24/7 to help you out.</p>
          <button onClick={() => router.push("/contact")}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all hover:scale-105">
            Contact Support
          </button>
        </motion.div>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          © 2026 AutoEmpire AI. Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}