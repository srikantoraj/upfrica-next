#!/usr/bin/env node
import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

function run(cmd) {
  try { return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim(); }
  catch (e) { return `! ${cmd}\n${(e.stdout||"").toString()}${(e.stderr||"").toString()}`.trim(); }
}

async function listFiles(root, matcher = () => true, max = 1000) {
  const out = [];
  async function walk(dir) {
    const ents = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of ents) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) await walk(p);
      else if (matcher(p)) out.push(p);
      if (out.length >= max) return;
    }
  }
  try { await walk(root); } catch {}
  return out.sort();
}

function maskEnv(v) {
  if (!v) return "";
  if (v.length <= 12) return v;
  return v.slice(0, 4) + "…" + v.slice(-4);
}

function header(t){ console.log(`\n=== ${t} ===`); }

(async () => {
  console.log("Upfrica Frontend Scan");
  console.log(new Date().toISOString());

  header("SYSTEM");
  console.log("OS:", os.platform(), os.release(), `(${os.arch()})`);
  console.log("Node:", process.version);
  console.log("npm:", run("npm -v"));
  console.log("pnpm:", run("pnpm -v"));
  console.log("yarn:", run("yarn -v"));

  header("NEXT");
  console.log("next -v:\n", run("npx --yes next -v"));
  console.log("\nnext info:\n", run("npx --yes next info"));

  header("ENV (masked)");
  const keys = [
    "NODE_ENV",
    "NEXT_PUBLIC_SITE_BASE_URL",
    "NEXT_PUBLIC_API_BASE_URL",
    "NEXT_PUBLIC_API_BASE",
    "NEXT_PUBLIC_CDN_HOST",
  ];
  for (const k of keys) console.log(`${k}=${maskEnv(process.env[k] || "")}`);

  header("KEY FILES (exists?)");
  const mustHave = [
    "src/contexts/LocalizationProvider.jsx",
    "src/lib/i18n.js",
    "src/lib/fx.js",
    "src/components/home/Header.jsx",
    "src/app/layout.js",
    "src/app/(pages)/[cc]/page.jsx",
    "app/constants.js",
  ];
  for (const f of mustHave) {
    try { await fs.access(f); console.log("✔", f); }
    catch { console.log("✖", f); }
  }

  header("APP ROUTES (app dir)");
  const appPages = await listFiles("src/app", p => /\/page\.(jsx?|tsx?)$/.test(p));
  appPages.forEach(p => console.log(p));

  header("PAGES ROUTES (pages dir)");
  const pagesPages = await listFiles("src/pages", p => /\.(jsx?|tsx?)$/.test(p));
  pagesPages.forEach(p => console.log(p));

  header("I18N INIT CHECK");
  // Just prints the URL we expect; we don’t call the network from the scanner.
  const apiBase =
    (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000")
      .replace(/\/$/, "");
  console.log("Expect endpoint:", `${apiBase}/api/i18n/init/ ?country={gh|ng|uk}`);

  header("GIT (optional)");
  console.log(run("git rev-parse --abbrev-ref HEAD"));
  console.log(run("git status -s"));

  header("DONE");
})();