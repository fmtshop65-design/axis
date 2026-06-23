# AXIS — SEO Setup Guide

This document explains everything that has been configured in your website files, and the handful of steps that only you can finish because they need access to your **server**, your **Google accounts**, or your **business details**.

Canonical domain chosen: **`https://axis-tattoo.com`** (non-www). Every canonical tag, the sitemap, and all redirect rules point here.

---

## ⚠️ One important thing to decide first: brand vs. studio

Your site is for **AXIS, a tattoo *supplies* brand** (cartridge needles, Silver Butter glide, aftercare cream). The "Local SEO" items you asked for — NAP in the footer, a Google Map, `LocalBusiness` schema, and *"Tattoo Studio in [City]"* keywords — only make sense if AXIS **also has a physical, walk-in location**.

Because of that, I implemented local SEO in a *ready-but-inactive* way rather than inventing a fake address:

- The footer has a **NAP block with bracketed placeholders** — fill in your real Name/Address/Phone and it's live.
- A **Google Map embed** and a **`LocalBusiness` (TattooParlor) schema block** are included as **commented-out templates** in the footer and in `index.html` `<head>`. Uncomment and fill them in *only if* you have a real storefront.
- The on-page keywords currently target what AXIS actually is — **professional tattoo cartridge needles / tattoo supplies** — which is the correct, rankable strategy for a product brand. If you do have a studio, swap in the local keywords described below.

If AXIS is purely a product brand with no walk-in location, **skip the map / LocalBusiness / city-keyword steps** — they can hurt you (Google penalizes fake or unverifiable local data).

---

## ✅ Done for you (in the files)

**Technical**
- Canonical `<link rel="canonical">` on every page (pointing at the real `.html` URLs).
- `robots.txt` — allows indexing, blocks `/admin/`, `/cgi-bin/`, `/.git/`, etc., and points to the sitemap.
- `sitemap.xml` — all 4 pages, plus `generate-sitemap.mjs` to rebuild it automatically.
- Custom branded **`404.html`** (set as the error page in every host config).
- **Images compressed**: 9.6 MB of PNGs → 0.7 MB of WebP (**~93% smaller**), resized to ≤1200px, with `loading="lazy"`, `decoding="async"` and explicit `width`/`height` (prevents layout shift).
- Direct `.html` page URLs so internal links work on any host without rewrite rules. (Pretty/extensionless URLs can be re-enabled later — see note in `.htaccess` — but you would then need to update the internal links, canonicals and sitemap to match.)
- Already mobile-friendly: every page has `<meta name="viewport">` and responsive CSS — verified.

**On-page (all pages)**
- Unique `<title>` (all ≤ 60 characters).
- Unique meta description (≈ 150–160 characters).
- Exactly **one `<h1>`** per page, with proper `<h2>`/`<h3>` structure.
- Descriptive ALT text on every image + descriptive WebP filenames.
- Open Graph + Twitter Card tags + a generated `og-image.jpg` for nice link previews.

**Structured data (JSON-LD, validated)**
- `Organization` on every page; `WebSite` on the homepage.
- `Product` + `BreadcrumbList` on each product page.
- `TattooParlor`/`LocalBusiness` template ready to enable (see above).

**Analytics & Search Console hooks**
- GA4 `gtag.js` snippet on every page (placeholder ID).
- Google Search Console verification `<meta>` tag (placeholder token).

---

## 🔧 What you need to finish (5 steps)

### 1. Deploy the files & turn on HTTPS
Upload the entire folder to your web host (keep the file structure as-is).
- **Shared hosting (cPanel/Apache/LiteSpeed):** the included `.htaccess` does the HTTPS redirect, www→non-www, the 404 page, gzip, and caching. For the SSL certificate itself, enable **"Let's Encrypt"/"AutoSSL"** (free) in your hosting panel, or "Force HTTPS".
- **Netlify:** drag-drop the folder. HTTPS and the 404 page are automatic; `netlify.toml` + `_redirects` handle the www→non-www redirect. (You can delete `.htaccess` and `vercel.json`.)
- **Vercel:** deploy the folder. `vercel.json` sets the www→non-www redirect and HTTPS. (You can delete `.htaccess`, `_redirects`, `netlify.toml`.)
- **Cloudflare Pages / GitHub Pages:** both serve HTTPS automatically and will serve the `.html` files directly; set the www→apex redirect in their dashboard.

Keep only the config file(s) for the host you actually use.

After deploying, confirm `http://` and `http://www.` both 301-redirect to `https://axis-tattoo.com`.

### 2. Set up Google Analytics 4
1. Go to <https://analytics.google.com> → **Admin → Create property** → add a **Web** data stream for `axis-tattoo.com`.
2. Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`).
3. Find/replace **`G-XXXXXXXXXX`** with your real ID in all HTML files (it appears twice per page). On Mac/Linux:
   ```bash
   grep -rl 'G-XXXXXXXXXX' . | xargs sed -i '' 's/G-XXXXXXXXXX/G-YOURREALID/g'   # mac
   ```

### 3. Connect Google Search Console & submit the sitemap
1. Go to <https://search.google.com/search-console> → add property **`https://axis-tattoo.com`**.
2. Verify with the **HTML tag** method: copy the token Google gives you into the existing tag — replace `REPLACE_WITH_GSC_VERIFICATION_TOKEN` in each page's `<head>`. (Or use the DNS-record method, which doesn't touch the files.)
3. Once verified: **Sitemaps → enter `sitemap.xml` → Submit**.
4. Use **URL Inspection** on each page → "Request indexing".

### 4. (Local SEO — only if you have a physical studio)
- Fill in the **NAP placeholders** in the footer (`[Street address]`, `[City]`, phone, email) on all pages — keep it identical everywhere and identical to your Google Business Profile.
- In Google Maps, find your studio → **Share → Embed a map** → copy the `<iframe>` → paste it into the commented "GOOGLE MAP" block in the footer and remove the `<!-- -->` markers.
- Uncomment and fill the **`TattooParlor` JSON-LD** block in `index.html`.
- Create/claim a **Google Business Profile** for the studio (the biggest lever for local ranking).
- For city keywords, update the homepage `<title>`/description and add a short intro paragraph like *"AXIS — professional tattoo supplies & studio in [City]"*.

### 5. Add the missing assets
- **After-care photos** — add 4 images named `axis-tattoo-aftercare-cream-1.webp` … `-4.webp` (see `IMAGE_GUIDE.txt`). Until then those image slots will be blank.
- **Optional hero video** — product pages reuse `hero-bg.mp4`; add a dedicated `hero.mp4` if you want a different clip (see `IMAGE_GUIDE.txt`).

---

## 🔁 Keeping the sitemap auto-updating

`sitemap.xml` is currently static. To make it regenerate itself whenever you add/change pages, run the included script — it scans your `.html` files, builds the URL list, and stamps today's date:

```bash
node generate-sitemap.mjs
```

Automate it one of these ways:
- **Build step:** add `"build": "node generate-sitemap.mjs"` to your `package.json` (Netlify/Vercel run this on every deploy).
- **GitHub Action (weekly):**
  ```yaml
  on:
    schedule: [{ cron: "0 3 * * 1" }]   # Mondays 03:00 UTC
    push: { branches: [main] }
  jobs:
    sitemap:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
        - run: node generate-sitemap.mjs
        - run: |
            git config user.name bot && git config user.email bot@axis
            git commit -am "chore: refresh sitemap" || echo "no changes"
            git push
  ```

---

## 🧪 Verify everything after launch

- **Rich Results / structured data:** <https://search.google.com/test/rich-results>
- **Mobile-friendliness & Core Web Vitals:** <https://pagespeed.web.dev>
- **Robots & sitemap:** open `https://axis-tattoo.com/robots.txt` and `…/sitemap.xml` in a browser.
- **Redirects:** check `www.` and `http://` both land on `https://axis-tattoo.com`.
- **Coverage/indexing:** watch the **Pages** report in Search Console over the following days.

---

## 📁 File reference

| File | Purpose |
|------|---------|
| `index / cartridges / silver-butter / after-care .html` | Pages with full SEO meta, headings, schema, GA4, GSC hooks |
| `404.html` | Custom error page |
| `robots.txt` | Crawl rules + sitemap pointer |
| `sitemap.xml` | URL list for search engines |
| `generate-sitemap.mjs` | Auto-rebuilds the sitemap |
| `.htaccess` | Apache: HTTPS, non-www, 404, gzip, cache |
| `_redirects`, `netlify.toml` | Netlify config |
| `vercel.json` | Vercel config |
| `favicon.svg`, `axis-logo.png`, `og-image.jpg` | Brand/social assets |
| `*.webp` | Compressed product images |
| `IMAGE_GUIDE.txt`, `README.txt` | Owner docs (blocked from indexing) |
