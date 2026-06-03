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
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex flex-col z-[200] overflow-hidden"
          >
            {/* Background Neural Animation (CSS only for speed) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                  <Sparkles size={28} className="text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase italic">Neural Link <span className="text-blue-500">v4.0</span></h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">System: Fully Autonomous / Intelligence: Beyond Human</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
              >
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Close Link</span>
                <X size={20} className="text-gray-500 group-hover:text-white" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-12 space-y-8 relative z-10 max-w-5xl mx-auto w-full custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-6 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                      msg.role === 'user' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-blue-400'
                    }`}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`p-6 rounded-3xl text-sm leading-relaxed shadow-2xl ${
                      msg.role === 'user' 
                        ? 'bg-white text-black font-bold rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                      <Bot size={18} />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tl-none backdrop-blur-md">
                      <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-12 relative z-10">
              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-60" />
                  <div className="relative bg-black border border-white/10 rounded-2xl flex items-center p-2 shadow-2xl">
                    <input
                      type="text"
                      value={input}
                      autoFocus
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Give a command to your Ultimate AI..."
                      className="flex-1 bg-transparent border-none py-4 px-6 text-lg focus:outline-none placeholder:text-gray-700 font-medium"
                    />
                    <button 
                      onClick={handleSend}
                      className="p-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-3 group/btn"
                    >
                      <span className="text-sm font-black uppercase tracking-widest hidden md:block">Transmit</span>
                      <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {['Optimize Entire Infrastructure', 'Execute Market Analysis', 'Scale Active Operations', 'System Health Audit'].map(suggestion => (
                    <button 
                      key={suggestion}
                      onClick={() => { setInput(suggestion); }}
                      className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-500 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
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
