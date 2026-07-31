# Farhan OS — Portfolio Security & Anti-Tamper Plan

**Status:** PARTIALLY IMPLEMENTED — Tracks A (headers + CSP Report-Only), B (API + contact), C (console + select/drag) shipped 2026-07-31. CSP Enforce + optional DevTools toast still pending.  
**Created:** 2026-07-31  
**Scope:** Production Farhan OS site (`farhanbuilds.in` / Vercel). Does **not** change game content or Time Machine UX except where a header would break an embed.

**Companions:**
- Game legal note: [`../public/game/LEGAL-NOTE.md`](../public/game/LEGAL-NOTE.md)
- Contact / EmailJS: [`.env.example`](../.env.example)

---

## 0. Read this first (non-negotiable truth)

| Claim people want | Reality |
|---|---|
| “Nobody can copy my images / text / code” | **Impossible** for a public website. If the browser can show it, a determined user can save it (screenshot, Network tab, `curl`, phone camera). |
| “Nobody can open DevTools / use the console” | **Impossible to enforce.** Detection can be delayed or faked; alternate shortcuts, remote debugging, and extensions bypass it. |
| “Nobody can scrape my site” | You can **slow casual scrapers** and **rate-limit APIs**. You cannot stop a serious scraper who fetches public URLs. |
| “My portfolio is secure” | Means: **no leaked secrets**, **safe APIs**, **safe headers**, **no XSS/clickjacking holes**, **rate limits** — not a locked museum case. |

**North star for this portfolio:**

1. **Real security** — protect secrets, visitors, and your APIs.  
2. **Polished anti-tamper UX** — friendly console branding, discourage casual copy/scrape, without breaking Farhan OS (right-click desktop menu, accessibility, recruiters who Inspect).  
3. **Honesty** — never claim the site is “uncopyable.” That claim is false and looks amateur to technical interviewers.

If someone asks “can we make it so nobody can copy anything?” the correct product answer is: **we harden what matters; we deter casual abuse; we do not fake absolute DRM.**

---

## 1. Current state (audit snapshot — 2026-07-31)

| Area | Today | Risk |
|---|---|---|
| Security headers (`CSP`, `X-Frame-Options`, `HSTS`, etc.) | **None** in `next.config.ts` | Clickjacking, mixed-content freestyle, XSS blast radius |
| `middleware.ts` | **Missing** | No central request gate / response headers |
| `/api/github-contributions` | Open `GET`; `username` is **any string** → open proxy to Deno API | Abuse / quota burn if the upstream is rate-limited |
| EmailJS | `NEXT_PUBLIC_*` keys in the browser | Expected for EmailJS public key; **must** lock down EmailJS dashboard (allowed domains, rate limits) |
| Contact form | Client-side EmailJS only | Spam if EmailJS is open; no server-side honeypot / rate limit |
| Right-click | Used by Farhan OS **desktop context menu** | Global “disable right-click” would **break** Refresh / Hire Farhan menu |
| Source maps | Default Next behavior | Dev-friendly; confirm production doesn’t ship `*.map` publicly if you care about casual source browsing |
| `robots.txt` / scraping | Not tuned for abuse | SEO wants indexing; abuse wants limits — different knobs |
| Game / image assets | Public under `/public` | Expected for a portfolio; Network tab will always see them |

---

## 2. Goals (what “proper” means here)

### Must have (real security)

- [ ] Strong **HTTP security headers** on every response  
- [ ] Tight **Content-Security-Policy** that still allows Phaser, Howler, EmailJS, Vercel analytics (if any), and Google Fonts / your font hosts  
- [ ] **API hardening** for `/api/github-contributions` (allowlist username, cache, rate limit, method lock)  
- [ ] **No private secrets** in the client bundle (audit: only `NEXT_PUBLIC_*` that are meant to be public)  
- [ ] EmailJS dashboard: **allowed origin = your domain only**, rate limits, no private keys in repo  
- [ ] Production **dependency audit** + keep Next patched  
- [ ] Basic **bot / abuse friction** on contact path (honeypot + cooldown)

### Should have (anti-tamper polish — UX, not DRM)

- [ ] Branded **console welcome** (ASCII / Farhan OS message) — looks intentional when someone opens DevTools  
- [ ] Soft deterrents: disable **image drag**, discourage **select/copy** on decorative assets (not on contact form fields)  
- [ ] Optional **watermark** on high-value images (resume preview screenshots, etc.) if you care about casual reuse  
- [ ] Custom “nice try” panel if DevTools is detected — **cosmetic only**, easy to bypass, keep it witty not hostile  

### Must not break

- Farhan OS **right-click context menu** on the desktop  
- Keyboard users, screen readers, paste into Contact form  
- Recruiters / engineers opening Inspect (common for portfolios)  
- Mobile Safari / Chrome behavior  
- Phaser game input (don’t steal all keydowns globally)

---

## 3. Threat model (who we’re defending against)

| Attacker | Intent | Our response |
|---|---|---|
| Casual visitor | Save wallpaper / screenshot | Soft UX + watermark optional |
| Script kid | Open console, deface locally, spam F12 | Console brand + no secrets to steal |
| Scraper / bot | Bulk-download `/public` assets | Rate limits, cache headers, robots for *bad* bots only; accept public URLs are fetchable |
| Spammer | Flood Contact via EmailJS | Domain allowlist + honeypot + EmailJS rate limits (+ optional server proxy later) |
| Clickjacker | Iframe your site over a fake button | `frame-ancestors 'none'` / `X-Frame-Options: DENY` |
| XSS | Inject script via query / third party | CSP + sanitize any future user HTML |
| API abuser | Hammer GitHub proxy | Username allowlist + rate limit + cache |
| Serious attacker | Mirror whole site | Out of scope — it’s a public portfolio |

**Out of scope (do not promise):** DRM, encrypted images that still display, unbreakable DevTools lock, stopping View Source.

---

## 4. Implementation tracks

### Track A — HTTP security headers (highest ROI)

**Where:** `next.config.ts` `headers()`, and/or `src/middleware.ts` for dynamic CSP nonce later.

| Header | Value (starting point) | Why |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Stop MIME sniffing |
| `X-Frame-Options` | `DENY` | Clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Less leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Kill unused powerful APIs |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolate window |
| `Cross-Origin-Resource-Policy` | `same-origin` (tune if CDNs break) | Limit cross-origin reads |
| `Content-Security-Policy` | See §4.1 | XSS / inject blast radius |

#### 4.1 CSP draft (must be tested against Phaser + EmailJS)

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://api.emailjs.com;  /* tighten to nonces after audit */
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
font-src 'self' data:;
connect-src 'self' https://api.emailjs.com https://github-contributions-api.deno.dev;
media-src 'self' blob:;
worker-src 'self' blob:;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
upgrade-insecure-requests;
```

**Work required before ship:** run the site with CSP Report-Only first (`Content-Security-Policy-Report-Only`), collect breaks (Phaser may need `blob:` / wasm / eval depending on build), then enforce.

**Exit:** securityheaders.com / Mozilla Observatory grade improves; site + game + contact still work.

---

### Track B — API & secrets hardening

#### B1. `/api/github-contributions`

Today anyone can pass `?username=anything` and burn upstream quota through your domain.

**Fix:**

1. Allowlist: only `FarhanSayed16` (or env `GITHUB_USERNAME`).  
2. Ignore / reject other usernames with `400`.  
3. `GET` only; reject other methods.  
4. In-memory / Edge rate limit per IP (e.g. 30 req / min).  
5. Keep `revalidate = 3600`.  
6. Do not forward arbitrary client input into upstream URLs beyond the allowlisted name.

#### B2. EmailJS / Contact

| Step | Action |
|---|---|
| Dashboard | Restrict to `https://farhanbuilds.in` (+ preview URLs if needed) |
| Repo | Never commit private EmailJS keys; only public key as `NEXT_PUBLIC_*` |
| Form | Honeypot field (hidden); reject if filled |
| Form | Client cooldown (e.g. 30s between sends) + disable button while sending |
| Optional later | Server route that calls EmailJS with a **non-public** key so the public key isn’t required in the browser |

#### B3. Env audit

- Script or checklist: grep for `SECRET`, `PRIVATE`, `TOKEN`, `API_KEY` in client components.  
- `.env*` in `.gitignore` (verify).  
- Document in `.env.example` what is public vs server-only.

**Exit:** API cannot be used as an open proxy; contact spam surface reduced; no private secrets in client JS.

---

### Track C — Soft anti-scrape / anti-tamper UX (with Farhan OS constraints)

#### C1. Console branding (“good console”)

On app boot (client only):

```text
╔══════════════════════════════╗
║   FARHAN OS — CONSOLE        ║
║   Built with care. Hire me.  ║
║   farhanbuilds.in            ║
╚══════════════════════════════╝
```

Optional: override `console.log` wrappers to prefix `[Farhan OS]` — **do not** delete `console` entirely (breaks debugging and looks broken). Prefer witty banners over broken tools.

#### C2. What we deliberately do **not** do

| Idea | Why not |
|---|---|
| Global `contextmenu` preventDefault | **Breaks** desktop Refresh / Hire menu |
| Trap F12 / Ctrl+Shift+I forever | Hostile to engineers reviewing your work; trivial to bypass; can brick accessibility |
| Disable all text selection site-wide | Breaks Contact form, README selection, a11y |
| “Debugger;” infinite loop anti-DevTools | Freezes tabs, looks malware-like, fails interviews |

#### C3. What we **do** add (light deterrents)

| Measure | Where | Notes |
|---|---|---|
| `user-select: none` on wallpaper + desktop icons | Desktop shell | Allow `user-select: text` inside windows / inputs |
| `draggable={false}` + CSS `-webkit-user-drag: none` on images | Icons, wallpaper, game canvases | Stops casual drag-save |
| Disable default browser image context menu **only on `<img>`** in content windows | Not on desktop root | Desktop keeps OS menu |
| `onCopy` toast on protected regions (optional) | Decorative areas | “Nice try — hire me instead ☺” — never on inputs |
| Hotlink / cache headers for `/wallpapers/*`, `/game/sprites/*` | `Cache-Control` + optional referrer check (weak) | Soft; not DRM |
| Watermark layer on Resume preview images (optional) | Resume window | Visible ownership without fake encryption |

#### C4. Optional DevTools “detector” (cosmetic)

- Heuristic: window size delta / `devtools` open detection libraries.  
- On detect: show a small Farhan OS toast: *“Inspector detected. Welcome, engineer — the real flex is the code quality.”*  
- **No** infinite debugger, **no** blanking the page, **no** redirect loops.

**Exit:** casual Save Image / select-all feels blocked on the desktop chrome; Inspect still works; right-click OS menu still works; console looks intentional.

---

### Track D — Scraping & bot posture

| Knob | Decision for a portfolio |
|---|---|
| Google / Bing indexing | **Allow** — you want recruiters to find you |
| `robots.txt` | Allow `/`; disallow useless scrapers only if you maintain a blocklist (limited value) |
| `ai.txt` / `llms.txt` (optional) | State preferred reuse policy for AI crawlers (honor-system) |
| Rate limit | APIs + contact path |
| Hotlinking | Prefer same-origin; accept that public CDN URLs can be fetched |

**Do not** set `X-Robots-Tag: noindex` on the whole site unless you intentionally want to hide from search.

---

### Track E — Supply chain & deploy hygiene

- [ ] `npm audit` / Dependabot (or Vercel’s dependency updates)  
- [ ] Lockfile committed; no `*` ranges for critical deps without review  
- [ ] Production builds: confirm no `.map` exposure if undesired (`productionBrowserSourceMaps: false` — Next default is already false)  
- [ ] Vercel: preview deployments protected if they contain draft content  
- [ ] Rotate any keys that ever appeared in git history  
- [ ] Separate LEGAL note for third-party game assets (already started for SMB)

---

### Track F — Monitoring & verification

| Check | Tool |
|---|---|
| Headers | [securityheaders.com](https://securityheaders.com), Mozilla Observatory |
| CSP | Browser console CSP errors; Report-Only period |
| Secrets | `gitleaks` / GitHub secret scanning |
| API abuse | Vercel logs + simple rate-limit counters |
| Smoke | Contact send, Mario game start, Internet window, desktop right-click Refresh |

---

## 5. Suggested order

| # | Track | Why | Risk |
|---|---|---|---|
| 1 | A — headers + CSP Report-Only | Biggest real win, no UX drama | Medium (CSP can break assets) |
| 2 | B — API allowlist + EmailJS lockdown | Stops free proxy / spam | Low |
| 3 | C — console brand + select/drag deterrents | Matches “good console / can’t casually copy” request | Low |
| 4 | E — audit / source maps / Dependabot | Hygiene | Low |
| 5 | D — robots / AI preference files | Policy, not firewall | Low |
| 6 | A — CSP enforce (after Report-Only is clean) | Lock it in | Medium |
| 7 | C4 — optional DevTools toast | Polish only | Low |

---

## 6. Acceptance criteria

- [ ] Production responses include HSTS, `nosniff`, frame deny, Referrer-Policy, Permissions-Policy, and a non-empty CSP (Report-Only → Enforce)  
- [ ] `/api/github-contributions?username=evil` returns `400`; only your username works  
- [ ] Contact form has honeypot + cooldown; EmailJS domain-restricted  
- [ ] Desktop **right-click menu still works** (Refresh animation included)  
- [ ] Wallpaper / icons not casually selectable or drag-saved  
- [ ] Opening DevTools shows Farhan OS console branding (not a broken console)  
- [ ] Phaser game + Contact + Browser Time Machine still function under CSP  
- [ ] No private secrets in client bundle (manual or scripted grep)  
- [ ] Plan does **not** claim “uncopyable assets” anywhere in UI copy

---

## 7. Explicit non-goals (document so future-you doesn’t re-litigate)

1. Unbreakable copy protection / image DRM in the browser.  
2. Permanently disabling DevTools for all users.  
3. Blocking all scrapers of public static files.  
4. Global right-click disable.  
5. Obfuscating the entire Next bundle to “hide” portfolio text (hurts performance, doesn’t hide Network).

---

## 8. Optional stretch (only if you still want more after A–E)

| Idea | Verdict |
|---|---|
| Server-side EmailJS proxy | Good — removes public key from client |
| Cloudflare Bot Fight / WAF in front of Vercel | Good for spam/scrape volume |
| Signed short-lived URLs for resume PDF | Overkill unless PDF leakage is a real issue |
| Canvas-rendered text for “secret” copy | Fragile, hurts a11y — skip |
| Disable View Source | Impossible |

---

## 9. Copy you can use in README / About (honest)

> Farhan OS uses modern web security headers, a locked-down contact path, and API rate limits. Like every public website, assets that render in your browser can still be saved by a determined user — the goal is a professional, hardened portfolio, not fake DRM.

---

## 10. Next steps (remaining)

1. Watch production DevTools for CSP Report-Only violations, then flip to Enforce.  
2. Lock EmailJS allowed domains in the dashboard (manual).  
3. Optional: DevTools welcome toast (cosmetic only).

---

## 11. Shipped (2026-07-31)

| Item | Notes |
|---|---|
| Headers in `next.config.ts` | HSTS (prod only), nosniff, frame deny, Referrer-Policy, Permissions-Policy, COOP, hide `X-Powered-By` |
| CSP | **Report-Only** — does not block; check DevTools Console for violations before enforcing |
| `/api/github-contributions` | Username allowlist + 30 req/min/IP rate limit + cache headers |
| Contact | Honeypot field + 30s send cooldown |
| `SecurityClient` | Branded console banner only — no DevTools trap |
| Desktop | `user-select: none` on chrome; images/canvas not draggable; forms still selectable |
| `robots.txt` | Allow indexing |
| Source maps | `productionBrowserSourceMaps: false` |

**Still pending:** CSP Enforce (after Report-Only is clean), EmailJS dashboard domain lock (manual), optional DevTools toast.

