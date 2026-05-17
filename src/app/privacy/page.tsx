"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
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
          <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: January 1, 2026</p>
        </motion.div>

        <div className="space-y-8 text-gray-400 leading-relaxed">
          {[
            {
              title: "1. Information We Collect",
              content: `When you use AutoEmpire AI, we collect information you provide directly to us, such as your name, email address, and payment information when you create an account or make a purchase.\n\nWe also collect information automatically when you use our platform, including log data, device information, and usage data such as which features you use and how often.`
            },
            {
              title: "2. How We Use Your Information",
              content: `We use the information we collect to provide, maintain, and improve our services. This includes:\n\n• Operating and improving the AutoEmpire AI platform\n• Processing transactions and sending related information\n• Sending technical notices, updates, and support messages\n• Responding to your comments and questions\n• Monitoring and analyzing usage patterns to improve user experience\n• Detecting and preventing fraudulent transactions and other illegal activities`
            },
            {
              title: "3. Information Sharing",
              content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:\n\n• Service providers who assist in our operations (payment processors, cloud hosting, etc.)\n• Law enforcement when required by law\n• Other parties with your consent\n\nAll third-party service providers are contractually required to keep your information confidential and secure.`
            },
            {
              title: "4. Data Security",
              content: `We take the security of your data seriously. We implement industry-standard security measures including:\n\n• SSL/TLS encryption for all data in transit\n• Encrypted storage for sensitive data\n• Regular security audits\n• Row-level security on all database tables\n• Strict access controls for our team\n\nHowever, no method of transmission over the internet is 100% secure.`
            },
            {
              title: "5. Your AI Agents and Lead Data",
              content: `AutoEmpire AI's agents collect publicly available business information (names, addresses, phone numbers) to generate leads for your business. This data is:\n\n• Collected from public sources including Google Maps and business directories\n• Used solely for the purpose of your business outreach\n• Stored securely in your private account\n• Never shared with other AutoEmpire users\n\nYou are responsible for ensuring your use of this data complies with applicable laws including GDPR and CAN-SPAM.`
            },
            {
              title: "6. Cookies",
              content: `We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`
            },
            {
              title: "7. Your Rights",
              content: `You have the right to:\n\n• Access the personal information we hold about you\n• Correct inaccurate personal information\n• Request deletion of your personal information\n• Object to processing of your personal information\n• Data portability\n\nTo exercise any of these rights, contact us at autoempire.ai123@gmail.com`
            },
            {
              title: "8. Children's Privacy",
              content: `AutoEmpire AI is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.`
            },
            {
              title: "9. Changes to This Policy",
              content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.`
            },
            {
              title: "10. Contact Us",
              content: `If you have any questions about this Privacy Policy, please contact us at:\n\nAutoEmpire AI Inc.\nEmail: autoempire.ai123@gmail.com`
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
