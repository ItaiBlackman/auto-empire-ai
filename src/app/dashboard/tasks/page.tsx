"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckSquare, Loader2, Clock, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id);

    if (!businesses?.length) { setLoading(false); return; }

    const ids = businesses.map(b => b.id);
    const { data } = await supabase
      .from("business_tasks")
      .select("*, businesses(name)")
      .in("business_id", ids)
      .order("due_date");

    setTasks(data || []);
    setLoading(false);
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done';
    await supabase.from("business_tasks").update({ status: newStatus }).eq("id", id);
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const done = tasks.filter(t => t.status === 'done').length;

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
      <Loader2 className="animate-spin text-white/20" size={48} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-gray-500">{done}/{tasks.length} tasks completed.</p>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "done"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${filter === s ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round((done / tasks.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(done / tasks.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <CheckSquare size={40} className="text-gray-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">No tasks yet</h3>
          <p className="text-sm text-gray-500">Tasks will appear here when you create a business.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${task.status === 'done' ? 'border-white/5 bg-white/[0.01] opacity-60' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'}`}
              onClick={() => toggleTask(task.id, task.status)}
            >
              <button className="shrink-0 transition-colors">
                {task.status === 'done'
                  ? <CheckCircle2 size={20} className="text-green-500" />
                  : <Circle size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                }
              </button>
              <div className="flex-1">
                <p className={`font-bold text-sm ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                {task.businesses?.name && <p className="text-xs text-gray-600 mt-0.5">{task.businesses.name}</p>}
              </div>
              {task.due_date && (
                <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                  <Clock size={12} />
                  {new Date(task.due_date).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
