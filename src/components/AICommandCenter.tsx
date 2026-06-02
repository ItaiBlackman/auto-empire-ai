"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, Zap, Loader2, User, Sparkles } from "lucide-react";

export const AICommandCenter = ({ business, onCommand }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: `Hello! I am the lead AI architect for ${business?.name}. How can I help you optimize your empire today?` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate AI Processing & Command Execution
    setTimeout(() => {
      let response = "";
      const cmd = userMessage.toLowerCase();

      if (cmd.includes("rename") || cmd.includes("change name")) {
        response = "Understood. I've initiated the rename protocol. Please confirm the new name in the settings tab.";
        onCommand('rename');
      } else if (cmd.includes("optimize") || cmd.includes("scale")) {
        response = "Analyzing market data... I've optimized your bidding strategy and content distribution. Growth efficiency increased by 12%.";
        onCommand('optimize');
      } else if (cmd.includes("status") || cmd.includes("how are we doing")) {
        response = `System status is optimal. ${business?.name} generated $420 in the last 24 hours with a 98% automation success rate.`;
      } else if (cmd.includes("delete") || cmd.includes("terminate")) {
        response = "I cannot perform a self-termination without secondary confirmation. Please use the 'Terminate Operations' button in the settings tab.";
      } else {
        response = "I'm processing your request. As your lead AI, I'm constantly monitoring operations to ensure maximum profitability. What else can I do for you?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-white text-black rounded-full shadow-2xl shadow-white/20 flex items-center justify-center z-[100] group"
      >
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        <MessageCircle size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl flex flex-col z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bot size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">AI Command Center</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Operator</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white text-black font-medium' 
                      : 'bg-white/5 border border-white/10 text-gray-300'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <Loader2 size={14} className="animate-spin text-gray-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/[0.01]">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Command your AI agents..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-white/20 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {['Optimize System', 'Check Status', 'Scale Empire'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => { setInput(suggestion); }}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};
