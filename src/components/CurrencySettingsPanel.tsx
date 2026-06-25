"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export const DEFAULT_CURRENCY_SETTINGS = [
  { language: "Hebrew",     flag: "IL", currency: "₪", setup: 1800, monthly: 350 },
  { language: "Arabic",     flag: "AR", currency: "$",      setup: 500,  monthly: 99  },
  { language: "English",    flag: "EN", currency: "$",      setup: 500,  monthly: 99  },
  { language: "French",     flag: "FR", currency: "€", setup: 450,  monthly: 90  },
  { language: "German",     flag: "DE", currency: "€", setup: 450,  monthly: 90  },
  { language: "Spanish",    flag: "ES", currency: "€", setup: 450,  monthly: 90  },
  { language: "Russian",    flag: "RU", currency: "$",      setup: 500,  monthly: 99  },
  { language: "Italian",    flag: "IT", currency: "€", setup: 450,  monthly: 90  },
  { language: "Portuguese", flag: "PT", currency: "$",      setup: 500,  monthly: 99  },
  { language: "Turkish",    flag: "TR", currency: "$",      setup: 500,  monthly: 99  },
];

export type CurrencyRow = typeof DEFAULT_CURRENCY_SETTINGS[0];

interface Props {
  settings: CurrencyRow[];
  onChange: (settings: CurrencyRow[]) => void;
}

export function CurrencySettingsPanel({ settings, onChange }: Props) {
  const safeSettings = Array.isArray(settings) ? settings : DEFAULT_CURRENCY_SETTINGS;
  const [newLang, setNewLang] = useState("");
  const [newCurrency, setNewCurrency] = useState("$");
  const [newSetup, setNewSetup] = useState(500);
  const [newMonthly, setNewMonthly] = useState(99);

  const update = (index: number, field: string, value: string | number) => {
    onChange(safeSettings.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const remove = (index: number) => {
    onChange(safeSettings.filter((_, i) => i !== index));
  };

  const addRow = () => {
    if (!newLang.trim()) return;
    onChange([...safeSettings, {
      language: newLang.trim(),
      flag: newLang.trim().slice(0, 2).toUpperCase(),
      currency: newCurrency,
      setup: newSetup,
      monthly: newMonthly,
    }]);
    setNewLang("");
    setNewCurrency("$");
    setNewSetup(500);
    setNewMonthly(99);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5">
        <h3 className="font-bold text-base">Pricing by Language</h3>
        <p className="text-xs text-gray-500 mt-0.5">The agent picks the right price automatically based on each lead's language.</p>
      </div>
      <div className="px-6 pt-5">
        <div className="grid grid-cols-[2fr_60px_1fr_1fr_36px] gap-3 mb-2 px-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Language</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Symbol</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Setup</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Monthly</p>
          <div />
        </div>
        <div className="space-y-2 max-h-[380px] overflow-y-auto pb-2">
          {safeSettings.map((row, i) => (
            <div key={i} className="grid grid-cols-[2fr_60px_1fr_1fr_36px] gap-3 items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 bg-white/10 px-1.5 py-0.5 rounded shrink-0">{row.flag}</span>
                <span className="text-sm font-medium truncate">{row.language}</span>
              </div>
              <input
                value={row.currency}
                onChange={e => update(i, "currency", e.target.value)}
                maxLength={1}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center text-white focus:outline-none focus:border-white/30"
              />
              <div className="flex items-center gap-1">
                <span className="text-gray-600 text-xs shrink-0">{row.currency}</span>
                <input
                  type="number"
                  value={row.setup}
                  onChange={e => update(i, "setup", Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600 text-xs shrink-0">{row.currency}</span>
                <input
                  type="number"
                  value={row.monthly}
                  onChange={e => update(i, "monthly", Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <button onClick={() => remove(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-5 mt-1 border-t border-white/5">
        <p className="text-xs font-bold text-gray-400 mb-3">Add your own</p>
        <div className="grid grid-cols-[2fr_60px_1fr_1fr_36px] gap-3 items-center">
          <input
            value={newLang}
            onChange={e => setNewLang(e.target.value)}
            placeholder="Language name"
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/30"
          />
          <input
            value={newCurrency}
            onChange={e => setNewCurrency(e.target.value)}
            placeholder="$"
            maxLength={1}
            className="bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-sm text-center text-white placeholder-gray-700 focus:outline-none focus:border-white/30"
          />
          <input
            type="number"
            value={newSetup}
            onChange={e => setNewSetup(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
          />
          <input
            type="number"
            value={newMonthly}
            onChange={e => setNewMonthly(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
          />
          <button
            onClick={addRow}
            disabled={!newLang.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
