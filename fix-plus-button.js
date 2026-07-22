const fs = require("fs");
let content = fs.readFileSync("src/components/CurrencySettingsPanel.tsx", "utf8");

// Fix the add row - change from grid to flex so the + button never gets clipped
content = content.replace(
  `        <div className="grid grid-cols-[2fr_100px_1fr_1fr_36px] gap-3 items-center">
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
        </div>`,
  `        <div className="flex gap-3 items-center">
          <input
            value={newCountry}
            onChange={e => setNewCountry(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addRow()}
            placeholder="e.g. Brazil"
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/30 min-w-0"
          />
          <div className="w-24 shrink-0">
            <CurrencyPicker value={newCurrency} onChange={setNewCurrency} />
          </div>
          <input type="number" value={newSetup} onChange={e => setNewSetup(Number(e.target.value))}
            className="w-20 shrink-0 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
          <input type="number" value={newMonthly} onChange={e => setNewMonthly(Number(e.target.value))}
            className="w-20 shrink-0 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
          <button
            onClick={addRow}
            disabled={!newCountry.trim()}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </div>`
);

fs.writeFileSync("src/components/CurrencySettingsPanel.tsx", content, "utf8");
console.log("Done. Run: git add . && git commit -m 'fix plus button visible' && git push");
