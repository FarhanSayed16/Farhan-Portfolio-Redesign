# Farhan Builds — Portfolio (Farhan OS)

Personal portfolio for **Farhan Sayed** (AI & Full-Stack Engineer, Mumbai).

**Live:** [https://farhanbuilds.in](https://farhanbuilds.in)

The experience adapts by device:

| Device | Experience |
|--------|------------|
| Desktop / large tablet | **Farhan OS** — Windows XP–style shell, windows, Internet browser (modern site + classic), Phaser platform game |
| Phone / small screens | Modern portfolio (default) · Nokia-style shell via `/?view=nokia` |
| Mid-size tablet | Choice: desktop OS or mobile portfolio |

Secondary route: **`/connectQR`** — connect card for QR / networking.

---

## Stack

- **Next.js** 16 (App Router) + **React** 19 + **TypeScript**
- **Tailwind CSS** · **Framer Motion** · **Lenis** (smooth scroll)
- **Phaser 4** (Mario-style game levels)
- Content as static JSON under `data/content/`

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production build
npm run lint
```

### Environment

Copy `.env.example` → `.env.local` (optional values):

| Variable | Purpose |
|----------|---------|
| `WEB3FORMS_ACCESS_KEY` | Contact form delivery via Web3Forms (recommended on Vercel). Without it, the client path uses FormSubmit. |
| `GITHUB_USERNAME` | Optional allowlist for the GitHub contributions API proxy |

Contact: browser → FormSubmit by default (server → FormSubmit is blocked on Vercel). Prefer Web3Forms for production reliability.

---

## Project layout

```
data/content/          # Site copy: site, about, projects, skills, experience, achievements, …
src/app/               # App Router: home, connectQR, API routes, sitemap, robots
src/components/
  desktop/             # XP shell, windows, Internet / ModernSite
  mobile/              # Modern portfolio + phone shells
  seo/                 # Server crawl content + JSON-LD
  shared/              # Contact, boot, device pickers
src/phaser/            # Game scenes, sprites, gameplay
src/lib/               # Content loader, contact send, audio helpers
public/                # Static assets, favicons, game maps/sprites, images
scripts/               # Favicon gen, game asset checks, mobile plan checks
docs/                  # Design / rebuild plans (internal)
```

**Edit portfolio copy** in `data/content/*.json` — not hard-coded components where content lives in JSON.

Brand mark (FS logo): `public/images/brand/fs-logo.png`. Regenerate icons:

```bash
npm run gen:favicon
```

This writes `public/*` favicons **and** `src/app/favicon.ico` / `icon.png` / `apple-icon.png` (App Router uses `src/app/favicon.ico`; a default there shows as the Vercel triangle if left unchanged).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run gen:favicon` | Rebuild favicon set from FS brand PNG |
| `npm run check:game` | Sprite + level geometry checks |
| `npm run gen:game-assets` | Crop/generate game assets |
| `npm run check:mobile` / `check:mobile-modern` | Plan / mobile checklist helpers |
| `npm run preview:level` | Game level preview utility |

---

## SEO

- Server-rendered crawl block + `Person` / `WebSite` JSON-LD on `/`
- `sitemap.xml` · `robots.ts`
- Metadata, Open Graph, canonical on root layout

After significant SEO or favicon changes, request indexing in [Google Search Console](https://search.google.com/search-console). SERP favicons can lag behind live tab icons by days.

---

## Deploy

Hosted on **Vercel** (custom domain `farhanbuilds.in`).

1. Connect the GitHub repo to Vercel  
2. Set env vars (`WEB3FORMS_ACCESS_KEY`, etc.) in the project settings  
3. Deploy `main`

---

## License / assets

Game sprites and audio may be third-party or nostalgic recreations — see `public/game/LEGAL-NOTE.md` for notes. Portfolio code and personal branding for Farhan Sayed unless otherwise noted.
