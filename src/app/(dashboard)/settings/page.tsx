"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  CreditCard, 
  ChevronRight,
  Save,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setProfile(profile);
          setFullName(profile.full_name || "");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getData();
  }, [supabase, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Profile updated successfully!" });
      setProfile({ ...profile, full_name: fullName });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-gray-500">Manage your profile, security, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-1">
          <SettingsNavLink icon={<User size={18} />} label="Profile" active />
          <SettingsNavLink icon={<Shield size={18} />} label="Security" disabled />
          <SettingsNavLink icon={<Bell size={18} />} label="Notifications" disabled />
          <SettingsNavLink icon={<CreditCard size={18} />} label="Billing" disabled />
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          <section className="p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-white transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {message && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </p>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          <section className="p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
            <h2 className="text-xl font-bold mb-2">Subscription</h2>
            <p className="text-sm text-gray-500 mb-6">You are currently on the <span className="text-white font-bold">Pro Plan</span>.</p>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <CreditCard size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Next billing date</p>
                  <p className="text-xs text-gray-500">May 27, 2024</p>
                </div>
              </div>
              <button className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                Manage Billing <ChevronRight size={14} />
              </button>
            </div>
          </section>

          <section className="p-8 rounded-3xl border border-red-500/20 bg-red-500/[0.02]">
            <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-6">Permanently delete your account and all your businesses.</p>
            <button className="px-6 py-3 border border-red-500/50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
              Delete Account
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

const SettingsNavLink = ({ icon, label, active = false, disabled = false }: { icon: React.ReactNode, label: string, active?: boolean, disabled?: boolean }) => (
  <button 
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
      active 
        ? 'bg-white text-black font-bold' 
        : disabled 
          ? 'text-gray-600 cursor-not-allowed' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </button>
);
