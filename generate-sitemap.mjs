#!/usr/bin/env node
/**
 * generate-sitemap.mjs — rebuilds sitemap.xml automatically.
 *
 * Scans the project folder for public .html pages, maps each to its URL,
 * stamps today's date as <lastmod>, and writes sitemap.xml.
 *
 * Run manually:        node generate-sitemap.mjs
 * Run on every build:  add it to your build command, e.g.
 *                      "build": "node generate-sitemap.mjs"
 * Run on a schedule:   call it from a cron job or a GitHub Action (see SEO guide).
 */
import { readdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DOMAIN = "https://axis-tattoo.com";
const ROOT = process.cwd();

// Pages to exclude from the sitemap (utility / error / non-indexable pages)
const EXCLUDE = new Set(["404.html"]);

// Priority/changefreq hints (homepage gets top priority)
const meta = (clean) =>
  clean === "/"
    ? { changefreq: "weekly", priority: "1.0" }
    : { changefreq: "monthly", priority: "0.8" };

const today = new Date().toISOString().slice(0, 10);

const pages = readdirSync(ROOT)
  .filter((f) => f.endsWith(".html") && !EXCLUDE.has(f) && statSync(join(ROOT, f)).isFile())
  .map((f) => (f === "index.html" ? "/" : "/" + f))
  .sort((a, b) => (a === "/" ? -1 : a.localeCompare(b)));

const urls = pages
  .map((clean) => {
    const m = meta(clean);
    return `  <url>
    <loc>${DOMAIN}${clean}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${m.changefreq}</changefreq>
    <priority>${m.priority}</priority>
  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(ROOT, "sitemap.xml"), xml);
console.log(`sitemap.xml written with ${pages.length} URLs (lastmod ${today}).`);
