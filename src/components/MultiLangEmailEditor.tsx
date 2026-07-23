"use client";
import React, { useState } from "react";
import { Plus, X, RefreshCcw, ChevronDown, Loader2 } from "lucide-react";

const LANGUAGES = [
  "Hebrew", "Arabic", "English", "French", "German", "Spanish", "Italian",
  "Russian", "Portuguese", "Turkish", "Dutch", "Polish", "Japanese", "Chinese",
  "Hindi", "Korean", "Swedish", "Norwegian", "Danish", "Finnish", "Greek",
  "Romanian", "Hungarian", "Czech", "Ukrainian",
];

export type LangVersion = { language: string; content: string };

interface Props {
  label: string;
  badge: string;
  badgeColor: string;
  baseTemplate: string; // English version (the main textarea)
  versions: LangVersion[];
  onVersionsChange: (versions: LangVersion[]) => void;
}

export function MultiLangEmailEditor({ label, badge, badgeColor, baseTemplate, versions, onVersionsChange }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<string | null>(null);

  const addLanguage = async (lang: string) => {
    setShowDropdown(false);
    if (versions.find(v => v.language === lang)) {
      setActiveVersion(lang);
      return;
    }
    setGenerating(lang);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a native ${lang} speaker writing a casual WhatsApp sales message to a local business owner.

Here is the English template to adapt into ${lang}:
---
${baseTemplate}
---

Rules:
- Write it fresh in ${lang} as if you are a real local person, NOT a word-for-word translation
- Keep the exact same meaning, facts, structure, and placeholders ({name}, {company}, {industry}, {agent_name}, {setup_price}, {monthly_price})
- Sound casual and friendly, like a real WhatsApp message
- Keep all placeholders EXACTLY as they are in curly braces
- Keep brand names as-is (EliteSite Architects, AutoEmpire AI)
- Do not add or remove any facts

Return ONLY the ${lang} message. No labels, no explanations.`
          }]
        })
      });
      const data = await res.json();
      const generated = data.content?.[0]?.text || baseTemplate;
      const newVersions = [...versions, { language: lang, content: generated }];
      onVersionsChange(newVersions);
      setActiveVersion(lang);
    } catch {
      const newVersions = [...versions, { language: lang, content: baseTemplate }];
      onVersionsChange(newVersions);
      setActiveVersion(lang);
    }
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
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a native ${lang} speaker writing a casual WhatsApp sales message to a local business owner.

Here is the English template to adapt into ${lang}:
---
${baseTemplate}
---

Rules:
- Write it fresh in ${lang} as if you are a real local person, NOT a word-for-word translation
- Keep the exact same meaning, facts, structure, and placeholders ({name}, {company}, {industry}, {agent_name}, {setup_price}, {monthly_price})
- Sound casual and friendly, like a real WhatsApp message
- Keep all placeholders EXACTLY as they are in curly braces
- Keep brand names as-is
- Do not add or remove any facts

Return ONLY the ${lang} message. No labels, no explanations.`
          }]
        })
      });
      const data = await res.json();
      const generated = data.content?.[0]?.text || baseTemplate;
      onVersionsChange(versions.map(v => v.language === lang ? { ...v, content: generated } : v));
    } catch {}
    setGenerating(null);
  };

  const availableLanguages = LANGUAGES.filter(l => l !== "English" && !versions.find(v => v.language === l));
  const activeVersionData = versions.find(v => v.language === activeVersion);

  return (
    <div className="mt-3">
      {/* Language version pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {versions.map(v => (
          <button
            key={v.language}
            onClick={() => setActiveVersion(activeVersion === v.language ? null : v.language)}
            className={"flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all " +
              (activeVersion === v.language ? "bg-white text-black" : "bg-white/10 text-gray-300 hover:bg-white/20")}
          >
            {generating === v.language ? <Loader2 size={10} className="animate-spin" /> : null}
            {v.language}
            <span
              onClick={e => { e.stopPropagation(); removeLanguage(v.language); }}
              className="ml-0.5 text-gray-500 hover:text-red-400 cursor-pointer"
            >
              <X size={10} />
            </span>
          </button>
        ))}

        {/* Add language button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(o => !o)}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
          >
            <Plus size={10} /> Add language
            <ChevronDown size={10} />
          </button>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute z-50 top-full mt-1 left-0 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
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
        </div>
      </div>

      {/* Active version editor */}
      {activeVersion && activeVersionData && (
        <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <p className="text-xs font-bold text-gray-300">{activeVersion} version</p>
            <button
              onClick={() => regenerate(activeVersion)}
              disabled={generating === activeVersion}
              className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {generating === activeVersion
                ? <Loader2 size={10} className="animate-spin" />
                : <RefreshCcw size={10} />}
              Regenerate
            </button>
          </div>
          <textarea
            value={activeVersionData.content}
            onChange={e => updateContent(activeVersion, e.target.value)}
            rows={8}
            className="w-full bg-black/40 p-4 text-sm text-white resize-none focus:outline-none font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
