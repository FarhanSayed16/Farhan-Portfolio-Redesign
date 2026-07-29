# Game assets — manual download guide

Spriters Resource blocks automated download (Cloudflare). **You** download the sheets once; drop them in the folders below; tell me when they’re in place and I’ll crop, wire, and replace the current recreations.

Do this on a normal browser (Chrome/Edge), logged in if the site asks.

---

## 1. Create these folders (if missing)

```
public/game/_raw/
public/game/audio/
```

---

## 2. Sprite sheets (required)

Open each link → click **Download this Sheet** → save with the **exact filename** into `public/game/_raw/`.

| Save as | What it is | Download page |
|---------|------------|---------------|
| `mario.png` | Small + Super + Fire Mario frames | https://www.spriters-resource.com/nes/supermariobros/sheet/50365/ |
| `enemies.png` | Goomba, Koopa, Bowser, etc. | https://www.spriters-resource.com/nes/supermariobros/sheet/52570/ |
| `tileset.png` | Ground, brick, pipes, castle tiles | https://www.spriters-resource.com/nes/supermariobros/sheet/52571/ |
| `items.png` | Coin, mushroom, fire flower, axe, flag, fireball | https://www.spriters-resource.com/nes/supermariobros/sheet/52569/ |
| `blocks.png` | ? / brick block variants (backup for tiles) | https://www.spriters-resource.com/nes/supermariobros/sheet/65962/ |
| `hills.png` | Overworld hills / mountains | https://www.spriters-resource.com/nes/supermariobros/sheet/164123/ |
| `bushes.png` | Bushes / trees | https://www.spriters-resource.com/nes/supermariobros/sheet/164124/ |
| `clouds.png` | Clouds | https://www.spriters-resource.com/nes/supermariobros/sheet/164125/ |

### Checklist

- [ ] `public/game/_raw/mario.png`
- [ ] `public/game/_raw/enemies.png`
- [ ] `public/game/_raw/tileset.png`
- [ ] `public/game/_raw/items.png`
- [ ] `public/game/_raw/blocks.png`
- [ ] `public/game/_raw/hills.png`
- [ ] `public/game/_raw/bushes.png`
- [ ] `public/game/_raw/clouds.png`

**Format:** PNG only. Don’t rename to `.jpg`. Don’t crop yet — full sheet is fine.

---

## 3. Backup source (if a TSR page fails)

Same game, alternate hub (browse and download matching sheets):

- https://www.mariouniverse.com/sprites-nes-smb/

Still save into `public/game/_raw/` using the **same filenames** as the table above (`mario.png`, `enemies.png`, …).

---

## 4. Music (BGM) — required for “exact” feel

SFX you already have under `public/sounds/smb_*.mp3`. We still need **looping stage music**.

### Option A — Sounds Resource (same site family as Spriters)

1. Open: https://www.sounds-resource.com/nes/supermariobros/
2. Download the **Overworld** / main theme loop (and **Castle** / underground-castle theme if listed separately).
3. Convert to WAV or OGG if needed (Audacity: File → Export).
4. Save as:

| Save as | Use |
|---------|-----|
| `public/game/audio/overworld.wav` (or `.ogg` / `.mp3`) | Levels 1-1, 1-2 |
| `public/game/audio/castle.wav` (or `.ogg` / `.mp3`) | Level 1-3 |

### Option B — any fan SMB overworld + castle loop

As long as filenames match (or you tell me the exact names), I can wire them.

### Checklist

- [ ] `public/game/audio/overworld.*`
- [ ] `public/game/audio/castle.*`

---

## 5. Optional (nice to have, not blocking)

| Save as | Source | Why |
|---------|--------|-----|
| `public/game/_raw/hud.png` | https://www.spriters-resource.com/nes/supermariobros/sheet/56929/ | Title / HUD numerals if we polish the score bar |
| Keep existing | `public/sounds/smb_jump.mp3`, `smb_coin.mp3`, `smb_mariodie.mp3`, `smb_stomp.mp3`, `smb_powerup.mp3`, `smb_1up.mp3`, `smb_stage_clear.mp3` | Already in the repo — don’t replace unless you have better rips |

---

## 6. When you’re done

1. Confirm the checklist folders look like:

```
public/game/_raw/
  mario.png
  enemies.png
  tileset.png
  items.png
  blocks.png
  hills.png
  bushes.png
  clouds.png
  (hud.png optional)

public/game/audio/
  overworld.wav   (or .ogg / .mp3)
  castle.wav      (or .ogg / .mp3)
```

2. Message me: **“raw sheets are in place”** (and note audio format if not `.wav`).

3. I will:
   - Crop frames from your sheets into the Phaser keys
   - Replace the current generated PNGs
   - Point BGM at your real loops
   - Smoke-test 1-1 → 1-2 → 1-3

---

## 7. Legal reminder (short)

These are Nintendo IP fan dumps. Fine for a local portfolio demo if you accept takedown risk. Don’t claim the game is official Mario. See `public/game/LEGAL-NOTE.md`.

---

## Quick links (all sheets)

1. Mario — https://www.spriters-resource.com/nes/supermariobros/sheet/50365/  
2. Enemies — https://www.spriters-resource.com/nes/supermariobros/sheet/52570/  
3. Tileset — https://www.spriters-resource.com/nes/supermariobros/sheet/52571/  
4. Items — https://www.spriters-resource.com/nes/supermariobros/sheet/52569/  
5. Blocks — https://www.spriters-resource.com/nes/supermariobros/sheet/65962/  
6. Hills — https://www.spriters-resource.com/nes/supermariobros/sheet/164123/  
7. Bushes — https://www.spriters-resource.com/nes/supermariobros/sheet/164124/  
8. Clouds — https://www.spriters-resource.com/nes/supermariobros/sheet/164125/  
9. Sounds — https://www.sounds-resource.com/nes/supermariobros/  
10. Game index — https://www.spriters-resource.com/nes/supermariobros/
