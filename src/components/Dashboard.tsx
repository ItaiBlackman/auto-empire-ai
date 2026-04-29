"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  TrendingUp, 
  Settings,
  Plus,
  ArrowUpRight,
  Search,
  Bell
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6 text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-black rotate-45" />
          </div>
          AutoEmpire
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
          <NavItem icon={<TrendingUp size={18} />} label="Businesses" />
          <NavItem icon={<Users size={18} />} label="Leads" />
          <NavItem icon={<MessageSquare size={18} />} label="Messages" />
          <NavItem icon={<CheckSquare size={18} />} label="Tasks" />
          <div className="pt-4 mt-4 border-t border-white/5">
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 mb-2">Current Plan</p>
            <p className="text-sm font-bold mb-4">Pro Version</p>
            <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg">Upgrade</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-96">
            <Search size={16} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search your empire..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border border-black" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/20" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Empire Overview</h1>
              <p className="text-gray-500">Welcome back. Your AI agents are hard at work.</p>
            </div>
            <button className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <Plus size={16} /> New Business
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Revenue" value="$12,450" change="+12.5%" />
            <StatCard title="Active Businesses" value="3" change="+1" />
            <StatCard title="Total Leads" value="1,284" change="+240" />
            <StatCard title="Messages Sent" value="8,920" change="+1.2k" />
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Businesses */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-bold">Active Businesses</h2>
              <div className="space-y-4">
                <BusinessItem 
                  name="Dentist Outreach Pro" 
                  status="Running" 
                  leads="420" 
                  revenue="$4,200"
                />
                <BusinessItem 
                  name="Real Estate AI Gen" 
                  status="Paused" 
                  leads="124" 
                  revenue="$1,100"
                />
                <BusinessItem 
                  name="Local SEO Automation" 
                  status="Running" 
                  leads="740" 
                  revenue="$7,150"
                />
              </div>
            </div>

            {/* AI Agents working live */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Live AI Agents</h2>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
                <AgentStatus name="Sales Manager" action="Closing deal with Dr. Smith" />
                <AgentStatus name="Lead Finder" action="Scraping LinkedIn for Realtors" />
                <AgentStatus name="Copywriter" action="Drafting email for Dental Clinic" />
                <AgentStatus name="Support AI" action="Answering customer FAQ" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active = false }: NavItemProps) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
    {icon}
    {label}
  </button>
);

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

const StatCard = ({ title, value, change }: StatCardProps) => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-bold">{value}</h3>
      <span className="text-xs text-green-500 font-bold flex items-center">
        {change} <ArrowUpRight size={12} />
      </span>
    </div>
  </div>
);

interface BusinessItemProps {
  name: string;
  status: string;
  leads: string;
  revenue: string;
}

const BusinessItem = ({ name, status, leads, revenue }: BusinessItemProps) => (
  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
        <TrendingUp size={18} className="text-gray-400" />
      </div>
      <div>
        <h4 className="font-bold">{name}</h4>
        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${status === 'Running' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
          {status}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-12">
      <div className="text-right">
        <p className="text-xs text-gray-500">Leads</p>
        <p className="font-bold">{leads}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">Revenue</p>
        <p className="font-bold">{revenue}</p>
      </div>
      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
        <ChevronRight size={18} className="text-gray-500 group-hover:text-white" />
      </button>
    </div>
  </div>
);

interface AgentStatusProps {
  name: string;
  action: string;
}

const AgentStatus = ({ name, action }: AgentStatusProps) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
    <div>
      <p className="text-xs font-bold text-white">{name}</p>
      <p className="text-[11px] text-gray-500">{action}</p>
    </div>
  </div>
);

interface ChevronRightProps {
  size: number;
  className?: string;
}

const ChevronRight = ({ size, className }: ChevronRightProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default Dashboard;
