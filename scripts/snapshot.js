// scripts/snapshot.js
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const includeDirs = ["app", "src", "components", "pages"]; // covers src/app too
const includeFiles = ["package.json", "next.config.js", "middleware.js", "tsconfig.json", "jsconfig.json"];
const exts = new Set([".js", ".jsx", ".json"]); // jsx only is fine
const ignore = new Set(["node_modules", ".next", ".git", "public", ".vercel", ".idea"]);

const chunks = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (ignore.has(name)) continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) { walk(p); continue; }
    const ext = path.extname(name).toLowerCase();
    if (exts.has(ext) || includeFiles.includes(name)) {
      const rel = path.relative(ROOT, p);
      let text = fs.readFileSync(p, "utf8");
      const lines = text.split("\n");
      if (lines.length > 400) text = lines.slice(0, 400).join("\n") + "\n// …truncated…";
      chunks.push(`\n===== ${rel} =====\n${text}`);
    }
  }
}

// seed top-level important files first
for (const f of includeFiles) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) chunks.push(`\n===== ${f} =====\n${fs.readFileSync(p, "utf8")}`);
}
// walk dirs
for (const d of includeDirs) {
  const p = path.join(ROOT, d);
  if (fs.existsSync(p)) walk(p);
}

fs.writeFileSync("scan.txt", chunks.join("\n"));
console.log("✅ Wrote scan.txt (first 400 lines per file).");