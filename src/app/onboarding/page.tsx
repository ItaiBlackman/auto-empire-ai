"use client";

import React, { useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  { id: "website", name: "Website Builder", desc: "Build websites for local businesses using AI", icon: "🌐", category: "AUTOMATION" },
  { id: "leadgen", name: "Lead Gen Agency", desc: "Automated B2B lead generation with AI outreach", icon: "👥", category: "SERVICE" },
  { id: "content", name: "Content Studio", desc: "Multi-channel content creation and scheduling", icon: "✉️", category: "MARKETING" },
  { id: "saas", name: "SaaS Outreach", desc: "Cold email and LinkedIn automation for startups", icon: "🚀", category: "SALES" },
  { id: "dropship", name: "E-com Dropshipping", desc: "One-click store creation with trending products", icon: "⚡", category: "COMMERCE" },
  { id: "support", name: "AI Support Team", desc: "24/7 intelligent customer support for any website", icon: "📊", category: "INFRASTRUCTURE" },
  { id: "custom", name: "Custom Business", desc: "Build your own AI-powered business from scratch", icon: "✨", category: "CUSTOM" },
];

function OnboardingContent() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const createBusiness = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const name = selected.id === "custom" ? customName : selected.name;
    const desc = selected.id === "custom" ? customDesc : selected.desc;

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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-black rotate-45" />
            </div>
            <span className="text-xl font-bold">AutoEmpire</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {step === 1 ? "What kind of business do you want to build?" : `Set up ${selected?.id === "custom" ? "your business" : selected?.name}`}
          </h1>
          <p className="text-gray-500">
            {step === 1 ? "Choose a business type and our AI agents will run it for you automatically." : "Your AI agents will start finding leads and sending emails automatically."}
          </p>
        </motion.div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BUSINESS_TYPES.map((type, i) => (
              <motion.button key={type.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => { setSelected(type); setStep(2); }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-left group">
                <div className="text-3xl mb-4">{type.icon}</div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">{type.category}</p>
                <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">{type.name}</h3>
                <p className="text-sm text-gray-500">{type.desc}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {step === 2 && selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] mb-6">
              <div className="text-4xl mb-4">{selected.icon}</div>
              <span className="text-xs text-gray-500 uppercase font-bold">{selected.category}</span>
              <h2 className="text-2xl font-bold mt-1 mb-2">{selected.id === "custom" ? "Custom Business" : selected.name}</h2>

              {selected.id === "custom" ? (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Business Name</label>
                    <input value={customName} onChange={e => setCustomName(e.target.value)}
                      placeholder="e.g. My Marketing Agency"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold block mb-2">What does it do?</label>
                    <textarea value={customDesc} onChange={e => setCustomDesc(e.target.value)}
                      placeholder="Describe what your business does..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors resize-none" />
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 mt-2">{selected.desc}</p>
              )}

              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-2"><Zap size={12} /> What happens next</p>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>✅ Write your custom email templates</li>
                  <li>✅ AI agents start finding leads across Israel</li>
                  <li>✅ Emails send automatically to every lead</li>
                  <li>✅ You get notified for every response</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 border border-white/10 font-bold rounded-xl hover:bg-white/5 transition-colors">
                Back
              </button>
              <button onClick={createBusiness} disabled={loading || (selected.id === "custom" && (!customName || !customDesc))}
                className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Create & Set Up Emails</>}
              </button>
            </div>
          </motion.div>
        )}
      </div>
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