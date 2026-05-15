"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Zap, Globe, Users, Mail, BarChart3, ChevronRight, Play, Menu, X, Star, Shield, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PRICING_PLANS } from "@/utils/stripe/products";
import { AnimatePresence } from "framer-motion";

const LandingPage = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLaunch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push(`/signup?prompt=${encodeURIComponent(prompt)}`);
        return;
      }

      // If logged in, generate and redirect
      const response = await fetch("/api/generate-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
      }
    } catch (error) {
      console.error(error);
      router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (priceId: string) => {
    if (!priceId) {
      router.push("/signup");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signup");
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mb-8"
          />
          <h2 className="text-2xl font-bold tracking-tighter animate-pulse">Building your empire...</h2>
          <p className="text-gray-400 mt-2">Hiring AI employees, generating brand assets, and finding leads.</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <div className="w-4 h-4 bg-black rotate-45" />
            </div>
            AutoEmpire AI
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-gray-300 transition-colors">Login</Link>
            <button 
              onClick={() => {
                const el = document.getElementById('prompt-input');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  el.focus();
                } else {
                  router.push('/signup');
                }
              }}
              className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
            >
              Launch Now
            </button>
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-black p-8 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-black rotate-45" />
                </div>
                AutoEmpire AI
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-2xl font-bold">
              <a href="#marketplace" onClick={() => setMobileMenuOpen(false)}>Marketplace</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <hr className="border-white/10" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-gray-500">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">
              Introducing AutoEmpire AI 1.0
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Build your AI Empire <br /> in 60 seconds.
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              The world's first platform to launch fully automated AI businesses. 
              Pick a niche, enter a prompt, and watch your empire grow.
            </p>
            
            <form onSubmit={handleLaunch} className="max-w-2xl mx-auto mb-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/0 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl focus-within:border-white/30 transition-colors">
                <Sparkles className="ml-4 text-gray-500" size={20} />
                <input 
                  id="prompt-input"
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Build me a website agency for dentists in London"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 placeholder:text-gray-600 outline-none"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  Launch Now <ChevronRight size={18} />
                </button>
              </div>
            </form>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-500 text-sm font-medium">
              <div className="flex items-center gap-2"><Zap size={16} /> Instant Generation</div>
              <div className="flex items-center gap-2"><Users size={16} /> AI Staff Included</div>
              <div className="flex items-center gap-2"><Rocket size={16} /> Fully Automated</div>
            </div>
          </motion.div>

          {/* Trust Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <span className="font-black tracking-tighter text-2xl">FORBES</span>
            <span className="font-black tracking-tighter text-2xl">TECHCRUNCH</span>
            <span className="font-black tracking-tighter text-2xl">WIRED</span>
            <span className="font-black tracking-tighter text-2xl">THE VERGE</span>
          </motion.div>

          {/* Animated Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/10 blur-[120px] rounded-full -z-10" />
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">Marketplace</h2>
              <p className="text-gray-400">Choose a ready-made business model and launch instantly.</p>
            </div>
            <button className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all templates <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {
                  setPrompt(`Build me a ${template.title.toLowerCase()} agency`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/30 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                  {template.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{template.type}</span>
                  <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
                    Select
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Built for scale.</h2>
            <p className="text-gray-400">Everything you need to run a 7-figure AI agency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-full md:h-[600px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-6">
                  <Rocket size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Business Builder</h3>
                <p className="text-gray-400 leading-relaxed max-w-sm">
                  Our proprietary engine generates a complete business model, brand assets, and marketing collateral in under 60 seconds. Just type your niche and watch the magic happen.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Autonomous AI Staff</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    Each business comes with a dedicated team of AI employees working 24/7 to find leads and close deals.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users size={20} />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="md:col-span-1 p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Live Tracking</h3>
                <p className="text-gray-500 text-xs">Monitor revenue and leads in real-time.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="md:col-span-1 p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Instant Payouts</h3>
                <p className="text-gray-500 text-xs">Integrated Stripe payments for global scale.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Loved by Founders.</h2>
            <p className="text-gray-400">Join 10,000+ entrepreneurs building their AI empires.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "AutoEmpire AI changed my life. I launched a lead gen agency in 60 seconds and landed my first client in 48 hours.",
                author: "Alex Rivera",
                role: "SaaS Founder",
                rating: 5
              },
              {
                text: "The AI employees are actually smart. My Sales Manager agent handles everything from outreach to booking calls.",
                author: "Sarah Chen",
                role: "Agency Owner",
                rating: 5
              },
              {
                text: "Luxury UI, seamless experience. It feels like I'm using a billion-dollar platform. Best investment this year.",
                author: "Marcus Thorne",
                role: "Digital Nomad",
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6 text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-300 italic mb-8 leading-relaxed">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500" />
                  <div>
                    <p className="font-bold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Simple Pricing</h2>
          <p className="text-gray-400 mb-16">Start free, scale as your empire grows.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan, index) => (
              <div 
                key={plan.name}
                className={`p-8 rounded-3xl border ${plan.id === 'pro' ? 'border-white bg-white/[0.05]' : 'border-white/10 bg-black'} relative`}
              >
                {plan.id === 'pro' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  ${plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span>
                </div>
                <ul className="text-left space-y-4 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature} className="text-sm text-gray-400 flex items-center gap-2">
                      <Zap size={14} className="text-white" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => plan.price === 0 ? router.push("/signup") : handleCheckout(plan.priceId || '')}
                  className={`w-full py-3 rounded-xl font-bold transition-all inline-block text-center ${plan.id === 'pro' ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {plan.price === 0 ? "Start Free" : `Go ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-black rotate-45" />
                </div>
                AutoEmpire AI
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                The premier platform for launching and scaling automated AI businesses. 
                Build your legacy today.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI Employees</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2024 AutoEmpire AI. Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-white transition-colors"><Shield size={18} /></a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors"><Star size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const templates = [
  {
    title: "Lead Gen Agency",
    description: "Automated B2B lead generation with AI-driven outreach and CRM integration.",
    icon: <Users size={24} />,
    type: "Service"
  },
  {
    title: "Website Builder",
    description: "Instant high-conversion landing pages for local businesses using AI.",
    icon: <Globe size={24} />,
    type: "Automation"
  },
  {
    title: "Content Studio",
    description: "Multi-channel content creation and scheduling across all social platforms.",
    icon: <Mail size={24} />,
    type: "Marketing"
  },
  {
    title: "SaaS Outreach",
    description: "Cold email and LinkedIn automation for software startups.",
    icon: <Rocket size={24} />,
    type: "Sales"
  },
  {
    title: "E-com Dropshipping",
    description: "One-click store creation with trending product discovery and ads.",
    icon: <Zap size={24} />,
    type: "Commerce"
  },
  {
    title: "AI Support Team",
    description: "24/7 intelligent customer support agents for any website.",
    icon: <BarChart3 size={24} />,
    type: "Infrastructure"
  }
];

export default LandingPage;
