"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, MessageSquare, CheckSquare, 
  Zap, Bot, ArrowUpRight, ArrowDownRight,
  Activity, Target, Shield, Cpu, Play, Pause,
  Settings, MessageCircle, BarChart3, Clock,
  DollarSign, Globe, PieChart, Layers
} from "lucide-react";

// --- Sub-components for the AI OS Dashboard ---

export const StatCard = ({ label, value, change, icon, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all" />
    <div className="flex items-center justify-between mb-3 relative z-10">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {change}
        </div>
      )}
    </div>
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider relative z-10">{label}</p>
    <p className="text-2xl font-bold mt-1 relative z-10 tracking-tight">{value}</p>
  </motion.div>
);

export const AIControlCenter = ({ status, actions, goals, isAutonomous, onToggle }: any) => (
  <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] h-full">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Cpu size={20} className="text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold">AI Control Center</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAutonomous ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-[10px] text-gray-500 uppercase font-black">{status}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onToggle}
          className={`p-2 rounded-lg border transition-colors ${isAutonomous ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
          {isAutonomous ? <Zap size={14} /> : <Play size={14} />}
        </button>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest">Active Objectives</p>
        <div className="space-y-2">
          {goals.map((goal: string, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <Target size={14} className="text-blue-400" />
              <span className="text-gray-300">{goal}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest">Real-time Operations</p>
        <div className="space-y-3">
          {actions.map((action: any, i: number) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-white">{action.agent}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed">{action.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const LiveFeed = ({ activities }: any) => (
  <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] h-full overflow-hidden flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Activity size={20} className="text-green-400" />
        </div>
        <h3 className="font-bold">Live Activity</h3>
      </div>
      <span className="text-[10px] text-gray-500 font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10">REAL-TIME</span>
    </div>
    
    <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
      {activities.map((a: any, i: number) => (
        <div key={i} className="flex gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Bot size={14} className="text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-bold text-white truncate">{a.agent_name}</p>
              <p className="text-[9px] text-gray-600 font-mono">{a.time}</p>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{a.action}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MetricWidget = ({ label, value, subtext, trend, color }: any) => (
  <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className={`text-[10px] font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
        {trend === 'up' ? '+' : '-'}{subtext}
      </div>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          className={`h-full ${color || 'bg-blue-500'}`}
        />
      </div>
    </div>
  </div>
);
