(() => {
  "use strict";

  const DATA = window.PRACTICE_DATA;
  if (!DATA) {
    document.getElementById("view").innerHTML = '<p class="card">data.js is missing. Run <code>python3 build_practice.py</code> in the project folder.</p>';
    return;
  }
  const STORE_KEY = "pattern-practice-v1";
  const STATUSES = ["todo", "attempted", "solved", "review"];
  const STATUS_LABELS = { todo: "Not started", attempted: "Attempted", solved: "Solved", review: "Review again" };
  const DEFAULT_FILTERS = { q: "", family: "", pattern: "", difficulty: "", status: "", role: "", source: "", mustdo: false, sort: "guide" };

  const problemsByRank = new Map(DATA.problems.map((p) => [p.rank, p]));
  const allPatterns = DATA.families.flatMap((f) => f.patterns);
  const familyOfPattern = new Map(DATA.families.flatMap((f) => f.patterns.map((p) => [p, f.name])));
  const guideOrder = buildGuideOrder();
  const view = document.getElementById("view");

  const filters = { ...DEFAULT_FILTERS };
  const blindOptions = { family: "", difficulty: "", unsolvedOnly: true, ranks: null };
  // Per page-load UI state: which blind problems have been revealed and which spoiler notes are open.
  const revealedBlind = new Map(); // rank -> guess result or null when skipped
  const revealedNotes = new Set();
  let activeEditor = null; // CodeMirror on the current problem page, for theme switches and pane resizes
  const LANGUAGES = {
    java: { label: "Java", mode: "text/x-java", bucket: "codeJava" },
    python: { label: "Python3", mode: "python", bucket: "code" },
  };
  const JAVA_REQUEST_TIMEOUT_MS = 60000; // compile + run; the server enforces the real time limit
  const JAVA_SERVER_HINT = "Java runs on your machine through the local server. In a terminal, run: python3 ~/Desktop/google/practice/server.py — then open http://localhost:8765";
  const SPLIT_KEY = "pattern-practice-split";
  const THEME_KEY = "pattern-practice-theme";

  // ---------- Persistence ----------
  const store = loadStore();
  let saveTimer = null;

  function emptyStore() {
    return { status: {}, code: {}, codeJava: {}, lang: "java", notes: {}, drill: {}, guesses: [], submissions: {}, concepts: {} };
  }

  function loadStore() {
    const empty = emptyStore();
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return saved && typeof saved === "object" ? { ...empty, ...saved } : empty;
    } catch {
      return empty;
    }
  }

  function writeStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      return true;
    } catch {
      return false;
    }
  }

  function persist(onSaved) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      const ok = writeStore();
      if (onSaved) onSaved(ok ? "Saved" : "Not saved: browser storage is unavailable");
    }, 300);
  }

  window.addEventListener("pagehide", () => {
    if (saveTimer) writeStore();
  });

  const statusOf = (rank) => store.status[rank] || "todo";
  const NEETCODE_RANK_OFFSET = 1000;
  const displayId = (p) => {
    if (p.source === "neetcode") return `NC${p.rank - NEETCODE_RANK_OFFSET}`;
    if (p.source === "apple") return p.code; // A1…A14, B1…B6, C1…C7
    return `#${p.rank}`;
  };

  // ---------- Rendering helpers ----------
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const canRenderMarkdown = () => Boolean(window.marked && window.DOMPurify);

  // Code (left alone) or a maths span: \[...\], $$...$$, \(...\), or $...$ (not a dollar amount).
  const MATH_OR_CODE = /(```[\s\S]*?```|`[^`\n]*`)|\\\[([\s\S]+?)\\\]|\$\$([\s\S]+?)\$\$|\\\(([\s\S]+?)\\\)|(?<![\\$\w])\$([^$\s](?:[^$\n]*[^$\s])?)\$(?![\w$])/g;

  /** Swap maths for placeholder tokens so Markdown can't mangle its backslashes; returns the text and the formulas. */
  function extractMath(md) {
    const formulas = [];
    const text = md.replace(MATH_OR_CODE, (match, code, block, blockDollar, inline, inlineDollar) => {
      if (code) return code;
      formulas.push({ tex: block || blockDollar || inline || inlineDollar, display: Boolean(block || blockDollar) });
      return `MATHTOKEN${formulas.length - 1}END`;
    });
    return { text, formulas };
  }

  function renderFormula({ tex, display }) {
    if (!window.katex) return `<code>${escapeHtml(tex)}</code>`;
    return katex.renderToString(tex, { displayMode: display, throwOnError: false, output: "html" });
  }

  function renderMarkdown(md) {
    if (!canRenderMarkdown()) return `<div class="plain">${escapeHtml(md)}</div>`;
    // ```hint <title> blocks are prose (bold, maths), not code: show them as a titled quote so they render as text.
    const withHints = md.replace(/```hint[ \t]*([^\n]*)\n([\s\S]*?)\n?```/g, (_, title, inner) => {
      const lines = (title.trim() ? [`**${title.trim()}**`, ""] : []).concat(inner.trim().split("\n"));
      return `\n${lines.map((line) => `> ${line}`).join("\n")}\n`;
    });
    const { text, formulas } = extractMath(withHints);
    // breaks: statements put "Input: / Output: / Explanation:" on consecutive lines without blank lines between.
    const html = DOMPurify.sanitize(marked.parse(text, { breaks: true }));
    // KaTeX output is generated from our own formula text (and escapes it), so it goes in after sanitising.
    return html.replace(/MATHTOKEN(\d+)END/g, (_, i) => renderFormula(formulas[Number(i)]));
  }

  function inlineMd(md) {
    return canRenderMarkdown() ? DOMPurify.sanitize(marked.parseInline(md)) : escapeHtml(md);
  }

  function buildGuideOrder() {
    const order = new Map();
    let i = 0;
    for (const pattern of allPatterns) {
      for (const cluster of DATA.clusters.filter((c) => c.pattern === pattern)) {
        for (const rank of clusterRanks(cluster)) order.set(rank, i++);
      }
      DATA.problems
        .filter((p) => p.pattern === pattern && p.role === "other")
        .sort((a, b) => a.rank - b.rank)
        .forEach((p) => order.set(p.rank, i++));
    }
    DATA.problems.forEach((p) => order.has(p.rank) || order.set(p.rank, i++));
    return order;
  }

  function clusterRanks(cluster) {
    return [cluster.anchor, ...cluster.members.filter((r) => r !== cluster.anchor)];
  }

  const DIFFICULTY_LABELS = { easy: "Easy", medium: "Med.", hard: "Hard" };

  function difficultyBadge(p, pill = false) {
    return `<span class="difficulty ${p.difficulty}${pill ? " pill" : ""}">${DIFFICULTY_LABELS[p.difficulty] || escapeHtml(p.difficulty)}</span>`;
  }

  const STATUS_ICONS = { solved: "✓", attempted: "◐", review: "↻", todo: "" };

  function statusDot(rank) {
    const status = statusOf(rank);
    return `<span class="status-icon ${status}" title="${STATUS_LABELS[status]}">${STATUS_ICONS[status]}</span>`;
  }

  function problemLink(rank, blind = false) {
    const p = problemsByRank.get(rank);
    return `<a href="#/p/${rank}${blind ? "/blind" : ""}">${displayId(p)} ${escapeHtml(p.title)}</a>`;
  }

  function patternSelect(id, selected = "") {
    const groups = DATA.families.map((f) => `<optgroup label="${escapeHtml(f.name)}">${
      f.patterns.map((p) => `<option value="${escapeHtml(p)}" ${p === selected ? "selected" : ""}>${escapeHtml(p)}</option>`).join("")
    }</optgroup>`);
    return `<select id="${id}"><option value="">Choose a pattern…</option>${groups.join("")}</select>`;
  }

  // ---------- Router ----------
  function route() {
    const [, page = "browse", arg, mode = ""] = location.hash.split("/");
    const activeTab = page === "p" ? ({ blind: "blind", hard: "hard", apple: "apple" }[mode] || "browse") : page;
    document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("active", a.dataset.tab === activeTab));

    const problem = page === "p" ? problemsByRank.get(Number(arg)) : null;
    activeEditor = null;
    document.body.classList.toggle("workspace-mode", Boolean(problem));
    if (problem) renderProblem(problem, mode);
    else if (page === "plan") renderPlan();
    else if (page === "hard") renderHard();
    else if (page === "apple") renderApple();
    else if (page === "concepts") renderConcepts();
    else if (page === "blind") renderBlindStart();
    else if (page === "progress") renderProgress();
    else renderBrowse();
    window.scrollTo(0, 0);
  }

  // ---------- Browse ----------
  function filterSelect(label, key, options, labels = {}, includeAny = true) {
    const opts = (includeAny ? ['<option value="">Any</option>'] : []).concat(
      options.map((o) => `<option value="${escapeHtml(o)}" ${filters[key] === o ? "selected" : ""}>${escapeHtml(labels[o] || o)}</option>`),
    );
    return `<label>${label}<select data-filter="${key}">${opts.join("")}</select></label>`;
  }

  function searchText(p) {
    const cluster = p.cluster !== null ? DATA.clusters[p.cluster] : null;
    return [displayId(p), p.title, p.summary, p.pattern, ...p.secondary, cluster && cluster.name, p.note, p.stretch]
      .filter(Boolean).join(" ").toLowerCase();
  }

  function matchesFilters(p) {
    const q = filters.q.trim().toLowerCase();
    if (q && !searchText(p).includes(q)) return false;
    if (filters.family && familyOfPattern.get(p.pattern) !== filters.family) return false;
    if (filters.pattern && p.pattern !== filters.pattern) return false;
    if (filters.difficulty && p.difficulty !== filters.difficulty) return false;
    if (filters.status && statusOf(p.rank) !== filters.status) return false;
    if (filters.role && p.role !== filters.role) return false;
    if (filters.source && p.source !== filters.source) return false;
    if (filters.mustdo && !p.mustdo) return false;
    return true;
  }

  function renderBrowse() {
    const patternOptions = filters.family ? DATA.families.find((f) => f.name === filters.family).patterns : allPatterns;
    if (filters.pattern && !patternOptions.includes(filters.pattern)) filters.pattern = "";

    view.innerHTML = `
      <div class="browse">
        <aside class="filters card">
          <label>Search<input type="search" data-filter="q" value="${escapeHtml(filters.q)}" placeholder="Title, #rank, technique (e.g. Rabin-Karp)"></label>
          ${filterSelect("Family", "family", DATA.families.map((f) => f.name))}
          ${filterSelect("Pattern", "pattern", patternOptions)}
          ${filterSelect("Difficulty", "difficulty", ["easy", "medium", "hard"])}
          ${filterSelect("Status", "status", STATUSES, STATUS_LABELS)}
          ${filterSelect("Role in cluster", "role", ["anchor", "variant", "other"], { anchor: "Anchor (solve first)", variant: "Variant", other: "Unclustered" })}
          ${filterSelect("Source", "source", ["full", "inferred", "neetcode", "apple"], { full: "PracHub (original)", inferred: "PracHub (inferred)", neetcode: "NeetCode 150", apple: "Apple set" })}
          <label class="check"><input type="checkbox" data-filter="mustdo" ${filters.mustdo ? "checked" : ""}> Must-do anchors only</label>
          ${filterSelect("Sort", "sort", ["guide", "popular"], { guide: "Guide order (clusters together)", popular: "Popularity" }, false)}
          <button type="button" class="ghost" id="clear-filters">Clear filters</button>
        </aside>
        <section>
          <div class="list-header"><span class="muted" id="count"></span></div>
          <div class="problem-list" id="list"></div>
        </section>
      </div>`;

    view.querySelectorAll("[data-filter]").forEach((el) => {
      const key = el.dataset.filter;
      el.addEventListener(el.type === "search" ? "input" : "change", () => {
        filters[key] = el.type === "checkbox" ? el.checked : el.value;
        if (key === "family") renderBrowse();
        else renderList();
      });
    });
    document.getElementById("clear-filters").addEventListener("click", () => {
      Object.assign(filters, DEFAULT_FILTERS);
      renderBrowse();
    });
    renderList();
  }

  function renderList() {
    const byPopularity = (a, b) => a.rank - b.rank;
    const byGuide = (a, b) => guideOrder.get(a.rank) - guideOrder.get(b.rank);
    const items = DATA.problems.filter(matchesFilters).sort(filters.sort === "popular" ? byPopularity : byGuide);
    document.getElementById("count").textContent = `${items.length} problem${items.length === 1 ? "" : "s"}`;
    document.getElementById("list").innerHTML = items.map((p) => problemItem(p)).join("") || '<p class="muted">No problems match these filters.</p>';
  }

  function problemItem(p, mode = "") {
    const cluster = p.cluster !== null ? DATA.clusters[p.cluster] : null;
    const anchor = mode === "hard" ? easierAnchor(p) : null;
    const context = [p.pattern, cluster && cluster.name, p.role === "anchor" && "anchor", anchor && `builds on ${displayId(anchor)}`,
      mode === "hard" && (p.difficulty_note || p.stretch)]
      .filter(Boolean).map(escapeHtml).join(" · ");
    return `<a class="problem-item" href="#/p/${p.rank}${mode ? `/${mode}` : ""}">
      ${statusDot(p.rank)}
      <span class="title"><span class="title-text">${displayId(p).replace(/^#/, "")}. ${escapeHtml(p.title)}</span><span class="sub">${context}</span></span>
      ${mode === "hard" && hardPriority.has(p.rank) ? '<span class="badge pattern">top 12</span>' : ""}
      ${mode === "hard" && p.stretch ? '<span class="badge medium">tricky medium</span>' : ""}
      ${mode === "hard" && testsFor(p.rank) ? '<span class="badge easy">▶ runnable</span>' : ""}
      ${p.mustdo ? '<span class="badge pattern">must-do</span>' : ""}
      ${p.source === "inferred" ? '<span class="badge">inferred</span>' : ""}
      ${p.source === "neetcode" ? '<span class="badge">NeetCode</span>' : ""}
      ${difficultyBadge(p)}
    </a>`;
  }

  // ---------- Problem ----------
  function renderProblem(p, mode = "") {
    const blind = mode === "blind";
    const revealed = !blind || revealedBlind.has(p.rank);
    const signature = extractSignature(p.body);
    const spec = testsFor(p.rank);
    const [backHref, backLabel] = { blind: ["#/blind", "Blind practice"], hard: ["#/hard", "Hard track"], apple: ["#/apple", "Apple"] }[mode]
      || ["#/browse", "Problem list"];
    const noteLabels = { cue: "Cue: what in the statement points to the pattern", invariant: "Invariant / key idea", pitfall: "Pitfall to remember" };

    view.innerHTML = `
      <div class="workspace" id="workspace">
        <section class="pane" id="left-pane">
          <div class="pane-tabs">
            <a class="pane-back" href="${backHref}">← ${backLabel}</a>
            <button type="button" class="pane-tab active" data-pane-tab="description">Description</button>
            <button type="button" class="pane-tab" data-pane-tab="notes">Notes</button>
            <button type="button" class="pane-tab" data-pane-tab="pattern">${revealed ? "Pattern" : "Pattern 🔒"}</button>
          </div>
          <div class="pane-body" data-pane-panel="description">
            ${blind ? blindBanner(p, revealed) : ""}
            ${mode === "hard" ? hardBanner(p) : ""}
            ${mode === "apple" ? appleBanner(p) : ""}
            <h1 class="problem-title">${displayId(p).replace(/^#/, "")}. ${escapeHtml(p.title)}</h1>
            <div class="row problem-tags">
              ${difficultyBadge(p, true)}
              ${p.round ? `<span class="badge">${escapeHtml(p.round)}</span>` : ""}
              ${p.source === "inferred" ? '<span class="badge" title="Reconstructed from PracHub\'s overview; details may differ from the original">inferred statement</span>' : ""}
              ${revealed ? `<span class="badge pattern">${escapeHtml(p.pattern)}</span>` : ""}
              ${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">Open on LeetCode ↗</a>` : ""}
            </div>
            <div class="row status-buttons" id="status-buttons">${statusButtons(p.rank)}</div>
            <div class="statement">${renderMarkdown(p.body)}</div>
          </div>
          <div class="pane-body notes" data-pane-panel="notes" hidden>
            <div class="row" style="justify-content: space-between">
              <h3>Your takeaway</h3>
              <span class="save-state" id="notes-state"></span>
            </div>
            ${Object.entries(noteLabels).map(([field, label]) => `
              <label>${label}
                <input type="text" data-note="${field}" value="${escapeHtml((store.notes[p.rank] || {})[field] || "")}">
              </label>`).join("")}
          </div>
          <div class="pane-body" data-pane-panel="pattern" id="cluster-panel" hidden>${revealed ? clusterPanel(p) : '<p class="muted">The pattern and cluster stay hidden until you lock in a guess.</p>'}</div>
        </section>
        <div class="gutter" id="gutter" role="separator" aria-orientation="vertical" title="Drag to resize"></div>
        <section class="pane" id="right-pane">${spec ? runnerPane(p, spec) : plainPane(signature)}</section>
      </div>`;

    wireTabs(document.getElementById("left-pane"), "pane");
    wireGutter();
    wireStatusButtons(p.rank);
    if (spec) setupRunner(p, spec);
    else setupPlainEditor(p, signature);
    wireNotes(p.rank);
    if (blind && !revealed) wireGuess(p);
    if (blind && revealed) wireNextBlind();
    if (mode === "hard") document.getElementById("next-hard").addEventListener("click", () => goToNextHard(p.rank));
    if (mode === "apple") wireAppleNext(p.rank);
    if (revealed) wireClusterPanel(p);
  }

  /** Tabs inside `container`: buttons carry data-<kind>-tab="key", panels data-<kind>-panel="key". Returns a selector. */
  function wireTabs(container, kind) {
    const select = (key) => {
      container.querySelectorAll(`[data-${kind}-tab]`).forEach((tab) => tab.classList.toggle("active", tab.getAttribute(`data-${kind}-tab`) === key));
      container.querySelectorAll(`[data-${kind}-panel]`).forEach((panel) => { panel.hidden = panel.getAttribute(`data-${kind}-panel`) !== key; });
    };
    container.addEventListener("click", (event) => {
      const tab = event.target.closest(`[data-${kind}-tab]`);
      if (tab) select(tab.getAttribute(`data-${kind}-tab`));
    });
    return select;
  }

  // The divider between the panes can be dragged; the split is remembered across problems.
  function wireGutter() {
    const gutter = document.getElementById("gutter");
    const workspace = document.getElementById("workspace");
    try {
      const saved = localStorage.getItem(SPLIT_KEY);
      if (saved) workspace.style.setProperty("--split", saved);
    } catch {
      // Storage unavailable: keep the default split.
    }
    gutter.addEventListener("mousedown", (event) => {
      event.preventDefault();
      const bounds = workspace.getBoundingClientRect();
      gutter.classList.add("dragging");
      document.body.classList.add("resizing");
      const move = (e) => {
        const percent = Math.min(75, Math.max(25, ((e.clientX - bounds.left) / bounds.width) * 100));
        workspace.style.setProperty("--split", `${percent.toFixed(1)}%`);
      };
      const stop = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stop);
        gutter.classList.remove("dragging");
        document.body.classList.remove("resizing");
        try {
          localStorage.setItem(SPLIT_KEY, workspace.style.getPropertyValue("--split"));
        } catch {
          // Not persisted; the split still applies to this page.
        }
        if (activeEditor) activeEditor.refresh();
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", stop);
    });
  }

  function editorTheme() {
    return document.documentElement.dataset.theme === "light" ? "default" : "material-darker";
  }

  /** Mount the code editor (CodeMirror when available, plain textarea otherwise) and return accessors. */
  function currentLanguage() {
    return LANGUAGES[store.lang] ? store.lang : "java";
  }

  function languageSelect() {
    const options = Object.entries(LANGUAGES)
      .map(([key, lang]) => `<option value="${key}"${key === currentLanguage() ? " selected" : ""}>${lang.label}</option>`).join("");
    return `<select class="lang" id="language" aria-label="Language">${options}</select>`;
  }

  function wireLanguageSelect() {
    document.getElementById("language").addEventListener("change", (event) => {
      store.lang = event.target.value;
      persist();
      route(); // re-render the problem with the other language's code and starter
    });
  }

  function mountEditor(textarea, rank, stateEl, initial, keys = {}) {
    const { bucket, mode } = LANGUAGES[currentLanguage()];
    const save = (value) => {
      store[bucket][rank] = value;
      stateEl.textContent = "Saving…";
      persist((message) => { stateEl.textContent = message; });
    };
    if (!window.CodeMirror) {
      setupEditor(textarea, rank, stateEl, bucket);
      if (!store[bucket][rank] && initial) textarea.value = initial;
      return {
        get: () => textarea.value,
        set: (value) => { textarea.value = value; save(value); },
        insert: (text) => { textarea.focus(); insertAtCursor(textarea, text); },
      };
    }
    textarea.value = store[bucket][rank] || initial;
    const editor = CodeMirror.fromTextArea(textarea, {
      mode,
      theme: editorTheme(),
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      autoCloseBrackets: true, // typing ( [ { " ' inserts the closing one; Enter between {} opens an indented block
      matchBrackets: true,
      styleActiveLine: true,
      extraKeys: {
        Tab: (cm) => (cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    ")),
        "Shift-Tab": (cm) => cm.indentSelection("subtract"),
        ...keys,
      },
    });
    editor.setSize("100%", "100%");
    editor.on("change", () => save(editor.getValue()));
    activeEditor = editor;
    return {
      get: () => editor.getValue(),
      set: (value) => editor.setValue(value),
      insert: (text) => { editor.replaceSelection(text); editor.focus(); },
    };
  }

  function plainPane(signature) {
    return `
      <div class="pane-tabs code-tabs">
        <span class="pane-tab active">&lt;/&gt; Code</span>
        ${languageSelect()}
        <span class="spacer"></span>
        <span class="save-state" id="code-state"></span>
        ${signature && currentLanguage() === "python" ? '<button type="button" class="ghost" id="insert-signature">Insert signature</button>' : ""}
      </div>
      <div class="editor-note">No tests for this problem. As in the interview, trace your examples by hand.</div>
      <div class="editor-wrap"><textarea class="code-editor" id="code" spellcheck="false" placeholder="# Clarify → examples → brute force → optimise → code → test"></textarea></div>`;
  }

  function setupPlainEditor(p, signature) {
    const editor = mountEditor(document.getElementById("code"), p.rank, document.getElementById("code-state"), "");
    wireLanguageSelect();
    const insertButton = document.getElementById("insert-signature");
    if (insertButton) insertButton.addEventListener("click", () => editor.insert(signature + "\n"));
  }

  function extractSignature(body) {
    // The first Python block before any spoiler is the signature/starter code.
    const visible = body.split("<details")[0];
    const match = visible.match(/```python\n([\s\S]*?)```/);
    return match ? match[1].trimEnd() : "";
  }

  function statusButtons(rank) {
    return STATUSES.map((s) => `<button type="button" data-status="${s}" class="${s} ${statusOf(rank) === s ? "active" : ""}">${STATUS_LABELS[s]}</button>`).join("");
  }

  function wireStatusButtons(rank) {
    const container = document.getElementById("status-buttons");
    container.addEventListener("click", (event) => {
      const status = event.target.dataset && event.target.dataset.status;
      if (status) setStatus(rank, status);
    });
  }

  function setupEditor(textarea, rank, stateEl, bucket = "code") {
    textarea.value = store[bucket][rank] || "";
    textarea.addEventListener("input", () => {
      store[bucket][rank] = textarea.value;
      stateEl.textContent = "Saving…";
      persist((message) => { stateEl.textContent = message; });
    });
    textarea.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && !event.shiftKey) {
        event.preventDefault();
        insertAtCursor(textarea, "    ");
      } else if (event.key === "Enter") {
        // Keep the current indentation, and indent one level after a line ending in ':'.
        const lineStart = textarea.value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
        const line = textarea.value.slice(lineStart, textarea.selectionStart);
        const indent = line.match(/^[ \t]*/)[0] + (/:\s*$/.test(line) ? "    " : "");
        event.preventDefault();
        insertAtCursor(textarea, "\n" + indent);
      }
    });
  }

  function insertAtCursor(textarea, text) {
    // execCommand keeps the browser's undo history; fall back when it is unsupported.
    if (!document.execCommand("insertText", false, text)) {
      textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, "end");
      textarea.dispatchEvent(new Event("input"));
    }
  }

  function wireNotes(rank) {
    const stateEl = document.getElementById("notes-state");
    view.querySelectorAll("[data-note]").forEach((input) => {
      input.addEventListener("input", () => {
        store.notes[rank] = { ...(store.notes[rank] || {}), [input.dataset.note]: input.value };
        stateEl.textContent = "Saving…";
        persist((message) => { stateEl.textContent = message; });
      });
    });
  }

  function clusterPanel(p) {
    const cluster = p.cluster !== null ? DATA.clusters[p.cluster] : null;
    const pattern = DATA.patterns[p.pattern];
    let html = `<h3>Pattern: ${escapeHtml(p.pattern)}</h3>`;
    if (p.secondary.length) html += `<p class="muted" style="margin-top: 0">Also uses: ${p.secondary.map(escapeHtml).join(", ")}</p>`;

    if (cluster) {
      html += `<p><strong>Cluster:</strong> ${escapeHtml(cluster.name)}${cluster.desc ? `: <span class="md">${inlineMd(cluster.desc)}</span>` : ""}</p>`;
      html += roleBox(p, cluster);
      html += `<ul class="cluster-members">${clusterRanks(cluster).map((rank) => `
        <li class="${rank === p.rank ? "current" : ""}">
          ${statusDot(rank)} ${problemLink(rank)}
          <span class="badge">${rank === cluster.anchor ? "anchor" : "variant"}</span>
        </li>`).join("")}</ul>`;
    } else {
      html += noteReveal(p, "Show the key twist", "Not part of a cluster. Try to name its twist before revealing.");
    }

    if (pattern && pattern.intro) {
      html += `<details class="md" style="margin-top: 16px"><summary>Pattern cheat sheet: cues, core idea, skeleton, pitfalls</summary>${renderMarkdown(pattern.intro)}</details>`;
    }
    return html;
  }

  function roleBox(p, cluster) {
    if (p.role === "anchor") {
      return noteReveal(p, "Why this is the anchor", "This is the cluster's <strong>anchor</strong>: solve it properly, then drill the variants below.");
    }
    return `
      <div class="reveal-box">
        <p style="margin-top: 0"><strong>Variant drill:</strong> how does this differ from anchor ${problemLink(cluster.anchor)}, and how does that approach adapt? Answer before revealing.</p>
        <textarea id="drill" rows="3" style="width: 100%" placeholder="What changes, and what I'd change in the anchor's approach…">${escapeHtml(store.drill[p.rank] || "")}</textarea>
        ${revealedNotes.has(p.rank)
          ? `<div class="md" style="margin-top: 8px">${inlineMd(p.note || "No notes for this variant.")}</div>`
          : '<button type="button" id="reveal-note" style="margin-top: 8px">Reveal the difference</button>'}
      </div>`;
  }

  function noteReveal(p, buttonLabel, intro) {
    return `
      <div class="reveal-box">
        <p style="margin-top: 0">${intro}</p>
        ${revealedNotes.has(p.rank)
          ? `<div class="md">${inlineMd(p.note || "No notes for this problem.")}</div>`
          : `<button type="button" id="reveal-note">${buttonLabel}</button>`}
      </div>`;
  }

  function wireClusterPanel(p) {
    const revealButton = document.getElementById("reveal-note");
    if (revealButton) {
      revealButton.addEventListener("click", () => {
        revealedNotes.add(p.rank);
        document.getElementById("cluster-panel").innerHTML = clusterPanel(p);
        wireClusterPanel(p);
      });
    }
    const drill = document.getElementById("drill");
    if (drill) {
      drill.addEventListener("input", () => {
        store.drill[p.rank] = drill.value;
        persist();
      });
    }
  }

  // ---------- Code runner ----------
  const testsFor = (rank) => (window.PRACTICE_TESTS || {})[rank] || null;

  function setStatus(rank, status) {
    if (status === "todo") delete store.status[rank];
    else store.status[rank] = status;
    persist();
    const buttons = document.getElementById("status-buttons");
    if (buttons) buttons.innerHTML = statusButtons(rank);
  }

  function submissionSummary(rank) {
    const history = store.submissions[rank] || [];
    if (!history.length) return "No submissions yet. Run checks the sample tests; Submit adds the hidden ones.";
    const last = history[history.length - 1];
    const solved = history.some((h) => h.status === "Accepted");
    return `${history.length} submission${history.length === 1 ? "" : "s"} · last: ${last.status} (${last.passed}/${last.total})${solved ? " · solved ✓" : ""}`;
  }

  function runnerPane(p, spec) {
    return `
      <div class="pane-tabs code-tabs">
        <span class="pane-tab active">&lt;/&gt; Code</span>
        ${languageSelect()}
        <span class="spacer"></span>
        <span class="save-state" id="code-state"></span>
        <button type="button" class="ghost icon-btn" id="reset-code" title="Reset to starter code">↺</button>
        <button type="button" class="run-btn" id="run-code" title="Run sample tests (⌘/Ctrl+Enter)">▶ Run</button>
        <button type="button" class="submit-btn" id="submit-code" title="Run all tests (⌘/Ctrl+Shift+Enter)">Submit</button>
      </div>
      ${runnerNotes(spec).map((note) => `<div class="editor-note">${escapeHtml(note)}</div>`).join("")}
      <div class="editor-wrap"><textarea id="code" class="code-editor" spellcheck="false"></textarea></div>
      <div class="console" id="console">
        <div class="pane-tabs">
          <button type="button" class="pane-tab active" data-console-tab="cases">Testcase</button>
          <button type="button" class="pane-tab" data-console-tab="result">Test Result</button>
          <span class="spacer"></span>
          <span class="runner-hint" id="submission-summary">${escapeHtml(submissionSummary(p.rank))}</span>
        </div>
        <div class="console-body" data-console-panel="cases">${testcasesHtml(spec)}</div>
        <div class="console-body" data-console-panel="result" id="run-result" hidden><p class="muted">Run your code to see results here.</p></div>
      </div>`;
  }

  function runnerNotes(spec) {
    const java = spec.java || {};
    if (currentLanguage() !== "java") return [spec.notes].filter(Boolean);
    if (java.unsupported) return [`${java.unsupported} Switch to Python3 to run it.`];
    // A Java-specific note replaces the Python one, which talks in Python terms (None, float('inf'), ...).
    return [java.notes || spec.notes, location.protocol === "file:" && JAVA_SERVER_HINT].filter(Boolean);
  }

  async function runJava(rank, code, includeHidden) {
    if (location.protocol === "file:") return { status: "Server needed", error: JAVA_SERVER_HINT, tests: [] };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), JAVA_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch("api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rank, code, includeHidden, language: "java" }),
        signal: controller.signal,
      });
      return await response.json();
    } catch (err) {
      return { status: "Server needed", error: `Couldn't reach the local Java server (${err.message}). ${JAVA_SERVER_HINT}`, tests: [] };
    } finally {
      clearTimeout(timer);
    }
  }

  /** Parameter names from the entry's signature in the starter code, for labelling test inputs. */
  function parameterNames(spec) {
    const match = spec.starter.match(new RegExp(`def ${spec.entry}\\(([^)]*)\\)`));
    if (!match) return [];
    const names = [];
    let depth = 0;
    let current = "";
    for (const ch of match[1]) {
      if ("[(".includes(ch)) depth++;
      if ("])".includes(ch)) depth--;
      if (ch === "," && depth === 0) {
        names.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    names.push(current);
    return names.map((n) => n.split(":")[0].split("=")[0].trim()).filter((n) => n && n !== "self");
  }

  function testcasesHtml(spec) {
    const cases = spec.tests.filter((t) => !t.hidden);
    const names = parameterNames(spec);
    const fields = (test) => (spec.kind === "class"
      ? [["operations", test.ops], ["arguments", test.args]]
      : test.args.map((arg, i) => [names[i] || `arg${i + 1}`, arg]));
    const expectedLabel = spec.checker ? "expected (one valid answer)" : "expected";
    return `
      <div class="case-chips">${cases.map((_, i) => `<button type="button" class="case-chip${i ? "" : " active"}" data-case-tab="${i}">Case ${i + 1}</button>`).join("")}</div>
      ${cases.map((test, i) => `
        <div class="case-panel" data-case-panel="${i}"${i ? " hidden" : ""}>
          ${fields(test).concat([[expectedLabel, test.expected]]).map(([label, value]) => `
            <div class="case-field"><div class="label">${escapeHtml(label)} =</div><pre>${escapeHtml(JSON.stringify(value))}</pre></div>`).join("")}
        </div>`).join("")}`;
  }

  function setupRunner(p, spec) {
    const resultEl = document.getElementById("run-result");
    const runButton = document.getElementById("run-code");
    const submitButton = document.getElementById("submit-code");
    const consoleEl = document.getElementById("console");
    const showConsole = wireTabs(consoleEl, "console");
    wireTabs(consoleEl, "case");

    const java = currentLanguage() === "java";
    const starter = java ? (spec.java && spec.java.starter) || "" : spec.starter;
    if (java && spec.java && spec.java.unsupported) runButton.disabled = submitButton.disabled = true;
    const editor = mountEditor(document.getElementById("code"), p.rank, document.getElementById("code-state"), starter, {
      "Ctrl-Enter": () => execute(false),
      "Cmd-Enter": () => execute(false),
      "Shift-Ctrl-Enter": () => execute(true),
      "Shift-Cmd-Enter": () => execute(true),
    });

    async function execute(includeHidden) {
      if (runButton.disabled) return;
      runButton.disabled = submitButton.disabled = true;
      showConsole("result");
      const action = includeHidden ? "Submitting…" : "Running…";
      const loading = java ? "Compiling and running your Java…" : PythonRunner.isReady() ? action : "Loading Python in your browser (the first time takes about 10 s)…";
      resultEl.innerHTML = `<p class="muted">${loading}</p>`;
      const result = java ? await runJava(p.rank, editor.get(), includeHidden) : await PythonRunner.run(spec, editor.get(), includeHidden);
      runButton.disabled = submitButton.disabled = false;
      if (!resultEl.isConnected) return; // the student navigated away while it ran
      recordRun(p.rank, result, includeHidden);
      resultEl.innerHTML = runResultHtml(spec, result, includeHidden);
      document.getElementById("submission-summary").textContent = submissionSummary(p.rank);
    }

    runButton.addEventListener("click", () => execute(false));
    submitButton.addEventListener("click", () => execute(true));
    document.getElementById("reset-code").addEventListener("click", () => {
      if (confirm("Replace your code with the starter code?")) editor.set(starter);
    });
    wireLanguageSelect();
    if (!java) PythonRunner.warmUp(); // load Python while the student reads the problem
  }

  function recordRun(rank, result, submitted) {
    if (result.status === "Server needed" || result.status === "Unsupported") return;
    if (submitted) {
      const history = (store.submissions[rank] = store.submissions[rank] || []);
      history.push({ at: Date.now(), status: result.status, passed: result.passed || 0, total: result.total || 0 });
      if (history.length > 20) history.shift();
    }
    if (submitted && result.status === "Accepted") setStatus(rank, "solved");
    else if (statusOf(rank) === "todo") setStatus(rank, "attempted");
    else persist();
  }

  function runResultHtml(spec, result, submitted) {
    const accepted = result.status === "Accepted";
    // On submit only the failing test matters (the judge stops there); on run, show every sample.
    const shown = submitted ? result.tests.filter((t) => !t.passed) : result.tests;
    return `
      <div class="verdict ${accepted ? "accepted" : "failed"}">${escapeHtml(result.status)}</div>
      ${result.total ? `<p class="muted" style="margin: 0">${result.passed}/${result.total} ${submitted ? "tests passed, hidden ones included" : "sample tests passed"}</p>` : ""}
      ${result.error ? `<pre class="run-error">${escapeHtml(result.error)}</pre>` : ""}
      ${shown.map((test) => testCaseHtml(spec, test)).join("")}
      ${submitted && accepted ? '<p class="muted">All tests pass. Marked as solved.</p>' : ""}`;
  }

  function testCaseHtml(spec, test) {
    const rows = [["Input", test.input], [spec.checker ? "Expected (one valid answer)" : "Expected", test.expected]];
    if (test.got !== null) rows.push(["Your output", test.got]);
    if (test.stdout) rows.push(["Output (print / System.out / System.err)", test.stdout]);
    return `
      <div class="test-case ${test.passed ? "passed" : "failed"}">
        <h4>${test.passed ? "✓" : "✗"} ${test.hidden ? "Hidden test" : "Case"} ${test.index + 1} <span class="muted" style="font-weight: 400">${test.ms} ms</span></h4>
        ${rows.map(([label, value]) => `<div class="label">${label}</div><pre>${escapeHtml(value)}</pre>`).join("")}
        ${test.error ? `<div class="label">Error</div><pre class="run-error">${escapeHtml(test.error)}</pre>` : ""}
      </div>`;
  }

  // ---------- Hard track ----------
  const HARD_DEFAULTS = { level: "both", source: "prachub", status: "", view: "order" };
  // Level, source and status persist in the store; the view always opens in suggested order.
  const hardState = { ...HARD_DEFAULTS, ...(store.hardFilters || {}), view: HARD_DEFAULTS.view, q: "" };
  const hardPriority = new Set(DATA.hard_priority);

  function hardTrack() {
    const ranks = { hard: DATA.hard_order, stretch: DATA.stretch_order }[hardState.level] || DATA.hard_order.concat(DATA.stretch_order);
    return ranks
      .map((rank) => problemsByRank.get(rank))
      .filter((p) => !hardState.source || (hardState.source === "neetcode") === (p.source === "neetcode"));
  }

  // A hard variant whose cluster anchor is easier: the anchor is the stepping stone when stuck.
  function easierAnchor(p) {
    const cluster = p.cluster !== null ? DATA.clusters[p.cluster] : null;
    const anchor = cluster && cluster.anchor !== p.rank ? problemsByRank.get(cluster.anchor) : null;
    return anchor && anchor.difficulty !== "hard" ? anchor : null;
  }

  function goToNextHard(currentRank) {
    const track = hardTrack();
    const start = track.findIndex((p) => p.rank === currentRank) + 1; // 0 when not on the track
    const next = track.slice(start).concat(track.slice(0, start))
      .find((p) => p.rank !== currentRank && statusOf(p.rank) !== "solved");
    location.hash = next ? `#/p/${next.rank}/hard` : "#/hard";
  }

  function hardBanner(p) {
    const track = hardTrack();
    const solved = track.filter((q) => statusOf(q.rank) === "solved").length;
    const anchor = easierAnchor(p);
    return `
      <div class="blind-banner row" style="justify-content: space-between">
        <span>Hard track: <strong>${solved}/${track.length}</strong> solved${p.stretch ? ` · <em>Tricky medium:</em> ${escapeHtml(p.stretch)}` : ""}${anchor ? ` · Stuck after 15 min? Solve its anchor ${problemLink(anchor.rank)} first.` : ""}</span>
        <button type="button" id="next-hard">Next unsolved hard →</button>
      </div>`;
  }

  function renderHard() {
    const track = hardTrack();
    const count = (status) => track.filter((p) => statusOf(p.rank) === status).length;
    const q = hardState.q.trim().toLowerCase();
    const items = track.filter((p) => (!hardState.status || statusOf(p.rank) === hardState.status) && (!q || searchText(p).includes(q)));
    const neetcodeCount = DATA.hard_order.filter((rank) => problemsByRank.get(rank).source === "neetcode").length;    const select = (key, options) => `<select data-hard="${key}">${options.map(([value, label]) =>
      `<option value="${value}" ${hardState[key] === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>`;

    view.innerHTML = `
      <section class="card">
        <h2 style="margin-top: 0">Hard track</h2>
        <p class="muted">${DATA.hard_order.length} hard problems: ${DATA.hard_order.length - neetcodeCount} from PracHub (including ${DATA.problems.filter((p) => p.difficulty_note).length} whose coding version PracHub rates Hard) and ${neetcodeCount} from NeetCode 150, which open on LeetCode. Plus ${DATA.stretch_order.length} <strong>tricky mediums</strong>: rated medium but not straightforward, because they need an insight, combine techniques, or twist a standard template. Give each one 40–45 minutes on the timer. Stuck after 15? Solve the cluster's easier anchor first, then come back. The hard part is usually one extra twist on top of it.</p>
        <div class="stats">
          <div class="stat"><strong>${count("solved")}</strong>solved</div>
          <div class="stat"><strong>${count("attempted")}</strong>attempted</div>
          <div class="stat"><strong>${count("review")}</strong>to review</div>
          <div class="stat"><strong>${count("todo")}</strong>not started</div>
        </div>
        <div class="row" style="margin-top: 12px">
          <input type="search" id="hard-search" value="${escapeHtml(hardState.q)}" placeholder="Search title or technique (e.g. Rabin-Karp)">
          <label>Level ${select("level", [["both", "Hard + tricky mediums"], ["hard", "Hard only"], ["stretch", "Tricky mediums only"]])}</label>
          <label>Source ${select("source", [["", "All"], ["prachub", "PracHub"], ["neetcode", "NeetCode 150"]])}</label>
          <label>Status ${select("status", [["", "Any"], ...STATUSES.map((s) => [s, STATUS_LABELS[s]])])}</label>
          <label>View ${select("view", [["order", "Suggested order"], ["pattern", "By pattern"]])}</label>
          <button type="button" id="hard-next">Next unsolved →</button>
          <button type="button" class="ghost" id="hard-random">Random, pattern hidden</button>
        </div>
      </section>
      <div style="margin-top: 16px">${items.length ? hardList(items) : '<p class="muted">Nothing matches these filters.</p>'}</div>`;

    view.querySelectorAll("[data-hard]").forEach((el) => el.addEventListener("change", () => {
      hardState[el.dataset.hard] = el.value;
      store.hardFilters = { level: hardState.level, source: hardState.source, status: hardState.status };
      persist();
      renderHard();
    }));
    const search = document.getElementById("hard-search");
    search.addEventListener("change", () => {
      hardState.q = search.value;
      renderHard();
      document.getElementById("hard-search").focus();
    });
    document.getElementById("hard-next").addEventListener("click", () => goToNextHard(null));
    document.getElementById("hard-random").addEventListener("click", () => {
      // Draw from exactly the problems on this track (respecting Level and Source).
      Object.assign(blindOptions, { family: "", difficulty: "", unsolvedOnly: true, ranks: hardTrack().map((p) => p.rank) });
      startBlindProblem();
    });
  }

  function hardList(items) {
    if (hardState.view === "order") {
      return `<div class="problem-list">${items.map((p) => problemItem(p, "hard")).join("")}</div>`;
    }
    return allPatterns.map((pattern) => {
      const group = items.filter((p) => p.pattern === pattern);
      if (!group.length) return "";
      const solved = group.filter((p) => statusOf(p.rank) === "solved").length;
      return `<h3 style="margin: 16px 0 8px">${escapeHtml(pattern)} <span class="muted">(${solved}/${group.length} solved)</span></h3>
        <div class="problem-list">${group.map((p) => problemItem(p, "hard")).join("")}</div>`;
    }).join("");
  }

  // ---------- Apple set ----------
  const appleTrack = () => DATA.apple.order.map((rank) => problemsByRank.get(rank));
  const appleCodingTrack = () => appleTrack().filter((p) => p.part !== "C");

  function nextApple(currentRank) {
    const track = appleCodingTrack();
    const start = track.findIndex((p) => p.rank === currentRank) + 1; // 0 when not on the track
    return track.slice(start).concat(track.slice(0, start)).find((p) => p.rank !== currentRank && statusOf(p.rank) !== "solved") || null;
  }

  function appleBanner(p) {
    const track = appleCodingTrack();
    const solved = track.filter((q) => statusOf(q.rank) === "solved").length;
    const position = DATA.apple.order.indexOf(p.rank) + 1;
    return `
      <div class="blind-banner row" style="justify-content: space-between">
        <span>Apple set: <strong>${solved}/${track.length}</strong> solved · ${position} of ${DATA.apple.order.length} in the recommended order</span>
        ${p.part === "C" ? "" : '<button type="button" id="next-apple">Next in order →</button>'}
      </div>`;
  }

  function wireAppleNext(rank) {
    const button = document.getElementById("next-apple");
    if (!button) return;
    button.addEventListener("click", () => {
      const next = nextApple(rank);
      location.hash = next ? `#/p/${next.rank}/apple` : "#/apple";
    });
  }

  function renderApple() {
    const track = appleCodingTrack();
    const count = (status) => track.filter((p) => statusOf(p.rank) === status).length;
    const runnable = track.filter((p) => testsFor(p.rank)).length;
    view.innerHTML = `
      <section class="card">
        <h2 style="margin-top: 0">Apple set</h2>
        <p class="muted">${escapeHtml(DATA.apple.intro)} Each problem has a statement, an example, things to clarify, and an approach behind a spoiler: try the problem before opening it.</p>
        <div class="stats">
          <div class="stat"><strong>${count("solved")}</strong>solved</div>
          <div class="stat"><strong>${count("attempted")}</strong>attempted</div>
          <div class="stat"><strong>${count("review")}</strong>to review</div>
          <div class="stat"><strong>${runnable}/${track.length}</strong>with runnable tests</div>
        </div>
        <div class="row" style="margin-top: 12px"><button type="button" id="apple-next">Next in order →</button></div>
      </section>
      ${DATA.apple.parsing_track && DATA.apple.parsing_track.length ? parsingTrackSection() : ""}
      ${DATA.apple.ai_track && DATA.apple.ai_track.length ? aiTrackSection() : ""}
      ${DATA.apple.classes_track && DATA.apple.classes_track.length ? classesTrackSection() : ""}
      ${DATA.apple.team_prep ? `<section class="card statement" style="margin-top: 16px">${renderMarkdown(DATA.apple.team_prep)}</section>` : ""}
      <h3 style="margin: 20px 0 8px">Full Apple set, recommended order</h3>
      <div class="problem-list">${appleTrack().map((p, i) => appleRow(p, i + 1)).join("")}</div>
      <section class="card" style="margin-top: 16px">
        <p style="margin-top: 0">${inlineMd(DATA.apple.concepts)}</p>
        <p class="muted" style="margin-bottom: 0">${inlineMd(DATA.apple.skipped)}</p>
      </section>`;
    document.getElementById("apple-next").addEventListener("click", () => {
      const next = nextApple(null);
      location.hash = next ? `#/p/${next.rank}/apple` : "#/apple";
    });
  }

  /** The minimal practical set: parsing problems plus Python-feature drills, with the production checklist. */
  function parsingTrackSection() {
    const track = DATA.apple.parsing_track.map((rank) => problemsByRank.get(rank));
    const solved = track.filter((p) => statusOf(p.rank) === "solved").length;
    return `
      <h3 style="margin: 20px 0 8px">Minimal set: parsing and production-ready Python (${solved}/${track.length} solved)</h3>
      <p class="muted" style="margin: 0 0 8px">Ten parsing problems from simple to hard, then three Python-language drills. Write each one as if it were a pull request, using the checklist below.</p>
      <div class="problem-list">${track.map((p, i) => appleRow(p, i + 1)).join("")}</div>
      ${DATA.apple.production_checklist ? `<section class="card statement" style="margin-top: 12px">${renderMarkdown(DATA.apple.production_checklist)}</section>` : ""}`;
  }

  function aiTrackSection() {
    const track = DATA.apple.ai_track.map((rank) => problemsByRank.get(rank));
    const solved = track.filter((p) => statusOf(p.rank) === "solved").length;
    const cards = DATA.concepts.cards.filter((c) => c.area === "AI/ML for automation").length;
    return `
      <h3 style="margin: 20px 0 8px">Minimal set: AI/ML automation (${solved}/${track.length} solved)</h3>
      <p class="muted" style="margin: 0 0 8px">The ML ideas this team works on, coded in pure Python (no numpy or sklearn), the way an intern interview asks them. Then do the ${cards} AI/ML design cards in <a href="#/concepts">Concepts</a> (filter Area → AI/ML for automation): they cover triage pipelines, safe rollout, test selection and your own project pitch.</p>
      <div class="problem-list">${track.map((p, i) => appleRow(p, i + 1)).join("")}</div>`;
  }

  function classesTrackSection() {
    const track = DATA.apple.classes_track.map((rank) => problemsByRank.get(rank));
    const solved = track.filter((p) => statusOf(p.rank) === "solved").length;
    const cards = DATA.concepts.cards.filter((c) => c.topic && c.topic.startsWith("OOP")).length;
    return `
      <h3 style="margin: 20px 0 8px">Minimal set: Python classes and OOP (${solved}/${track.length} solved)</h3>
      <p class="muted" style="margin: 0 0 8px">Five class-design drills set in CI tooling (a value object, a validated dataclass, an abstract base class, a plugin registry, dependency injection), then three earlier drills that test the same skills. Each one checks the class contract too: hashing, immutability, abstract methods, copies. Then do the ${cards} OOP cards in <a href="#/concepts">Concepts</a> (filter Area → Python language).</p>
      <div class="problem-list">${track.map((p, i) => appleRow(p, i + 1)).join("")}</div>`;
  }

  function appleRow(p, position) {
    const part = DATA.apple.parts[p.part];
    const tags = [
      testsFor(p.rank) ? '<span class="badge easy">▶ runnable</span>' : "",
      p.part === "C" ? '<span class="badge">talk-through</span>' : "",
    ].join("");
    return `<a class="problem-item" href="#/p/${p.rank}/apple">
      ${statusDot(p.rank)}
      <span class="title"><span class="title-text">${position}. ${escapeHtml(p.code)} · ${escapeHtml(p.title)}</span><span class="sub">${escapeHtml(part)} · ${escapeHtml(p.pattern)}</span></span>
      ${tags}
      ${difficultyBadge(p)}
    </a>`;
  }

  // ---------- Concept flashcards ----------
  const conceptFilters = { area: "", status: "", level: "" };
  const revealedConcepts = new Set();
  const CONCEPT_STATUS_LABELS = { "": "Any", new: "New", review: "Review again", known: "Knew it" };

  const conceptStatus = (id) => store.concepts[id] || "new";

  function visibleConcepts() {
    return DATA.concepts.cards.filter((c) =>
      (!conceptFilters.area || c.area === conceptFilters.area)
      && (!conceptFilters.status || conceptStatus(c.id) === conceptFilters.status)
      && (!conceptFilters.level || c.level === conceptFilters.level));
  }

  function renderConcepts() {
    const cards = DATA.concepts.cards;
    const count = (status) => cards.filter((c) => conceptStatus(c.id) === status).length;
    const select = (key, options) => `<select data-concept-filter="${key}">${options.map(([value, label]) =>
      `<option value="${escapeHtml(value)}" ${conceptFilters[key] === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>`;
    const shown = visibleConcepts();

    view.innerHTML = `
      <section class="card">
        <h2 style="margin-top: 0">Concepts</h2>
        <p class="muted">Interview questions for the Apple Firmware CI/CD role, by area. Answer out loud first, then reveal the model answer and the likely follow-ups, and mark how it went.</p>
        <div class="stats">
          <div class="stat"><strong>${count("known")}</strong>knew it</div>
          <div class="stat"><strong>${count("review")}</strong>to review</div>
          <div class="stat"><strong>${count("new")}</strong>not tried</div>
          <div class="stat"><strong>${cards.length}</strong>cards</div>
        </div>
        <div class="row" style="margin-top: 12px">
          <label>Area ${select("area", [["", "All areas"], ...DATA.concepts.areas.map((a) => [a, a])])}</label>
          <label>Status ${select("status", Object.entries(CONCEPT_STATUS_LABELS))}</label>
          <label>Level ${select("level", [["", "Any"], ["core", "Core"], ["stretch", "Stretch"]])}</label>
          <button type="button" id="concept-random">Random unanswered</button>
        </div>
      </section>
      <p class="muted" style="margin: 16px 0 8px">${shown.length} card${shown.length === 1 ? "" : "s"}</p>
      <div id="concept-list">${shown.map(conceptCard).join("") || '<p class="muted">No cards match these filters.</p>'}</div>`;

    view.querySelectorAll("[data-concept-filter]").forEach((el) => el.addEventListener("change", () => {
      conceptFilters[el.dataset.conceptFilter] = el.value;
      renderConcepts();
    }));
    document.getElementById("concept-random").addEventListener("click", () => {
      const pool = visibleConcepts().filter((c) => conceptStatus(c.id) !== "known");
      if (!pool.length) return;
      const card = pool[Math.floor(Math.random() * pool.length)];
      document.getElementById(`concept-${card.id}`).scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.getElementById("concept-list").addEventListener("click", onConceptClick);
  }

  function conceptCard(card) {
    const status = conceptStatus(card.id);
    const revealed = revealedConcepts.has(card.id);
    const statusBadge = status === "new" ? "" : `<span class="badge ${status === "known" ? "easy" : "medium"}">${CONCEPT_STATUS_LABELS[status]}</span>`;
    return `
      <article class="card concept-card" id="concept-${escapeHtml(card.id)}">
        <div class="row" style="justify-content: space-between">
          <span class="muted concept-meta">${escapeHtml(card.area)} · ${escapeHtml(card.topic)}${card.level === "stretch" ? " · stretch" : ""}</span>
          ${statusBadge}
        </div>
        <div class="statement concept-question">${renderMarkdown(card.question)}</div>
        ${revealed ? `
          <div class="statement concept-answer">${renderMarkdown(card.answer)}</div>
          ${card.followups && card.followups.length ? `<div class="concept-followups"><strong>Likely follow-ups</strong><ul>${card.followups.map((f) => `<li>${inlineMd(f)}</li>`).join("")}</ul></div>` : ""}
          <div class="row">
            <button type="button" class="ghost" data-concept-mark="known" data-id="${escapeHtml(card.id)}">Knew it</button>
            <button type="button" class="ghost" data-concept-mark="review" data-id="${escapeHtml(card.id)}">Review again</button>
          </div>`
        : `<button type="button" data-concept-reveal="${escapeHtml(card.id)}">Show answer</button>`}
      </article>`;
  }

  function onConceptClick(event) {
    const reveal = event.target.closest("[data-concept-reveal]");
    const mark = event.target.closest("[data-concept-mark]");
    const id = reveal ? reveal.dataset.conceptReveal : mark ? mark.dataset.id : null;
    if (!id) return;
    if (reveal) revealedConcepts.add(id);
    if (mark) {
      store.concepts[id] = mark.dataset.conceptMark;
      persist();
    }
    const card = DATA.concepts.cards.find((c) => c.id === id);
    document.getElementById(`concept-${id}`).outerHTML = conceptCard(card);
  }

  // ---------- Blind practice ----------
  function blindCandidates() {
    const allowed = blindOptions.ranks ? new Set(blindOptions.ranks) : null;
    return DATA.problems.filter((p) =>
      (!allowed || allowed.has(p.rank))
      && (!blindOptions.family || familyOfPattern.get(p.pattern) === blindOptions.family)
      && (!blindOptions.difficulty || p.difficulty === blindOptions.difficulty)
      && (!blindOptions.unsolvedOnly || statusOf(p.rank) !== "solved"));
  }

  function pickBlindProblem() {
    const candidates = blindCandidates();
    if (!candidates.length) return null;
    // Prefer problems not yet guessed; fall back to the whole pool once everything has been seen.
    const guessed = new Set(store.guesses.map((g) => g.rank));
    const fresh = candidates.filter((p) => !guessed.has(p.rank));
    const pool = fresh.length ? fresh : candidates;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startBlindProblem() {
    const problem = pickBlindProblem();
    if (problem) location.hash = `#/p/${problem.rank}/blind`;
  }

  function renderBlindStart() {
    blindOptions.ranks = null; // the Blind tab picks from its own filters, not a Hard-track list
    const accuracy = recognitionAccuracy();
    view.innerHTML = `
      <div class="card" style="max-width: 720px">
        <h2 style="margin-top: 0">Blind practice</h2>
        <p>In the interview nobody tells you the pattern. You get a random problem with its pattern and cluster hidden. Read it, decide which pattern solves it, lock in your guess, then solve it with the timer running.</p>
        <div class="row" style="margin: 16px 0">
          <label>Family <select id="blind-family"><option value="">Any</option>${DATA.families.map((f) => `<option ${blindOptions.family === f.name ? "selected" : ""}>${escapeHtml(f.name)}</option>`).join("")}</select></label>
          <label>Difficulty <select id="blind-difficulty"><option value="">Any</option>${["easy", "medium", "hard"].map((d) => `<option ${blindOptions.difficulty === d ? "selected" : ""}>${d}</option>`).join("")}</select></label>
          <label class="row"><input type="checkbox" id="blind-unsolved" ${blindOptions.unsolvedOnly ? "checked" : ""}> Skip solved problems</label>
        </div>
        <div class="row">
          <button type="button" id="blind-start">Give me a problem</button>
          <span class="muted" id="blind-count"></span>
        </div>
        <p class="muted" style="margin-bottom: 0">${accuracy.total ? `Recognition so far: ${accuracy.correct}/${accuracy.total} correct (${Math.round((100 * accuracy.correct) / accuracy.total)}%). See Progress for the patterns you miss most.` : "No guesses yet."}</p>
      </div>`;

    const updateCount = () => {
      const n = blindCandidates().length;
      document.getElementById("blind-count").textContent = `${n} problem${n === 1 ? "" : "s"} in the pool`;
      document.getElementById("blind-start").disabled = n === 0;
    };
    document.getElementById("blind-family").addEventListener("change", (e) => { blindOptions.family = e.target.value; updateCount(); });
    document.getElementById("blind-difficulty").addEventListener("change", (e) => { blindOptions.difficulty = e.target.value; updateCount(); });
    document.getElementById("blind-unsolved").addEventListener("change", (e) => { blindOptions.unsolvedOnly = e.target.checked; updateCount(); });
    document.getElementById("blind-start").addEventListener("click", startBlindProblem);
    updateCount();
  }

  function blindBanner(p, revealed) {
    if (!revealed) {
      return `
        <div class="blind-banner">
          <strong>Blind mode:</strong> which pattern solves this? Decide before you code.
          <div class="row" style="margin-top: 8px">
            ${patternSelect("guess")}
            <button type="button" id="lock-guess" disabled>Lock in guess</button>
            <button type="button" class="ghost" id="skip-guess">Reveal without guessing</button>
          </div>
        </div>`;
    }
    const result = revealedBlind.get(p.rank);
    const resultLine = !result
      ? `Pattern: <strong>${escapeHtml(p.pattern)}</strong>`
      : result.correct
        ? `<span class="guess-result correct">✓ Correct: ${escapeHtml(p.pattern)}</span>`
        : `<span class="guess-result wrong">✗ You said ${escapeHtml(result.guess)}. It's ${escapeHtml(p.pattern)}</span>`;
    const alsoUses = p.secondary.length ? ` <span class="muted">(also uses ${p.secondary.map(escapeHtml).join(", ")})</span>` : "";
    return `
      <div class="blind-banner row" style="justify-content: space-between">
        <span>${resultLine}${alsoUses}</span>
        <button type="button" id="next-blind">Next blind problem →</button>
      </div>`;
  }

  function wireGuess(p) {
    const select = document.getElementById("guess");
    const lock = document.getElementById("lock-guess");
    select.addEventListener("change", () => { lock.disabled = !select.value; });
    lock.addEventListener("click", () => {
      const guess = select.value;
      // A secondary pattern also counts: it is a valid way to see the problem.
      const correct = guess === p.pattern || p.secondary.includes(guess);
      store.guesses.push({ rank: p.rank, guess, actual: p.pattern, correct, at: Date.now() });
      persist();
      revealedBlind.set(p.rank, { guess, correct });
      renderProblem(p, "blind");
    });
    document.getElementById("skip-guess").addEventListener("click", () => {
      revealedBlind.set(p.rank, null);
      renderProblem(p, "blind");
    });
  }

  function wireNextBlind() {
    document.getElementById("next-blind").addEventListener("click", startBlindProblem);
  }

  function recognitionAccuracy() {
    return { total: store.guesses.length, correct: store.guesses.filter((g) => g.correct).length };
  }

  // ---------- Plan ----------
  function renderPlan() {
    const planItem = (rank) => {
      const p = problemsByRank.get(rank);
      return `<li>${statusDot(rank)} ${problemLink(rank)} ${difficultyBadge(p)}</li>`;
    };
    const solvedCount = (ranks) => ranks.filter((r) => statusOf(r) === "solved").length;

    view.innerHTML = `
      <h2>Four-day plan</h2>
      <p class="muted">Solve the core anchors properly (25–35 min, timed). Then open each anchor's cluster and drill the variants: read the problem, say what changes, reveal. Do the "if time" list after that.</p>
      <div class="plan-grid">${DATA.plan.map((day) => {
        const title = /^\d+$/.test(day.day) ? `Day ${day.day}` : day.day;
        return `
        <section class="card">
          <h3>${escapeHtml(title)}: ${escapeHtml(day.focus)}</h3>
          <p class="muted" style="margin: 0">${solvedCount(day.core)}/${day.core.length} solved in the first list</p>
          ${day.hint ? `<p class="muted" style="margin: 4px 0 0">${escapeHtml(day.hint)}</p>` : ""}
          <h4 style="margin: 12px 0 0">${escapeHtml(day.core_label || "Core anchors")}</h4>
          <ul class="plan-list">${day.core.map(planItem).join("")}</ul>
          ${day.extra.length ? `<h4 style="margin: 0">${escapeHtml(day.extra_label || "If time")}</h4><ul class="plan-list">${day.extra.map(planItem).join("")}</ul>` : ""}
        </section>`;
      }).join("")}
      </div>`;
  }

  // ---------- Progress ----------
  function renderProgress() {
    const counts = Object.fromEntries(STATUSES.map((s) => [s, DATA.problems.filter((p) => statusOf(p.rank) === s).length]));
    const accuracy = recognitionAccuracy();
    const missed = {};
    store.guesses.filter((g) => !g.correct).forEach((g) => { missed[g.actual] = (missed[g.actual] || 0) + 1; });
    const mostMissed = Object.entries(missed).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const review = DATA.problems.filter((p) => statusOf(p.rank) === "review");

    const barRow = (pattern) => {
      const items = DATA.problems.filter((p) => p.pattern === pattern);
      const solved = items.filter((p) => statusOf(p.rank) === "solved").length;
      const attempted = items.filter((p) => ["attempted", "review"].includes(statusOf(p.rank))).length;
      const pct = (n) => (100 * n) / items.length;
      return `<div class="bar-row">
        <span>${escapeHtml(pattern)}</span>
        <span class="bar"><span class="solved" style="width:${pct(solved)}%"></span><span class="attempted" style="width:${pct(attempted)}%"></span></span>
        <span class="muted">${solved}/${items.length}</span>
      </div>`;
    };

    view.innerHTML = `
      <h2>Progress</h2>
      <div class="card stats">
        <div class="stat"><strong>${counts.solved}</strong>solved</div>
        <div class="stat"><strong>${counts.attempted}</strong>attempted</div>
        <div class="stat"><strong>${counts.review}</strong>to review</div>
        <div class="stat"><strong>${DATA.problems.length - counts.todo}</strong>of ${DATA.problems.length} touched</div>
        <div class="stat"><strong>${accuracy.total ? Math.round((100 * accuracy.correct) / accuracy.total) + "%" : "–"}</strong>pattern recognition (${accuracy.correct}/${accuracy.total})</div>
      </div>
      <div class="progress-grid" style="margin-top: 16px">
        ${DATA.families.map((f) => `<section class="card"><h3>${escapeHtml(f.name)}</h3>${f.patterns.map(barRow).join("")}</section>`).join("")}
        <section class="card">
          <h3>Patterns you miss most in blind mode</h3>
          ${mostMissed.length ? `<ul>${mostMissed.map(([pattern, n]) => `<li>${escapeHtml(pattern)}: ${n} miss${n === 1 ? "" : "es"}</li>`).join("")}</ul>` : '<p class="muted">No misses yet.</p>'}
          <h3>Marked "review again"</h3>
          ${review.length ? `<ul>${review.map((p) => `<li>${problemLink(p.rank)}</li>`).join("")}</ul>` : '<p class="muted">Nothing marked for review.</p>'}
        </section>
        <section class="card">
          <h3>Your data</h3>
          <p class="muted">Progress, code and notes are saved only in this browser. Export a backup before clearing browser data or switching machines.</p>
          <div class="row">
            <button type="button" id="export">Export</button>
            <label class="ghost" style="cursor: pointer"><input type="file" id="import" accept="application/json" hidden><span class="badge">Import…</span></label>
            <button type="button" class="ghost" id="reset">Reset everything</button>
          </div>
          <p class="muted" id="data-state"></p>
        </section>
      </div>`;

    document.getElementById("export").addEventListener("click", exportStore);
    document.getElementById("import").addEventListener("change", (e) => importStore(e.target.files[0]));
    document.getElementById("reset").addEventListener("click", () => {
      if (!confirm("Delete all saved progress, code and notes in this browser?")) return;
      Object.assign(store, emptyStore());
      writeStore();
      renderProgress();
    });
  }

  function exportStore() {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pattern-practice-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importStore(file) {
    if (!file) return;
    const state = document.getElementById("data-state");
    file.text().then((text) => {
      const data = JSON.parse(text);
      if (!data || typeof data !== "object" || typeof data.status !== "object") throw new Error("not a progress export");
      Object.assign(store, emptyStore(), data);
      writeStore();
      renderProgress();
    }).catch((err) => {
      state.textContent = `Import failed: ${err.message}`;
    });
  }

  // ---------- Timer ----------
  function setupTimer() {
    const container = document.getElementById("timer");
    const display = document.getElementById("timer-display");
    const toggle = document.getElementById("timer-toggle");
    const length = document.getElementById("timer-length");
    let endsAt = null;
    let remaining = Number(length.value) * 60000;
    let interval = null;

    const format = (ms) => {
      const total = Math.ceil(ms / 1000);
      return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    };
    const left = () => (endsAt ? Math.max(0, endsAt - Date.now()) : remaining);

    function stop(ms) {
      clearInterval(interval);
      endsAt = null;
      remaining = ms;
      toggle.textContent = "Start";
    }

    function paint() {
      const ms = left();
      display.textContent = format(ms);
      if (endsAt && ms === 0) stop(0);
      container.classList.toggle("running", Boolean(endsAt));
      container.classList.toggle("expired", ms === 0);
    }

    toggle.addEventListener("click", () => {
      if (endsAt) {
        stop(left());
      } else if (remaining > 0) {
        endsAt = Date.now() + remaining;
        interval = setInterval(paint, 250);
        toggle.textContent = "Pause";
      }
      paint();
    });
    const reset = () => { stop(Number(length.value) * 60000); paint(); };
    document.getElementById("timer-reset").addEventListener("click", reset);
    length.addEventListener("change", reset);
    paint();
  }

  // ---------- Theme ----------
  function setupTheme() {
    const button = document.getElementById("theme-toggle");
    let theme = "dark";
    try {
      theme = localStorage.getItem(THEME_KEY) || "dark";
    } catch {
      // Storage unavailable: default to dark.
    }
    const apply = () => {
      if (theme === "light") document.documentElement.dataset.theme = "light";
      else delete document.documentElement.dataset.theme;
      button.textContent = theme === "light" ? "☾" : "☀︎";
      if (activeEditor) activeEditor.setOption("theme", editorTheme());
    };
    button.addEventListener("click", () => {
      theme = theme === "light" ? "dark" : "light";
      apply();
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        // Not persisted; the theme still applies now.
      }
    });
    apply();
  }

  // ---------- Boot ----------
  if (window.DOMPurify) {
    // External links (LeetCode, videos) open in a new tab so the app and its timer stay put.
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node.tagName === "A" && /^https?:/i.test(node.getAttribute("href") || "")) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });
  }
  setupTheme();
  setupTimer();
  window.addEventListener("hashchange", route);
  route();
})();
