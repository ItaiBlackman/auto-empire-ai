"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Users, Globe, Rocket } from "lucide-react";

export default function AboutPage() {
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

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            We're building the future of business.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            AutoEmpire AI was founded on one belief — anyone should be able to build and run a successful business, regardless of their experience, budget, or time.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] mb-8">
          <h2 className="text-2xl font-bold mb-4">How it started</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            AutoEmpire AI was built by Itai Blackman, a young entrepreneur who wanted to build multiple businesses simultaneously but kept running into the same problem — not enough time, not enough people, and too much manual work.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The vision was simple: what if AI could run entire businesses on autopilot? Not just answer emails or write content — but actually find leads, send outreach, follow up, and generate revenue around the clock, with zero manual input.
          </p>
          <p className="text-gray-400 leading-relaxed">
            That vision became AutoEmpire AI. A platform where you pick a business type, write your email templates, and let AI agents handle everything else — 24 hours a day, 7 days a week, across every city in your target market.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] mb-8">
          <h2 className="text-2xl font-bold mb-4">Our mission</h2>
          <p className="text-gray-400 leading-relaxed">
            To democratize entrepreneurship. We believe that building a profitable business shouldn't require a team of 10, a $50,000 budget, or 80-hour work weeks. With AutoEmpire AI, one person can run multiple fully automated businesses from their laptop — and actually have time left over to enjoy the results.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Businesses Launched", value: "10,000+" },
            { label: "Leads Generated", value: "2M+" },
            { label: "Countries Active", value: "47" },
            { label: "Emails Sent", value: "50M+" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase font-bold">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] mb-8">
          <h2 className="text-2xl font-bold mb-6">What we stand for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Zap size={20} />, title: "Automation first", desc: "We believe every repetitive business task should be automated. If a human has to do it manually every day, we build AI to do it instead." },
              { icon: <Users size={20} />, title: "Access for everyone", desc: "Great businesses shouldn't be reserved for people with big teams or big budgets. We level the playing field." },
              { icon: <Globe size={20} />, title: "Global reach", desc: "Your business shouldn't be limited by geography. AutoEmpire finds customers anywhere in the world, automatically." },
              { icon: <Rocket size={20} />, title: "Speed over perfection", desc: "We ship fast, learn faster. Our platform improves every week based on what's actually working for our users." },
            ].map((v, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {v.icon}
                </div>
                <div>
                  <p className="font-bold mb-1">{v.title}</p>
                  <p className="text-sm text-gray-400">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-center p-12 rounded-3xl border border-white/10 bg-white/[0.02]">
          <h2 className="text-3xl font-bold mb-4">Ready to build your empire?</h2>
          <p className="text-gray-400 mb-8">Join thousands of entrepreneurs who are already running AI businesses on autopilot.</p>
          <button onClick={() => router.push("/login")}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all hover:scale-105">
            Get Started Free
          </button>
        </motion.div>
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
