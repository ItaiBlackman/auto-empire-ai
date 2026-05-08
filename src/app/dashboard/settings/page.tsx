"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, User, Shield, Bell, CreditCard, Trash2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [activityAlerts, setActivityAlerts] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile({ ...prof, email: user.email });
      setName(prof?.full_name || "");
      setEmailNotifs(prof?.email_notifications ?? true);
      setActivityAlerts(prof?.activity_alerts ?? true);
      setTwoFA(prof?.two_fa_enabled ?? false);
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ full_name: name, email_notifications: emailNotifs, activity_alerts: activityAlerts }).eq("id", user!.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const changePassword = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.auth.resetPasswordForEmail(user!.email!, { redirectTo: `${window.location.origin}/reset-password` });
    alert("Password reset email sent!");
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  const Toggle = ({ value, onChange }: { value: boolean, onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-green-500' : 'bg-white/10'}`}>
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );

  if (loading) return (
    <Dashboard profile={profile}>
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    </Dashboard>
  );

  return (
    <Dashboard profile={profile}>
      <div className="p-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences.</p>
        </div>

        <div className="space-y-6">

          {/* Profile */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold mb-5 flex items-center gap-2 text-lg"><User size={18} /> Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Email Address</label>
                <input value={profile?.email || ""} disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-gray-500 cursor-not-allowed" />
              </div>
              <button onClick={saveProfile} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                {saved ? <><Check size={14} /> Saved!</> : saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold mb-5 flex items-center gap-2 text-lg"><Shield size={18} /> Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Password</p>
                  <p className="text-xs text-gray-500 mt-0.5">Send a reset link to your email</p>
                </div>
                <button onClick={changePassword}
                  className="px-4 py-2 border border-white/10 text-sm font-bold rounded-xl hover:bg-white/5 transition-colors">
                  Change Password
                </button>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
                </div>
                <Toggle value={twoFA} onChange={setTwoFA} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold mb-5 flex items-center gap-2 text-lg"><Bell size={18} /> Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Email Notifications</p>
                  <p className="text-xs text-gray-500 mt-0.5">Receive updates via email</p>
                </div>
                <Toggle value={emailNotifs} onChange={setEmailNotifs} />
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Activity Alerts</p>
                  <p className="text-xs text-gray-500 mt-0.5">Get notified when AI agents take action</p>
                </div>
                <Toggle value={activityAlerts} onChange={setActivityAlerts} />
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold mb-5 flex items-center gap-2 text-lg"><CreditCard size={18} /> Billing</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Current Plan</p>
                  <p className="font-bold">{profile?.plan === 'pro' ? 'Pro Version' : profile?.plan === 'unlimited' ? 'Unlimited' : 'Free Plan'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Next Billing</p>
                  <p className="font-bold">{profile?.plan === 'free' || !profile?.plan ? 'N/A' : 'Jun 1, 2026'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => router.push("/pricing")}
                  className="flex-1 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Upgrade Plan
                </button>
                <button className="flex-1 py-2.5 border border-white/10 text-sm font-bold rounded-xl hover:bg-white/5 transition-colors text-gray-400">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/[0.02]">
            <h2 className="font-bold mb-5 flex items-center gap-2 text-lg text-red-400"><Trash2 size={18} /> Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Delete Account</p>
                <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <button onClick={deleteAccount}
                className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </Dashboard>
  );
}