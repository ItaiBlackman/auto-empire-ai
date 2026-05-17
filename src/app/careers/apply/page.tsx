"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Check, Upload, ArrowLeft } from "lucide-react";

function ApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Open Position";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [why, setWhy] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !why) return;
    setSending(true);

    // Send via mailto
    const subject = encodeURIComponent(`Job Application — ${role} — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nLinkedIn: ${linkedin || "Not provided"}\n\nWhy I want to join AutoEmpire:\n${why}`
    );
    window.open(`mailto:autoempire.ai123@gmail.com?subject=${subject}&body=${body}`);

    await new Promise(r => setTimeout(r, 1000));
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
          <button onClick={() => router.push("/careers")} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Careers
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">We're Hiring</span>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Apply for {role}</h1>
          <p className="text-gray-400">Fill in your details and we'll get back to you within 48 hours.</p>
        </motion.div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center p-16 rounded-3xl border border-white/10 bg-white/[0.02]">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application sent!</h2>
            <p className="text-gray-400 mb-8">We'll review your application and get back to you within 48 hours.</p>
            <button onClick={() => router.push("/careers")}
              className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Back to Careers
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-5">
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Email Address *</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">LinkedIn Profile</label>
              <input value={linkedin} onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Why do you want to join AutoEmpire? *</label>
              <textarea value={why} onChange={e => setWhy(e.target.value)}
                placeholder="Tell us about yourself, your experience, and why you'd be a great fit..."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors resize-none" />
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
              <Upload size={16} className="text-gray-500 shrink-0" />
              <div>
                <p className="text-sm font-bold">Attach your CV</p>
                <p className="text-xs text-gray-500">After clicking Apply, attach your CV to the email that opens.</p>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={sending || !name || !email || !why}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40">
              {sending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Apply Now"}
            </button>
          </motion.div>
        )}
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          © 2026 AutoEmpire AI. Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}