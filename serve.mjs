// Tiny static server for local preview: node serve.mjs [port]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".webp": "image/webp", ".mjs": "text/javascript",
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path.endsWith("/")) path += "index.html";
    // clean URLs like production: /foo → foo.html, falling back to foo/index.html
    const candidates = extname(path) ? [path] : [path + ".html", path + "/index.html"];
    let body, file;
    for (const c of candidates) {
      file = normalize(join(root, c));
      if (!file.startsWith(root)) throw new Error("traversal");
      try { body = await readFile(file); break; } catch { /* try next */ }
    }
    if (!body) throw new Error("not found");
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    // serve the branded 404 page, like production
    try {
      const body = await readFile(join(root, "404.html"));
      res.writeHead(404, { "content-type": "text/html" });
      res.end(body);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
    }
  }
}).listen(port, () => console.log(`teslapod revamp on http://localhost:${port}`));
