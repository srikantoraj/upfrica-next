#!/usr/bin/env python3
"""
scan_frontend.py — quick static scanner for a React/Next.js frontend

What it does (no deps):
- Walks your repo (default ".") and inspects .js, .jsx, .ts, .tsx files
- Detects routes for:
  * Next.js App Router (app/**/page.tsx|tsx|js|jsx)
  * Next.js Pages Router (pages/**/*.tsx/js[x])
  * React Router (<Route path="...">, createBrowserRouter([...]))
- Finds keywords/features in files (BNPL, AddOn, Storefront, Subscription, etc.)
- Looks for entitlement patterns: useEntitlements, has('FEATURE'), <Guard require=...>, <UpgradeGate ...>
- Flags the /new-dashboard route if present
- Writes a JSON report to frontend_scan.json and prints a short summary

Usage:
  python scan_frontend.py [path]
"""
from __future__ import annotations
import os, re, sys, json
from pathlib import Path
from typing import Dict, List, Any, Tuple

SCAN_EXTS = (".js", ".jsx", ".ts", ".tsx")
IGNORE_DIRS = {"node_modules", ".git", ".next", "out", "build", "dist", ".turbo", ".vercel", ".cache", ".venv", "env", "venv", "__pycache__"}
KEYWORDS = [
    # core
    "Entitlement", "entitlement", "useEntitlements", "UpgradeGate", "Guard", "has(",
    # features
    "BNPL", "AddOn", "Addon", "SellerPlan", "SellerFeature", "Storefront", "Subscription",
    "affiliate", "agent", "commission", "wholesale", "whatsapp", "instant_payout", "pay_on_delivery",
    "wishlist", "payout", "SecurePayout", "analytics", "CampaignEventLog", "StorefrontViewsLog",
    "SellerAnalyticsDaily",
    # routes we care about
    "new-dashboard", "new_dashboard", "dashboard"
]

ROUTE_PATTERNS = {
    "react_router_jsx": re.compile(r"<Route\s+[^>]*path\s*=\s*[\"']([^\"']+)[\"']", re.I),
    "react_router_obj": re.compile(r"path\s*:\s*[\"']([^\"']+)[\"']", re.I),
    "next_link": re.compile(r"<Link\s+[^>]*href\s*=\s*[\"'](/[^\"']*)[\"']", re.I),
}

CREATE_BROWSER_ROUTER = re.compile(r"createBrowserRouter\s*\(", re.I)

def walk_files(root: Path) -> List[Path]:
    files: List[Path] = []
    for dirpath, dirnames, filenames in os.walk(root):
        # mutate dirnames in-place to skip ignored dirs
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS and not d.startswith(".")]
        for fn in filenames:
            if fn.endswith(SCAN_EXTS):
                files.append(Path(dirpath) / fn)
    return files

def detect_framework(root: Path) -> Dict[str, Any]:
    framework = {"next_app_router": False, "next_pages_router": False, "react_router": False}
    if (root / "app").exists():
        for p in (root / "app").rglob("*"):
            if p.is_file() and p.name.startswith("page.") and p.suffix in SCAN_EXTS:
                framework["next_app_router"] = True
                break
    if (root / "pages").exists():
        for p in (root / "pages").rglob("*"):
            if p.is_file() and p.suffix in SCAN_EXTS and not any(seg == "api" for seg in p.parts):
                framework["next_pages_router"] = True
                break
    # react-router heuristic: imports or createBrowserRouter
    react_router = False
    pkg = root / "package.json"
    if pkg.exists():
        try:
            data = json.loads(pkg.read_text(encoding="utf-8", errors="ignore"))
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
            if any(k.startswith("react-router") for k in deps.keys()):
                react_router = True
        except Exception:
            pass
    if not react_router:
        for f in walk_files(root):
            try:
                txt = f.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            if "react-router-dom" in txt or CREATE_BROWSER_ROUTER.search(txt):
                react_router = True
                break
    framework["react_router"] = react_router
    return framework

def next_route_from_app_path(p: Path, app_root: Path) -> str:
    # app/path/to/page.tsx -> /path/to
    rel = p.relative_to(app_root)
    parts = list(rel.parts)
    # remove trailing "page.ext"
    if len(parts) >= 1:
        parts = parts[:-1]
    # convert Next dynamic segments to :param style for readability
    segs = []
    for seg in parts:
        if seg.startswith("(") and seg.endswith(")"):
            # optional group/folder — ignore in URL
            continue
        seg = seg.replace("%5B", "[").replace("%5D", "]")
        if seg.startswith("[[") and seg.endswith("]]"):
            segs.append(f":{seg[2:-2]}?")
        elif seg.startswith("[...") and seg.endswith("]"):
            segs.append(f":{seg[4:-1]}*")
        elif seg.startswith("[") and seg.endswith("]"):
            segs.append(f":{seg[1:-1]}")
        elif seg == "index":
            # in app router, index is just the folder root; usually not present here
            continue
        else:
            segs.append(seg)
    route = "/" + "/".join([s for s in segs if s])
    return route if route != "/" else "/"

def next_route_from_pages_path(p: Path, pages_root: Path) -> str:
    rel = p.relative_to(pages_root)
    if rel.parts and rel.parts[0] == "api":
        return ""
    parts = rel.parts
    # drop extension
    stem = rel.stem
    # handle index.*
    if stem.startswith("index"):
        clean = "/" + "/".join(parts[:-1])
        clean = clean if clean != "" else "/"
    else:
        clean = "/" + "/".join(parts[:-1] + (stem,))
    # dynamic segments [id] => :id
    def convert(seg: str) -> str:
        if seg.startswith("[[") and seg.endswith("]]"):
            return f":{seg[2:-2]}?"
        if seg.startswith("[...") and seg.endswith("]"):
            return f":{seg[4:-1]}*"
        if seg.startswith("[") and seg.endswith("]"):
            return f":{seg[1:-1]}"
        return seg
    segs = [convert(s) for s in clean.split("/") if s != ""]
    return "/" + "/".join(segs)

def collect_routes(root: Path, framework: Dict[str, Any]) -> List[Dict[str, Any]]:
    routes: List[Dict[str, Any]] = []
    if framework.get("next_app_router"):
        app_root = root / "app"
        for p in app_root.rglob("page.*"):
            if p.suffix in SCAN_EXTS:
                route = next_route_from_app_path(p, app_root)
                routes.append({"framework": "next_app", "path": route, "file": str(p)})
    if framework.get("next_pages_router"):
        pages_root = root / "pages"
        for p in pages_root.rglob("*"):
            if p.is_file() and p.suffix in SCAN_EXTS:
                route = next_route_from_pages_path(p, pages_root)
                if route and not route.startswith("/api"):
                    routes.append({"framework": "next_pages", "path": route, "file": str(p)})
    if framework.get("react_router"):
        for f in walk_files(root):
            try:
                txt = f.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            # JSX <Route path="...">
            for m in ROUTE_PATTERNS["react_router_jsx"].finditer(txt):
                routes.append({"framework": "react_router", "path": m.group(1), "file": str(f)})
            # Object-based routes { path: "..." }
            if CREATE_BROWSER_ROUTER.search(txt) or "routes" in txt:
                for m in ROUTE_PATTERNS["react_router_obj"].finditer(txt):
                    routes.append({"framework": "react_router", "path": m.group(1), "file": str(f)})
            # Next <Link href="/..."> (helpful even in non-Next projects)
            for m in ROUTE_PATTERNS["next_link"].finditer(txt):
                routes.append({"framework": "link_href", "path": m.group(1), "file": str(f)})
    # normalize and unique
    seen = set()
    uniq = []
    for r in routes:
        key = (r["framework"], r["path"], r["file"])
        if key not in seen and r["path"]:
            seen.add(key)
            uniq.append(r)
    return uniq

def scan_keywords(root: Path) -> Tuple[Dict[str, List[str]], Dict[str, int]]:
    file_hits: Dict[str, List[str]] = {}
    keyword_counts: Dict[str, int] = {k: 0 for k in KEYWORDS}
    kw_regex = {k: re.compile(re.escape(k), re.I) for k in KEYWORDS}
    for f in walk_files(root):
        try:
            txt = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        hits = []
        for k, rx in kw_regex.items():
            if rx.search(txt):
                hits.append(k)
                keyword_counts[k] += 1
        if hits:
            file_hits[str(f)] = sorted(hits)
    return file_hits, keyword_counts

def find_entitlement_usage(root: Path) -> Dict[str, Any]:
    usage = {
        "useEntitlements_files": [],
        "Guard_files": [],
        "UpgradeGate_files": [],
        "has_calls": [],
        "my_entitlements_calls": []
    }
    my_ent_re = re.compile(r"/my[-_]?entitlements", re.I)
    for f in walk_files(root):
        try:
            txt = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        path = str(f)
        if "useEntitlements" in txt:
            usage["useEntitlements_files"].append(path)
        if re.search(r"<Guard\b", txt):
            usage["Guard_files"].append(path)
        if re.search(r"<UpgradeGate\b", txt):
            usage["UpgradeGate_files"].append(path)
        for m in re.finditer(r"\bhas\s*\(\s*['\"]([^'\"]+)['\"]\s*\)", txt):
            usage["has_calls"].append({"file": path, "feature": m.group(1)})
        if my_ent_re.search(txt):
            usage["my_entitlements_calls"].append(path)
    # unique
    for k in ["useEntitlements_files", "Guard_files", "UpgradeGate_files", "my_entitlements_calls"]:
        usage[k] = sorted(set(usage[k]))
    # unique has_calls by (file,feature)
    seen = set()
    uniq_has = []
    for x in usage["has_calls"]:
        t = (x["file"], x["feature"])
        if t not in seen:
            seen.add(t)
            uniq_has.append(x)
    usage["has_calls"] = uniq_has
    return usage

def main():
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(".").resolve()
    report: Dict[str, Any] = {"root": str(root)}
    framework = detect_framework(root)
    report["framework"] = framework
    routes = collect_routes(root, framework)
    report["routes"] = sorted(routes, key=lambda r: (r["path"], r["framework"]))
    file_hits, keyword_counts = scan_keywords(root)
    report["feature_hits_by_file"] = file_hits
    report["keyword_counts"] = keyword_counts
    ent = find_entitlement_usage(root)
    report["entitlements"] = ent

    # highlight /new-dashboard
    has_new_dashboard = any(
        r["path"].rstrip("/") == "/new-dashboard" or
        "new-dashboard" in r["path"]
        for r in routes
    )
    report["has_new_dashboard_route"] = has_new_dashboard

    out_path = root / "frontend_scan.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    # Pretty print summary
    unique_paths = sorted({r["path"] for r in routes if r["path"]})
    print("Frontend Scan Summary")
    print(f"Root: {root}")
    print(f"Detected: Next App Router={framework['next_app_router']}, Next Pages Router={framework['next_pages_router']}, React Router={framework['react_router']}")
    print(f"Total route entries: {len(routes)} | Unique paths: {len(unique_paths)}")
    if unique_paths:
        sample = [p for p in unique_paths if p != "/"]
        print(f"Sample paths: {', '.join(sample[:10])}{' ...' if len(sample) > 10 else ''}")
    ent_files = sum(bool(report['entitlements'][k]) for k in ["useEntitlements_files","Guard_files","UpgradeGate_files","my_entitlements_calls"])
    print(f"Entitlement usage files touched (kinds present): {ent_files}/4")
    print(f"has(feature) calls: {len(report['entitlements']['has_calls'])}")
    print(f"'/new-dashboard' present: {has_new_dashboard}")
    print(f"Keywords matched (top): " + ", ".join([f"{k}:{v}" for k,v in keyword_counts.items() if v][:8]))
    print(f"Wrote JSON to: {out_path}")

if __name__ == "__main__":
    main()
