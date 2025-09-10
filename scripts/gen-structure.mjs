#!/usr/bin/env node
// scripts/gen-structure.mjs
// Node 18+ (no deps). Generates STRUCTURE.md with full tree + app/components views.

//run
//npm run tree:out     # writes STRUCTURE.md
//npm run tree:stdout  # prints to terminal
//npm run tree:watch   # regenerates on changes (macOS/Windows)

import fs from "fs";
import path from "path";

const CWD = process.cwd();
const PKG = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(CWD, "package.json"), "utf8"));
  } catch {
    return {};
  }
})();
const PROJECT_NAME = (PKG.name || path.basename(CWD)) + "/";

const argv = process.argv.slice(2);
const OUTFILE = (() => {
  const i = argv.indexOf("--out");
  return i > -1 ? argv[i + 1] : "STRUCTURE.md";
})();
const STDOUT_ONLY = argv.includes("--stdout");
const WATCH = argv.includes("--watch");

// Defaults chosen for Next.js repos
const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".next", ".turbo", ".vercel",
  "coverage", "dist", "build", ".cache", ".idea", ".vscode",
  "__pycache__", "tmp"
]);
const IGNORE_FILES = new Set([
  "pnpm-lock.yaml", "yarn.lock", "package-lock.json", ".DS_Store"
]);
const IGNORE_EXTS = new Set([".map"]);

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function shouldIgnore(name, fullPath) {
  if (IGNORE_FILES.has(name)) return true;
  if (IGNORE_DIRS.has(name) && isDir(fullPath)) return true;
  const ext = path.extname(name);
  if (IGNORE_EXTS.has(ext)) return true;
  return false;
}

function list(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function splitDirsFiles(dirents) {
  const dirs  = dirents.filter(d => d.isDirectory()).map(d => d.name).sort();
  const files = dirents.filter(d => d.isFile()).map(d => d.name).sort();
  return { dirs, files };
}

function drawTree(rootDir, rel = "", prefix = "") {
  const abs = path.join(rootDir, rel);
  const dirents = list(abs)
    .filter(d => !shouldIgnore(d.name, path.join(abs, d.name)));

  const { dirs, files } = splitDirsFiles(dirents);
  const ordered = [
    ...dirs.map(name => ({ name, isDir: true })),
    ...files.map(name => ({ name, isDir: false })),
  ];

  const lines = [];
  ordered.forEach((entry, idx) => {
    const isLast = idx === ordered.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const label = entry.name + (entry.isDir ? "/" : "");
    lines.push(`${prefix}${connector}${label}`);
    if (entry.isDir) {
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      lines.push(...drawTree(rootDir, path.join(rel, entry.name), childPrefix));
    }
  });
  return lines;
}

function drawAppRoutes(appRoot) {
  if (!fs.existsSync(appRoot)) return ["(no app/ directory found)"];

  function draw(dir, rel = "", prefix = "") {
    const abs = path.join(dir, rel);
    const keepFiles = new Set([
      "page.tsx","page.jsx","layout.tsx","layout.jsx","route.ts","route.js",
      "loading.tsx","loading.jsx","error.tsx","error.jsx",
      "not-found.tsx","not-found.jsx","template.tsx","template.jsx",
      "head.tsx","head.jsx"
    ]);

    const dirents = list(abs).filter(d => {
      const full = path.join(abs, d.name);
      if (shouldIgnore(d.name, full)) return false;
      if (d.isDirectory()) return true;
      return keepFiles.has(d.name);
    });

    const { dirs, files } = splitDirsFiles(dirents);
    const ordered = [
      ...dirs.map(n => ({ n, isDir: true })),
      ...files.map(n => ({ n, isDir: false })),
    ];

    const lines = [];
    ordered.forEach((e, idx) => {
      const isLast = idx === ordered.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const label = e.isDir ? `${e.n}/` : e.n;
      const comment = (!e.isDir && rel === "" && (e.n === "page.tsx" || e.n === "page.jsx")) ? "  # Home Page" : "";
      lines.push(`${prefix}${connector}${label}${comment}`);
      if (e.isDir) {
        const childPrefix = prefix + (isLast ? "    " : "│   ");
        lines.push(...draw(dir, path.join(rel, e.n), childPrefix));
      }
    });
    return lines;
  }

  return draw(appRoot);
}

function drawComponents(componentsRoot) {
  if (!fs.existsSync(componentsRoot)) return ["(no components/ directory found)"];

  function draw(dir, depth = 0, prefix = "") {
    const dirents = list(dir)
      .filter(d => !shouldIgnore(d.name, path.join(dir, d.name)));

    const { dirs, files } = splitDirsFiles(dirents);
    const ordered = [
      ...dirs.map(n => ({ n, isDir: true })),
      ...files.map(n => ({ n, isDir: false })),
    ];

    const lines = [];
    ordered.forEach((e, idx) => {
      const isLast = idx === ordered.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const label = e.isDir ? `${e.n}/` : e.n;
      lines.push(`${prefix}${connector}${label}`);
      if (e.isDir && depth < 2) {
        const childPrefix = prefix + (isLast ? "    " : "│   ");
        lines.push(...draw(path.join(dir, e.n), depth + 1, childPrefix));
      }
    });
    return lines;
  }

  return draw(componentsRoot, 0, "");
}

function generate() {
  const fullTree = [
    PROJECT_NAME,
    ...drawTree(CWD)
  ].join("\n");

  const appView = [
    PROJECT_NAME,
    "├── app/",
    ...drawAppRoutes(path.join(CWD, "app")).map(l => "│   " + l)
  ].join("\n");

  const componentsView = [
    PROJECT_NAME,
    "├── components/",
    ...drawComponents(path.join(CWD, "components")).map(l => "│   " + l)
  ].join("\n");

  const md = [
    "# Project Structure",
    "",
    "```",
    fullTree,
    "```",
    "",
    "## App routes (focus)",
    "",
    "```",
    appView,
    "```",
    "",
    "## Components (by category snapshot)",
    "",
    "```",
    componentsView,
    "```",
    ""
  ].join("\n");

  if (STDOUT_ONLY) {
    process.stdout.write(md);
  } else {
    fs.writeFileSync(path.join(CWD, OUTFILE), md, "utf8");
    console.log(`Wrote ${OUTFILE}`);
  }
}

generate();

if (WATCH) {
  console.log("Watching for changes… (Ctrl+C to stop)");
  // Note: fs.watch recursive works on macOS/Windows; on Linux, prefer chokidar.
  fs.watch(CWD, { recursive: true }, (evt, fname) => {
    if (!fname) return;
    if (fname.includes(path.sep + "node_modules" + path.sep)) return;
    if (fname.startsWith(".git" + path.sep)) return;
    try { generate(); } catch {}
  });
}