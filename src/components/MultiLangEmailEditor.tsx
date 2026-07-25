"use client";
import React, { useState, useRef } from "react";
import { Plus, X, RefreshCcw, ChevronDown, Loader2 } from "lucide-react";

const LANGUAGES = [
  "Hebrew", "Arabic", "French", "German", "Spanish", "Italian",
  "Russian", "Portuguese", "Turkish", "Dutch", "Polish", "Japanese", "Chinese",
  "Hindi", "Korean", "Swedish", "Norwegian", "Danish", "Finnish", "Greek",
  "Romanian", "Hungarian", "Czech", "Ukrainian",
];

export type LangVersion = { language: string; content: string };

interface Props {
  label: string;
  badge: string;
  badgeColor: string;
  baseTemplate: string;
  versions: LangVersion[];
  onVersionsChange: (versions: LangVersion[]) => void;
}

async function generateForLanguage(lang: string, baseTemplate: string): Promise<string> {
  try {
    const res = await fetch("https://aoeundhgmxfevkecnmvo.supabase.co/functions/v1/generate-email-version", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, baseTemplate })
    });
    const data = await res.json();
    return data.content || baseTemplate;
  } catch {
    return baseTemplate;
  }
}

export function MultiLangEmailEditor({ label, badge, badgeColor, baseTemplate, versions, onVersionsChange }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const addBtnRef = useRef<HTMLDivElement>(null);

  const openDropdown = () => {
    if (addBtnRef.current) {
      const rect = addBtnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setShowDropdown(o => !o);
  };

  const addLanguage = async (lang: string) => {
    setShowDropdown(false);
    if (versions.find(v => v.language === lang)) {
      setActiveVersion(lang);
      return;
    }
    setGenerating(lang);
    const generated = await generateForLanguage(lang, baseTemplate);
    onVersionsChange([...versions, { language: lang, content: generated }]);
    setActiveVersion(lang);
    setGenerating(null);
  };

  const removeLanguage = (lang: string) => {
    onVersionsChange(versions.filter(v => v.language !== lang));
    if (activeVersion === lang) setActiveVersion(null);
  };

  const updateContent = (lang: string, content: string) => {
    onVersionsChange(versions.map(v => v.language === lang ? { ...v, content } : v));
  };

  const regenerate = async (lang: string) => {
    setGenerating(lang);
    const generated = await generateForLanguage(lang, baseTemplate);
    onVersionsChange(versions.map(v => v.language === lang ? { ...v, content: generated } : v));
    setGenerating(null);
  };

  const availableLanguages = LANGUAGES.filter(l => !versions.find(v => v.language === l));
  const activeVersionData = versions.find(v => v.language === activeVersion);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 flex-wrap">
        {versions.map(v => (
          <button
            key={v.language}
            onClick={() => setActiveVersion(activeVersion === v.language ? null : v.language)}
            className={"flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all " +
              (activeVersion === v.language ? "bg-white text-black" : "bg-white/10 text-gray-300 hover:bg-white/20")}
          >
            {generating === v.language && <Loader2 size={10} className="animate-spin" />}
            {v.language}
            <span
              onClick={e => { e.stopPropagation(); removeLanguage(v.language); }}
              className="ml-0.5 text-gray-500 hover:text-red-400 cursor-pointer"
            >
              <X size={10} />
            </span>
          </button>
        ))}
        <div ref={addBtnRef}>
          <button
            onClick={openDropdown}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
          >
            <Plus size={10} /> Add language <ChevronDown size={10} />
          </button>
        </div>
      </div>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowDropdown(false)} />
          <div
            className="fixed z-[9999] w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <div className="max-h-56 overflow-y-auto p-1">
              {availableLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => addLanguage(lang)}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeVersion && activeVersionData && (
        <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2"><p className="text-xs font-bold text-gray-300">{activeVersion} version</p><button onClick={() => setActiveVersion(null)} className="text-gray-600 hover:text-gray-300 transition-colors"><X size={12} /></button></div>
            <button
              onClick={() => { const lang = activeVersion; if (lang) regenerate(lang); }}
              disabled={!!generating}
              className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 size={10} className="animate-spin" /> : <RefreshCcw size={10} />}
              Regenerate
            </button>
          </div>
          <textarea
            value={activeVersionData.content}
            onChange={e => updateContent(activeVersion, e.target.value)}
            rows={8}
            className="w-full bg-black/40 p-4 text-sm text-white resize-none focus:outline-none font-mono leading-relaxed" dir="auto"
          />
        </div>
      )}
    </div>
  );
}
