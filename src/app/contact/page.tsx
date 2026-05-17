"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, MessageSquare, Zap, Check, Loader2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">Get in Touch</span>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            We're here to help.
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have a question, problem, or idea? Our team responds within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Mail size={20} />, title: "Email Support", desc: "autoempire.ai123@gmail.com", sub: "Response within 24 hours" },
            { icon: <MessageSquare size={20} />, title: "Live Chat", desc: "Available in dashboard", sub: "Monday to Friday, 9am–6pm" },
            { icon: <Zap size={20} />, title: "Help Center", desc: "Browse all articles", sub: "Instant answers to common questions", link: "/help" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => item.link && router.push(item.link)}
              className={`p-6 rounded-2xl border border-white/10 bg-white/[0.02] ${item.link ? 'cursor-pointer hover:border-white/20 transition-all' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <p className="font-bold mb-1">{item.title}</p>
              <p className="text-sm text-white mb-1">{item.desc}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Message sent!</h3>
              <p className="text-gray-400">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Your Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Itai Blackman"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Email Address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="itai@example.com" type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors resize-none" />
              </div>
              <button onClick={handleSubmit} disabled={sending || !name || !email || !message}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40">
                {sending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send Message"}
              </button>
            </div>
          )}
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
