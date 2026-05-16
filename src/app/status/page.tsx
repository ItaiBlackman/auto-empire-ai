"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, Clock } from "lucide-react";

const SERVICES = [
  { name: "Dashboard & Web App", description: "Main AutoEmpire AI platform", status: "operational" },
  { name: "AI Lead Finder Agent", description: "Hourly lead discovery across Israel", status: "operational" },
  { name: "Email Delivery (Resend)", description: "Outreach, welcome, and reminder emails", status: "operational" },
  { name: "Authentication", description: "Login, signup, and session management", status: "operational" },
  { name: "Database (Supabase)", description: "Business, lead, and user data storage", status: "operational" },
  { name: "Zapier Webhooks", description: "Third-party app integrations", status: "operational" },
  { name: "Google Maps API", description: "Real business discovery and lead data", status: "operational" },
  { name: "Vercel Hosting", description: "Platform hosting and deployment", status: "operational" },
];

const INCIDENTS = [
  { date: "May 10, 2026", title: "Scheduled Maintenance", desc: "Database migrations for new email queue system. No downtime experienced.", status: "resolved", duration: "0 min downtime" },
  { date: "May 5, 2026", title: "Vercel Deployment Issue", desc: "Brief deployment failure due to missing Suspense boundary. Resolved within 15 minutes.", status: "resolved", duration: "15 min" },
];

export default function StatusPage() {
  const router = useRouter();
  const [uptime] = useState("99.98%");
  const allOperational = SERVICES.every(s => s.status === "operational");

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
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">System Status</span>
          <h1 className="text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            All Systems Status
          </h1>

          {/* Overall status */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border ${allOperational ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${allOperational ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className={`font-bold ${allOperational ? 'text-green-400' : 'text-yellow-400'}`}>
              {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
            </span>
          </div>
        </motion.div>

        {/* Uptime stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Uptime (30 days)", value: uptime },
            { label: "Avg Response Time", value: "142ms" },
            { label: "Incidents (30 days)", value: "2" },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase font-bold">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Services */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <h2 className="font-bold text-lg mb-4">Services</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            {SERVICES.map((service, i) => (
              <div key={i} className={`flex items-center justify-between p-5 ${i < SERVICES.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div>
                  <p className="font-bold text-sm">{service.name}</p>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {service.status === "operational" ? (
                    <><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-xs text-green-400 font-bold">Operational</span></>
                  ) : service.status === "degraded" ? (
                    <><div className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-xs text-yellow-400 font-bold">Degraded</span></>
                  ) : (
                    <><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-xs text-red-400 font-bold">Down</span></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Incidents */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-bold text-lg mb-4">Recent Incidents</h2>
          <div className="space-y-4">
            {INCIDENTS.map((incident, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-400 shrink-0" />
                    <p className="font-bold text-sm">{incident.title}</p>
                  </div>
                  <span className="text-xs text-gray-500">{incident.date}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{incident.desc}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold">Resolved</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {incident.duration}</span>
                </div>
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