# Business Card QR Landing — Final Plan
### `farhanbuilds.in/connectQR` (instant contact door → OS portfolio optional)

**Status:** IMPLEMENTED (CQ-1 → CQ-2) — 2026-07-29  
**Created:** 2026-07-29  
**Why:** Card QR must not dump people into Farhan OS boot. Event scanners need contact in ~3 seconds.

**Companions:** V3 OS lives at `/` · Content: `data/content/site.json`

---

## 0. Verdict (locked)

| Question | Decision |
|----------|----------|
| Point QR at `/` (main OS)? | **No.** Boot + device choice is wrong for a handshake scan. |
| Dedicated lightweight page? | **Yes.** |
| URL to use | **`https://farhanbuilds.in/connectQR`** — this is what your QR already encodes. Do **not** reprint for `/card`. |
| Alias | Optional: `/card` → **308 redirect** to `/connectQR` (nice short link for verbal share; QR stays on `/connectQR`). |
| What the page is | Mobile-first **contact / connect** sheet: photo, name, role, proof, links, resume, deep-link into full portfolio. |
| What it is not | Not the XP desktop, not the time machine, not a second full portfolio. |

**One-line:**  
**QR → instant connect page → save contact / LinkedIn / resume; Portfolio is one intentional tap away.**

---

## 1. Why this is correct for *your* product

Your V3 homepage is a **nostalgia OS** (boot → Bliss → windows). That is a great second impression for curious recruiters. It is a bad **first** impression for:

- Someone scanning at a hackathon / meetup with 10 seconds of attention  
- Weak Wi‑Fi / mid-range Android  
- “Just give me LinkedIn” energy  

The card already says **SCAN TO CONNECT**. The landing page should honor that promise: **connect**, not “watch a boot ROM.”

Flow that matches the card:

```
Business card QR
    → farhanbuilds.in/connectQR     (≤1s, mobile, no boot)
         → LinkedIn / GitHub / Email / WhatsApp
         → Download Resume (PDF)
         → View Full Portfolio → /  (Farhan OS — optional)
```

---

## 2. URL strategy (final)

| URL | Role |
|-----|------|
| **`/connectQR`** | **Canonical QR target** (already on the card). Build the page here. |
| `/card` | Optional redirect → `/connectQR` (marketing / “visit farhanbuilds.in/card”). |
| `/` | Unchanged Farhan OS experience. |
| `/resume.pdf` | Already in `public/` — link directly from the connect page. |

**Do not** change the QR payload if cards are printed or about to print. Changing to `/card` only makes sense if the QR is **not** finalized yet — and even then `/connectQR` matches the card copy (“SCAN TO CONNECT”) better than `/card`.

---

## 3. Page content (exactly what they see)

Mobile-first, single column, thumb-reachable CTAs. Echo card proof; keep copy short.

```
┌─────────────────────────────┐
│  [Photo — farhan.jpeg]      │
│                             │
│  Farhan Sayed               │
│  AI & Full-Stack Engineer   │
│  Mumbai, India              │
│                             │
│  ★ SIH 2025 National Winner │
│  ★ Intl. Finalist · EA 2025 │
│                             │
│  [ LinkedIn ] [ GitHub ]    │
│  [ Email ]    [ WhatsApp ]  │
│                             │
│  [ Download Resume ]        │
│  [ View Full Portfolio ]    │
│                             │
│  farhanbuilds.in            │
└─────────────────────────────┘
```

### Copy source (reuse JSON — no duplicate bios)

| UI bit | Source |
|--------|--------|
| Name, tagline, location, photo | `site.json` |
| Email, GitHub, LinkedIn | `site.json` → `socialLinks` |
| Resume | `site.json` → `resumeUrl` (`/resume.pdf`) |
| SIH / Open Group lines | Short strings on the page (or tiny `connect.json` later) — match **card back** wording |
| WhatsApp | Add `whatsapp` (or `phone`) to `site.json` when you confirm the number — **required before ship** |

### CTA priority (top → bottom)

1. **LinkedIn** — highest event conversion  
2. **WhatsApp** — India event reality (optional but strong)  
3. **Email** — mailto  
4. **GitHub** — builders  
5. **Download Resume** — primary file action  
6. **View Full Portfolio** — secondary, opens `/` (OS). Label it clearly so people know it’s the immersive experience.

**Avoid:** boot animation, autoplay video, Framer-heavy hero, time machine, “enter Farhan OS” as the only button.

---

## 4. Design direction (card-aligned, still readable)

Your card is **black + gold, serif brand, QR-centric**. The web page should **rhyme**, not photocopy.

| Choice | Spec |
|--------|------|
| Mood | Dark premium, calm, high contrast on phone outdoors |
| Base | Near-black background (`#0a0a0a`–`#111`) |
| Accent | Soft gold / champagne (`#c9a227`–`#e3c57c`) for rules & labels — not neon |
| Type | Strong name (serif or tight sans); body sans; mono only for tiny labels if needed |
| Photo | Circular or soft-rounded portrait from `/images/farhan.jpeg` |
| Motion | **Almost none.** Optional 150ms fade-in of the block. Respect `prefers-reduced-motion`. |
| Load budget | No Phaser, no Howler, no heavy fonts beyond 1–2 families already in the app (or system stack for max speed) |

**Brand test:** Someone who just held your card should feel “same person, same energy” — not a different product.

---

## 5. Technical plan (Next.js App Router)

### 5.1 Routes

| Route | Implementation |
|-------|----------------|
| `src/app/connectQR/page.tsx` | Server Component preferred — static HTML, fast TTFB |
| `src/app/connectQR/layout.tsx` | Minimal layout: own metadata, **no** DesktopShell / boot |
| `src/app/card/page.tsx` or `next.config` redirect | ` /card` → `/connectQR` |

### 5.2 Isolation from OS

Root `page.tsx` stays the OS. Connect page must **not** import:

- `DesktopShell` / `PhoneShell`  
- Phaser / GameWrapper  
- Boot screen  

Use shared content via `@/lib/content` only.

### 5.3 Metadata (for link previews)

When someone shares `/connectQR`:

- Title: `Farhan Sayed — Connect`  
- Description: one line from tagline + SIH winner  
- OG image: photo or a simple card-style OG (optional later)

### 5.4 Optional niceties (phase 2 — not required for QR launch)

- **Save contact** → generate a `.vcf` (vCard) download with name, email, LinkedIn, URL  
- UTM: `/connectQR?src=card` for analytics  
- Tiny analytics event on CTA clicks (Plausible/Vercel Analytics)  

---

## 6. Implementation phases

### Phase CQ-0 — Lock (this doc)

- [ ] Approve URL: `/connectQR` canonical  
- [ ] Confirm WhatsApp number (or drop WhatsApp CTA)  
- [ ] Confirm resume PDF is final at `/resume.pdf`  

### Phase CQ-1 — Ship the page

- [ ] `app/connectQR/page.tsx` + minimal layout  
- [ ] Photo, identity, awards, socials, resume, portfolio link  
- [ ] Mobile layout QA (iPhone SE width → large Android)  
- [ ] Lighthouse-ish: fast, no boot, no OS JS on this route  

### Phase CQ-2 — Redirects & polish

- [ ] `/card` → `/connectQR`  
- [ ] OG/Twitter meta  
- [ ] Optional vCard button  

### Phase CQ-3 — Verify QR in the wild

- [ ] Scan printed card (or draft print) → lands on connect page  
- [ ] Every CTA works on iOS Safari + Chrome Android  
- [ ] “View Full Portfolio” reaches OS without breaking back-button expectations  

---

## 7. What we will not do

- Will not send the QR to `/` or auto-launch the OS.  
- Will not embed the XP desktop in an iframe on the connect page.  
- Will not rebuild the whole portfolio as a normal marketing site for the QR.  
- Will not block launch on perfect gold gradients / 3D card CSS.  

---

## 8. Success criteria

1. Scan → readable contact UI in **under ~1–2s** on mid phone + normal 4G.  
2. LinkedIn / GitHub / Email / Resume work without opening the OS.  
3. Portfolio is available but **optional**.  
4. Page does not run boot, Phaser, or desktop shell.  
5. URL matches the QR: **`/connectQR`**.  

---

## 9. Recommendation summary (for you)

| Suggestion you got | My call |
|--------------------|---------|
| Don’t QR to main portfolio | **Agree — mandatory** |
| Dedicated lightweight page | **Agree — mandatory** |
| Path `/card` | **Nice alias only.** Keep **`/connectQR`** as QR target (already on card + matches “SCAN TO CONNECT”). |
| Photo + links + resume + portfolio | **Agree** |
| No animations / no boot | **Agree** (tiny fade OK) |
| WhatsApp | **Add if you want event conversion** — confirm number first |

**Final plan in one sentence:**  
Build a dark, card-rhyming, mobile **Connect** page at **`/connectQR`**, feed it from existing content JSON, link resume + socials + optional WhatsApp, and send curious people to `/` for Farhan OS — never the other way around.

---

## 10. Next step

Reply with:

1. **Go** to implement CQ-1, or wait  
2. WhatsApp: **number** or **skip**  
3. Awards lines: use card wording as-is? (SIH National Winner / International Finalist)

Then we implement only `connectQR` (+ optional `/card` redirect) — no OS churn.
