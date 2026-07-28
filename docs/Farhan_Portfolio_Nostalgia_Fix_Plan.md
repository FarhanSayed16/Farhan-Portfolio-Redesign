# FARHAN’S WORLD — NOSTALGIA FIX PLAN
### Make the desktop look like real Windows XP / 98 · Make the game look like real Super Mario Bros (NES)

**Status:** Track A (XP Luna OS) — DONE · Track B (Mario) — IMPLEMENTED 2026-07-15 (procedural NES art + mechanics)  
**Created:** 2026-07-15  
**Why this exists:** The current build is a *dark futuristic cyber-OS* (navy + cyan grid + Lucide icons) with *colored rectangle placeholders* for Mario. That is the opposite of the nostalgia brief. Reference screenshots (Win98 portfolio, WinXP Luna, SMB World 1-1) define the target.

**Companions:**
- Vision (old): [`Farhan_Portfolio_V3_Complete_Plan.md`](./Farhan_Portfolio_V3_Complete_Plan.md)
- Execution tracker: [`Farhan_Portfolio_V3_Master_Checklist.md`](./Farhan_Portfolio_V3_Master_Checklist.md)
- This file **overrides** Phase 02 visual tokens and Phase 16–18 art direction until the nostalgia tracks below are done.

---

## 0. Verdict (read this first)

| Surface | What we have today | What the references show | Gap |
|--------|--------------------|---------------------------|-----|
| Desktop | Dark navy `#0a0e1a`, cyan/violet gradients, scanline/grid wallpaper, Lucide line icons, flat dark taskbar | Win98 teal `#008080` *or* WinXP blue Bliss + green Start + silver taskbar + skeuomorphic icons | **Wrong visual language** (futuristic ≠ nostalgic) |
| Windows chrome | Dark panels, cyan title gradient, modern close icons | XP Luna blue title bar, plastic buttons, classic `_ □ X` chrome | **Wrong chrome** |
| Game | Solid cyan/red/yellow boxes, crude 4-color tileset, no hills/clouds/pipes art, HUD not SMB layout | NES Mario: sky `#5C94FC`, brick ground, `?` blocks, pipes, bushes, clouds, small Mario sprite, classic HUD | **Wrong art + incomplete level presentation** |
| Audio | Procedural beeps only | Jump / stomp / coin / pipe / level clear / die (NES-like) | Acceptable short-term; must be replaced for “feels like Mario” |

**North star after this plan ships:**  
Someone removes the browser URL bar from a screenshot and still says *“that’s Windows XP”* for the OS, and *“that’s Super Mario Bros”* for the game — not *“cool cyber portfolio”* or *“Phaser prototype with boxes.”*

---

## 1. Design decision (locked for this fix)

### 1.1 Desktop OS → **Windows XP Luna** (primary)

| Choice | Decision | Reason |
|--------|----------|--------|
| Theme | **Windows XP “Luna”** | User attached XP as explicit reference; still instantly nostalgic for recruiters |
| Optional easter egg | Win98 “Classic” skin toggle later | Win98 teal (like `ross.aleksei.digital/98`) is a phase after Luna ships — not a distraction now |
| Fonts | **Tahoma / “xp” stack for UI** (`Segoe UI` fallback OK); keep `Press Start 2P` **only** for game + rare pixel labels | Space Grotesk + JetBrains everywhere reads modern |
| Icons | 32–48px **skeuomorphic / XP-style** PNGs or CSS+SVG that look physical (shadow under icon) | Lucide outlines are modern |
| Wallpaper | Soft blue gradient + subtle embossed brand mark (Farhan / four-pane tribute), **not** cyan grid | Match Bliss/Luna mood without ripping Microsoft wallpaper 1:1 |
| Start button | Glossy **green** pill, white “start”, colorful window logo mark | Current cyan flat button fails the XP test |
| Taskbar | Silver/grey metallic gradient, recessed tray + clock | Current dark bar reads “IDE dark theme” |

**Hard ban list (remove from desktop):**
- Cyan/violet neon accents as default
- Dark navy cyber wallpaper + scanline grid
- Glow, glassmorphism, heavy rounded modern cards (except XP’s own soft radii)
- Future-OS title gradients (cyan→violet)
- Flat Lucide-only desktop icons without XP chrome wrappers

### 1.2 Game → **NES Super Mario Bros visual authenticity**

| Choice | Decision |
|--------|----------|
| Look | Match reference World 1-1: sky blue, brown ground strip, bricks, `?` blocks, green pipes, hills, bushes, clouds, small Mario, Goomba |
| Engine | Keep Phaser 3 + existing level flow (3 worlds, overlays, hire) — **replace art/feel**, don’t rewrite React shell |
| Sprites | Real NES-resolution sprite sheets + tileset (16×16 / 16×32 as appropriate), **no colored rectangles** |
| Physics feel | Tune to “SMB-ish” (walk/run, variable jump, stomp) — already partially there; re-test after sprites change hitboxes |
| HUD | Classic layout: `FARHAN`/`SCORE` · `×COINS` · `WORLD` · `TIME` (Press Start 2P, white) |
| Branding inside game | Portfolio copy stays in **React overlays**, not painted over tiles like a fake logo billboard |

### 1.3 Legal / IP (must stay explicit)

Nintendo owns SMB. For a public portfolio:

1. **Preferred (recommended):** Commission or draw **original NES-style** sprites that *read* as Mario/Goomba/pipe (same proportions & palette family) but are **not** pixel-for-pixel rips — label in README as “original retro platformer art inspired by 8-bit era.”
2. **Fan sheets (spriters-resource etc.):** Only if you accept takedown risk; treat as **dev placeholders**, not production claim of “authentic Nintendo game.”
3. **Never claim** “official Super Mario Bros” or use the “SUPER MARIO BROS.” logo / © Nintendo lockup in product UI.

This plan’s acceptance criteria are **visual fidelity to the references**, not a legal Nintendo distribution.

---

## 2. What’s wrong in code today (file-level)

### 2.1 OS — futuristic tokens & surfaces

| File | Problem |
|------|---------|
| `src/app/globals.css` | Tokens are cyber: `--os-bg: #0a0e1a`, cyan/violet brand, dark taskbar |
| `src/components/desktop/Desktop.tsx` | Wallpaper = navy + cyan radial + **grid**; Lucide icons |
| `src/components/desktop/Taskbar.tsx` | Dark flat bar; cyan Start |
| `src/components/desktop/Window.tsx` | Dark title chrome; Lucide control glyphs |
| `src/components/desktop/StartMenu.tsx` | Dark modern panel |
| `src/components/desktop/BootScreen.tsx` | Likely tech-boot aesthetic vs XP-style splash |
| Fonts in `layout.tsx` | Space Grotesk / JetBrains dominate OS (modern) |

### 2.2 Game — placeholder art & presentation

| File | Problem |
|------|---------|
| `src/phaser/scenes/BootScene.ts` | Generates cyan/red/yellow **boxes** as “sprites” and a 4-color fake tileset |
| `public/game/` | Maps exist; **no** `sprites/`, real `tilesets/`, or `audio/` art packs |
| Level scenes | Seed coins as floating placeholders; pipes/flags often colored rectangles; no background parallax (hills/clouds) |
| HUD in `BaseLevel.ts` | Functional but not classic column HUD / WORLD label |
| Overlays | Still OS-dark styling — should match XP dialogs *or* NES pause card, not cyber modal |

---

## 3. Target look — acceptance screenshots

After fixes, capture and compare:

1. **Desktop idle** vs user’s XP reference: blue wallpaper mood, green Start, silver taskbar, column of XP-style icons, no cyan grid.
2. **One open window** vs XP Luna: blue title bar, beige/silver body, classic caption buttons.
3. **Game Level 1 cold start** vs SMB 1-1 reference: sky color, ground tiles, at least one `?` block, pipe or hill, recognisable player + enemy sprites (not boxes), classic HUD.
4. **Side-by-side test:** if icons/chrome still feel “SaaS dashboard,” track A is not done.

---

## 4. TRACK A — Windows XP Luna OS restyle

### Phase N1 — Design tokens & fonts (foundation)

**Goal:** One CSS switch turns the whole OS from cyber → Luna.

#### Tasks
1. Replace `:root` OS tokens in `globals.css`:
   - Wallpaper blue family (`#245EDC` → `#3A6EA5` range; Bliss-like gradient stops)
   - Window body: classic `#ECE9D8` / `#FFFFFF` for content
   - Title bar active: Luna blue gradient (`#0A246A` → `#A6CAF0` style stops)
   - Title bar inactive: grey-blue
   - Taskbar: silver metallic (`#ECE9D8` → `#C0C0C0` vertical gradient)
   - Start green: `#3C8A3C` → `#5CB85C` gloss
   - Borders: classic 3D bevel (light outer / dark inner) — utility classes `.xp-bevel-out`, `.xp-bevel-in`
   - Text: near-black `#000` / grey `#404040` on light surfaces (not light-on-dark by default)
2. Remove or gate cyan/violet as **default** brand; optional accent only inside portfolio *content* (e.g. browser page), not chrome.
3. Add font: **Tahoma** via `next/font` local or `font-family: Tahoma, "Segoe UI", sans-serif` for OS UI.
4. Keep Press Start 2P for game + any pixel easter eggs only.
5. Kill `.scanlines` on desktop (or limit to Boot CRT joke, then fade out).

**Exit criteria**
- [x] No default page loads with navy+cyan grid wallpaper
- [x] Body text on windows is dark-on-light
- [x] Screenshot test #1 wallpaper mood passes

---

### Phase N2 — Wallpaper, icons, desktop layout

**Goal:** First viewport = XP desktop composition, not a cyber dashboard.

#### Tasks
1. Wallpaper: CSS gradient + soft embossed “Farhan” / four-pane mark (SVG, low contrast) — inspired by XP branding area, **original art**.
2. Replace Lucide desktop icons with assets under `public/icons/xp/`:
   - Recycle Bin, My Computer / System, Folder (Projects), Document (Resume/README), Mail (Contact), Globe (Browser), Gamepad/Cartridge (Game), Trophy, Briefcase, etc.
3. Icon presentation: 32×32 or 48×48, drop shadow, white label with soft black shadow (classic XP text).
4. Icon column left-aligned (Win-like), README can sit center as hero doc.
5. Selection: dashed XP marquee or blue translucent rect — not cyan glow.

**Asset sources (pick one path and stick to it)**
- Path A: Free XP-era icon packs (ICO → PNG), CC0 / credited
- Path B: Redraw simple skeuomorphic SVGs that *feel* XP (faster, unique brand) ← **chosen** (`XpIcons.tsx`)

**Exit criteria**
- [x] Zero Lucide icons as primary desktop icons (tray may keep simple glyphs temporary)
- [x] Icons cast a soft shadow; labels read on blue wallpaper
- [x] Side-by-side with XP reference: “same era”

---

### Phase N3 — Window chrome, Start menu, Taskbar

**Goal:** Every window feels like Luna.

#### Tasks
1. **Window.tsx**
   - Classic caption: icon + title + `_` `□` `X` (XP style buttons: blue minimize/maximize, red X)
   - Active title: blue Luna gradient; inactive: dull
   - Outer border: raised bevel; inner client area sunken/light
   - Resize grips optional (XP SE-style corner)
2. **Taskbar.tsx**
   - Height ~30–36px silver bar
   - Green Start with logo mark + “start”
   - Task buttons: pressed bevel when focused
   - Tray: recessed well, speaker, clock `h:mm AM/PM`
3. **StartMenu.tsx**
   - Two-tone XP start panel (blue user strip + white list) **or** simplified single column with XP blue header showing name “Farhan Sayed”
   - Separators, hover blue highlight (classic)
4. **Context menu:** light grey, bevel, selection blue
5. **BootScreen:** short XP-inspired splash (blue fade / progress) or classic BIOS-then-XP — **not** cyber terminal purple

**Exit criteria**
- [x] Open About + Projects: both pass screenshot test #2
- [x] Start menu does not look like a modern command palette
- [x] Mute / clock still work on new tray

---

### Phase N4 — Window content skins (light OS apps)

**Goal:** Content inside windows matches XP apps, not dark IDE panels.

#### Tasks
1. Restyle shared surfaces: scrollbar (classic), buttons (`.os-button` → XP grey bevel), inputs (sunken white).
2. Per-window:
   - Notepad / README: white paper, system font
   - Explorer (Projects / Achievements): beige tree + list or dual pane light
   - Contact: Outlook Express–ish light form (already directionally close)
   - Browser: classic IE chrome (grey bars, back/forward) wrapping content
3. Game overlay React modal: either XP dialog or NES-style bordered box — **not** dark cyan modal.
4. Tablet choice + error boundaries: light XP MessageBox style.

**Exit criteria**
- [x] No portfolio window body uses `--os-window-body` navy as default fill
- [x] Contrast AA for text on beige/white

---

### Phase N5 — Mobile Nokia remains Nokia (out of OS track)

Nokia green-on-black stays. Only fix: if shared CSS tokens break phone contrast after Luna change, **namespace OS tokens** under `[data-theme="xp"]` on desktop shell so phone isn’t wiped beige.

**Exit criteria**
- [x] Phone still green LCD after OS restyle
- [x] Desktop root has `data-theme="xp"`

---

## 5. TRACK B — Super Mario Bros visual authenticity

### Phase M1 — Asset pipeline & folder contract

**Goal:** Stop generating boxes in `BootScene`; load real sheets.

#### Folder contract
```
public/game/
  tilesets/
    smb-overworld.png      # 16×16 (or 16×15) tile atlas — ground, brick, ?, used brick, pipe caps/body, etc.
  sprites/
    mario.png              # idle / walk / jump / die / small+big frames
    enemies.png            # goomba walk/flatten, (koop optional)
    items.png              # coin spin, mushroom
    particles.png          # optional brick break bits
  backgrounds/
    hills.png              # or draw layered from tiles
    clouds.png
    bushes.png
  audio/
    jump.ogg / coin.ogg / stomp.ogg / bump.ogg / powerup.ogg / die.ogg / flagpole.ogg / overworld.ogg
  maps/
    level_1_1.json         # already exist — re-author tiles to match new tileset indices
    level_1_2.json
    level_1_3.json
```

#### Tasks
1. Choose asset path (see §1.3): original NES-style pack vs temporary fan pack.
2. Document spritesheet frame sizes in `docs/game-asset-spec.md` (one page: frame rects, pivot, collision box).
3. Delete or gate placeholder generation in `BootScene.ts` once loads succeed.
4. PreloadScene loads all assets with a progress bar styled like NES (optional).

**Exit criteria**
- [ ] Opening game with network tab: no missing 404 for required sheets
- [ ] BootScene does not create cyan/red box textures for player/enemy

---

### Phase M2 — Tileset + map rebuild (looks like 1-1)

**Goal:** Level geometry *looks* like the reference, not a grey slab with green flag rect.

#### Tasks
1. Build / import overworld tileset matching reference colors:
   - Ground row (two-tone brick soil)
   - Brick block, `?` block (gold + `?`), empty block
   - Green pipe (top + body)
   - Optional castle / flagpole tiles
2. Re-paint Tiled maps `level_1_1` / `_2` / `_3`:
   - Sky empty; ground continuous
   - Early `?` / brick patterns like 1-1
   - At least one pipe; hills/bushes as **decoration layer** (no collision) or image layer
3. Object layer keeps: `MarioSpawn`, `Enemy`, `Flagpole`/`WarpPipe`, L3 `BowserSpawn`/`Axe`/`Bridge`
4. Camera bounds = map pixels; sky clearColor `#5C94FC`

**Exit criteria**
- [ ] Screenshot test #3 matches SMB vibe without explaining “placeholders”
- [ ] No large solid-color rectangle stand-ins for pipes/flags (use sprites or tiles)

---

### Phase M3 — Sprites, animation, hitboxes

**Goal:** Player and enemies animate like the references.

#### Tasks
1. Mario: walk cycle, jump, skid optional, death flip; big Mario stretch frames if mushroom kept
2. Goomba: walk flip, squish on stomp then remove
3. Coin: spin; mushroom: slide
4. Recalculate Arcade body sizes to sprite (small Mario ~12×16 visual → tight body)
5. Replace Bowser/axe placeholders with at least *recognisable* boss/axe art for Level 3
6. Invulnerability blink stays

**Exit criteria**
- [ ] Walk/jump/stomp readable at 768×480
- [ ] Zero solid-colour box sprites in gameplay

---

### Phase M4 — HUD, audio, juice

#### Tasks
1. HUD layout columns like reference (`SCORE` / coins / `WORLD 1-x` / `TIME`) — use Farhan name where SCORE name sits if desired
2. Swap SFXSynth placeholders for Howler short samples (or keep synth until samples land — but schedule samples)
3. Optional looping overworld BGM (mute respects tray + phone `*`)
4. Flagpole / pipe enter: short pause + sfx
5. Death / game over / win: NES-flavoured screens (black + white pixel text)

**Exit criteria**
- [ ] Mute silences BGM + SFX
- [ ] HUD readable and “SMB-shaped”
- [ ] Win → Hire Farhan still opens Contact

---

### Phase M5 — Polish pass vs references

#### Tasks
1. Side-by-side screenshot checklist (desktop game window maximized)
2. Fix parallax / decoration density (clouds every few screens)
3. Phone: smaller controls remain; canvas letterbox with sky blue (not black empty)
4. Performance: atlas pack; don’t load unused sheets on menu

**Exit criteria**
- [ ] User (or reviewer) can say “this looks like Mario” before “this is Phaser”
- [ ] Lighthouse / FPS still fine with game open (no unthrottled BGM leak)

---

## 6. Suggested execution order (dependencies)

```
N1 tokens/fonts ─────────────────────────────────────────────┐
     │                                                       │
     ├─► N2 wallpaper+icons                                  │
     ├─► N3 chrome (window/taskbar/start)                    ├── XP OS done
     └─► N4 content skins + N5 theme namespace                │
                                                             │
M1 asset folders + sheets ──► M2 maps/tileset ──► M3 sprites ┼── Game done
     │                         │                  │
     └─────────────────────────┴── M4 HUD/audio ──┴─► M5 polish
```

**Parallelism:** Track A and Track B can run in parallel after N1 (so game overlays get light dialogs) and M1 (so preload doesn’t depend on XP).

**Do not start:** random new features, purple accents, more cyber boot jokes, content rewrite (Phase 23), until N3 + M3 pass visual acceptance.

---

## 7. Effort estimate (honest)

| Phase | Estimate | Notes |
|------:|----------|-------|
| N1 | 0.5–1 day | CSS + theme attribute |
| N2 | 1–2 days | Icons are the bottleneck |
| N3 | 1–2 days | Window/Taskbar/Start rewrite |
| N4 | 1–2 days | Many windows, mechanical restyle |
| N5 | 0.5 day | Namespace + phone QA |
| M1 | 1–3 days | Depends on asset acquisition |
| M2 | 2–3 days | Tiled re-author is real work |
| M3 | 2–3 days | Anims + hitboxes |
| M4 | 1 day | HUD + audio wiring |
| M5 | 1 day | Reference QA |
| **Total** | **~10–18 days** | One focused engineer; art sourcing can add wait time |

---

## 8. Definition of done (nostalgia tracks)

All must be true:

1. **XP desktop** — no cyan-grid cyber wallpaper; green Start; silver taskbar; light windows; XP-style icons.
2. **SMB game** — no colored placeholder boxes; sky/ground/`?`/pipes/hills read as World 1; animated Mario & Goomba; classic HUD.
3. **Phone** — still Nokia; game playable with compact controls.
4. **Product flows** — boot → desktop, all apps open, Contact, Hire from win, mute, tablet choice unchanged in behaviour.
5. **Build** — `npm run lint` + `npm run build` clean.
6. **Docs** — Master Checklist gains sections “Nostalgia Track A/B” with checkboxes; this file marked **DONE** when exit criteria are ticked.

---

## 9. Out of scope (for this plan)

- Rewriting portfolio **copy** / project screenshots (content Phase 23)
- Exact Nintendo ROM or emulator embed
- Full SMB World 1–8 recreation (we keep **3 Farhan levels**)
- Win98 skin (optional follow-up after Luna)
- Redesigning Nokia industrial design (only protect it from XP token bleed)

---

## 10. Approval gate (answer before implementation)

Reply with:

1. **OS:** Confirm **Windows XP Luna** as primary (Y/N). If you prefer pure **Win98 teal** like the first screenshot instead, say so — Track A wallpaper/taskbar targets swap.
2. **Game art:** Confirm path — **(A) original NES-style pack** (safer) or **(B) fan SMB sheets for now** (risk).
3. **Start implementing** after approval: Track A first, Track B first, or both in parallel.

Until then, no visual rewrite ships — this document is the contract.
