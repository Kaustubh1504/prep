// Runs solutions with Pyodide inside a Web Worker, so an infinite loop can be stopped by
// terminating the worker. The worker is created from a Blob because the app is opened
// from file://, where Chrome refuses to load worker scripts from disk.
window.PythonRunner = (() => {
  "use strict";

  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  // Browser Python is several times slower than CPython, so limits are generous.
  const TIME_LIMIT_MS = { run: 10000, submit: 20000 };

  let worker = null;
  let warmup = null;
  let loaded = false;
  let nextId = 0;
  const pending = new Map();

  function workerSource() {
    return `
      importScripts(${JSON.stringify(PYODIDE_URL + "pyodide.js")});
      const HARNESS = ${JSON.stringify(window.PRACTICE_HARNESS || "")};
      let ready = null;
      self.onmessage = async (event) => {
        const { id, type, spec, code, includeHidden } = event.data;
        try {
          if (!ready) {
            ready = loadPyodide({ indexURL: ${JSON.stringify(PYODIDE_URL)} }).then((py) => {
              py.runPython(HARNESS);
              return py;
            });
          }
          const py = await ready;
          if (type === "warmup") {
            self.postMessage({ id, ok: true });
            return;
          }
          py.globals.set("_spec_json", JSON.stringify(spec));
          py.globals.set("_code", code);
          py.globals.set("_include_hidden", includeHidden);
          const output = py.runPython("run_json(_spec_json, _code, _include_hidden)");
          self.postMessage({ id, ok: true, result: JSON.parse(output) });
        } catch (err) {
          self.postMessage({ id, ok: false, error: String(err) });
        }
      };`;
  }

  function settleAll(message) {
    for (const { resolve } of pending.values()) resolve({ ok: false, error: message });
    pending.clear();
  }

  function getWorker() {
    if (!worker) {
      const url = URL.createObjectURL(new Blob([workerSource()], { type: "text/javascript" }));
      worker = new Worker(url);
      URL.revokeObjectURL(url);
      worker.onmessage = (event) => {
        const entry = pending.get(event.data.id);
        if (entry) {
          pending.delete(event.data.id);
          entry.resolve(event.data);
        }
      };
      worker.onerror = (event) => {
        settleAll(`Python failed to start (${event.message || "check your internet connection"}).`);
        restart();
      };
    }
    return worker;
  }

  function restart() {
    if (worker) worker.terminate();
    worker = null;
    warmup = null;
    loaded = false;
  }

  function request(message) {
    return new Promise((resolve) => {
      const id = ++nextId;
      pending.set(id, { resolve });
      getWorker().postMessage({ id, ...message });
    });
  }

  /** Start loading Python in the background; resolves once it is ready. */
  function warmUp() {
    if (!warmup) {
      warmup = request({ type: "warmup" }).then((reply) => {
        if (reply.ok) loaded = true;
        else warmup = null;
        return reply;
      });
    }
    return warmup;
  }

  /** Run the tests; resolves to the harness result, or a synthetic one for load failures and timeouts. */
  async function run(spec, code, includeHidden) {
    const ready = await warmUp();
    if (!ready.ok) return { status: "Runtime Error", error: ready.error, tests: [] };

    const limit = includeHidden ? TIME_LIMIT_MS.submit : TIME_LIMIT_MS.run;
    let timer = null;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(() => {
        // Resolve first so the race reports the timeout, then drop the stuck run.
        resolve({
          ok: true,
          result: { status: "Time Limit Exceeded", error: `Stopped after ${limit / 1000} s. Look for an infinite loop or a slower-than-needed algorithm.`, tests: [] },
        });
        settleAll("timeout");
        restart(); // the only way to stop a runaway loop; Python reloads from cache on the next run
      }, limit);
    });
    const reply = await Promise.race([request({ type: "run", spec, code, includeHidden }), timeout]);
    clearTimeout(timer);
    return reply.ok ? reply.result : { status: "Runtime Error", error: reply.error, tests: [] };
  }

  return { warmUp, run, isReady: () => loaded };
})();
