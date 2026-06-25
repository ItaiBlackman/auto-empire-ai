const fs = require("fs");

fs.writeFileSync("src/components/CurrencySettingsPanel.tsx", `"use client";
import React, { useState } from "react";
import { Plus, X, Search } from "lucide-react";

export const DEFAULT_CURRENCY_SETTINGS = [
  { country: "Israel",       code: "IL", currency: "\u20AA", setup: 1800, monthly: 350 },
  { country: "United States",code: "US", currency: "$",      setup: 500,  monthly: 99  },
  { country: "United Kingdom",code:"UK", currency: "\u00A3", setup: 400,  monthly: 79  },
  { country: "France",       code: "FR", currency: "\u20AC", setup: 450,  monthly: 90  },
  { country: "Germany",      code: "DE", currency: "\u20AC", setup: 450,  monthly: 90  },
  { country: "Spain",        code: "ES", currency: "\u20AC", setup: 450,  monthly: 90  },
  { country: "Italy",        code: "IT", currency: "\u20AC", setup: 450,  monthly: 90  },
  { country: "Russia",       code: "RU", currency: "\u20BD", setup: 45000,monthly: 9000},
  { country: "Saudi Arabia", code: "SA", currency: "\u0631.\u0633",setup:1875,monthly:371},
  { country: "UAE",          code: "AE", currency: "AED",    setup: 1835, monthly: 363 },
  { country: "Canada",       code: "CA", currency: "CA$",    setup: 675,  monthly: 134 },
  { country: "Australia",    code: "AU", currency: "A$",     setup: 765,  monthly: 151 },
];

export type CurrencyRow = typeof DEFAULT_CURRENCY_SETTINGS[0];

const ALL_CURRENCIES = [
  { symbol: "$",     name: "US Dollar (USD)" },
  { symbol: "\u20AC",     name: "Euro (EUR)" },
  { symbol: "\u00A3",     name: "British Pound (GBP)" },
  { symbol: "\u20AA",     name: "Israeli Shekel (ILS)" },
  { symbol: "\u00A5",     name: "Japanese Yen (JPY)" },
  { symbol: "CA$",   name: "Canadian Dollar (CAD)" },
  { symbol: "A$",    name: "Australian Dollar (AUD)" },
  { symbol: "NZ$",   name: "New Zealand Dollar (NZD)" },
  { symbol: "HK$",   name: "Hong Kong Dollar (HKD)" },
  { symbol: "S$",    name: "Singapore Dollar (SGD)" },
  { symbol: "\u20BD",     name: "Russian Ruble (RUB)" },
  { symbol: "\u20B9",     name: "Indian Rupee (INR)" },
  { symbol: "\u20A9",     name: "South Korean Won (KRW)" },
  { symbol: "\u20BA",     name: "Turkish Lira (TRY)" },
  { symbol: "R$",    name: "Brazilian Real (BRL)" },
  { symbol: "MX$",   name: "Mexican Peso (MXN)" },
  { symbol: "R",     name: "South African Rand (ZAR)" },
  { symbol: "kr",    name: "Scandinavian Krone (SEK/NOK/DKK)" },
  { symbol: "CHF",   name: "Swiss Franc (CHF)" },
  { symbol: "AED",   name: "UAE Dirham (AED)" },
  { symbol: "\u0631.\u0633",    name: "Saudi Riyal (SAR)" },
  { symbol: "\u062F.\u0643",    name: "Kuwaiti Dinar (KWD)" },
  { symbol: "\u062F.\u0628",    name: "Bahraini Dinar (BHD)" },
  { symbol: "\u0631.\u0639",    name: "Omani Rial (OMR)" },
  { symbol: "\u062F.\u0625",    name: "Algerian Dinar (DZD)" },
  { symbol: "EGP",   name: "Egyptian Pound (EGP)" },
  { symbol: "MAD",   name: "Moroccan Dirham (MAD)" },
  { symbol: "\u20A6",     name: "Nigerian Naira (NGN)" },
  { symbol: "Ksh",   name: "Kenyan Shilling (KES)" },
  { symbol: "GH\u20B5",  name: "Ghanaian Cedi (GHS)" },
  { symbol: "ETB",   name: "Ethiopian Birr (ETB)" },
  { symbol: "TZS",   name: "Tanzanian Shilling (TZS)" },
  { symbol: "UGX",   name: "Ugandan Shilling (UGX)" },
  { symbol: "\u0e3f",     name: "Thai Baht (THB)" },
  { symbol: "\u20ab",     name: "Vietnamese Dong (VND)" },
  { symbol: "Rp",    name: "Indonesian Rupiah (IDR)" },
  { symbol: "RM",    name: "Malaysian Ringgit (MYR)" },
  { symbol: "\u20b1",     name: "Philippine Peso (PHP)" },
  { symbol: "PKR",   name: "Pakistani Rupee (PKR)" },
  { symbol: "BDT",   name: "Bangladeshi Taka (BDT)" },
  { symbol: "LKR",   name: "Sri Lankan Rupee (LKR)" },
  { symbol: "NPR",   name: "Nepalese Rupee (NPR)" },
  { symbol: "MMK",   name: "Myanmar Kyat (MMK)" },
  { symbol: "KHR",   name: "Cambodian Riel (KHR)" },
  { symbol: "\u20ae",     name: "Mongolian Tugrik (MNT)" },
  { symbol: "zl",    name: "Polish Zloty (PLN)" },
  { symbol: "Kc",    name: "Czech Koruna (CZK)" },
  { symbol: "Ft",    name: "Hungarian Forint (HUF)" },
  { symbol: "lei",   name: "Romanian Leu (RON)" },
  { symbol: "kn",    name: "Croatian Kuna (HRK)" },
  { symbol: "din",   name: "Serbian Dinar (RSD)" },
  { symbol: "lev",   name: "Bulgarian Lev (BGN)" },
  { symbol: "UAH",   name: "Ukrainian Hryvnia (UAH)" },
  { symbol: "GEL",   name: "Georgian Lari (GEL)" },
  { symbol: "AMD",   name: "Armenian Dram (AMD)" },
  { symbol: "AZN",   name: "Azerbaijani Manat (AZN)" },
  { symbol: "KZT",   name: "Kazakhstani Tenge (KZT)" },
  { symbol: "UZS",   name: "Uzbekistani Som (UZS)" },
  { symbol: "CLP",   name: "Chilean Peso (CLP)" },
  { symbol: "COP",   name: "Colombian Peso (COP)" },
  { symbol: "PEN",   name: "Peruvian Sol (PEN)" },
  { symbol: "ARS",   name: "Argentine Peso (ARS)" },
  { symbol: "BOB",   name: "Bolivian Boliviano (BOB)" },
  { symbol: "PYG",   name: "Paraguayan Guarani (PYG)" },
  { symbol: "UYU",   name: "Uruguayan Peso (UYU)" },
  { symbol: "VES",   name: "Venezuelan Bolivar (VES)" },
  { symbol: "GTQ",   name: "Guatemalan Quetzal (GTQ)" },
  { symbol: "CRC",   name: "Costa Rican Colon (CRC)" },
  { symbol: "DOP",   name: "Dominican Peso (DOP)" },
  { symbol: "JMD",   name: "Jamaican Dollar (JMD)" },
  { symbol: "TTD",   name: "Trinidad Dollar (TTD)" },
  { symbol: "XAF",   name: "Central African Franc (XAF)" },
  { symbol: "XOF",   name: "West African Franc (XOF)" },
  { symbol: "XPF",   name: "Pacific Franc (XPF)" },
  { symbol: "IQD",   name: "Iraqi Dinar (IQD)" },
  { symbol: "IRR",   name: "Iranian Rial (IRR)" },
  { symbol: "JOD",   name: "Jordanian Dinar (JOD)" },
  { symbol: "LBP",   name: "Lebanese Pound (LBP)" },
  { symbol: "SYP",   name: "Syrian Pound (SYP)" },
  { symbol: "YER",   name: "Yemeni Rial (YER)" },
  { symbol: "TND",   name: "Tunisian Dinar (TND)" },
  { symbol: "LYD",   name: "Libyan Dinar (LYD)" },
  { symbol: "SDG",   name: "Sudanese Pound (SDG)" },
  { symbol: "SOS",   name: "Somali Shilling (SOS)" },
  { symbol: "MZN",   name: "Mozambican Metical (MZN)" },
  { symbol: "ZMW",   name: "Zambian Kwacha (ZMW)" },
  { symbol: "BWP",   name: "Botswana Pula (BWP)" },
  { symbol: "NAD",   name: "Namibian Dollar (NAD)" },
  { symbol: "MUR",   name: "Mauritian Rupee (MUR)" },
  { symbol: "SCR",   name: "Seychellois Rupee (SCR)" },
  { symbol: "MGA",   name: "Malagasy Ariary (MGA)" },
  { symbol: "DZD",   name: "Algerian Dinar (DZD)" },
  { symbol: "NZD",   name: "New Zealand Dollar" },
  { symbol: "ISK",   name: "Icelandic Krona (ISK)" },
  { symbol: "ALL",   name: "Albanian Lek (ALL)" },
  { symbol: "MKD",   name: "Macedonian Denar (MKD)" },
  { symbol: "BAM",   name: "Bosnia Mark (BAM)" },
];

interface CurrencyPickerProps {
  value: string;
  onChange: (symbol: string) => void;
}

function CurrencyPicker({ value, onChange }: CurrencyPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = ALL_CURRENCIES.filter(c =>
    c.symbol.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center text-white hover:border-white/30 transition-colors focus:outline-none"
      >
        {value}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(""); }} />
          <div className="absolute z-50 top-full mt-1 left-0 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
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
              {filtered.map(c => (
                <button
                  key={c.symbol + c.name}
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
        </>
      )}
    </div>
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
        <div className="grid grid-cols-[2fr_90px_1fr_1fr_36px] gap-3 mb-2 px-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Country</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Currency</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Setup</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Monthly</p>
          <div />
        </div>
        <div className="space-y-2 max-h-[380px] overflow-y-auto pb-2">
          {safeSettings.map((row: any, i: number) => (
            <div key={i} className="grid grid-cols-[2fr_90px_1fr_1fr_36px] gap-3 items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 bg-white/10 px-1.5 py-0.5 rounded shrink-0">{row.code || row.flag}</span>
                <span className="text-sm font-medium truncate">{row.country || row.language}</span>
              </div>
              <CurrencyPicker value={row.currency} onChange={v => update(i, "currency", v)} />
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
        <p className="text-xs font-bold text-gray-400 mb-3">Add a country</p>
        <div className="grid grid-cols-[2fr_90px_1fr_1fr_36px] gap-3 items-center">
          <input
            value={newCountry}
            onChange={e => setNewCountry(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addRow()}
            placeholder="Country name"
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/30"
          />
          <CurrencyPicker value={newCurrency} onChange={setNewCurrency} />
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
            disabled={!newCountry.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
`, "utf8");

console.log("Done. Run: git add . && git commit -m 'country pricing with full currency picker' && git push");
