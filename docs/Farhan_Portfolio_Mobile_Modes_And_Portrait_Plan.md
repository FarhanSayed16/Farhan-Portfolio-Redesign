# Mobile scan: favicon, portrait, experience picker

**Status:** Implemented (code). Google SERP icon still depends on Google recrawl.  
**Created:** 2026-08-18  
**Why:** Recruiters/QR visitors on a phone see (1) a Vercel triangle in Google, (2) an off-center headshot, (3) a Nokia easter egg with no path into the Windows XP desktop they would never know exists.

---

## 0. Verdict (locked)

| Symptom | Root cause | What we do |
|---------|------------|------------|
| Google still shows Vercel triangle after 7–10 days | Live `/favicon.ico` **is** the FS mark (~3 KB). Google Search Console / SERP cache the old default. Next also injects `app/favicon.ico` as a hashed `/favicon.ico?favicon.*.ico` link. | Keep FS files as source of truth. Add a **stable unique URL** Google has never cached (`/fs-icon-48.png`, 48×48). Put that PNG first in `icons`. User: Search Console → URL Inspection → Request indexing. We cannot force Google’s SERP icon clock. |
| Headshot empty on one side, arm cropped on the other | Source `farhan.jpeg` is **1280×853 landscape**. Circle + Google square crop from “center” / `object-position: 30%`. That keeps left wall and clips the right shoulder. OG tags also claim `800×1000` (wrong). | Generate a **face-centered 1200×1200** (`farhan-square.jpg`) for Open Graph / search thumbnail. Fix `object-position` on site + connectQR circles to ~**54% 38%** (subject, not empty wall). |
| Nokia button jumps straight into the phone egg | `mps-nav-egg` → `/?view=nokia`. Phone `HomeClient` never offers Farhan OS. | Replace **Nokia** with **Modes**. Sheet: **Desktop (Farhan OS)** · **Nokia phone**. Desktop first shows a **laptop recommended** confirm, then `/?view=desktop` which mounts the real `DesktopShell` plus a **Back to site** chip. |

---

## 1. Google favicon (SERP + Search Console)

**Already true in production:** `https://farhanbuilds.in/favicon.ico` is the gold FS ICO (not 25 KB Vercel). Browser tab after hard-refresh should already show FS.

**Why SERP/GSC still show the triangle**

- Google caches favicons **separately** from page indexing (often days–weeks after a correct file is live).
- They prefer a **square PNG multiple of 48px** discovered via `<link rel="icon">`.
- A never-before-fetched URL is more likely to be picked up than the same `/favicon.ico` they already associated with Vercel.

**Code**

1. Copy `public/favicon-48.png` → `public/fs-icon-48.png` (stable brand URL).
2. `layout.tsx` `icons.icon[0]` = `/fs-icon-48.png?v=2` (48×48 PNG). Keep ico / 192 as fallbacks.
3. Leave `src/app/favicon.ico` as the FS ICO (do not restore the Next default).

**After deploy (human)**

1. Open `https://farhanbuilds.in/fs-icon-48.png` — gold FS on black.
2. Search Console → URL Inspection → `https://farhanbuilds.in` → **Request indexing**.
3. Wait. SERP icon is not instant even when the file is correct.

---

## 2. Center the portrait

**Source:** `public/images/farhan.jpeg` — landscape, subject on the **right**, wood wall on the **left**.

**Code**

1. `scripts/gen-portrait-square.mjs` — extract around face (`left: 270, top: 36, size: 720`), resize **1200×1200** JPEG → `public/images/farhan-square.jpg`.
2. Root `openGraph` / `twitter` images → that square, `width/height: 1200` (fixes the false 800×1000 metadata).
3. CSS focal point (cover + slight zoom, **no** left bias):
   - `.bv-portrait-img` (desktop IE)
   - `.bv-modern-viewport--standalone .bv-portrait-img` (phone site)
   - `.cq-photo` (connectQR)
   - Target: `object-position: 47% 40%`; drop the `translate(3%, 2.5%)` that shoved the crop.

Site circles still use `farhan.jpeg` (full photo). Google / link previews use the square.

---

## 3. Modes picker (recruiter / QR phone)

**Who:** Someone who scanned the card, landed on the **modern phone site**, never sees Bliss / XP / windows.

**UX**

```
[Modes]  →  sheet
            ├─ Farhan OS (desktop)
            │     → confirm: “Built for a laptop. Phone is a cramped preview.
            │        Open farhanbuilds.in on a computer for the real thing.”
            │     → [Open anyway] → /?view=desktop
            │     → [Not now]
            └─ Nokia phone
                  → /?view=nokia  (existing egg + Back to site)
```

**Routing** (`HomeClient`)

| Query | Phone viewport |
|-------|----------------|
| (none) | Modern portfolio (default) |
| `view=nokia` | `PhoneShell` easter egg |
| `view=desktop` | **`DesktopShell`** (same XP boot + desktop as PC) + fixed **← Portfolio site** exit |

Do **not** write `farhan-device-preference` for this path (QR users must not get stuck in XP on every later visit).

**Copy (confirm)** — recruiter-plain, not cute:

> Farhan OS is a full Windows XP desktop. It is built for a laptop or monitor. On this phone you’ll get the same OS, but windows and the taskbar will feel small. For the complete experience, open farhanbuilds.in on a computer.

---

## 4. Files

| File | Change |
|------|--------|
| `docs/Farhan_Portfolio_Mobile_Modes_And_Portrait_Plan.md` | This plan |
| `src/app/layout.tsx` | OG square + `/fs-icon-48.png` first |
| `public/fs-icon-48.png` | Stable 48×48 favicon |
| `public/images/farhan-square.jpg` | Centered OG/search crop |
| `scripts/gen-portrait-square.mjs` | Regenerable crop |
| `browserTheme.css` / `modernPortfolio.css` / `connect.css` | `object-position` |
| `src/components/mobile/ExperiencePicker.tsx` | Sheet + confirm |
| `ModernPortfolioShell.tsx` | Modes instead of raw Nokia |
| `HomeClient.tsx` + `DesktopShell.tsx` | `view=desktop` + mobile exit |

**Out of scope:** Redesigning Farhan OS for touch. Preview is intentionally the real desktop.

---

## 5. Check

- Phone: Modes → Nokia → egg → back to site.
- Phone: Modes → Desktop → confirm copy → XP boot → Back to site → modern site again.
- Hard-refresh: circle photo — face in the middle, both shoulders in frame as far as the source allows.
- `https://farhanbuilds.in/fs-icon-48.png` and `/favicon.ico` = FS mark.
- View source: `og:image` = `farhan-square.jpg`.
