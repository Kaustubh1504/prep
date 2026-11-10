const statusBox = document.getElementById("status");

// Minimal RFC 4180 parser: handles quoted fields containing commas, quotes and newlines.
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

document.getElementById("start").onclick = async () => {
  const file = document.getElementById("csv").files[0];
  const delayMs = Math.max(5, Number(document.getElementById("delay").value) || 8) * 1000;
  let items;
  if (file) {
    const [header, ...rows] = parseCsv(await file.text());
    const rankCol = header.indexOf("rank"), urlCol = header.indexOf("url");
    if (urlCol === -1) { statusBox.textContent = "CSV has no 'url' column."; return; }
    items = rows.filter((r) => r[urlCol]).map((r, i) => ({ rank: r[rankCol] || String(i + 1), url: r[urlCol] }));
  }
  chrome.runtime.sendMessage({ type: "start", items, delayMs });
};
document.getElementById("stop").onclick = () => chrome.runtime.sendMessage({ type: "stop" });
document.getElementById("reset").onclick = () => chrome.runtime.sendMessage({ type: "reset" });

chrome.storage.local.get("status", ({ status }) => { if (status) statusBox.textContent = status; });
chrome.storage.onChanged.addListener((changes) => {
  if (changes.status) statusBox.textContent = changes.status.newValue;
});
