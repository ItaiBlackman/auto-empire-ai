"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Globe, Rocket, Users } from "lucide-react";

const ROLES = [
  { title: "Senior AI Engineer", team: "Engineering", location: "Remote", type: "Full-time", desc: "Build and improve the AI agents that power AutoEmpire businesses. Experience with LLMs, prompt engineering, and Python required." },
  { title: "Full Stack Developer", team: "Engineering", location: "Remote", type: "Full-time", desc: "Work on our Next.js frontend and Supabase backend. You'll build the features thousands of entrepreneurs use every day." },
  { title: "Growth Marketer", team: "Marketing", location: "Remote", type: "Full-time", desc: "Own our user acquisition strategy. Run experiments, analyze data, and help us reach the next million entrepreneurs." },
  { title: "Customer Success Manager", team: "Support", location: "Remote", type: "Full-time", desc: "Help our users get the most out of AutoEmpire. You'll be the bridge between our users and our product team." },
  { title: "Sales Representative", team: "Sales", location: "Remote", type: "Full-time", desc: "Convert inbound leads into paying customers. You'll work with small business owners and entrepreneurs across the world." },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time", desc: "Design beautiful, intuitive interfaces for our platform. You'll shape how millions of people interact with AI businesses." },
];

export default function CareersPage() {
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

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">We're Hiring</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Build the future with us.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We're a small team building something massive. If you want to work on AI that actually runs real businesses, we want to hear from you.
          </p>
        </motion.div>

        {/* Why join */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <Globe size={20} />, title: "100% Remote", desc: "Work from anywhere in the world" },
            { icon: <Zap size={20} />, title: "Move fast", desc: "Ship features used by thousands weekly" },
            { icon: <Rocket size={20} />, title: "Equity", desc: "Own a piece of what we're building" },
            { icon: <Users size={20} />, title: "Small team", desc: "Your work has real impact from day one" },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">{item.icon}</div>
              <p className="font-bold text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Open roles */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold mb-6">Open Roles</h2>
          <div className="space-y-4">
            {ROLES.map((role, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{role.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{role.team}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{role.location}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{role.type}</span>
                    </div>
                  </div>
                  <a href={`/careers/apply?role=${encodeURIComponent(role.title)}`}
                    className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100">
                    Apply
                  </a>
                </div>
                <p className="text-sm text-gray-400">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-12 text-center p-12 rounded-3xl border border-white/10 bg-white/[0.02]">
          <h2 className="text-2xl font-bold mb-3">Don't see your role?</h2>
          <p className="text-gray-400 mb-6">We're always looking for exceptional people. Send us your CV and tell us how you'd contribute.</p>
          <a href={`/careers/apply?role=${encodeURIComponent(role.title)}`}
            className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all hover:scale-105">
            Send us your CV
          </a>
        </motion.div>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          © 2026 AutoEmpire AI. Inc. All rights reserved.
        </div>
      </footer>
    </dhiv>
  );
}
