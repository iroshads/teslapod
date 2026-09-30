// Generates responsive WebP variants for every episode thumbnail.
// Run from repo root:  node tools/build-thumbs.mjs   (needs `cwebp` on PATH)
// For each assets/thumbs/<id>.jpg it writes <id>-320/-640/-960/-1280.webp next to it.
// The 1280x720 .jpg stays as the <img src> fallback and the og:image source.
import { readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dir = fileURLToPath(new URL("../assets/thumbs/", import.meta.url));
const WIDTHS = [320, 640, 960, 1280];

const files = (await readdir(dir)).filter((f) => /^[\w-]+\.jpg$/.test(f));
let made = 0, kept = 0;
for (const f of files) {
  const src = join(dir, f);
  const srcTime = (await stat(src)).mtimeMs;
  for (const w of WIDTHS) {
    const out = join(dir, f.replace(/\.jpg$/, `-${w}.webp`));
    const fresh = await stat(out).then((s) => s.mtimeMs >= srcTime, () => false);
    if (fresh) { kept++; continue; }
    execFileSync("cwebp", ["-quiet", "-q", "78", "-m", "6", "-resize", String(w), "0", src, "-o", out]);
    made++;
  }
}
console.log(`thumbs: ${files.length} sources, ${made} variants written, ${kept} already fresh`);
