const fs = require("fs");
const path = "src/components/CurrencySettingsPanel.tsx";
let content = fs.readFileSync(path, "utf8");

// Make the component defensive - always ensure settings is an array
content = content.replace(
  `export function CurrencySettingsPanel({ settings, onChange }: Props) {
  const update = (index: number, field: string, value: string | number) => {
    onChange(settings.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };`,
  `export function CurrencySettingsPanel({ settings, onChange }: Props) {
  const safeSettings = Array.isArray(settings) ? settings : DEFAULT_CURRENCY_SETTINGS;
  const update = (index: number, field: string, value: string | number) => {
    onChange(safeSettings.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };`
);

// Replace all uses of settings with safeSettings in the JSX
content = content.replace(
  `        {settings.map((row, i) => (`,
  `        {safeSettings.map((row, i) => (`
);

fs.writeFileSync(path, content, "utf8");
console.log("Fixed");
