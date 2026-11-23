# scootermedia.ae — Scooter UAE website (v2)

A static, dependency-free website for **Scooter**, a video production company and production partner in Dubai and India.
Plain HTML, one CSS file and one small JS file, with no build step and no framework.

## Pages (one URL each, for SEO)

| URL | File | In the menu |
|---|---|---|
| `/` | `index.html` | Home |
| `/original-content-for-brands/` | `original-content-for-brands/index.html` | Originals |
| `/real-estate-content-dubai/` | `real-estate-content-dubai/index.html` | Real Estate |
| `/work/` | `work/index.html` | Work (films + full client wall at `#clients`) |
| `/about/` | `about/index.html` | About (founder, crew, cities, press at `#press`) |
| `/contact/` | `contact/index.html` | Contact (`?type=real-estate` / `?type=original-content` preselects the offer) |
| `/ai-films/` | `ai-films/index.html` | Footer + Capabilities only |
| `/post-production/` | `post-production/index.html` | Footer + Capabilities only |
| `/global/` | `global/index.html` | Not linked; redirects to scootermedia.co |

Old URLs `/real-estate/`, `/originals/`, `/clients/` and `/news/` redirect via `_redirects`.

Every page has its own `<title>`, meta description, canonical URL, Open Graph tags and
JSON-LD (Organization, ProfessionalService, Service, FAQPage, BreadcrumbList).
`sitemap.xml` and `robots.txt` are at the root.

## Deploying (Cloudflare)

The site deploys to Cloudflare as a Worker with static assets, the same way the current
scootermedia.ae site does. There is no build step: the repo root is the site.

| File | What it does |
|---|---|
| `wrangler.jsonc` | Worker name (`scooter-uae-v2`), serves the repo root, clean `/about/` URLs, `404.html` for unknown pages |
| `.assetsignore` | Keeps repo files (README, config) from being published |
| `_headers` | Security headers and cache rules (CSS/JS cached a year, images and video a day) |
| `_redirects` | Old URLs from the previous site, e.g. `/crew/` → `/about/#crew` |

**First deploy (Cloudflare dashboard):**

1. Workers & Pages → Create → Import a repository → `scootermedia/Scooter_UAE_V2`.
2. Build command: leave empty. Deploy command: `npx wrangler deploy`.
3. Deploy. The site goes live on a `scooter-uae-v2.<account>.workers.dev` preview URL.
   Check it there first: the live scootermedia.ae is not touched yet.

**Switch scootermedia.ae to this site** (when the preview looks right):

1. Old Worker (`scooter-uae-media`) → Settings → Domains & Routes → remove `scootermedia.ae`
   (and `www.scootermedia.ae` if present).
2. This Worker (`scooter-uae-v2`) → Settings → Domains & Routes → Add → Custom domain →
   `scootermedia.ae`. Add `www.scootermedia.ae` too, or a redirect rule from www to the apex.
3. Every push to `main` then redeploys automatically.
4. Submit `https://scootermedia.ae/sitemap.xml` in Google Search Console.

To roll back, move the custom domain back to `scooter-uae-media`.

**From a terminal instead:** `npx wrangler deploy` in the repo root (after `npx wrangler login`).

## Contact form

There is no backend. The brief form opens WhatsApp (+91 905 122 2997) or the visitor's
email app with the brief pre-filled. To collect submissions server-side instead, point
the `<form id="brief">` action at a form service (Formspree, Netlify Forms, etc.).

## Client logos

Official logos for all 38 clients live in `assets/img/clients/`. `sources.json` records where each
file came from (the brand's own website, Wikimedia Commons or an official press kit). Logos show in
grey and switch to full colour on hover. White-only logos are rendered black via the `dk` class.

## Brand

- Colours: white `#FFFFFF`, black `#0A0A0A`, teal `#0F5C6D` (dark `#0A4652`, tint `#CFE5E9`)
- Type: Inter (Google Fonts)

## Editing copy

Edit the HTML files directly; they are hand-readable. Shared styles live in
`assets/css/site.css`, and the clients wall, mobile menu, hero sound toggle and contact
form logic live in `assets/js/site.js`.
