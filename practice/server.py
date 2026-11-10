"""Local server for the practice app: serves the page and judges Java solutions.

Usage: python3 practice/server.py [port]      then open http://localhost:8765

Listens on 127.0.0.1 only. Python solutions still run in the browser; Java needs a JDK
(javac/java on PATH) because it is compiled and run on this machine.
"""
import json
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import java_support

HERE = Path(__file__).resolve().parent
TESTS_DIR = HERE / "tests"
DEFAULT_PORT = 8765
MAX_BODY_BYTES = 1_000_000


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/api/run":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            if length > MAX_BODY_BYTES:
                raise ValueError("request too large")
            request = json.loads(self.rfile.read(length))
            rank = int(request["rank"])
            spec_path = TESTS_DIR / f"{rank:03d}.json"
            if request.get("language") != "java" or not spec_path.exists():
                raise ValueError("unknown problem or language")
            spec = json.loads(spec_path.read_text())
            result = java_support.run(spec, str(request["code"]), bool(request.get("includeHidden")))
            self._send_json(200, result)
        except (ValueError, KeyError, json.JSONDecodeError) as err:
            self._send_json(400, {"status": "Runtime Error", "error": f"Bad request: {err}", "tests": []})

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # Always serve fresh files so a rebuilt data.js/tests.js shows up on reload.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        if "/api/run" in (args[0] if args else ""):
            super().log_message(format, *args)


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    server = ThreadingHTTPServer(("127.0.0.1", port), partial(Handler, directory=str(HERE)))
    print(f"Pattern Practice: open http://localhost:{port}  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
