"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
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
  Bell,
  LogOut
} from "lucide-react";

const Dashboard = ({ children, profile }: { children?: React.ReactNode, profile?: any }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/dashboard" },
    { icon: <TrendingUp size={18} />, label: "Businesses", href: "/dashboard/businesses" },
    { icon: <Users size={18} />, label: "Leads", href: "/dashboard/leads" },
    { icon: <MessageSquare size={18} />, label: "Messages", href: "/dashboard/messages" },
    { icon: <CheckSquare size={18} />, label: "Tasks", href: "/dashboard/tasks" },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-black rotate-45" />
          </div>
          AutoEmpire
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === item.href ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={() => router.push("/dashboard/settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === '/dashboard/settings' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Settings size={18} /> Settings
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 mb-2">Current Plan</p>
            <p className="text-sm font-bold mb-4">{profile?.plan === 'pro' ? 'Pro Version' : profile?.plan === 'unlimited' ? 'Unlimited' : 'Free Plan'}</p>
            <button 
              onClick={() => router.push("/dashboard/settings")}
              className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-80">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Search your empire..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full relative">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/20 flex items-center justify-center text-xs font-bold">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold leading-none">{profile?.full_name || 'User'}</p>
                <p className="text-[10px] text-gray-500">Empirical Founder</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
