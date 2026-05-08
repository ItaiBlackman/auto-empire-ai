"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with one AI business.",
    features: ["1 AI Business", "100 Leads/month", "Basic AI Agents", "Email Support"],
    cta: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "Scale with multiple businesses and advanced agents.",
    features: ["5 AI Businesses", "2,000 Leads/month", "Advanced AI Agents", "Priority Support", "Analytics Dashboard"],
    cta: "Upgrade to Pro",
    highlight: true,
    disabled: false,
  },
  {
    name: "Unlimited",
    price: "$149",
    period: "per month",
    description: "Full power. No limits.",
    features: ["Unlimited Businesses", "Unlimited Leads", "All AI Agents", "Dedicated Support", "Custom Integrations", "White Label"],
    cta: "Go Unlimited",
    disabled: false,
  },
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Simple Pricing</h1>
          <p className="text-gray-400 text-lg">Start free. Scale when you're ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl border flex flex-col ${plan.highlight ? 'border-white bg-white/5' : 'border-white/10 bg-white/[0.02]'}`}>
              {plan.highlight && (
                <span className="text-xs font-black uppercase px-3 py-1 bg-white text-black rounded-full w-fit mb-4">Most Popular</span>
              )}
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 text-sm mb-1">/{plan.period}</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-green-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.disabled}
                onClick={() => !plan.disabled && router.push("/dashboard")}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${plan.disabled ? 'bg-white/5 text-gray-500 cursor-not-allowed' : plan.highlight ? 'bg-white text-black hover:bg-gray-200' : 'border border-white/20 hover:bg-white/5'}`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}