const fs = require("fs");

fs.writeFileSync("src/components/CurrencySettingsPanel.tsx", `"use client";
import React, { useState, useRef, useEffect } from "react";
import { Plus, X, Search, ChevronDown } from "lucide-react";

export const DEFAULT_CURRENCY_SETTINGS = [
  { country: "Israel",         code: "IL", currency: "\u20AA", setup: 1800,  monthly: 350  },
  { country: "United States",  code: "US", currency: "$",      setup: 500,   monthly: 99   },
  { country: "United Kingdom", code: "UK", currency: "\u00A3", setup: 400,   monthly: 79   },
  { country: "France",         code: "FR", currency: "\u20AC", setup: 450,   monthly: 90   },
  { country: "Germany",        code: "DE", currency: "\u20AC", setup: 450,   monthly: 90   },
  { country: "Spain",          code: "ES", currency: "\u20AC", setup: 450,   monthly: 90   },
  { country: "Italy",          code: "IT", currency: "\u20AC", setup: 450,   monthly: 90   },
  { country: "Russia",         code: "RU", currency: "\u20BD", setup: 45000, monthly: 9000 },
  { country: "Saudi Arabia",   code: "SA", currency: "SAR",    setup: 1875,  monthly: 371  },
  { country: "UAE",            code: "AE", currency: "AED",    setup: 1835,  monthly: 363  },
  { country: "Canada",         code: "CA", currency: "CA$",    setup: 675,   monthly: 134  },
  { country: "Australia",      code: "AU", currency: "A$",     setup: 765,   monthly: 151  },
  { country: "India",          code: "IN", currency: "\u20B9", setup: 41500, monthly: 8200 },
  { country: "Japan",          code: "JP", currency: "\u00A5", setup: 75000, monthly: 14800},
];

export type CurrencyRow = typeof DEFAULT_CURRENCY_SETTINGS[0];

const ALL_CURRENCIES = [
  { symbol: "$",    name: "US Dollar" },
  { symbol: "\u20AC",    name: "Euro" },
  { symbol: "\u00A3",    name: "British Pound" },
  { symbol: "\u20AA",    name: "Israeli Shekel" },
  { symbol: "\u00A5",    name: "Yen / Yuan" },
  { symbol: "CA$",  name: "Canadian Dollar" },
  { symbol: "A$",   name: "Australian Dollar" },
  { symbol: "NZ$",  name: "New Zealand Dollar" },
  { symbol: "HK$",  name: "Hong Kong Dollar" },
  { symbol: "S$",   name: "Singapore Dollar" },
  { symbol: "\u20BD",    name: "Russian Ruble" },
  { symbol: "\u20B9",    name: "Indian Rupee" },
  { symbol: "\u20A9",    name: "South Korean Won" },
  { symbol: "\u20BA",    name: "Turkish Lira" },
  { symbol: "R$",   name: "Brazilian Real" },
  { symbol: "MX$",  name: "Mexican Peso" },
  { symbol: "R",    name: "South African Rand" },
  { symbol: "kr",   name: "Krone (SE/NO/DK)" },
  { symbol: "CHF",  name: "Swiss Franc" },
  { symbol: "AED",  name: "UAE Dirham" },
  { symbol: "SAR",  name: "Saudi Riyal" },
  { symbol: "KWD",  name: "Kuwaiti Dinar" },
  { symbol: "BHD",  name: "Bahraini Dinar" },
  { symbol: "OMR",  name: "Omani Rial" },
  { symbol: "EGP",  name: "Egyptian Pound" },
  { symbol: "MAD",  name: "Moroccan Dirham" },
  { symbol: "\u20A6",    name: "Nigerian Naira" },
  { symbol: "Ksh",  name: "Kenyan Shilling" },
  { symbol: "\u0E3F",    name: "Thai Baht" },
  { symbol: "\u20AB",    name: "Vietnamese Dong" },
  { symbol: "Rp",   name: "Indonesian Rupiah" },
  { symbol: "RM",   name: "Malaysian Ringgit" },
  { symbol: "\u20B1",    name: "Philippine Peso" },
  { symbol: "PKR",  name: "Pakistani Rupee" },
  { symbol: "BDT",  name: "Bangladeshi Taka" },
  { symbol: "zl",   name: "Polish Zloty" },
  { symbol: "Kc",   name: "Czech Koruna" },
  { symbol: "Ft",   name: "Hungarian Forint" },
  { symbol: "lei",  name: "Romanian Leu" },
  { symbol: "UAH",  name: "Ukrainian Hryvnia" },
  { symbol: "GEL",  name: "Georgian Lari" },
  { symbol: "KZT",  name: "Kazakhstani Tenge" },
  { symbol: "CLP",  name: "Chilean Peso" },
  { symbol: "COP",  name: "Colombian Peso" },
  { symbol: "PEN",  name: "Peruvian Sol" },
  { symbol: "ARS",  name: "Argentine Peso" },
  { symbol: "IQD",  name: "Iraqi Dinar" },
  { symbol: "JOD",  name: "Jordanian Dinar" },
  { symbol: "LBP",  name: "Lebanese Pound" },
  { symbol: "TND",  name: "Tunisian Dinar" },
  { symbol: "LYD",  name: "Libyan Dinar" },
  { symbol: "ISK",  name: "Icelandic Krona" },
  { symbol: "BGN",  name: "Bulgarian Lev" },
  { symbol: "RSD",  name: "Serbian Dinar" },
  { symbol: "GTQ",  name: "Guatemalan Quetzal" },
  { symbol: "DOP",  name: "Dominican Peso" },
  { symbol: "XAF",  name: "Central African CFA" },
  { symbol: "XOF",  name: "West African CFA" },
];

interface CurrencyPickerProps {
  value: string;
  onChange: (symbol: string) => void;
}

function CurrencyPicker({ value, onChange }: CurrencyPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open || !dropRef.current || !btnRef.current) return;
    const btn = btnRef.current.getBoundingClientRect();
    const drop = dropRef.current;
    const spaceBelow = window.innerHeight - btn.bottom;
    drop.style.left = btn.left + "px";
    drop.style.width = "260px";
    if (spaceBelow < 280) {
      drop.style.top = "auto";
      drop.style.bottom = (window.innerHeight - btn.top + 4) + "px";
    } else {
      drop.style.top = (btn.bottom + 4) + "px";
      drop.style.bottom = "auto";
    }
  }, [open]);

  const filtered = ALL_CURRENCIES.filter(c =>
    c.symbol.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white hover:border-white/30 transition-colors focus:outline-none flex items-center justify-between gap-1"
      >
        <span className="font-bold truncate">{value}</span>
        <ChevronDown size={10} className="text-gray-500 shrink-0" />
      </button>
      {open && (
        <div
          ref={dropRef}
          className="fixed z-[9999] bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-2 border-b border-white/5">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg">
              <Search size={11} className="text-gray-500 shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.map((c, idx) => (
              <button
                key={idx}
                onClick={() => { onChange(c.symbol); setOpen(false); setSearch(""); }}
                className={"w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-white/10 transition-colors " + (value === c.symbol ? "bg-white/10" : "")}
              >
                <span className="text-sm w-10 text-center font-bold shrink-0">{c.symbol}</span>
                <span className="text-xs text-gray-400 truncate">{c.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-4">No results</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface Props {
  settings: CurrencyRow[];
  onChange: (settings: CurrencyRow[]) => void;
}

export function CurrencySettingsPanel({ settings, onChange }: Props) {
  const safeSettings = Array.isArray(settings) ? settings : DEFAULT_CURRENCY_SETTINGS;
  const [newCountry, setNewCountry] = useState("");
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
    if (!newCountry.trim()) return;
    onChange([...safeSettings, {
      country: newCountry.trim(),
      code: newCountry.trim().slice(0, 2).toUpperCase(),
      currency: newCurrency,
      setup: newSetup,
      monthly: newMonthly,
    }]);
    setNewCountry("");
    setNewCurrency("$");
    setNewSetup(500);
    setNewMonthly(99);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5">
        <h3 className="font-bold text-base">Pricing by Country</h3>
        <p className="text-xs text-gray-500 mt-0.5">The agent picks the right currency and price automatically based on each lead's country.</p>
      </div>

      <div className="px-6 pt-5">
        <div className="grid grid-cols-[2fr_100px_1fr_1fr_36px] gap-3 mb-2 px-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Country</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Currency</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Setup</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Monthly</p>
          <div />
        </div>
        <div className="space-y-2 max-h-[360px] overflow-y-auto pb-2">
          {safeSettings.map((row: any, i: number) => (
            <div key={i} className="grid grid-cols-[2fr_100px_1fr_1fr_36px] gap-3 items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-black text-gray-500 bg-white/10 px-1.5 py-0.5 rounded shrink-0">{row.code || row.flag}</span>
                <span className="text-sm font-medium truncate">{row.country || row.language}</span>
              </div>
              <CurrencyPicker value={row.currency} onChange={v => update(i, "currency", v)} />
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-gray-600 text-xs shrink-0">{row.currency}</span>
                <input type="number" value={row.setup} onChange={e => update(i, "setup", Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/30 min-w-0" />
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-gray-600 text-xs shrink-0">{row.currency}</span>
                <input type="number" value={row.monthly} onChange={e => update(i, "monthly", Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/30 min-w-0" />
              </div>
              <button onClick={() => remove(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 mt-1 border-t border-white/5">
        <p className="text-xs font-bold text-gray-400 mb-3">Add a country</p>
        <div className="grid grid-cols-[2fr_100px_1fr_1fr_36px] gap-3 items-center">
          <input
            value={newCountry}
            onChange={e => setNewCountry(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addRow()}
            placeholder="e.g. Brazil"
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/30"
          />
          <CurrencyPicker value={newCurrency} onChange={setNewCurrency} />
          <input type="number" value={newSetup} onChange={e => setNewSetup(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
          <input type="number" value={newMonthly} onChange={e => setNewMonthly(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
          <button
            onClick={addRow}
            disabled={!newCountry.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
`, "utf8");

console.log("Done. Run: git add . && git commit -m 'fix country panel plus button and dropdown' && git push");
