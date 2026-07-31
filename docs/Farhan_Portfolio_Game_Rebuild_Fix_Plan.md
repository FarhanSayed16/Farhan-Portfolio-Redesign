# Farhan OS Game — Full Fix Plan (Assets, Physics, Level Geometry)

**Status:** IMPLEMENTED — all six tracks landed 2026-07-31 (see §6 for what shipped)
**Created:** 2026-07-31
**Scope:** `1-1` → `1-2` → `1-3` only. Branding stays Farhan / `WORLD 1-x`.
**Companions:** [`Farhan_Portfolio_Game_Asset_Upgrade_Plan.md`](./Farhan_Portfolio_Game_Asset_Upgrade_Plan.md) (asset sourcing), [`Farhan_Portfolio_Nostalgia_Fix_Plan.md`](./Farhan_Portfolio_Nostalgia_Fix_Plan.md) (art direction)

---

## 0. The one big discovery that changes everything

`originalassetsimages/tileset.png` has an **"Assembled Structures"** block at the bottom (y ≥ 595) containing complete, correctly-built objects on a plain background — pipes, castles, flagpole, coins, clouds, hills.

Every asset we've been hand-guessing or hand-painting already exists there, assembled and pixel-correct. All the current "low quality / not proper" complaints trace back to us cropping from the wrong part of the sheets (raw 16×16 tile grids, palette-reference swatches, dev cells) instead of this block.

**Verified exact bounding boxes** (flood-filled against the sheet background, confirmed visually):

| Asset | `left` | `top` | `w` | `h` | Notes |
|---|---|---|---|---|---|
| Pipe (upright, 2 tiles) | 112 | 624 | 32 | 64 | Rim + body, one piece — no stitching |
| Flagpole (full) | 0 | 608 | 16 | 168 | Ball on top + base block included |
| Castle (small) | 24 | 696 | 80 | 80 | End-of-level castle |
| Castle (big) | 400 | 600 | 144 | 176 | Optional, for 1-3 |
| Coin (single) | 563 | 654 | 10 | 14 | Real NES coin — replaces hand-painted one |
| Cloud | 624 | 608 | 48 | 24 | Complete, both ends closed |
| Hill (large) | 112 | 741 | 80 | 35 | Dark green with tufts |

Background key already handled by `isKey()` in `scripts/final-crop-originals.mjs` (light-blue cell `#b8b8f8`-ish + dark-blue page).

---

## 1. Broken now — evidence

### 1.1 Finish line / flagpole is garbage art (reported)
- `public/game/sprites/flagpole.png` is a **16×96 column of random brown/teal/orange blocks** — it is not a flagpole. Source crop `items.png @ (56,93) 8×48` lands on unrelated sheet content.
- `public/game/sprites/flag.png` is a few faint yellow specks.
- **No castle asset exists at all** — there is no `castle` key in `sheetKeys.ts`, so the end-of-level building can never render.
- Placement is also wrong: `Level1Scene.ts` draws the pole at `y + obj.height/2` with a 96px-tall texture against a **288px-tall** Tiled object, so it floats in mid-air at roughly a third of the intended height.

### 1.2 Pipe still not right (reported)
- Current `pipe.png` is a 64×96 **stitch of three separately-cropped strips**, which leaves black seam rows between segments and a hollow left gutter.
- It is also 96px tall against a **64×64** Tiled object box, so the pipe overshoots the tile grid.
- Fix is trivial once we use the assembled pipe at `(112,624) 32×64` — one crop, no stitching, no seams.

### 1.3 Bushes still look doubled / floating (reported)
Three separate causes stacked:
1. **`hill` and `bush` are the same green mound at similar sizes.** `hill` currently renders as a small mound inside a 160×48 frame (lots of empty padding, so it draws off-centre). Two near-identical green blobs at different parallax = "double bush".
2. **Hills still use `setScrollFactor(0.35)`** while bushes are at `1` — they slide across each other as you walk, which reads as duplicates appearing and merging.
3. **Scenery is placed on a fixed screen-space line** (`groundY = camera.height - 64`) at blind intervals, with **no check for pits**. Over a gap there is no ground under the bush, so it hangs in mid-air — exactly what's circled in the 1-2 screenshot.

### 1.4 Level 1-2 gap is unjumpable (reported)
Measured from the tilemaps and current physics:

| | Value |
|---|---|
| Gravity | 980 px/s² |
| Jump velocity | 480 (small) / 520 (super) |
| Air time | 0.98s (small) / 1.06s (super) |
| Walk speed | 160 px/s → **157px** of horizontal reach |
| Run speed (hold Shift) | 260 px/s → **255px** of reach |

Actual pit widths:

| Map | Pits | Verdict |
|---|---|---|
| `1-1` | 96px, **160px** | 160px pit is impossible while walking (157px reach) |
| `1-2` | **192px, 192px** | Impossible walking; only clears at full run with a perfect jump |
| `1-3` | 192px, **512px** | 512px is impossible by any means — see 1.5 |

So the gap isn't just "big", it is **unclearable unless the player knows to hold Shift**, and nothing in the game teaches that.

### 1.5 Level 1-3 is unwinnable (not yet reported — found during audit)
The `Bridge` object exists in `level_1_3.json` at `x=960, w=480`, but **nothing in the code ever builds it**. `Level3Scene.ts` only stashes it in the registry (line 80) to delete tiles later (line 125).

Consequence: the Ground layer has a **512px hole** at columns 30–45, and **Bowser spawns at x=1344 — inside that hole**. Bowser falls out of the world, and the player cannot reach the axe at x=1536. The boss level cannot be completed.

### 1.6 Coins still read as "II" (visible in screenshots)
The hand-painted `paintCoin()` frames use two vertical dark bars down the middle, which at 2× reads as a pause icon rather than a coin. The real coin art at `(563,654)` fixes this outright.

### 1.7 Cloud crop regressed
`cloud.png` currently contains **only the pale-blue shading arcs** — the white body was keyed out by the crop at `(56,56)`. The clouds still look correct in the screenshots only because the browser is serving a cached older PNG; the next hard refresh will show broken clouds.

---

## 2. Fix plan

### Track A — Rebuild the asset pack from "Assembled Structures"
**File:** `scripts/final-crop-originals.mjs`

1. Repoint these crops at the verified boxes in §0: `pipe`, `flagpole`, `castle`, `coin`, `cloud`, `hill`.
2. **Delete `paintCoin()` and `paintBush()`** — hand-painted stand-ins are no longer needed. Coin spin frames become horizontal squeezes of the real coin (100% / 60% / 20% / 60% width, centred), so no frame ever degenerates into a 2px bar.
3. **Delete `stitchV` usage for the pipe** — the assembled pipe is a single crop, which removes the seam rows.
4. Keep `trimPad` only for sprites that need a fixed canvas; never apply it to multi-part stitches (that is what introduced the pipe gaps).
5. Add `castle` to `src/phaser/assets/sheetKeys.ts` and to the preview list.
6. Extend `scripts/check-game-sprites.mjs` with a **content assertion**, not just a size check: assert each sprite's opaque-pixel ratio falls in an expected band and that its dominant hue matches expectation (pipe → green, castle → brown, coin → gold, cloud → white). This is what would have caught the garbage flagpole automatically.

**Exit:** contact sheet at `public/game/_preview/packed/` visually shows a correct pipe, flagpole, castle, coin, cloud, hill; `check-game-sprites` passes including hue assertions.

---

### Track B — Finish line: pole, flag, castle
**Files:** `Level1Scene.ts`, `Level2Scene.ts`, new `src/phaser/gameplay/placeFlagpole.ts`

1. New shared helper `placeFlagpole(scene, obj, nextScene)` that:
   - Draws the pole scaled to the **full Tiled object height** (288px), anchored bottom-centre on the ground — not centred at half height.
   - Adds the flag sprite as a child, parented to the pole.
   - Places the **castle** to the right of the pole, sitting on the ground line.
2. **Flag slide sequence** on touch: player snaps to the pole, flag tweens down, `playFlagpole()` fires, player walks right into the castle, then the scene advances. Right now it cuts straight to the next scene with no feedback.
3. Level 1-2's `WarpPipe` ending stays as-is (stand on top + press ↓), but gets an on-screen hint the first time the player stands on it.

**Exit:** reaching the end of 1-1 shows pole + flag sliding + castle, then advances.

---

### Track C — Scenery placement (kills the floating/doubled bushes)
**File:** `src/phaser/scenes/BaseLevel.ts` → `addScenery()`

1. **Derive the ground line from the tilemap, not the camera.** Pass `groundLayer` in and, for each candidate x, look up the topmost solid tile. If the column is a pit, **skip placement entirely**.
2. **Give hills and bushes distinct silhouettes and depths:** hill = large (160×80) dark-green mound, `depth 0`, `scrollFactor 0.5`; bush = small bright mound, `depth 1`, `scrollFactor 1` (world-locked). Never place a bush within 96px of a hill's footprint.
3. **Deterministic, spaced layout** rather than fixed modulo intervals, so decorations don't line up with pipes, blocks, or the flagpole.
4. Same treatment for clouds: keep parallax, but seed positions so they don't stack.

**Exit:** walking the full length of 1-1 and 1-2 shows no bush over a pit, no bush overlapping a hill, and no visual duplication while scrolling.

---

### Track D — Jumpable level geometry
**Files:** `public/game/maps/level_1_1.json`, `level_1_2.json`, `level_1_3.json`, `src/phaser/sprites/Player.ts`

1. **Build the missing bridge in 1-3.** Fill the Ground layer across the `Bridge` object span so Bowser and the player have a floor. Keep the win-time tile removal (that's the bridge-collapse effect) — it will finally have something to remove.
2. **Narrow the pits** to a walking-clearable width: max **128px (4 tiles)**. Applies to the 160px pit in 1-1 and both 192px pits in 1-2.
3. **Raise the physics ceiling a little** so a running jump has genuine margin rather than being frame-perfect: jump velocity 480 → **520 small / 560 super**. That lifts running reach to ~300px and walking reach to ~185px.
4. **Teach the run key.** A one-time toast on 1-1 ("Hold SHIFT to run") the first time the player approaches a pit — reuses the toast system already built in Track F.
5. Re-verify every pit against measured reach with a small assertion script so future map edits can't silently create an impossible gap.

**Exit:** all three levels completable end-to-end without running (except where intentionally challenging), and 1-3 reaches Bowser and the axe.

---

### Track E — Pipe placement correctness
**File:** `src/phaser/gameplay/placePipe.ts`

1. With the 64×64 assembled pipe, the sprite finally matches the Tiled object box — remove the ad-hoc `displayHeight` maths.
2. Collider = 56×60 anchored to the visible pixels, bottom-aligned to the ground line.
3. Support taller pipes by **repeating the body section** rather than scaling, so proportions stay NES-correct.

**Exit:** player stands on, jumps over, and cannot clip through any pipe in 1-1/1-2.

---

### Track F — Remaining polish
1. Sprite-edge audit: several Mario frames still carry a stray pixel from the neighbouring sheet cell. Tighten crops using the same flood-fill bbox technique used in §0.
2. `GameOverScene` currently offers only Retry — add "Back to menu".
3. Confirm the toast timing (2s) reads comfortably on the Nokia `PhoneGame` viewport, where it is much smaller.

---

## 3. Suggested order

| # | Track | Why this order | Risk |
|---|---|---|---|
| 1 | A — asset pack | Everything else renders these sprites | Low — script-only, verifiable offline |
| 2 | E — pipe placement | Trivial once A lands | Low |
| 3 | D — level geometry | Unblocks 1-3 entirely; biggest gameplay win | Medium — hand-editing tilemap JSON |
| 4 | C — scenery | Pure placement logic | Low |
| 5 | B — finish line | Largest new code surface | Medium |
| 6 | F — polish | Cosmetic tail | Low |

---

## 4. Acceptance criteria

- [ ] 1-1 playable start → flagpole → flag slides → castle → 1-2
- [ ] 1-2 playable start → warp pipe → 1-3, every pit clearable
- [ ] 1-3 has a solid bridge, Bowser stays on it, axe reachable, bridge collapses on win
- [ ] No bush floating over a pit; no hill/bush overlap; no duplicate-looking scenery
- [ ] Pipe: standable, jumpable, no seams, matches the 64×64 tile box
- [ ] Coin reads as a spinning coin at every animation frame
- [ ] `check-game-sprites` passes size **and** hue/coverage assertions
- [ ] `npx tsc --noEmit` clean

---

## 6. What shipped

### 6.1 The bigger root cause, found during Track A

`crop()` in `final-crop-originals.mjs` treated **every pure-black pixel as background** and
made it transparent. No sheet actually uses a black background — every one of them keys on
dark blue `rgb(0,41,140)` — so black is the **outline colour**. The cropper had been silently
deleting the outlines out of every sprite in the pack: ~39k pixels on `tileset.png` alone,
12k on `mario.png`, 10k on `enemies.png`.

This is the single largest reason everything "felt low quality". Bricks had no mortar, pipes
had no rim edge, Mario had no outline. Removing the black key fixed the entire pack at once.

### 6.2 Track-by-track

| Track | Result |
|---|---|
| A — assets | Repointed pipe/flagpole/castle/coin/cloud/hill/bush at the Assembled Structures boxes; deleted `paintCoin`/`paintBush`/`stitchV`/`toOverworldGreen`; dropped the black key |
| B — finish line | New `placeFlagpole.ts`: pole anchored to the ground, flag slides down, castle placed, then the scene advances |
| C — scenery | Ground line read from the tilemap bottom-up, pits skipped, parallax removed everywhere, hill/bush separation, keep-clear zones around pipes and the flagpole, negative depths so scenery sits behind the tilemap |
| D — geometry | 1-3 bridge built (cols 30–45, row 13); all pits narrowed to 128px; jump 480→520 / 520→560; enemy moved off a widened pit |
| E — pipe | `placePipe` uses `staticImage` + `refreshBody`; warp fires from the collider callback with a one-time hint toast |
| F — polish | `MENU` button on the game-over screen; removed the duplicate `coin_spin1` that stuttered the spin loop; purged ~60 stale debug PNGs from `public/` |

### 6.3 Checks left behind

| Command | Guards |
|---|---|
| `npm run check:game` | Sprite size **and** coverage/dominant-hue — this is what would have caught the garbage flagpole |
| `node scripts/check-level-geometry.mjs` | No pit wider than walking reach; no object spawned over a void (this is what caught Bowser being in the hole) |
| `npm run preview:level level_1_1` | Renders a level to PNG using the scene's own placement rules, so scenery/pipe/flagpole positions can be checked without booting the game |

### 6.4 Deliberately not done

- **Taller pipes via body repetition** (Track E item 3). Every pipe in every current map is a
  64×64 Tiled box, so there is nothing to repeat. `pipe_top` / `pipe_body` are exported and
  ready if a taller pipe is ever placed.
- **The "hold SHIFT to run" hint** (Track D item 4). Once the pits were 128px, a walking jump
  clears them with ~40px to spare, so the hint had nothing to teach.
- **The 1-3 bridge uses ground tiles, not the bridge sprite.** It is solid, collapses on the
  axe as intended, and reads fine; swapping in the striped bridge art from `(183,601)` is
  cosmetic and can come later.

---

## 5. Notes

- Nintendo owns Super Mario Bros. — this is a portfolio demo only; `public/game/LEGAL-NOTE.md` applies unchanged.
- Do not commit until explicitly asked.
- Asset regeneration: `npm run gen:game-assets` (`scripts/final-crop-originals.mjs`), smoke: `node scripts/check-game-sprites.mjs`.
- Browser aggressively caches `public/game/sprites/*.png` — always hard-refresh when verifying art changes, otherwise you are grading stale PNGs.
