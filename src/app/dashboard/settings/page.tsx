"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, User, CreditCard, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      setName(prof?.full_name || "");
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ full_name: name }).eq("id", user!.id);
    setSaving(false);
  };

  if (loading) return <Dashboard profile={profile}><div className="flex items-center justify-center h-[80vh]"><Loader2 className="animate-spin text-white/20" size={48} /></div></Dashboard>;

  return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences.</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold mb-4 flex items-center gap-2"><User size={16} /> Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Email</label>
                <input value={profile?.email || ""} disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-gray-500 cursor-not-allowed" />
              </div>
              <button onClick={saveProfile} disabled={saving}
                className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold mb-4 flex items-center gap-2"><CreditCard size={16} /> Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{profile?.plan === 'pro' ? 'Pro Version' : profile?.plan === 'unlimited' ? 'Unlimited' : 'Free Plan'}</p>
                <p className="text-sm text-gray-500 mt-1">Upgrade to unlock more businesses and AI agents.</p>
              </div>
              <button onClick={() => router.push("/pricing")}
                className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Upgrade
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Bell size={16} /> Danger Zone</h2>
            <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
              className="px-5 py-2.5 border border-red-500/30 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/10 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}