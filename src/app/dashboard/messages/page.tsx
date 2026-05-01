"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageSquare, Loader2, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id);

    if (!businesses?.length) { setLoading(false); return; }

    const ids = businesses.map(b => b.id);
    const { data } = await supabase
      .from("messages")
      .select("*, businesses(name)")
      .in("business_id", ids)
      .order("created_at", { ascending: false });

    setMessages(data || []);
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
      <Loader2 className="animate-spin text-white/20" size={48} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-gray-500">{messages.length} messages sent by your AI agents.</p>
      </div>

      {messages.length === 0 ? (
        <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <MessageSquare size={40} className="text-gray-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">No messages yet</h3>
          <p className="text-sm text-gray-500">Your AI agents will send outreach messages automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Bot size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{msg.recipient || 'Unknown Recipient'}</p>
                    <p className="text-xs text-gray-500">{msg.businesses?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${msg.status === 'sent' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {msg.status || 'sent'}
                  </span>
                </div>
              </div>
              {msg.subject && <p className="text-sm font-bold mb-2">{msg.subject}</p>}
              <p className="text-sm text-gray-400 line-clamp-3">{msg.body || msg.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
