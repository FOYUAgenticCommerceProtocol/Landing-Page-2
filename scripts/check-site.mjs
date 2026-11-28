// Checks the static foyu.ai site before Netlify serves it (no dependencies, Node 22).
// 1. Every page parses: one <title>, <html lang>, a viewport meta, no unclosed <script>/<style>.
// 2. Every local link, image, script, stylesheet and media file a page names exists (or is a redirect "from").
// 3. netlify.toml: no duplicate redirect "from", proxies go only to the known FOYU hosts, security headers stay.
// 4. Nothing that looks like a secret key is in the repository.
// 5. Every page says test mode / preview where it mentions payments, never "live" money (claim guard).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, normalize } from "node:path";

const root = process.cwd();
const problems = [];
const walk = (d) => readdirSync(d).flatMap((f) => {
  if (f === ".git" || f === "node_modules") return [];
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(root);
const rel = (p) => p.slice(root.length + 1);

// netlify.toml
const toml = readFileSync(join(root, "netlify.toml"), "utf8");
const froms = [...toml.matchAll(/from\s*=\s*"([^"]+)"/g)].map((m) => m[1]);
const dup = froms.filter((f, i) => froms.indexOf(f) !== i);
if (dup.length) problems.push(`netlify.toml: duplicate redirect from ${[...new Set(dup)].join(", ")}`);
const ALLOWED_HOSTS = ["foyu-poc-web.vercel.app", "foyu.ai"];
for (const m of toml.matchAll(/to\s*=\s*"(https?:\/\/[^/"]+)/g)) {
  const host = new URL(m[1]).host;
  if (!ALLOWED_HOSTS.includes(host)) problems.push(`netlify.toml: proxy to unknown host ${host}`);
}
for (const h of ["X-Content-Type-Options", "Referrer-Policy"]) if (!toml.includes(h)) problems.push(`netlify.toml: header ${h} missing`);
const redirectFrom = (path) => froms.some((f) => f === path || (f.endsWith("/*") && path.startsWith(f.slice(0, -1))) || (f.endsWith("*") && path.startsWith(f.slice(0, -1))));

// pages
const pages = files.filter((f) => f.endsWith(".html"));
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const name = rel(page);
  if ((html.match(/<title>/gi) ?? []).length !== 1) problems.push(`${name}: needs exactly one <title>`);
  if (!/<html[^>]*\blang=/i.test(html)) problems.push(`${name}: <html> has no lang`);
  if (!/<meta[^>]+name=["']?viewport/i.test(html)) problems.push(`${name}: no viewport meta`);
  // A <script> must close before the next one opens (tags inside a script's own strings are its data).
  let at = 0;
  for (;;) {
    const o = html.slice(at).search(/<script[\s>]/i);
    if (o < 0) break;
    const c = html.slice(at + o).search(/<\/script>/i);
    if (c < 0) { problems.push(`${name}: a <script> never closes`); break; }
    at += o + c + 9;
  }
  if ((html.match(/<style[\s>]/gi) ?? []).length !== (html.match(/<\/style>/gi) ?? []).length) problems.push(`${name}: <style> and </style> don't pair up`);
  if (/\blive (money|payments?)\b/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, "")) && !/test mode|not live|isn't live|preview/i.test(html))
    problems.push(`${name}: mentions live money without saying test mode (claim guard)`);
  for (const m of html.matchAll(/\b(?:href|src|poster)="([^"#?]+)[^"]*"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(url) || url.includes("${")) continue;
    const abs = url.startsWith("/") ? url : "/" + normalize(join(dirname(name), url)).replace(/\\/g, "/");
    const disk = join(root, decodeURIComponent(abs));
    const ok = existsSync(disk) && (statSync(disk).isFile() || existsSync(join(disk, "index.html")))
      || existsSync(disk + ".html") || redirectFrom(abs) || redirectFrom(abs.replace(/\/$/, ""));
    if (!ok) problems.push(`${name}: link to ${url} has no file or redirect`);
  }
}

// secrets
const SECRET = /(sk_live_[0-9a-zA-Z]{8,}|rk_live_[0-9a-zA-Z]{8,}|sk-ant-[0-9a-zA-Z_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[0-9a-zA-Z]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
for (const f of files.filter((f) => /\.(html|js|css|json|toml|md|txt|webmanifest|mjs)$/.test(f))) {
  if (SECRET.test(readFileSync(f, "utf8"))) problems.push(`${rel(f)}: looks like it holds a secret key`);
}

if (problems.length) {
  console.error(`Site check found ${problems.length} problem(s):\n- ` + problems.join("\n- "));
  process.exit(1);
}
console.log(`Site check passed: ${pages.length} pages, ${froms.length} redirects, ${files.length} files.`);
