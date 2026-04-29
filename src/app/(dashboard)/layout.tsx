"use client";

import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  TrendingUp, 
  Settings,
  Bell,
  LogOut,
  Search,
  Menu,
  X
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-black flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 text-xl font-bold tracking-tighter flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-black rotate-45" />
            </div>
            AutoEmpire
          </Link>
          <button 
            className="md:hidden p-2 hover:bg-white/5 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem 
            href="/dashboard" 
            icon={<LayoutDashboard size={18} />} 
            label="Overview" 
            active={pathname === "/dashboard"} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            href="#" 
            icon={<TrendingUp size={18} />} 
            label="Businesses" 
            disabled
          />
          <NavItem 
            href="#" 
            icon={<Users size={18} />} 
            label="Leads" 
            disabled
          />
          <NavItem 
            href="#" 
            icon={<MessageSquare size={18} />} 
            label="Messages" 
            disabled
          />
          <NavItem 
            href="#" 
            icon={<CheckSquare size={18} />} 
            label="Tasks" 
            disabled
          />
          <div className="pt-4 mt-4 border-t border-white/5">
            <NavItem 
              href="/settings" 
              icon={<Settings size={18} />} 
              label="Settings"
              active={pathname === "/settings"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 mb-2">Current Plan</p>
            <p className="text-sm font-bold mb-4">Pro Version</p>
            <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">Upgrade</button>
          </div>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full mt-4 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="md:hidden p-2 hover:bg-white/5 rounded-full"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-96 focus-within:border-white/30 transition-all">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search your empire..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border border-black" />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-white">{profile?.full_name || user.email.split('@')[0]}</span>
                <span className="text-[10px] text-gray-500 font-medium">Empirical Founder</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/20" />
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

const NavItem = ({ href, icon, label, active = false, disabled = false, onClick }: { href: string, icon: React.ReactNode, label: string, active?: boolean, disabled?: boolean, onClick?: () => void }) => {
  const content = (
    <>
      {icon}
      {label}
    </>
  );

  if (disabled) {
    return (
      <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      {content}
    </Link>
  );
};
