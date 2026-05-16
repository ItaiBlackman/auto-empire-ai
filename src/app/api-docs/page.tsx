"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Code, Copy, Check, Zap, Globe, Mail, Users } from "lucide-react";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/businesses",
    desc: "Get all businesses for the authenticated user",
    response: `{
  "businesses": [
    {
      "id": "uuid",
      "name": "EliteSite Architects",
      "description": "Website builder for local businesses",
      "status": "active",
      "leads": 159,
      "revenue": "$38,250",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}`,
  },
  {
    method: "POST",
    path: "/api/businesses",
    desc: "Create a new business",
    body: `{
  "name": "My New Business",
  "description": "What my business does",
  "status": "active"
}`,
    response: `{
  "business": {
    "id": "uuid",
    "name": "My New Business",
    "status": "active",
    "created_at": "2026-01-01T00:00:00Z"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/leads",
    desc: "Get all leads across all businesses",
    response: `{
  "leads": [
    {
      "id": "uuid",
      "name": "Café Dizengoff",
      "email": "contact@cafedizengoff.co.il",
      "company": "Café Dizengoff",
      "phone": "+972-3-123-4567",
      "status": "new",
      "business_id": "uuid",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}`,
  },
  {
    method: "POST",
    path: "/api/leads",
    desc: "Add a new lead manually",
    body: `{
  "business_id": "uuid",
  "name": "John's Restaurant",
  "email": "john@restaurant.co.il",
  "company": "John's Restaurant",
  "phone": "+972-3-000-0000",
  "status": "new"
}`,
    response: `{
  "lead": {
    "id": "uuid",
    "name": "John's Restaurant",
    "status": "new",
    "created_at": "2026-01-01T00:00:00Z"
  }
}`,
  },
  {
    method: "PATCH",
    path: "/api/leads/:id",
    desc: "Update a lead's status",
    body: `{
  "status": "contacted"
}`,
    response: `{
  "lead": {
    "id": "uuid",
    "status": "contacted",
    "updated_at": "2026-01-01T00:00:00Z"
  }
}`,
  },
  {
    method: "POST",
    path: "/api/webhooks",
    desc: "Register a Zapier webhook for events",
    body: `{
  "name": "Notify Slack on new lead",
  "url": "https://hooks.zapier.com/hooks/catch/...",
  "events": ["new_lead", "outreach_email"]
}`,
    response: `{
  "webhook": {
    "id": "uuid",
    "name": "Notify Slack on new lead",
    "active": true,
    "created_at": "2026-01-01T00:00:00Z"
  }
}`,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-500/10 text-green-400 border border-green-500/20",
  POST: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  PATCH: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  DELETE: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative">
      <pre className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-400 overflow-x-auto font-mono">{code}</pre>
      <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-gray-400" />}
      </button>
    </div>
  );
}

export default function ApiDocsPage() {
  const router = useRouter();
  const [openEndpoint, setOpenEndpoint] = useState<number | null>(0);

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

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">Developers</span>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">API Documentation</h1>
          <p className="text-gray-400 max-w-2xl">Build on top of AutoEmpire AI. Use our API to manage businesses, leads, and webhooks programmatically.</p>
        </motion.div>

        {/* Auth */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Code size={18} /> Authentication</h2>
          <p className="text-sm text-gray-400 mb-4">All API requests require a Bearer token. Get your API key from Settings → API Keys.</p>
          <CodeBlock code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://auto-empire-ai.vercel.app/api/businesses`} />
        </motion.div>

        {/* Base URL */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={18} /> Base URL</h2>
          <CodeBlock code="https://auto-empire-ai.vercel.app/api" />
        </motion.div>

        {/* Endpoints */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Zap size={18} /> Endpoints</h2>
          <div className="space-y-3">
            {ENDPOINTS.map((endpoint, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button onClick={() => setOpenEndpoint(openEndpoint === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors">
                  <span className={`text-xs font-black px-2 py-1 rounded-lg shrink-0 ${METHOD_COLORS[endpoint.method]}`}>
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-sm text-gray-300">{endpoint.path}</span>
                  <span className="text-xs text-gray-500 ml-auto hidden md:block">{endpoint.desc}</span>
                </button>
                {openEndpoint === i && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                    <p className="text-sm text-gray-400">{endpoint.desc}</p>
                    {endpoint.body && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Request Body</p>
                        <CodeBlock code={endpoint.body} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">Response</p>
                      <CodeBlock code={endpoint.response} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Webhook events */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Mail size={18} /> Webhook Events</h2>
          <p className="text-sm text-gray-400 mb-4">AutoEmpire fires these events to your registered webhooks:</p>
          <div className="space-y-3">
            {[
              { event: "new_lead", desc: "Fired when a new lead is found and added to your dashboard" },
              { event: "outreach_email", desc: "Fired when a cold outreach email is sent to a prospect" },
              { event: "welcome_email", desc: "Fired when a welcome email is sent to a new lead" },
              { event: "reminder_email", desc: "Fired when a 24-hour reminder email is sent" },
              { event: "send_email", desc: "Generic email send event with to, subject, and body fields" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/5">
                <code className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-1 rounded shrink-0">{item.event}</code>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
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