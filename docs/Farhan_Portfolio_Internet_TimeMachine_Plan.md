# INTERNET TIME MACHINE → MODERN PORTFOLIO
### Manual for the Browser window (`Internet` desktop icon)

**Status:** IMPLEMENTED (BT-1 → BT-4) — 2026-07-16  
**Created:** 2026-07-16  
**Scope:** Inside the **Internet / Browser** window only. Outer Farhan OS (XP desktop, taskbar, window chrome) does **not** change.

**Companions:**
- OS + game: [`Farhan_Portfolio_Nostalgia_Fix_Plan.md`](./Farhan_Portfolio_Nostalgia_Fix_Plan.md)
- Master plan Phase 12 (current Browser.exe): [`Farhan_Portfolio_V3_Master_Plan.md`](./Farhan_Portfolio_V3_Master_Plan.md)
- Content source of truth: `data/content/*.json`

---

## 0. Verdict (read this first)

| Question | Answer |
|----------|--------|
| Is this possible? | **Yes.** The shell already isolates page content inside `BrowserWindow`. We only rewrite / expand what renders **below the address bar**. |
| Does the outer XP layer stay the same? | **Yes — locked.** Bliss wallpaper, taskbar, XP title bar, Start menu stay. Transformation is **viewport-only** (the “webpage” area). |
| Is this a second full portfolio? | **No.** A **short, modern landing** inside the browser — hero, few highlights, CTA. Deep detail stays in About / Projects / Skills / Experience windows. |
| Does this replace the current fake browser? | **It upgrades it.** Keep back/forward/address chrome; replace the flat cyber pages with: **Time Machine intro → Modern site**. |
| Should we build this before content polish (Phase 23)? | **Shell + motion first** with existing JSON. Copy polish can wait; structure should not. |

**North star:**  
Someone opens **Internet**, watches a short “web history” trip from ~2005 → current year, then lands on a **clean modern personal site** — still framed by Windows XP Internet Explorer chrome. Joke + craft in one click.

---

## 1. What you asked for (translated into product)

1. User clicks **Internet** on the desktop (or Start → Internet Explorer).
2. XP window opens (existing behavior).
3. **Before** the modern portfolio: a **time-machine sequence** — years move forward (≈2005 → 2026/2027), UI eras change to show how the web evolved.
4. Transition completes **only inside the browser page area**.
5. Then a **modern portfolio UI** plays — good motion, light info, not a clone of every OS window.

That is exactly the right use of the Internet icon: the OS is nostalgia; the browser is “the web grew up.”

---

## 2. What exists today (code reality)

| Piece | Today |
|-------|--------|
| Desktop icon | `Internet` → opens window `component: 'browser'` ([`Desktop.tsx`](../src/components/desktop/Desktop.tsx)) |
| Window body | [`BrowserWindow.tsx`](../src/components/desktop/windows/BrowserWindow.tsx) |
| Chrome | Back / Forward / Reload + address bar (good — **keep**) |
| Page area | Simple “farhanbuilds.in” home / projects / contact / blog — still cyber-styled, not a real modern site |
| Content | Already pulled from `siteData`, `projectsData`, `stats` via `@/lib/content` |

**Implication:** We do **not** need a new desktop app. We evolve `BrowserWindow` into three stages:

```
[XP window chrome — unchanged]
[IE-ish toolbar — keep / lightly XP-skin]
[ PAGE VIEWPORT ← only this transforms ]
     Stage A: Time Machine
     Stage B: Morph / dissolve
     Stage C: Modern portfolio site
```

---

## 3. Experience design (locked decisions)

### 3.1 Outer vs inner

| Layer | Changes? |
|-------|----------|
| Desktop wallpaper, icons, taskbar | No |
| Window title bar (`Browser — farhanbuilds.in`) | No (optional: title stays) |
| Browser toolbar (back/forward/address) | Keep; optional era-tint during time machine only |
| **Scrollable page content** | **Yes — entire feature lives here** |

### 3.2 First open behavior

| Choice | Decision |
|--------|----------|
| First open this session | Play Time Machine once → then Modern site |
| Re-open same session | Skip intro → Modern site (unless user hits “Replay era trip”) |
| Refresh button | Soft reload of modern site; long-press or “↺ eras” link replays time machine |
| Persist skip? | `sessionStorage` key `farhan-browser-eras-seen` (not localStorage forever — recruiters should still see it sometimes) |

### 3.3 Time Machine — eras (suggested cast)

Keep it **short** (≈8–14 seconds total). Not a museum. Each era is a **full-bleed fake homepage** in that year’s aesthetic, with a big year stamp and 1 line of copy.

| Order | Year stamp | Visual gag (inside viewport only) | Tech joke (1 line) |
|------:|------------|-----------------------------------|--------------------|
| 1 | 2005 | Table layout, Times New Roman, visitor counter, “Under Construction” GIF energy (CSS only, no hotlinked GIFs required) | “Welcome to my homepage!!1” |
| 2 | 2010 | Glossy Web 2.0, blue links, sidebar, Comic/Arial mix, “Follow me” badges as plain CSS | “Web 2.0 — now with rounded corners” |
| 3 | 2015 | Flat Material-ish cards, Roboto-ish stack, hamburger tease | “Everything is a card now” |
| 4 | 2020 | Dark mode, purple gradient hero, glass cards (ironic — we banned this on the XP shell) | “Dark mode + purple = professional” |
| 5 | 2026 / current year | Brief “loading modern stack…” then dissolve into real Modern Portfolio | “Shipping…” |

**Year end:** Use **current calendar year** at runtime (`new Date().getFullYear()`) so it stays correct in 2027+ without edits.

**Motion:** Horizontal or crossfade “warp” between eras; optional ticking year counter (2005 → … → now). Prefer **Framer Motion** (already in the project) over new deps.

**Skip:** Visible **Skip →** control after ~1s so impatient recruiters aren’t trapped.

### 3.4 Modern portfolio (inside browser) — what it is / isn’t

**Is:**
- One composition landing (hero brand + one headline + one sentence + CTA group)
- Short sections: Selected work (3 featured), About blurb, Skills strip (names only), Contact CTA
- Modern typography + tasteful motion (scroll / hover) — **inside viewport**
- Uses existing JSON (featured projects, site tagline, social links)

**Is not:**
- A second copy of Projects.exe / Experience.exe with full case studies
- A route takeover of `/` (desktop OS remains the real homepage of farhanbuilds.in)
- Purple-on-white AI-slop or cream+terracotta defaults (see frontend design rules)
- Cards everywhere; hero must not be a card collage

**Brand test:** After the time machine, the first viewport of the modern site should still read as **Farhan** — name as hero-level signal.

### 3.5 Information architecture (light)

```
Modern site (single scroll page, optional in-page anchors)
├── Hero — name, role, CTA (View work / Contact)
├── Selected work — 3 featured projects (title + tagline + link-out or “open Projects window”)
├── About — 2–3 sentences from about.json
├── Skills — compact row/chips of top skills (not full Skills.exe)
└── Contact — mailto + GitHub + LinkedIn + optional “Open Contact window”
```

Deep dive stays in OS windows. Browser site = **trailer**; OS apps = **feature film**.

---

## 4. Architecture (how we build it)

### 4.1 Component split (proposed)

```
src/components/desktop/windows/
  BrowserWindow.tsx              ← chrome + stage router (keep)
  browser/
    BrowserTimeMachine.tsx       ← era sequence + skip
    eras/
      Era2005.tsx … Era2020.tsx  ← presentational only
      EraWarp.tsx                ← shared year counter / transition
    ModernSite.tsx               ← modern portfolio shell
    modern/
      ModernHero.tsx
      ModernWork.tsx
      ModernAbout.tsx
      ModernSkills.tsx
      ModernContact.tsx
    browserTheme.css             ← scoped styles; do NOT leak into XP shell
```

**Rule:** All modern/era styles are **scoped** under a wrapper like `[data-browser-viewport]` so XP Luna tokens outside are untouched.

### 4.2 State machine (simple)

```
idle → playing_eras → morphing → modern
         ↑ skip ───────────────┘
modern → (optional) replay_eras
```

Implement with `useState` + one `phase` enum. No Redux. No new state library.

### 4.3 Data

| Need | Source |
|------|--------|
| Name, tagline, social | `data/content/site.json` via `@/lib/content` |
| Featured projects | `projectsData.filter(p => p.featured).slice(0, 3)` |
| About blurb | `about.json` short field / first paragraph |
| Skills names | top N from skills JSON |

No duplicate content files for the browser site unless a tiny `browser.json` is needed later for era copy only.

### 4.4 Motion budget

| Moment | Motion |
|--------|--------|
| Era change | Crossfade or horizontal wipe + year tick (2–3 intentional motions total for the trip) |
| Morph to modern | Short dissolve / scale-from-center of viewport content |
| Modern site | Hero text stagger; section reveal on scroll (light) |

Respect `prefers-reduced-motion`: skip eras → jump to modern static.

### 4.5 Mobile / Nokia

Phone shell may not expose the same Internet icon. **Decision:** Desktop-first feature. If phone has a browser entry later, either skip eras (small screen) or show modern site only. Do not block desktop ship on phone parity.

---

## 5. Implementation phases (manual order)

Do these in order. Each phase has an exit check.

### Phase BT-0 — Spec lock (this file)

- [x] Feasibility confirmed
- [ ] You approve: era list, ~10s length, light modern IA, session skip behavior

**Exit:** Explicit “build it” from you.

### Phase BT-1 — Scaffold stages in `BrowserWindow`

- Keep toolbar/address bar.
- Replace page body with `phase` switch: `eras` | `modern`.
- Wire Skip + sessionStorage.
- Stub era screens (solid color + year text is enough).

**Exit:** Open Internet → see stub eras → Skip → stub modern; re-open skips intro.

### Phase BT-2 — Time Machine polish

- Implement 4 era UIs (CSS-only nostalgia, no heavy assets).
- Year counter 2005 → current year.
- Warp transitions; Skip; reduced-motion path.
- Optional: address bar text spoofs `http://farhan.tripod.com` → `farhanbuilds.in` during trip (cosmetic only).

**Exit:** Trip feels intentional in ≤14s; skippable; no layout bleed onto XP desktop.

### Phase BT-3 — Modern portfolio UI

- Design one clear visual direction (pick fonts that are **not** Inter/Roboto/Arial defaults; not purple-gradient AI look).
- Hero + Selected work + About + Skills + Contact.
- CTAs can `dispatch` OPEN for `projects` / `contact` windows where useful.
- Scoped CSS module / data-attribute styles.

**Exit:** Looks like a real 2026 personal site **inside** the IE frame; still “Farhan” after removing the XP chrome in a mental crop test.

### Phase BT-4 — Integration & QA

- First visit / revisit / refresh / Esc close mid-trip / reopen.
- Window resize (browser window is ~800×550 default).
- Reduced motion.
- No new npm deps unless Framer Motion gaps force it (prefer existing).
- Lint + build green.

**Exit:** Recruiter path: Desktop → Internet → trip → modern site → Contact CTA works.

### Phase BT-5 — Optional polish (later)

- “Replay time machine” footer link.
- Era-specific favicon flash in toolbar (fake).
- Sound (soft whoosh) — only if SFXSynth already easy to hook; YAGNI otherwise.
- Content pass when Phase 23 content is ready.

---

## 6. What we will not do

- Will not replace the XP desktop with the modern site as the root experience.
- Will not embed a real iframe of an external site as the “portfolio” (keeps us offline-demoable and on-brand).
- Will not duplicate full case studies inside the browser.
- Will not add a CMS or new backend.
- Will not animate the Bliss wallpaper or taskbar as part of the time machine.
- Will not ship unskippable 30s intros.

---

## 7. Effort & risk (honest)

| Item | Estimate | Risk |
|------|----------|------|
| Scaffold + state | Small | Low |
| Era art direction | Medium | Scope creep if we add too many years |
| Modern UI quality | Medium | Highest taste risk — keep sections few |
| Motion polish | Small–medium | Reduced-motion must be handled |
| Content | Small | Reuse JSON |

**Biggest risk:** Overbuilding eras. Cap at **4 eras + morph**. If it feels long, cut 2010 or 2015.

**Second risk:** Modern site looking like generic AI landing. Mitigate with locked art direction in BT-3 before coding sections.

---

## 8. Acceptance criteria (definition of done)

1. Click **Internet** → XP window opens (unchanged outer shell).
2. First time in session: Time Machine plays inside page viewport only.
3. Years advance to **current year**; then modern Farhan site appears in the same viewport.
4. Skip works; revisit in-session skips intro.
5. Modern site shows light, correct info from existing content modules.
6. Primary CTA can reach contact (mailto and/or Contact window).
7. No style leakage onto desktop / other windows.
8. `prefers-reduced-motion`: no forced multi-era animation.
9. Lint/build pass.

---

## 9. Suggested art direction note (for BT-3)

Pick **one** lane before coding the modern site:

| Lane | Mood | Use if… |
|------|------|---------|
| **A — Editorial engineer** | Strong display font, ink/paper + one sharp accent, lots of whitespace | You want “senior / deliberate” |
| **B — Product terminal** | Monospace + geometric sans, dark but **not** purple neon, grid subtle | You want continuity with builder brand without cyber-OS |
| **C — Soft portfolio** | Large type, photography/atmosphere, minimal chrome | You want agency-site calm |

**Recommendation:** Lane **A** or **B**. Avoid Lane C if we lack strong personal photos yet.

Document the chosen lane in a short comment at the top of `ModernSite.tsx` when BT-3 starts.

---

## 10. How this sits next to the rest of Farhan’s World

| Surface | Job |
|---------|-----|
| XP Desktop | Nostalgia OS — apps hold the deep portfolio |
| Farhan’s World (game) | Playable metaphor + skills/projects overlays |
| **Internet (this feature)** | Meta joke: “the web grew up” → modern trailer site |
| Nokia phone | Separate; don’t block on it |

Recruiters get three beats: **OS → Game → Browser evolution**. That is memorable without more apps.

---

## 11. Next step for you

Reply with:

1. **Go / wait** on building this.
2. Any era to **drop** (keep max 4).
3. Modern art lane **A / B / C** (or your own one-liner).
4. Session skip OK, or always play once per day?

When you say **go**, implement **BT-1 → BT-4** in that order; no drive-by refactors outside `BrowserWindow` + `browser/*`.
