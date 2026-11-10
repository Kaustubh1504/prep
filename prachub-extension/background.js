// Stop instead of saving when a page looks like a login wall, paywall or limit notice.
const BLOCKED = /(daily limit|limit reached|upgrade (to|your plan)|subscribe to (view|unlock)|(sign|log) in to (view|continue))/i;
const MIN_CONTENT_CHARS = 300;
// Some questions render almost no text (locked or empty); skip those, but several in a row means something is wrong.
const MAX_CONSECUTIVE_THIN = 3;
// Chrome rejects URLs longer than 2 MB, which caps what a data: URL download can carry.
const MAX_DATA_URL_CHARS = 2 * 1024 * 1024;

chrome.action.onClicked.addListener(() => chrome.tabs.create({ url: "control.html" }));

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "start") start(msg.items, msg.delayMs);
  if (msg.type === "stop") chrome.storage.local.set({ running: false, status: "Stopping after the current page..." });
  if (msg.type === "reset") chrome.storage.local.set({ done: [], skipped: [], status: "Progress cleared." });
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const setStatus = (status) => chrome.storage.local.set({ status });

async function start(items, delayMs) {
  const state = await chrome.storage.local.get(["running", "queue"]);
  if (state.running) return;
  const queue = items || state.queue;
  if (!queue?.length) return setStatus("Choose a CSV file first.");
  // Skipped pages are retried on every new start, in case they were thin because of a temporary problem.
  await chrome.storage.local.set({ running: true, queue, delayMs, skipped: [] });
  run().catch((err) => chrome.storage.local.set({ running: false, status: `Error: ${err.message}` }));
}

async function run() {
  const { queue, delayMs } = await chrome.storage.local.get(["queue", "delayMs"]);
  const tab = await chrome.tabs.create({ url: "about:blank", active: false });
  let consecutiveThin = 0;

  while (true) {
    const { running, done = [], skipped = [] } = await chrome.storage.local.get(["running", "done", "skipped"]);
    const next = queue.find((item) => !done.includes(item.url) && !skipped.some((s) => s.url === item.url));
    const skippedNote = skipped.length ? `\nSkipped (too little text): #${skipped.map((s) => s.rank).join(", #")}` : "";
    if (!running) return setStatus(`Stopped. ${done.length}/${queue.length} saved.${skippedNote}`);
    if (!next) {
      await chrome.storage.local.set({ running: false });
      return setStatus(`Finished. ${done.length}/${queue.length} saved.${skippedNote}`);
    }

    await setStatus(`Opening #${next.rank} (${done.length}/${queue.length} saved)\n${next.url}${skippedNote}`);
    await chrome.tabs.update(tab.id, { url: next.url });
    await waitForLoad(tab.id);
    const page = await extractWhenRendered(tab.id);

    // The site redirects between sections (e.g. /interview-questions/ -> /coding-questions/), so only require the slug.
    const slug = next.url.split("/").pop();
    const blockedMatch = page.text.match(BLOCKED);
    const problem = !page.url.includes(slug) ? "redirected away from the question"
      : blockedMatch ? `page contains "${blockedMatch[0]}"`
      : null;
    if (problem) {
      await chrome.storage.local.set({ running: false });
      return setStatus(`Stopped at #${next.rank}: ${problem}. Check the open tab.\n${page.url}`);
    }

    if (page.text.length < MIN_CONTENT_CHARS) {
      consecutiveThin++;
      await chrome.storage.local.set({ skipped: [...skipped, { rank: next.rank, url: next.url }] });
      if (consecutiveThin >= MAX_CONSECUTIVE_THIN) {
        await chrome.storage.local.set({ running: false });
        return setStatus(`Stopped at #${next.rank}: ${consecutiveThin} pages in a row had almost no text. Check the open tab.\n${page.url}`);
      }
      await sleep(delayMs * (0.75 + Math.random()));
      continue;
    }
    consecutiveThin = 0;

    const dataUrl = "data:text/html;charset=utf-8;base64," + toBase64(page.html);
    if (dataUrl.length > MAX_DATA_URL_CHARS) {
      await chrome.storage.local.set({ running: false });
      return setStatus(`Stopped at #${next.rank}: page HTML is too large to save via a data URL.\n${page.url}`);
    }
    await chrome.downloads.download({
      url: dataUrl,
      filename: `prachub/${String(next.rank).padStart(3, "0")}-${slug}.html`,
      conflictAction: "overwrite",
      saveAs: false,
    });
    await chrome.storage.local.set({ done: [...done, next.url] });
    // Vary the pause between 0.75x and 1.75x the configured delay so requests don't arrive on a fixed beat.
    await sleep(delayMs * (0.75 + Math.random()));
  }
}

function waitForLoad(tabId, timeoutMs = 30000) {
  return new Promise((resolve) => {
    const timer = setTimeout(done, timeoutMs);
    function done() {
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }
    function listener(id, info) {
      if (id === tabId && info.status === "complete") done();
    }
    chrome.tabs.onUpdated.addListener(listener);
  });
}

// The site renders client-side, so retry until the visible text stops growing.
async function extractWhenRendered(tabId) {
  let page = { url: "", html: "", text: "" };
  for (let attempt = 0; attempt < 5; attempt++) {
    await sleep(1500);
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId }, func: extractPage });
    if (result.text.length >= MIN_CONTENT_CHARS && result.text.length === page.text.length) return result;
    page = result;
  }
  return page;
}

// Runs inside the page: returns the rendered DOM, plus the main content's visible text for the blocked/empty check.
function extractPage() {
  const root = document.querySelector("main") || document.querySelector("article") || document.body;
  const html = `<!doctype html>\n<!-- saved from ${location.href} -->\n${document.documentElement.outerHTML}`;
  return { url: location.href, html, text: root.innerText.trim() };
}

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
