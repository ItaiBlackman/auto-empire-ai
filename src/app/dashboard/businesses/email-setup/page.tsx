"use client";

import React, { useEffect, useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Mail, Check, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Dashboard from "@/components/Dashboard";

const VARIABLES = ["{{name}}", "{{company}}", "{{city}}", "{{business_name}}"];

function EmailSetupContent() {
  const [profile, setProfile] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(1);
  const [outreachSubject, setOutreachSubject] = useState("");
  const [outreachBody, setOutreachBody] = useState("");
  const [welcomeSubject, setWelcomeSubject] = useState("");
  const [welcomeBody, setWelcomeBody] = useState("");
  const [reminderSubject, setReminderSubject] = useState("");
  const [reminderBody, setReminderBody] = useState("");

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("business_id");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const [{ data: prof }, { data: biz }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        businessId
          ? supabase.from("businesses").select("*").eq("id", businessId).single()
          : supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
      ]);
      setProfile(prof);
      setBusiness(biz);
      if (biz) {
        setOutreachSubject(biz.outreach_email_subject || `I think we can help ${biz.name} grow`);
        setOutreachBody(biz.outreach_email_body || `Hi {{name}},\n\nI came across your business and thought we could help.\n\nWe run ${biz.name} and specialize in helping businesses like yours grow.\n\nWould you be open to a quick chat?\n\nBest,\n${biz.name} Team`);
        setWelcomeSubject(biz.welcome_email_subject || `Welcome to ${biz.name}!`);
        setWelcomeBody(biz.welcome_email_body || `Hi {{name}},\n\nWelcome to ${biz.name}! We're so excited to work with you.\n\nOur team is already working on your account and you'll hear from us within 24 hours.\n\nReply to this email with any questions!\n\nBest,\n${biz.name} Team`);
        setReminderSubject(biz.reminder_email_subject || `Still interested, {{name}}?`);
        setReminderBody(biz.reminder_email_body || `Hi {{name}},\n\nJust checking in — we reached out yesterday and wanted to make sure you got our message.\n\nWe'd love to help your business grow. Reply whenever you're ready!\n\nBest,\n${biz.name} Team`);
      }
      setLoading(false);
    })();
  }, [businessId]);

  const save = async () => {
    if (!business) return;
    setSaving(true);
    await supabase.from("businesses").update({
      outreach_email_subject: outreachSubject,
      outreach_email_body: outreachBody,
      welcome_email_subject: welcomeSubject,
      welcome_email_body: welcomeBody,
      reminder_email_subject: reminderSubject,
      reminder_email_body: reminderBody,
    }).eq("id", business.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/dashboard/businesses"), 1500);
  };

  const insertVariable = (variable: string, setter: (v: string) => void, current: string) => {
    setter(current + variable);
  };

  if (loading) return (
    <Dashboard profile={profile}>
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    </Dashboard>
  );

  const steps = [
    { num: 1, label: "Outreach" },
    { num: 2, label: "Welcome" },
    { num: 3, label: "Reminder" },
  ];

  return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Mail size={28} /> Email Templates
          </h1>
          <p className="text-gray-500 mt-1">
            Write the emails your AI agents will send to leads for <span className="text-white font-bold">{business?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <button onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${step === s.num ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {s.num}. {s.label}
              </button>
              {i < steps.length - 1 && <ArrowRight size={14} className="text-gray-600" />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <p className="text-xs text-gray-500 w-full mb-1">Click to insert a variable:</p>
          {VARIABLES.map(v => (
            <button key={v} onClick={() => {
              if (step === 1) insertVariable(v, setOutreachBody, outreachBody);
              if (step === 2) insertVariable(v, setWelcomeBody, welcomeBody);
              if (step === 3) insertVariable(v, setReminderBody, reminderBody);
            }}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-green-400 hover:bg-white/10 transition-colors">
              {v}
            </button>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 text-xs text-orange-400">
              <Zap size={12} className="inline mr-1" />
              This email gets sent to cold prospects your AI finds.
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Subject Line</label>
              <input value={outreachSubject} onChange={e => setOutreachSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Email Body</label>
              <textarea value={outreachBody} onChange={e => setOutreachBody(e.target.value)} rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors resize-none font-mono" />
            </div>
            <button onClick={() => setStep(2)}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              Next — Welcome Email <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-xs text-green-400">
              <Check size={12} className="inline mr-1" />
              This email gets sent immediately when a new lead is added.
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Subject Line</label>
              <input value={welcomeSubject} onChange={e => setWelcomeSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Email Body</label>
              <textarea value={welcomeBody} onChange={e => setWelcomeBody(e.target.value)} rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors resize-none font-mono" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 border border-white/10 font-bold rounded-xl hover:bg-white/5 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)}
                className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                Next — Reminder Email <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400">
              <Mail size={12} className="inline mr-1" />
              This email gets sent automatically 24 hours after the welcome email.
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Subject Line</label>
              <input value={reminderSubject} onChange={e => setReminderSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Email Body</label>
              <textarea value={reminderBody} onChange={e => setReminderBody(e.target.value)} rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors resize-none font-mono" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 py-3 border border-white/10 font-bold rounded-xl hover:bg-white/5 transition-colors">
                Back
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {saved ? <><Check size={16} /> Saved!</> : saving ? "Saving..." : "Save & Launch Agent"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Dashboard>
  );
}

export default function EmailSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    }>
      <EmailSetupContent />
    </Suspense>
  );
}