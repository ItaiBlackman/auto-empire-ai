"use client";
import React from "react";

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
  const update = (index: number, field: string, value: string | number) => {
    onChange(settings.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  return (
    <div className="w-64 shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-4 border-b border-white/5">
        <h3 className="font-bold text-sm">Pricing by Language</h3>
        <p className="text-[10px] text-gray-500 mt-0.5">Set currency and prices per market</p>
      </div>
      <div className="p-3 space-y-1 max-h-[420px] overflow-y-auto">
        {settings.map((row, i) => (
          <div key={row.language} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-black text-gray-500 bg-white/10 px-1.5 py-0.5 rounded">{row.flag}</span>
              <span className="text-xs font-bold text-gray-300">{row.language}</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <input
                value={row.currency}
                onChange={e => update(i, "currency", e.target.value)}
                className="w-8 bg-black/40 border border-white/10 rounded-md px-1.5 py-1 text-xs text-center text-white focus:outline-none focus:border-white/20"
                maxLength={1}
              />
              <input
                type="number"
                value={row.setup}
                onChange={e => update(i, "setup", Number(e.target.value))}
                className="w-16 bg-black/40 border border-white/10 rounded-md px-1.5 py-1 text-xs text-white focus:outline-none focus:border-white/20"
              />
              <span className="text-gray-600 text-xs">/</span>
              <input
                type="number"
                value={row.monthly}
                onChange={e => update(i, "monthly", Number(e.target.value))}
                className="w-14 bg-black/40 border border-white/10 rounded-md px-1.5 py-1 text-xs text-white focus:outline-none focus:border-white/20"
              />
            </div>
            <p className="text-[9px] text-gray-600 mt-1">{row.currency}{row.setup} setup / {row.currency}{row.monthly} mo</p>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3 pt-1">
        <p className="text-[9px] text-gray-600 text-center">Saved with your email templates</p>
      </div>
    </div>
  );
}
