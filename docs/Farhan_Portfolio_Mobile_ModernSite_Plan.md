# Mobile Default → Modern Portfolio Plan
### Phones open the Internet “arrival” site — not Nokia, not XP

**Status:** SHIPPED (MS-1 → MS-3) — phones → ModernSite; no eras; Nokia via egg  
**Created:** 2026-07-29  
**Updated:** 2026-07-29  
**Decision driver:** Desktop Farhan OS + `/connectQR` are solid. Nokia-as-default on `/` fails hire psychology. Modern site is the real portfolio scroll experience.

**Companions:**  
- Time Machine / ModernSite: `docs/Farhan_Portfolio_Internet_TimeMachine_Plan.md`  
- Prior Nokia track (keep as optional): `docs/Farhan_Portfolio_Mobile_Enhancement_Plan.md`  
- QR handshake (unchanged): `docs/Farhan_Portfolio_ConnectQR_Plan.md`  
- Code today: `page.tsx` → `PhoneShell` · `ModernSite.tsx` · `BrowserTimeMachine.tsx`

---

## 0. Verdict (locked for this plan)

| Question | Decision |
|----------|----------|
| Mobile `/` default? | **Modern portfolio site** (same surface as IE “arrival” / `ModernSite`) |
| Force Time Machine eras on mobile? | **No.** Eras stay a **desktop** jewel. Optional “Replay eras” only if trivial later — not v1. |
| Keep Nokia candy-bar? | **Yes, optional** — footer / menu: “Try Nokia phone” → existing `PhoneShell` |
| Keep Farhan OS Lite on mobile? | **Optional only** (via Nokia menu or a single “Classic OS” link) — not default |
| Change `/connectQR`? | **No.** Still handshake-only. “Enter full portfolio” → `/` now lands on **modern site** on phones (upgrade). |
| Change desktop `/`? | **No.** Still Farhan OS → IE → eras → ModernSite inside window. |

**One-line:**  
**Phone `/` = modern farhanbuilds.in scroll portfolio · Desktop `/` = Farhan OS mythos · QR = connect sheet.**

```
QR scan     →  /connectQR     (handshake)
Phone /     →  ModernSite     (hire + proof + scroll)
Desktop /   →  Farhan OS      (nostalgia + Time Machine)
Nokia       →  optional toy   (from modern footer)
```

---

## 1. Why this is the right psychology

### 1.1 What mobile users want

| Intent | Need in ~10s |
|--------|----------------|
| Recruiter on phone | Name, role, proof, LinkedIn/resume/contact |
| Came from QR “full portfolio” | Real site, not another metaphor to learn |
| Curious peer | Scroll + motion OK; still must feel finished |

Nokia asked them to **operate firmware** before believing you.  
ModernSite asks them to **read you**.

### 1.2 Why “the internet part” specifically

The ModernSite is already:

- Brand-forward hero  
- Featured work, about, skills, achievements, experience, contact  
- Floating dock anchors  
- Same JSON as the rest of the product  

It is the **portfolio**, wrapped today inside a desktop browser window after a time trip. On phones, skip the wrapper and the trip — keep the destination.

### 1.3 What we stop pretending

- That a 220px LCD is a good primary hire canvas  
- That Nokia + Lite OS + Game is one coherent first impression  
- That mobile must mirror desktop metaphor 1:1  

---

## 2. Product surfaces after change

| Width / door | Surface | Notes |
|--------------|---------|--------|
| `/connectQR` | Connect sheet | Unchanged |
| `/` · width `< 768` | **ModernSite standalone** | New default |
| `/` · width `≥ 1024` | Farhan OS (XP) | Unchanged |
| `/` · `768–1023` | TabletChoice | Update copy: **Desktop OS** vs **Portfolio site** (not “Nokia phone” as primary label) |
| Optional deep link | e.g. `/?toy=nokia` or in-app state | Opens existing PhoneShell |

**Detection:** keep `useDeviceMode` (viewport). No UA sniffing.

---

## 3. User journeys

### 3.1 Recruiter on phone (happy path)

1. Opens `farhanbuilds.in`  
2. Sees modern hero (name, role, CTAs) — scroll unlocked  
3. Dock → Work / Experience / Achievements / Contact  
4. LinkedIn / resume / mailto without learning a keypad  

### 3.2 QR → full portfolio

1. `/connectQR` → “Enter full portfolio”  
2. Lands on `/` → **same modern site** on phone  
3. No boot, no Nokia, no eras  

### 3.3 Power user who wants nostalgia on phone

1. Footer: **Try Nokia phone** → PhoneShell (existing M1–M4)  
2. Or **Open on desktop for Farhan OS + Time Machine** (hint text)  

### 3.4 Desktop (unchanged)

Boot → OS → IE → eras → ModernSite *inside* browser window. Replay eras still works there.

---

## 4. Technical plan

### 4.1 Core problem today

`ModernSite` is not phone-safe as-is:

| Issue | Detail |
|-------|--------|
| `useWindows()` | `openProjects` / `openContact` dispatch XP windows — **no WindowProvider on mobile** → crash |
| `onReplayEras` | Required prop — desktop-only meaning |
| `body { overflow: hidden }` | OS lock — modern page **must scroll** (same class of bug as connectQR) |
| Lenis + heavy motion | OK if scroll unlocked; respect `prefers-reduced-motion` |
| Mounted inside IE chrome | Needs full-viewport shell without XP window |

### 4.2 Target architecture

```
page.tsx
  desktop  → DesktopShell          (unchanged)
  mobile   → ModernPortfolioShell  (NEW)  → ModernSite mode="standalone"
  tablet   → choice → one of the above
  optional → PhoneShell            (Nokia toy, not default)

/connectQR → unchanged
```

**New (minimal):**

| File | Role |
|------|------|
| `src/components/mobile/ModernPortfolioShell.tsx` | Full-viewport host, unlock scroll, footer links to Nokia |
| Soften `ModernSite.tsx` | `mode?: 'embedded' \| 'standalone'` — no window dispatch in standalone |

**Prefer not to:** duplicate the whole modern site into a second codebase.

### 4.3 `ModernSite` API change (smallest)

```ts
type ModernSiteMode = 'embedded' | 'standalone';

interface ModernSiteProps {
  mode?: ModernSiteMode;          // default 'embedded' (desktop IE)
  onReplayEras?: () => void;      // optional; hide button if missing
}
```

**Standalone behavior:**

- Do **not** call `useWindows` (or call only when `mode === 'embedded'` — pattern: split hooks / conditional provider / pass callbacks).  
  **Preferred lazy pattern:** optional callbacks:

  ```ts
  onOpenProjects?: () => void;
  onOpenContact?: () => void;
  onReplayEras?: () => void;
  ```

  Desktop browser passes window-open + replay.  
  Mobile passes nothing → CTAs scroll to `#bv-work` / `#bv-contact` or `mailto` / links only.

- Replay eras button: **hidden** on standalone (v1).  
- FloatingDock: keep (already in-page anchors — works on mobile).  
- Portrait tilt / cursor glow: degrade on touch (`hover: none`) if janky.

### 4.4 Scroll unlock

Mirror connectQR lesson — do **one** of:

1. `ModernPortfolioShell` + client `UnlockScroll` (class on `html/body`), or  
2. Fixed full-viewport shell with `overflow-y: auto` as sole scrollport  

Must work with global `html, body { overflow: hidden; height: 100% }`.

### 4.5 Nokia as optional

Keep `PhoneShell` intact (M1–M4 work preserved).

Entry points (pick in implement, default = all cheap ones):

1. Footer on modern standalone: **Try Nokia phone**  
2. Query `/?view=nokia` for demos / yourself  
3. Tablet choice tertiary optional later — **not required in v1**

Back from Nokia → modern shell (not a dead end).

### 4.6 TabletChoice copy

Update labels:

| Old | New |
|-----|-----|
| Desktop OS / Nokia Phone | **Farhan OS (desktop)** / **Portfolio site** |

Optional small text under portfolio: “Includes classic Nokia toy inside.”

### 4.7 `/connectQR` link

“Enter full portfolio” → `/` stays.  
On phones this becomes modern site automatically — **no QR code reprint**, no connect page redesign.

---

## 5. Design / UX bar for standalone modern

- First viewport: brand (Farhan), one role line, one proof line (SIH), CTA group (Work / Contact / Resume)  
- Safe-area padding; dock not under home indicator  
- No XP chrome, no fake IE frame on mobile (that’s desktop theater)  
- Performance: don’t load Phaser on this path; defer heavy below-fold if easy  
- Reduced motion respected  

**Not in v1:** restyle ModernSite into a third visual language. Reuse browser theme CSS (`browserTheme.css` / existing classes).

---

## 6. What we explicitly do *not* do

- Make modern site the desktop `/` homepage (kills Farhan OS)  
- Auto-play Time Machine eras on mobile  
- Delete Nokia code  
- Merge `/connectQR` into modern site  
- Force landscape  
- Build BlackBerry / flip  

---

## 7. Implementation phases

### Phase MS-0 — Confirm (done when you approve this doc)

- [x] Lock verdict §0  
- [x] Confirm Nokia = optional only  
- [x] Confirm no eras on mobile v1  

### Phase MS-1 — Decouple ModernSite (0.5–1 day)

- [x] Make window opens / replay optional via props or `mode`  
- [x] Embedded (desktop IE) behavior **unchanged**  
- [x] Standalone: in-page scroll CTAs; hide replay  
- [x] Smoke: desktop IE → eras → site still opens Projects/Contact windows  

### Phase MS-2 — ModernPortfolioShell + route (0.5–1 day)

- [x] New shell: full viewport, scroll unlock, safe areas  
- [x] `page.tsx`: mobile → `ModernPortfolioShell` instead of `PhoneShell`  
- [x] Footer: Try Nokia · maybe “Best on desktop: Farhan OS”  
- [x] `/?view=nokia` → `PhoneShell`  

### Phase MS-3 — Tablet + QR path QA (0.5 day)

- [x] TabletChoice copy update  
- [x] From `/connectQR` → `/` on phone = modern site  
- [x] Nokia optional round-trip works  
- [x] `/connectQR` still no OS boot  

### Phase MS-4 — Polish + docs (0.5 day)

- [x] Touch dock targets, short landscape  
- [x] Update Mobile Enhancement plan status: “Nokia demoted to optional”  
- [x] Smoke script: `check-mobile-modern.mjs`  
- [ ] Owner real-device sign-off  

**Exit:** Phone stranger test — “this is a portfolio” in &lt;3s; Contact reachable without keypad.

---

## 8. File touch list (expected)

| Path | Change |
|------|--------|
| `src/app/page.tsx` | Mobile → ModernPortfolioShell |
| `src/components/mobile/ModernPortfolioShell.tsx` | **New** |
| `src/components/desktop/windows/browser/ModernSite.tsx` | Standalone-safe props |
| `src/components/shared/TabletChoice.tsx` | Copy |
| `src/components/mobile/PhoneShell.tsx` | Unchanged entry; optional only |
| `docs/Farhan_Portfolio_Mobile_Enhancement_Plan.md` | Add supersession note |
| `docs/Farhan_Portfolio_V3_Master_Checklist.md` | Mobile primary = modern site |
| `scripts/check-mobile-plan.mjs` | Adjust expectations |

---

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| ModernSite crashes without WindowProvider | MS-1 before MS-2; never mount standalone until decoupled |
| Body scroll lock | Dedicated unlock like connectQR |
| Bundle weight (framer/lenis) on mid Android | Accept v1; reduce motion; don’t add Phaser |
| Brand feels “normal site only” | Desktop mythos unchanged; Nokia toy link preserves quirk |
| You miss Nokia default | Optional entry + `/?view=nokia` for demos |

---

## 10. Success criteria

1. Phone `/` shows modern portfolio, scrolls, Contact works.  
2. Desktop Farhan OS + Time Machine unchanged.  
3. `/connectQR` unchanged; “full portfolio” on phone feels right.  
4. Nokia reachable in ≤2 taps from modern footer.  
5. No WindowContext error in mobile console.  

---

## 11. Supersession note

This plan **changes the mobile default** decided in `Farhan_Portfolio_Mobile_Enhancement_Plan.md` (Nokia primary).  

Nokia M1–M4 work is **not wasted** — it becomes the **optional classic toy**.  
Do not delete Phone* until after MS-2 ships and you confirm.

---

## 12. Ask before coding

Reply **approve MS-0** (or note any change), then we implement **MS-1 → MS-2** first.

Optional preferences (defaults if you say nothing):

1. Footer link label: **Try Nokia phone**  
2. Query param: **`/?view=nokia`**  
3. Replay eras on mobile: **hidden in v1**  
