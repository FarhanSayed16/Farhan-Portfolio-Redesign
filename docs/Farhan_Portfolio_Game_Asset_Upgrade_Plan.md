# Farhan OS Game — Asset & Authenticity Upgrade Plan

**Status:** IMPLEMENTED — Option **B** (NES SMB look via `public/game/sprites` PNGs + overworld/castle BGM). TSR auto-download blocked by Cloudflare; packed assets from `scripts/gen-smb-assets.mjs` (NES-accurate 2×). See [`LEGAL-NOTE.md`](../public/game/LEGAL-NOTE.md) + [`game-asset-spec.md`](./game-asset-spec.md).  
**Created:** 2026-07-29  
**Updated:** 2026-07-29 — Option B sheet pipeline + BGM.  
**Scope:** Keep **exactly three playable stages** (current `1-1` → `1-2` → `1-3`). Do **not** expand to SMB Worlds 1–8.  
**Hosts unchanged:** Desktop `GameWindow` + Nokia `PhoneGame` (both via `GameWrapper`).

**Sources reviewed**
- [The Spriters Resource — Super Mario Bros. (NES)](https://www.spriters-resource.com/nes/supermariobros/) — 43 sheets, sectioned downloads
- [Mario Universe — SMB NES sprites](https://www.mariouniverse.com/sprites-nes-smb/) — aggregate NES Mario sprite hub

**Companion (older Track B):** [`Farhan_Portfolio_Nostalgia_Fix_Plan.md`](./Farhan_Portfolio_Nostalgia_Fix_Plan.md) §5 — many M1–M5 exit boxes still unchecked; this plan **supersedes Track B execution** with a concrete sheet pick + wiring checklist for *this* codebase.

---

## 0. Verdict (read first)

| Question | Answer |
|----------|--------|
| What’s wrong today? | Art is **procedural grids** (`SmTextureFactory`), not sheets. Several textures are **missing or wrong**. Audio SFX exist but BGM doesn’t; some samples never play. |
| Best public sheet library for *our* 3 levels? | **Spriters Resource** — cleaner per-role sheets (Mario, enemies, tileset, items, backgrounds). |
| Mario Universe role? | Useful **backup / cross-check** and alternate dumps; weaker as a primary pick-list for Phaser atlases. |
| Scrape into prod as-is? | **Legal risk.** Nintendo owns SMB. Prefer **original NES-style redraws**; fan sheets only as **dev placeholders** if you accept takedown risk. |
| Expand to 8 worlds? | **No.** Rectify the existing three stages only. |

---

## 1. Current game — what we actually ship

### 1.1 Architecture

| Piece | Location |
|-------|----------|
| Phaser entry | `src/phaser/main.ts` (768×480, Arcade, `pixelArt: true`) |
| Texture generation | `src/phaser/assets/SmTextureFactory.ts` ← **primary art today** |
| Scenes | `BootScene` → `PreloadScene` → `MainMenu` → `Level1` → `Level2` → `Level3` → `Win` / `GameOver` |
| Maps | `public/game/maps/level_1_1.json`, `level_1_2.json`, `level_1_3.json` |
| Sprites / tilesets / game audio dirs | `public/game/sprites|tilesets|audio/` — **empty** |
| SFX on disk | `public/sounds/smb_*.mp3` (jump, coin, die, stomp, powerup, 1up, stage_clear) |
| SFX playback | `src/lib/SFXSynth.ts` (HTMLAudio). Phaser `PreloadScene` loads the same files but **doesn’t play them**. |

### 1.2 The three stages (keep this structure)

| Label | Scene | Map | Feel today | Exit |
|-------|--------|-----|------------|------|
| **1-1** | `Level1Scene` | `level_1_1.json` | Overworld-ish; Goombas; flag | → 1-2 |
| **1-2** | `Level2Scene` | `level_1_2.json` | Shorter; Goombas; warp pipe | → 1-3 |
| **1-3** | `Level3Scene` | `level_1_3.json` | Boss: Bowser + axe + bridge | → Win |

HUD calls them `WORLD 1-x`. Product copy can say “three worlds” meaning **three stages** — not eight SMB worlds.

### 1.3 Issue register (must-fix)

| ID | Severity | Issue |
|----|----------|--------|
| A1 | Critical | `public/game/sprites` + `tilesets` empty — no real sheets loaded |
| A2 | Critical | Big Mario = scaled small idle (`SmTextureFactory` comment: “only built small grids”) — no big walk cycle |
| A3 | Critical | Mushroom texture = Mario idle (wrong art) |
| A4 | Critical | `Bowser` / `Axe` textures **never generated** — Level 3 boss art broken / invisible |
| A5 | High | `Coin.ts` uses `coin_0`; factory only makes `coin_spin1–4` — floating coins can fail |
| A6 | High | L1 map has `Pipe` objects; scene doesn’t spawn pipe collision/art consistently |
| A7 | High | No overworld / castle **BGM**; mute story incomplete for music |
| A8 | Med | `smb_1up.mp3` mapped in SFXSynth but **never called**; bump/block SFX reused as stomp |
| A9 | Med | Dual audio path (Phaser load + HTMLAudio) — dead preload |
| A10 | Med | Scenery hills/clouds/bushes are code-placed, not map layers — sparse vs SMB 1-1 |
| A11 | Low | Fire flower / star / Koopa / fireballs not in scope historically — only add if you explicitly want them after sheet pass |
| A12 | Docs | Track B marked “IMPLEMENTED (procedural)” while M1 folder contract still unchecked — plan drift |

### 1.4 What already works (don’t break)

- Stomp physics (overlap, not collider) + grow/shrink floor-tunneling fixes in `Player.ts`
- Lives, invuln blink, flag / warp / axe win flow
- Portfolio overlays (skill / coin / Hire → Contact)
- Desktop + Nokia input via `GameBridge`
- Mute via `farhan-muted`

---

## 2. Source comparison — which site for which assets?

### 2.1 [Spriters Resource — SMB NES](https://www.spriters-resource.com/nes/supermariobros/)

**Strengths**
- **43 curated sheets**, split by role — easy to map to Phaser atlases
- Individual download pages (PNG) with known sheet IDs
- Clear sections for playable chars, enemies, stages, backgrounds, misc

**Sheets we actually need for 3 stages** (minimum set)

| Need in game | TSR section / sheet (typical) | Sheet refs (examples) |
|--------------|-------------------------------|------------------------|
| Small + Super Mario frames | Playable Characters → Mario & Luigi | [50365](https://www.spriters-resource.com/nes/supermariobros/sheet/50365/) |
| Goomba (+ optional Koopa later) | Enemies & Bosses | [52570](https://www.spriters-resource.com/nes/supermariobros/sheet/52570/) |
| Ground, brick, `?`, pipe, castle bits | Tileset | [52571](https://www.spriters-resource.com/nes/supermariobros/sheet/52571/) |
| Coin, mushroom, axe, flag bits | Items / Item and Brick Blocks / Objects | Items & related misc sheets |
| Hills, clouds, bushes | Backgrounds 1–3 | Mountains / Trees / Clouds sheets |
| HUD numerals / coin icon | Title Screen, HUD and Miscellaneous | HUD sheet |

**Stages on TSR:** full World 1-1 … 8-4 map *screenshots* exist — **we do not import those as playable levels**. Use only as **visual reference** when re-painting our three Tiled maps.

**Weaknesses**
- Fan dumps of Nintendo IP — same legal ceiling as every sprite site
- Sheets need **manual crop → atlas → frame rects** (work for `docs/game-asset-spec.md`)

### 2.2 [Mario Universe — SMB NES](https://www.mariouniverse.com/sprites-nes-smb/)

**Strengths**
- Long-running Mario sprite / map / soundboard hub
- Good for **browsing** multiple Mario titles in one place ([NES index](https://www.mariouniverse.com/sprites/nes/))
- Sometimes packs sheets differently (handy if a TSR sheet is missing a frame)

**Weaknesses**
- Page is a **blog/aggregate** — less “pick this sheet ID for Phaser” structure than TSR
- Harder to cite exact download URLs for a reproducible pipeline
- Same Nintendo IP issue

### 2.3 Decision (locked)

| Priority | Source | Use |
|----------|--------|-----|
| **Primary** | NES-accurate PNGs in `public/game/` (`gen-smb-assets.mjs`) | Production look for 3 stages |
| **Upgrade** | Drop TSR sheets into `public/game/_raw/` | Crop path when Cloudflare allows / manual drop |
| **Audio** | `public/sounds/smb_*.mp3` + `public/game/audio/*.wav` | SFX + BGM loops |

---

## 3. Legal / IP gate (must decide before downloads land in `public/`)

Nintendo owns Super Mario Bros. For a **public portfolio**:

| Option | Description | Recommendation |
|--------|-------------|----------------|
| **A — Inspired originals** | Redraw NES-resolution sheets that *read* as Mario/Goomba/pipe but are not pixel rips. Label in README. | **Preferred for production** |
| **B — Fan sheets (TSR / MU)** | Drop PNGs into `public/game/` for speed. Treat as **temporary**; accept takedown risk. Never claim “official SMB”. | OK for **local/dev** if you explicitly accept risk |
| **C — Hybrid** | Fan sheets to unblock Phaser wiring this week → swap to Option A before marketing push | Practical |

**This plan does not auto-commit ripped sheets.** Next implementation step waits on your choice: **A / B / C**.

Also: do **not** ship the “SUPER MARIO BROS.” logo lockup or © Nintendo branding in the UI. Keep “Farhan” / `WORLD 1-x` naming.

---

## 4. Target folder contract (after assets exist)

```
public/game/
  tilesets/
    overworld.png          # 16×16 (or documented size) — ground, brick, ?, used, pipe, flagpole base
    underground.png        # optional if 1-2 gets palette swap
  sprites/
    mario.png              # small + super: idle, walk×3, jump, skid?, die
    enemies.png            # goomba walk×2, flatten; bowser frames
    items.png              # coin spin, mushroom, axe, flag
  backgrounds/
    hills.png
    clouds.png
    bushes.png
  audio/                   # optional move from /sounds later
    overworld.ogg          # loop (cleared / original)
    castle.ogg             # optional for 1-3
  maps/
    level_1_1.json         # rebind tile GIDs to new tileset
    level_1_2.json
    level_1_3.json

docs/
  game-asset-spec.md       # frame rects, pivots, body sizes (NEW — required)
```

`SmTextureFactory` becomes **fallback only** (or deleted once Preload succeeds).

---

## 5. Work phases

### G0 — Confirm & acquire (0.5–1 day)

1. You pick **A / B / C** (legal).
2. Download **minimum TSR set** (Mario, Enemies, Tileset, Items/blocks, 3 backgrounds, HUD).
3. Optionally cross-check Mario Universe for missing frames.
4. Store originals outside git if Option B temporary — or commit under Option C with a `LEGAL-NOTE.md` in `public/game/`.

**Exit:** Sheets on disk; decision written in this file’s Status line.

---

### G1 — Atlas + preload pipeline (1–2 days)

1. Crop / pack into the folder contract (TexturePacker, Aseprite, or manual Phaser frame configs).
2. Write `docs/game-asset-spec.md`: every texture key → frame rect + intended Arcade body.
3. `PreloadScene`: load sheets; progress bar; fail loudly if missing.
4. `BootScene`: stop calling `generateGameTextures` for keys that loaded; keep procedural only as `#ifdef`-style fallback if needed.
5. Fix key mismatches: `coin_0` vs `coin_spin*`, `bowser`, `axe`, `mushroom`.

**Exit:** Network tab shows sheet 200s; no missing texture warnings for player/goomba/tiles/boss.

---

### G2 — Tileset + map rebind for 1-1 / 1-2 / 1-3 (2–3 days)

1. Import `overworld.png` into Tiled; rebuild tileset first-gid mapping.
2. Re-paint maps for SMB density (reference TSR World 1-1 / castle screens — **layout inspiration only**):
   - **1-1:** sky `#5C94FC`, continuous ground, `?`/brick clusters, ≥1 pipe, hills/bushes/clouds decoration layer, flagpole
   - **1-2:** tighter / slightly different palette or underground tiles if we load a second palette sheet; warp pipe exit
   - **1-3:** bridge + Bowser arena + axe; fewer Goombas OK
3. Object layer contract stays: `MarioSpawn`, `Enemy`, `Flagpole` / `WarpPipe`, `BowserSpawn`, `Axe`, `Bridge`.
4. Wire L1 `Pipe` objects to real pipe tiles + collision.

**Exit:** Screenshots of all three stages read as “NES Mario-like” without explaining placeholders.

---

### G3 — Sprites, anims, upgrades (2–3 days)

1. **Mario:** small walk/jump/die; **super** real frames (not scaled idle).
2. **Goomba:** walk flip + squash.
3. **Mushroom:** correct sprite + slide; grow/shrink keep existing physics guards.
4. **Bowser + axe:** recognisable frames; axe collect still collapses bridge.
5. Recalibrate Arcade bodies to sheet pixels (small ~12×16 visual footprint).
6. Optional stretch goal (only if time): one Koopa type — **not required** for G3 exit.

**Exit:** Walk / jump / stomp / grow / boss readable at 768×480; zero solid-colour box sprites.

---

### G4 — Audio & juice (1 day)

1. Keep SFX files; route **one** playback path (`SFXSynth` *or* Phaser sound — pick one, delete the dead preload).
2. Wire `playOneup` on 100-coin / 1-up mushroom if we add it.
3. Add `bump` (or keep stomp alias but document it).
4. Add **looping BGM** (overworld for 1-1/1-2, optional castle for 1-3); respect `farhan-muted`.
5. Flagpole / stage clear already have SFX — verify volumes.

**Exit:** Mute silences SFX + BGM; no unused `smb_1up` / double-load confusion.

---

### G5 — HUD + hosts polish (1 day)

1. Classic HUD columns: score / coins / `WORLD 1-x` / time (Press Start 2P).
2. Desktop window + Nokia LCD: letterbox with sky colour, not black voids.
3. Win → Hire Farhan → Contact still works.
4. Smoke: `node` script or short checklist for texture keys + map object types.

**Exit:** Side-by-side “looks like Mario before Phaser” pass on desktop; playable on phone.

---

## 6. Explicit non-goals

- Porting all SMB World 1–8 maps from TSR
- Fire Mario / star invincibility / multi-world save (unless requested after G5)
- Claiming official Nintendo branding
- Changing Nokia vs desktop host architecture
- Rewriting physics from scratch (keep stomp/grow fixes)

---

## 7. Suggested order

```
G0 legal + download sheets
  → G1 preload / atlases / kill broken keys
  → G2 Tiled rebind (1-1, 1-2, 1-3)
  → G3 Mario / Goomba / mushroom / Bowser anims
  → G4 audio path + BGM
  → G5 HUD + phone/desktop QA
```

**Effort:** ~7–12 focused days after sheets are in hand (art decision can add wait).

---

## 8. Confirmation needed from you

Reply with:

1. **Legal path:** A (original), B (fan sheets in repo), or C (hybrid)?
2. **Enemy scope:** Goomba + Bowser only for now, or add Koopa in G3?
3. **Power-ups:** Mushroom only (current), or also Fire Flower after sheets?

Once you confirm, implementation starts at **G0/G1** (no silent scraping into `public/` without that call).

---

## 9. Definition of done

- [ ] Three stages still: 1-1 → 1-2 → 1-3 with same win/hire flow  
- [ ] Real tileset + Mario/Goomba/items/Bowser/axe on disk and loaded  
- [ ] No missing texture keys; mushroom ≠ Mario idle; big Mario has walk frames  
- [ ] BGM + SFX mute-clean; single audio path  
- [ ] Maps denser / pipe wired; sky `#5C94FC` (or stage-appropriate palette)  
- [ ] `docs/game-asset-spec.md` exists  
- [ ] Desktop + Nokia playable; lint/build clean  
- [ ] This plan Status → **COMPLETE**
