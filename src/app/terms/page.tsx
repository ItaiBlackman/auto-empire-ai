"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TermsPage() {
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

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 bg-white/5">Legal</span>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">Terms of Service</h1>
          <p className="text-gray-500">Last updated: January 1, 2026</p>
        </motion.div>

        <div className="space-y-8 text-gray-400 leading-relaxed">
          {[
            {
              title: "1. Acceptance of Terms",
              content: `By accessing or using AutoEmpire AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.\n\nThese terms apply to all users of AutoEmpire AI, including users who are browsers, customers, merchants, and contributors of content.`
            },
            {
              title: "2. Description of Service",
              content: `AutoEmpire AI is an AI-powered business automation platform that helps entrepreneurs create and manage automated businesses. Our platform includes:\n\n• AI agents that find and contact potential leads\n• Automated email outreach and follow-up systems\n• Business management dashboard\n• Integration with third-party services\n\nWe reserve the right to modify, suspend, or discontinue any part of our service at any time.`
            },
            {
              title: "3. User Accounts",
              content: `To use AutoEmpire AI, you must create an account. You are responsible for:\n\n• Maintaining the confidentiality of your account credentials\n• All activities that occur under your account\n• Ensuring your account information is accurate and up to date\n\nYou must be at least 18 years old to create an account. We reserve the right to terminate accounts that violate these terms.`
            },
            {
              title: "4. Acceptable Use",
              content: `You agree not to use AutoEmpire AI to:\n\n• Send spam or unsolicited messages in violation of applicable law\n• Harass, abuse, or harm any person\n• Violate any local, national, or international law or regulation\n• Collect or harvest personal data without consent\n• Impersonate any person or entity\n• Engage in any fraudulent or deceptive practices\n• Interfere with or disrupt the integrity of our platform\n\nViolation of these rules may result in immediate account termination.`
            },
            {
              title: "5. Email Outreach Compliance",
              content: `When using AutoEmpire AI's automated email features, you are solely responsible for ensuring compliance with all applicable email laws including:\n\n• CAN-SPAM Act (United States)\n• GDPR (European Union)\n• CASL (Canada)\n• Any local laws in your target market\n\nYou must ensure all outreach emails include a valid unsubscribe mechanism and your accurate business information. AutoEmpire AI is not liable for any legal issues arising from your email campaigns.`
            },
            {
              title: "6. Payment and Billing",
              content: `Paid plans are billed in advance on a monthly or annual basis. All payments are non-refundable except as required by law.\n\nWe reserve the right to change our pricing at any time. We will give you at least 30 days notice before any price changes take effect.\n\nFailed payments may result in suspension of your account until payment is resolved.`
            },
            {
              title: "7. Intellectual Property",
              content: `AutoEmpire AI and its original content, features, and functionality are owned by AutoEmpire AI Inc. and are protected by international copyright, trademark, and other intellectual property laws.\n\nContent you create using our platform remains your property. By using our platform, you grant us a limited license to use your content solely to provide the service.`
            },
            {
              title: "8. Limitation of Liability",
              content: `AutoEmpire AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.\n\nOur total liability to you for any claims arising from these terms shall not exceed the amount you paid us in the 12 months prior to the claim.`
            },
            {
              title: "9. Termination",
              content: `We may terminate or suspend your account at any time for any reason, including violation of these terms. Upon termination, your right to use the service will immediately cease.\n\nYou may cancel your account at any time from your account settings. Cancellation takes effect at the end of your current billing period.`
            },
            {
              title: "10. Changes to Terms",
              content: `We reserve the right to modify these terms at any time. We will notify you of significant changes via email or a notice on our platform. Your continued use of AutoEmpire AI after changes constitutes acceptance of the new terms.`
            },
            {
              title: "11. Contact",
              content: `For questions about these Terms of Service, contact us at:\n\nAutoEmpire AI Inc.\nEmail: legal@autoempire.ai`
            },
          ].map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h2 className="text-white font-bold text-lg mb-3">{section.title}</h2>
              <p className="whitespace-pre-line text-sm">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          © 2026 AutoEmpire AI. Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}