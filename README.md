# scootermedia.ae — Scooter UAE website (v2)

A static, dependency-free website for **Scooter**, a creative production studio in Dubai.
Plain HTML, one CSS file and one small JS file, with no build step and no framework.

## Pages (one URL each, for SEO)

| URL | File |
|---|---|
| `/` | `index.html` |
| `/about/` | `about/index.html` |
| `/real-estate/` | `real-estate/index.html` |
| `/clients/` | `clients/index.html` |
| `/ai-films/` | `ai-films/index.html` |
| `/global/` | `global/index.html` |
| `/news/` | `news/index.html` |
| `/contact/` | `contact/index.html` |
| 404 | `404.html` |

Every page has its own `<title>`, meta description, canonical URL, Open Graph tags and
JSON-LD (Organization, ProfessionalService, Service, FAQPage, BreadcrumbList).
`sitemap.xml` and `robots.txt` are at the root.

## Before going live

1. **Showreel video:** add `assets/video/showreel.mp4` (and optionally `showreel.webm`).
   See `assets/video/README.md` for export settings. Until then the hero shows a dark poster.
2. **Hero poster:** replace `assets/img/hero-poster.jpg` with a still frame from the reel.
3. **Domain:** the site uses root-relative links (`/about/`), so it must be served from the
   domain root (`https://scootermedia.ae/`), not a sub-path.
4. After launch, submit `https://scootermedia.ae/sitemap.xml` in Google Search Console.

## Deploying

This is a plain static site, so any static host works:

- **Netlify:** connect this repo and deploy. `netlify.toml` already sets no build step and the root publish directory, overriding the UI settings.
- **Vercel / Cloudflare Pages:** connect this repo, with no build command and the output directory set to `/`.
- **GitHub Pages:** Settings → Pages → deploy from `main` / root, then add the custom domain
  `scootermedia.ae` (this creates a `CNAME` file) and point DNS at GitHub Pages.
- **Any web server:** upload the folder as is. Configure `404.html` as the not-found page.

## Contact form

There is no backend. The brief form opens WhatsApp (+91 905 122 2997) or the visitor's
email app with the brief pre-filled. To collect submissions server-side instead, point
the `<form id="brief">` action at a form service (Formspree, Netlify Forms, etc.).

## Brand

- Colours: white `#FFFFFF`, black `#0A0A0A`, teal `#0F5C6D` (dark `#0A4652`, tint `#CFE5E9`)
- Type: Inter (Google Fonts)

## Editing copy

Edit the HTML files directly; they are hand-readable. Shared styles live in
`assets/css/site.css`, and the clients wall, mobile menu, hero sound toggle and contact
form logic live in `assets/js/site.js`.
