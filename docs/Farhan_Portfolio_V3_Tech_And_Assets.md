# FARHAN SAYED — PORTFOLIO V3
# Technical Stack + Asset Requirements
### "Farhan's World" — Complete Reference for Antigravity
**farhanbuilds.in · Version 1.0**

---

## HOW TO READ THIS DOCUMENT

This document has three parts:

- **Part 1** — Full technical stack. Every package, every tool, why it's chosen.
- **Part 2** — Every single asset this project needs, where to get it, and what the placeholder is until the real one arrives.
- **Part 3** — Handoff schedule. What Farhan provides, when, and in what format.

The golden rule: **nothing in development should ever be blocked by a missing asset.** Every asset has a placeholder so Antigravity can build and test with real layout and real logic. Farhan drops in the real assets when ready and the project updates automatically.

---

---

# PART 1 — FULL TECHNICAL STACK

---

## 1.1 CORE FRAMEWORK

### Next.js 15 (App Router)
```
Package:   next@15
Why:       - App Router enables per-route code splitting
           - Dynamic imports let us load Phaser only when game opens
           - Built-in image optimization (next/image) for project screenshots
           - next/font for zero-layout-shift font loading
           - Vercel deployment is first-class, zero config
           - Already set up in the existing project
```

### React 19
```
Package:   react@19, react-dom@19
Why:       - Concurrent features for smoother OS window interactions
           - Already installed
```

### TypeScript 5
```
Package:   typescript@5
Config:    tsconfig.json — strict mode ON
Why:       - Phaser.js has full TS types
           - Window state management is complex; types prevent bugs
           - Game event bridge between Phaser and React must be typed
```

---

## 1.2 STYLING

### Tailwind CSS 3
```
Package:   tailwindcss@3, postcss, autoprefixer
Why:       - Utility-first; OS components need precise pixel sizing
           - JIT mode handles dynamic values like window dimensions
           - Already installed
Config additions needed:
  - Add 'Press Start 2P' to font family config
  - Add custom colors for OS palette (--bg, --surface, --cyan etc.)
  - Add 'scanlines' animation keyframe
  - Add 'float' animation keyframe (Nokia 3D decoratives)
```

### CSS Custom Properties (Design Tokens)
```
Location:  src/app/globals.css
Tokens:
  --os-bg:          #0A0A1A   (desktop background)
  --os-taskbar:     #1A1A2E   (taskbar)
  --os-window:      #16213E   (window chrome)
  --os-window-body: #0D1B2A   (window content area)
  --os-title-active: linear-gradient(90deg, #00D4FF, #7B2FFF)
  --os-title-inactive: #3a3a5a
  --os-border:      #2a3a5a
  --os-button:      #1e2d45
  --os-button-hover:#2a3f60
  --cyan:           #00D4FF
  --violet:         #7B2FFF
  --gold:           #F5C542
  --text:           #E8F4F8
  --text-muted:     #8899AA
  --nokia-green:    #7FBF00   (phone screen tint)
  --nokia-body:     #3a3a3a   (phone plastic)
  --nokia-screen:   #9BAF9B   (unlit screen color)
```

### CSS Modules
```
Where used:  OS window chrome, Nokia phone frame, game overlay
Why:         Some components need scoped styles that Tailwind can't
             express cleanly (e.g., window resize handles, scanline
             pseudo-elements, pixel-perfect phone borders)
```

---

## 1.3 ANIMATION

### Framer Motion
```
Package:   framer-motion@12 (already installed)
Used for:
  - Window open animation: scale(0.95)→scale(1) + fade in, 120ms
  - Window close animation: scale(1)→scale(0.95) + fade out, 100ms
  - Window minimize: slide down to taskbar position
  - Boot screen sequence: coordinated text reveals
  - Nokia screen transitions: slide left/right between menu screens
  - Game overlay popup: scale in from center
  - Tablet choice screen: fade in
NOT used for:
  - Game physics (Phaser handles that)
  - Scroll (no scroll in this project)
  - Nokia button press (CSS only)
```

### CSS Animations (native, no library)
```
Used for:
  - Boot screen typewriter effect
  - Nokia scanlines overlay (repeating gradient + opacity)
  - Nokia screen glow pulse (box-shadow animation)
  - Desktop wallpaper subtle movement (very slow pan)
  - Taskbar clock update (no animation needed, just setInterval)
  - "Farhan's World.exe" icon — pixel art shimmer on hover
  - Recycle Bin icon — wobble on hover
```

---

## 1.4 GAME ENGINE

### Phaser.js 3
```
Package:   phaser@3 (latest stable — currently 3.87.0)
           (no @types/phaser needed — Phaser 3.60+ includes TS types)
Why:       - Industry standard HTML5 game framework
           - Arcade Physics perfectly replicates SMB jump arc
           - Built-in tilemap loader (reads Tiled JSON directly)
           - Sprite animation system handles all Mario frame sequences
           - Scene system maps 1:1 with our 3 levels + WinScene
           - Canvas renderer (not WebGL) — simpler, wider compatibility
           - Runs in a sandboxed canvas — zero interference with React

Renderer:  Phaser.AUTO (tries WebGL, falls back to Canvas)
           For pixel art: pixelArt: true in game config (disables
           antialiasing — sprites stay crisp at any scale)

Config:
  width:        768     (classic NES aspect ratio scaled)
  height:       480
  pixelArt:     true    (critical — without this Mario looks blurry)
  backgroundColor: '#5C94FC'  (original SMB sky blue)
  physics:
    default:    'arcade'
    arcade:
      gravity:  { y: 980 }   (tuned to match original SMB feel)
      debug:    false

Loading:   Dynamic import only — Phaser is NOT in the main bundle.
           Loaded only when user opens "Farhan's World.exe" window.
```

```typescript
// Dynamic import pattern (prevents Phaser from bloating initial load)
const openGame = async () => {
  const { default: initGame } = await import('../game/phaser/main');
  initGame(containerRef.current);
};
```

### Tiled Map Editor (external tool, not an npm package)
```
Download:  mapeditor.org (free, open source)
Used by:   Antigravity to design the 3 level layouts
Output:    JSON tilemap files → saved to public/game/maps/
           - level_1_1.json
           - level_1_2.json
           - level_1_3.json
Phaser reads these directly with:
  this.make.tilemap({ key: 'level_1_1' })
```

---

## 1.5 AUDIO

### Howler.js
```
Package:   howler@2
Used for:  Loading and playing CC0 background music files
           (the .ogg/.mp3 chiptune tracks from opengameart.org)
Why:       - Best-in-class web audio library
           - Handles autoplay policy gracefully
           - Sprite support (multiple sounds in one file)
           - Fade in/out for music transitions between levels
           - Volume control API
```

### Web Audio API (native browser, no package)
```
Used for:  All game SFX — synthesized procedurally
           Zero files needed. Zero copyright risk.
Sounds to synthesize:
  - Jump          (square wave, 300→600 Hz, 0.1s)
  - Coin collect  (sine wave, 800→1200 Hz, 0.08s)
  - Block hit     (square wave, 200 Hz, 0.05s burst)
  - Enemy stomp   (square wave, 150→100 Hz, 0.1s)
  - Powerup grab  (sine arpeggio: 400→500→600→800 Hz)
  - Mario die     (descending square wave sweep)
  - Flagpole      (ascending sine scale)
  - Game over     (slow descending tritone, square wave)
  - Boss roar     (low square wave pulse, 80 Hz, 0.3s)

Implementation:
  src/game/phaser/audio/SFXSynth.ts
  — exports individual play functions
  — AudioContext created once, reused
  — Triggered by Phaser scene events
```

---

## 1.6 STATE MANAGEMENT

### React Context + useReducer
```
No external library (Zustand/Redux not needed at this scale)

WindowContext  — manages all OS window instances
  State shape:
    windows: WindowState[]        (all open windows)
    activeWindowId: string | null (which window has focus)
  Actions:
    OPEN_WINDOW   (id, component, title, defaultSize, defaultPos)
    CLOSE_WINDOW  (id)
    MINIMIZE_WINDOW (id)
    MAXIMIZE_WINDOW (id)
    RESTORE_WINDOW  (id)
    FOCUS_WINDOW    (id)          → bumps zIndex
    MOVE_WINDOW     (id, x, y)
    RESIZE_WINDOW   (id, w, h)

PhoneContext  — manages Nokia navigation state
  State shape:
    currentScreen: ScreenName
    screenHistory: ScreenName[]   (for Back button)
    selectedIndex: number         (highlighted menu item)
  Actions:
    NAVIGATE_TO   (screen)
    GO_BACK
    SELECT_ITEM   (index)
    MOVE_CURSOR   (direction: 'up' | 'down')
```

---

## 1.7 UTILITY PACKAGES

### Custom Hooks (no external package)
```
useDraggable.ts
  — mousedown on window title bar → tracks delta → updates window position
  — Touch events supported (for tablet desktop mode)
  — Bounds checking (window can't be dragged off screen)

useResizable.ts
  — mousedown on resize handle → tracks delta → updates window size
  — Min size enforced (280×200px per window)

useLocalStorage.ts
  — Persists tablet mode choice (desktop vs phone)
  — Persists window positions between sessions (optional, nice touch)

useDeviceMode.ts
  — Returns 'desktop' | 'mobile' | 'tablet'
  — Uses window.innerWidth + checks touch capability
  — Listens to resize events

useClock.ts
  — Returns current time as string, updates every second
  — Used in OS taskbar system tray
```

### EmailJS
```
Package:   @emailjs/browser@4
Used for:  Contact window email form (no backend needed)
Config:    NEXT_PUBLIC_EMAILJS_SERVICE_ID
           NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
           NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
           — all in .env.local, never committed to git
Alternative: Resend API (if Farhan prefers backend route via Next.js API route)
```

---

## 1.8 FONTS

All loaded via `next/font/google` — zero layout shift, optimal loading.

```typescript
// src/app/layout.tsx
import { Space_Grotesk, JetBrains_Mono, Press_Start_2P } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  variable: '--font-pixel',
  weight: ['400'],   // Only one weight available
});
```

| Font | Variable | Used For |
|------|----------|----------|
| Space Grotesk | `--font-body` | Window content, menus, all readable text |
| JetBrains Mono | `--font-mono` | Notepad windows, terminal-style, README.txt |
| Press Start 2P | `--font-pixel` | OS labels, game HUD, Nokia screen, boot text |

---

## 1.9 ICONS

```
Lucide React (already installed)
  Used for:  General UI icons inside windows
             (folder, file, close X, minimize, maximize, arrow icons)
             NOT used for desktop icons (those are custom pixel art)

Custom Pixel SVGs (Antigravity builds these)
  Used for:  The desktop icon set (see Part 2 — Asset List)
```

---

## 1.10 DEVELOPMENT TOOLING

```
ESLint          — next/core-web-vitals config (already set up)
Prettier        — formatting (add if not already configured)
next/bundle-analyzer — verify Phaser stays out of initial bundle
  Package: @next/bundle-analyzer

.env.local      — EmailJS keys (never committed)
.env.example    — Template file committed to repo showing which
                  env vars are needed (with placeholder values)
```

---

## 1.11 DEPLOYMENT

```
Platform:    Vercel (free tier sufficient)
Domain:      farhanbuilds.in (already owned — point to Vercel)
DNS:         Add CNAME record in domain registrar → cname.vercel-dns.com
Environment: Add EmailJS env vars in Vercel project settings

Build command:   next build
Output:          .next/
Vercel settings: Framework preset = Next.js (auto-detected)

Performance:
  next/image for all project screenshots (auto WebP conversion)
  Dynamic import for Phaser (keeps initial bundle small)
  next/font for zero-CLS font loading
  Static generation for non-dynamic content
```

---

## 1.12 COMPLETE PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.0.0",
    "phaser": "^3.87.0",
    "howler": "^2.2.4",
    "@emailjs/browser": "^4.0.0",
    "lucide-react": "^0.577.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/howler": "^2.2.11",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0",
    "@next/bundle-analyzer": "^15.0.0"
  }
}
```

**Total runtime packages: 9**
**No bloated dependencies. No UI component libraries. All custom.**

---

---

# PART 2 — EVERY ASSET THIS PROJECT NEEDS

## Asset Status Legend
```
🔴 FARHAN PROVIDES    — must come from Farhan (personal/unique content)
🟡 DOWNLOAD/SOURCE    — Antigravity downloads from a specific URL
🟢 ANTIGRAVITY BUILDS — Antigravity creates this themselves (code/design)
⚪ PLACEHOLDER READY  — placeholder exists, real asset drops in later
```

---

## 2.1 GAME ASSETS — SPRITES

All sourced from **spriters-resource.com** (fan-use for non-commercial portfolios).
Navigate to: `The Spriters Resource → NES → Super Mario Bros.`

---

### SPRITE SHEET 1 — Mario Character
```
Status:      🟡 DOWNLOAD
Source:      spriters-resource.com → NES → Super Mario Bros → "Mario"
File:        mario_sprites.png  (sprite sheet)
Contains:
  Small Mario:    Stand, Walk (2 frames), Jump, Die
  Super Mario:    Stand, Walk (2 frames), Jump, Duck
  Fire Mario:     Stand, Walk (2 frames), Jump, Duck, Throw
Save to:     /public/game/sprites/mario_sprites.png

Phaser animation config (Antigravity writes this):
  'mario-walk':  frames [1,2,3], frameRate: 10, repeat: -1
  'mario-jump':  frames [4],     frameRate: 1
  'mario-stand': frames [0],     frameRate: 1
  'mario-die':   frames [5],     frameRate: 1
```

### SPRITE SHEET 2 — Enemies
```
Status:      🟡 DOWNLOAD
Source:      spriters-resource.com → same game → "Enemies"
File:        enemies_sprites.png
Contains:    Goomba (walk 2 frames, squish), Koopa (walk, shell),
             Bowser (walk 2 frames, fire), Piranha Plant
Save to:     /public/game/sprites/enemies_sprites.png
```

### SPRITE SHEET 3 — Items & Power-ups
```
Status:      🟡 DOWNLOAD
Source:      spriters-resource.com → same game → "Items"
File:        items_sprites.png
Contains:    Coin (4 frame spin animation), Mushroom,
             Fire Flower, Super Star (4 frame spin),
             1-Up Mushroom
Save to:     /public/game/sprites/items_sprites.png
```

### SPRITE SHEET 4 — Tiles & Environment
```
Status:      🟡 DOWNLOAD
Source:      spriters-resource.com → same game → "Tiles" or "Backgrounds"
File:        tiles_sprites.png
Contains:
  Overworld:  Ground tiles, brick blocks, question blocks (3 frame anim),
              empty block, pipes (top+body), clouds, bushes, hills,
              castle graphic, flagpole + flag
  Underground: Dark bricks, ceiling tiles, different pipe colors
  Castle:      Castle wall tiles, lava tiles, lava bubbles, bridge,
               chain, axe, Bowser's bridge platform
Save to:     /public/game/sprites/tiles_sprites.png
```

### SPRITE SHEET 5 — HUD / UI Elements
```
Status:      🟡 DOWNLOAD
Source:      spriters-resource.com → same game → "HUD" or extract manually
File:        hud_sprites.png
Contains:    Coin icon (small, for HUD), heart/life icon
             Number font sprites (0-9) for score display
Save to:     /public/game/sprites/hud_sprites.png
Note:        The HUD text ("FARHAN", "SCORE", "WORLD", "TIME") is
             rendered using Press Start 2P CSS font — not sprites
```

---

## 2.2 GAME ASSETS — TILEMAPS

These are NOT downloaded — Antigravity builds them using Tiled Map Editor.

### TILEMAP 1 — Level 1-1 (Overworld)
```
Status:      🟢 ANTIGRAVITY BUILDS
Tool:        Tiled Map Editor (mapeditor.org — free)
Reference:   The original SMB World 1-1 layout is publicly documented.
             Search: "Super Mario Bros 1-1 level map" for full layout image.
             The exact layout is well-known (first pipe at tile X=28, etc.)
Output:      /public/game/maps/level_1_1.json
Layers:
  - Background (sky, hills, clouds — parallax layer)
  - Ground (collision)
  - Objects (pipes, bricks, question blocks — placed as Tiled objects)
  - Enemy spawns (Tiled object layer — Phaser reads spawn points)
```

### TILEMAP 2 — Level 1-2 (Underground)
```
Status:      🟢 ANTIGRAVITY BUILDS
Reference:   SMB World 1-2 layout (also publicly documented)
Output:      /public/game/maps/level_1_2.json
Special:     Warp Zone at the end (pipes leading to 1-3)
             — triggers "Warp Zone!" overlay
```

### TILEMAP 3 — Level 1-3 (Castle / Bowser)
```
Status:      🟢 ANTIGRAVITY BUILDS
Reference:   SMB World 1-3 castle layout
Output:      /public/game/maps/level_1_3.json
Special:     Bowser spawn point, axe position, bridge tiles,
             lava layer — all placed as Tiled objects
```

---

## 2.3 GAME ASSETS — AUDIO

### Background Music (BGM)
```
Status:      🟡 DOWNLOAD (CC0 licensed — free + safe)
Source:      opengameart.org
Search:      "mario platformer chiptune" or "8bit overworld music"
Filter by:   CC0 license (public domain — zero restrictions)

Recommended search terms on opengameart.org:
  → "chiptune overworld loop"    for Level 1-1
  → "underground chiptune loop"  for Level 1-2
  → "castle chiptune loop"       for Level 1-3
  → "victory chiptune"           for Win scene

Format needed: .ogg (primary) + .mp3 (fallback) — both formats
               Howler.js loads whichever format browser supports
Save to:
  /public/game/audio/bgm_overworld.ogg + .mp3
  /public/game/audio/bgm_underground.ogg + .mp3
  /public/game/audio/bgm_castle.ogg + .mp3
  /public/game/audio/bgm_victory.ogg + .mp3
  /public/game/audio/bgm_gameover.ogg + .mp3

Conversion tool: Use cloudconvert.com (free) to convert any MP3 to OGG
```

### Sound Effects (SFX)
```
Status:      🟢 ANTIGRAVITY BUILDS (synthesized — no file needed)
Tool:        Web Audio API — native browser, zero packages
File:        src/game/phaser/audio/SFXSynth.ts

All SFX synthesized as square/sine/triangle waves:
  playJump()        square wave, 300→600 Hz, 0.09s
  playCoin()        sine wave,   800→1200 Hz, 0.07s
  playBlockHit()    square wave, 220 Hz, burst 0.05s
  playStomp()       square wave, 150→80 Hz, 0.1s
  playPowerup()     sine arpeggio, 400→800 Hz sweep, 0.3s
  playFireFlower()  sine chord, 600+800 Hz, 0.2s
  play1Up()         sine arpeggio, major 6th interval, 0.3s
  playMarioDie()    descending square sweep, 400→50 Hz, 0.8s
  playGameOver()    tritone descent, square, 0.6s
  playFlagpole()    ascending sine scale, 0.4s
  playBowserRoar()  low square pulse, 80 Hz + noise, 0.3s
  playBossDie()     explosion-type noise burst, 0.5s
```

---

## 2.4 DESKTOP OS ASSETS — ICONS

The OS needs pixel art icons for the desktop. These are SVG files built by Antigravity.
Pixel art style: 48×48px canvas, 4px grid (so effectively 12×12 pixel art scaled up).

### Desktop Icon Set (Antigravity builds all of these)
```
Status:      🟢 ANTIGRAVITY BUILDS
Format:      SVG (scalable, crisp at any DPI)
Save to:     /public/icons/
Style:       Dark background (#1a1a2e), cyan accents (#00D4FF),
             pixel art aesthetic, 48×48 viewBox

Icon list:
  folder.svg          — projects folder (golden pixel folder)
  pdf.svg             — resume (white page, red PDF badge)
  notepad.svg         — about me / readme (white lines on dark bg)
  zip.svg             — achievements (folder with zipper)
  timeline.svg        — experience (vertical dots and lines)
  skills_exe.svg      — brain pixel art or circuit board
  game_exe.svg        — Mario mushroom pixel art (iconic)
  browser_exe.svg     — retro monitor with "www" on screen
  contact_lnk.svg     — pixel envelope / @ symbol
  recycle_bin.svg     — classic bin with arrows (pixel style)
  system_info.svg     — computer chip / gear pixel art
  readme_txt.svg      — page with "!" pixel art
  farhanbuilds.svg    — small "FB" monogram pixel art (favicon too)
```

### Favicon
```
Status:      🟢 ANTIGRAVITY BUILDS (derived from game_exe.svg)
Files:       /public/favicon.ico        (16x16, 32x32 multi-size)
             /public/favicon.svg        (modern browsers)
             /public/apple-touch-icon.png (180x180)
Design:      Pixel art Mario mushroom or "F" monogram in pixel style
```

---

## 2.5 DESKTOP OS ASSETS — WALLPAPER

```
Status:      🟢 ANTIGRAVITY BUILDS (pure CSS + SVG — no image file)

Design:      Dark navy (#0A0A1A) base
             Subtle pixel grid overlay (1px lines every 32px, 5% opacity)
             "farhanbuilds.in" watermark bottom-right (Press Start 2P,
             very faint, 10% opacity)
             Optional: static pixel art silhouette of Mumbai skyline
             at very bottom (pure SVG, can be inline in CSS)

Implementation:
  CSS background-image: 
    linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
  background-size: 32px 32px

  No external image file needed — entirely CSS.
```

---

## 2.6 DESKTOP OS ASSETS — BOOT SCREEN

```
Status:      🟢 ANTIGRAVITY BUILDS (pure CSS + JS animation)
No images needed. Entirely text-based, typewriter effect.
Font: Press Start 2P (already loaded)
```

---

## 2.7 MOBILE — NOKIA PHONE FRAME

```
Status:      🟢 ANTIGRAVITY BUILDS
Format:      SVG (inline, embedded in PhoneFrame.tsx component)
             NOT an external image file — built as React SVG component

The phone SVG includes:
  - Phone body (rounded rect, dark gray #2a2a2a)
  - Speaker grille (top, pixel dots)
  - Screen bezel (raised rectangle)
  - Screen area (the actual <div> with content sits here via
    CSS position:absolute overlay, not inside the SVG)
  - Nokia logo text (pixel font)
  - Navigation cluster (circle with 4 arrows + center button)
  - Soft key buttons (two rectangles below nav)
  - Number pad (12 buttons: 1-9, *, 0, #)
  - Phone body details (side buttons, bottom connector)
  - Subtle plastic texture (CSS radial gradients)

Screen overlay CSS (the green tint + scanlines):
  .phone-screen {
    background: #9BAF9B;
    filter: contrast(1.1) brightness(0.95);
    position: relative;
  }
  .phone-screen::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0,0,0,0.08) 2px,
      rgba(0,0,0,0.08) 3px
    );
    pointer-events: none;
  }
```

---

## 2.8 FARHAN'S PERSONAL ASSETS — PROFILE PHOTO

```
Status:      🔴 FARHAN PROVIDES
File:        /public/images/farhan.jpg
Used in:     OS → About Me window (optional photo display)
             OS → Start Menu (avatar next to name)
             Nokia → Profile screen (small avatar)

Requirements:
  Format:    JPG or PNG
  Size:      Minimum 400×400px (will be displayed at 120×120px max)
  Style:     Clean background preferred (dark background ideal —
             matches OS theme naturally)
  Framing:   Portrait or square crop works fine

Placeholder until Farhan provides photo:
  A CSS-only avatar: circle with "FS" initials
  background: linear-gradient(135deg, #00D4FF, #7B2FFF)
  color: white, Press Start 2P font, centered
  — Looks intentional, not broken
```

---

## 2.9 FARHAN'S PERSONAL ASSETS — PROJECT SCREENSHOTS

These are needed for the Projects window in the OS and the Projects screen on Nokia.

### Complete List — 11 Projects × 3 Screenshots = 33 Images

```
Status:      🔴 FARHAN PROVIDES (when ready — placeholder used until then)
Format:      PNG or JPG
Size:        Minimum 800×500px per screenshot (displayed at 400×250px)
Save to:     /public/images/projects/

Naming convention (exact — Antigravity maps these in code):
  kavach-1.jpg        kavach-2.jpg        kavach-3.jpg
  swachhcity-1.jpg    swachhcity-2.jpg    swachhcity-3.jpg
  ecosweep-1.jpg      ecosweep-2.jpg      ecosweep-3.jpg
  govbuy-1.jpg        govbuy-2.jpg        govbuy-3.jpg
  recruitment-1.jpg   recruitment-2.jpg   recruitment-3.jpg
  jalsevak-1.jpg      jalsevak-2.jpg      jalsevak-3.jpg
  ayush-1.jpg         ayush-2.jpg         ayush-3.jpg
  mediscan-1.jpg      mediscan-2.jpg      mediscan-3.jpg
  dudedice-1.jpg      dudedice-2.jpg      dudedice-3.jpg
  alumni-1.jpg        alumni-2.jpg        alumni-3.jpg
  ibm-1.jpg           ibm-2.jpg           ibm-3.jpg

What to screenshot for each project:
  -1.jpg  → Main dashboard or landing page (the hero view)
  -2.jpg  → A feature screen or key functionality
  -3.jpg  → Another feature, mobile view, or admin panel
```

### Placeholder Strategy (development is NOT blocked without these)
```
Antigravity generates placeholder images using CSS:

const PROJECT_COLORS = {
  kavach:      ['#00D4FF', '#003D7A'],   // cyan gradient
  swachhcity:  ['#7B2FFF', '#3D0099'],   // violet gradient
  ecosweep:    ['#00FF88', '#006600'],   // green gradient
  govbuy:      ['#F5C542', '#8B6914'],   // gold gradient
  recruitment: ['#FF6B35', '#8B2500'],   // orange gradient
  jalsevak:    ['#00B4D8', '#023E8A'],   // ocean blue gradient
  ayush:       ['#8BC34A', '#33691E'],   // AYUSH green gradient
  mediscan:    ['#FF4081', '#880E4F'],   // medical red gradient
  dudedice:    ['#212121', '#616161'],   // premium dark gradient
  alumni:      ['#795548', '#3E2723'],   // warm brown gradient
  ibm:         ['#1565C0', '#0D47A1'],   // IBM blue gradient
}

Each placeholder is a gradient rectangle with:
  - Project name in Press Start 2P
  - Badge text below (e.g., "SIH 2025 WINNER")
  - The gradient specific to that project
  — Drops out automatically when real screenshots are placed
    in /public/images/projects/ with the correct filenames
```

---

## 2.10 FARHAN'S PERSONAL ASSETS — RESUME PDF

```
Status:      ✅ ALREADY EXISTS
File:        /public/resume.pdf  (or Farhan_Sayed_Resume.pdf)
Used in:     OS → Resume.pdf window (PDF viewer via <iframe>)
             Download button in window title bar
Note:        Keep resume PDF up to date — this is what recruiters download
```

---

## 2.11 GAME OVERLAY — PORTFOLIO DATA

This is not an image asset — it's a TypeScript file. But it needs Farhan's content.

```
Status:      🔴 FARHAN REVIEWS (Antigravity drafts, Farhan approves)
File:        /src/game/phaser/data/portfolioData.ts

Needs Farhan to confirm:
  1. The exact fun facts for coin reveals (drafts already in V3 plan)
  2. Which project appears on Mushroom grab (per level)
  3. The exact achievement text for Star/Win screens
  4. Any personal easter eggs he wants added

Antigravity drafts this from V3 plan B3 section.
Farhan reviews and tweaks the wording.
Takes 30 minutes to finalize.
```

---

## 2.12 ENVIRONMENT VARIABLES

```
Status:      🔴 FARHAN PROVIDES (after EmailJS account setup)
File:        .env.local (never committed to git)

Steps for Farhan:
  1. Sign up at emailjs.com (free)
  2. Add email service (Gmail recommended — use farhan@farhanbuilds.in)
  3. Create email template (Antigravity provides the HTML template)
  4. Copy 3 keys into .env.local:

     NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
     NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
     NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx

  5. Add same 3 vars to Vercel project settings (Dashboard → Settings → Environment Variables)

Placeholder behavior (before EmailJS is set up):
  Contact form shows a "Coming Soon" message instead of the form
  — development is not blocked
```

---

---

# PART 3 — ASSET HANDOFF SCHEDULE

---

## 3.1 WHAT IS NEEDED WHEN

### Before Build Starts (Day 0) — Farhan Provides
```
Priority:   CRITICAL — build cannot start meaningfully without these

Nothing actually! Antigravity can start Day 1 with all placeholders.
The only thing Farhan should confirm before build starts:
  ✅ Confirm coin fact text (review the drafts in B3 of V3 plan)
  ✅ Confirm contact email (farhan@farhanbuilds.in)
  ✅ EmailJS account created (10 minutes — emailjs.com)
```

### During Week 1–2 (OS + Phone build) — Farhan Provides
```
Priority:   HIGH — improves the OS experience while Antigravity builds

  📸 Profile photo (farhan.jpg)
     → Needed for Start Menu avatar and About Me window
     → Any decent phone photo works as interim

  📸 At least 3 project screenshots (any 3 projects)
     → Kavach, JalSevak, DudeDice recommended first
       (the most visually impressive ones)
     → Remaining 8 projects can stay on placeholder through Week 3
```

### During Week 3 (Mario Game build) — Farhan Provides
```
Priority:   HELPFUL — game content gets finalized

  📝 Review and approve portfolioData.ts draft from Antigravity
     (the coin facts, popup text, Bowser win screen copy)
     → Takes 30 minutes of Farhan's time

  📸 Remaining project screenshots
     → All 33 images ideally done by end of Week 3
```

### Before Launch (End of Week 4) — Farhan Provides
```
Priority:   REQUIRED — these must be done before go-live

  🔑 EmailJS keys (3 values) → Antigravity adds to Vercel env vars
  📄 Final resume PDF confirmed current and correct
  📸 All 33 project screenshots in place (or explicit decision to
     launch with placeholders for some projects — acceptable)
  ✅ Final review of portfolioData.ts game content
  ✅ Domain farhanbuilds.in DNS pointed to Vercel
```

---

## 3.2 WHAT ANTIGRAVITY SOURCES (No Farhan Action Needed)

```
🟡 Download from spriters-resource.com:
   mario_sprites.png
   enemies_sprites.png
   items_sprites.png
   tiles_sprites.png
   hud_sprites.png

🟡 Download from opengameart.org (CC0):
   bgm_overworld.ogg + .mp3
   bgm_underground.ogg + .mp3
   bgm_castle.ogg + .mp3
   bgm_victory.ogg + .mp3
   bgm_gameover.ogg + .mp3

🟢 Antigravity builds from scratch:
   All desktop icons (SVG pixel art set)
   Nokia phone frame (SVG component)
   Desktop wallpaper (pure CSS)
   SFXSynth.ts (Web Audio API code)
   All 3 Tiled tilemaps (level_1_1.json, level_1_2.json, level_1_3.json)
   All placeholder gradient images for projects
   Profile photo placeholder (CSS initials avatar)
   Favicon set
   All React components, hooks, contexts, game scenes
```

---

## 3.3 COMPLETE ASSET CHECKLIST

```
GAME SPRITES (Antigravity downloads)
  □ mario_sprites.png         spriters-resource.com
  □ enemies_sprites.png       spriters-resource.com
  □ items_sprites.png         spriters-resource.com
  □ tiles_sprites.png         spriters-resource.com
  □ hud_sprites.png           spriters-resource.com

GAME TILEMAPS (Antigravity builds in Tiled)
  □ level_1_1.json            World 1-1 Overworld layout
  □ level_1_2.json            World 1-2 Underground layout
  □ level_1_3.json            World 1-3 Castle layout

GAME AUDIO BGM (Antigravity downloads from opengameart.org)
  □ bgm_overworld.ogg/.mp3
  □ bgm_underground.ogg/.mp3
  □ bgm_castle.ogg/.mp3
  □ bgm_victory.ogg/.mp3
  □ bgm_gameover.ogg/.mp3

GAME AUDIO SFX (Antigravity synthesizes — no files)
  □ Web Audio API SFXSynth.ts  ← code, not an asset file

DESKTOP ICONS (Antigravity builds as SVG)
  □ folder.svg
  □ pdf.svg
  □ notepad.svg
  □ zip.svg
  □ timeline.svg
  □ skills_exe.svg
  □ game_exe.svg
  □ browser_exe.svg
  □ contact_lnk.svg
  □ recycle_bin.svg
  □ system_info.svg
  □ readme_txt.svg
  □ farhanbuilds.svg (also used as favicon base)

FAVICON SET (Antigravity builds)
  □ /public/favicon.ico
  □ /public/favicon.svg
  □ /public/apple-touch-icon.png

NOKIA PHONE FRAME (Antigravity builds as SVG component)
  □ PhoneFrame.tsx (SVG inline)

FARHAN'S PERSONAL ASSETS
  □ /public/images/farhan.jpg                     🔴 FARHAN
  □ /public/resume.pdf                            ✅ READY
  □ /public/images/projects/kavach-1.jpg          🔴 FARHAN
  □ /public/images/projects/kavach-2.jpg          🔴 FARHAN
  □ /public/images/projects/kavach-3.jpg          🔴 FARHAN
  □ /public/images/projects/swachhcity-1.jpg      🔴 FARHAN
  □ /public/images/projects/swachhcity-2.jpg      🔴 FARHAN
  □ /public/images/projects/swachhcity-3.jpg      🔴 FARHAN
  □ /public/images/projects/ecosweep-1.jpg        🔴 FARHAN
  □ /public/images/projects/ecosweep-2.jpg        🔴 FARHAN
  □ /public/images/projects/ecosweep-3.jpg        🔴 FARHAN
  □ /public/images/projects/govbuy-1.jpg          🔴 FARHAN
  □ /public/images/projects/govbuy-2.jpg          🔴 FARHAN
  □ /public/images/projects/govbuy-3.jpg          🔴 FARHAN
  □ /public/images/projects/recruitment-1.jpg     🔴 FARHAN
  □ /public/images/projects/recruitment-2.jpg     🔴 FARHAN
  □ /public/images/projects/recruitment-3.jpg     🔴 FARHAN
  □ /public/images/projects/jalsevak-1.jpg        🔴 FARHAN
  □ /public/images/projects/jalsevak-2.jpg        🔴 FARHAN
  □ /public/images/projects/jalsevak-3.jpg        🔴 FARHAN
  □ /public/images/projects/ayush-1.jpg           🔴 FARHAN
  □ /public/images/projects/ayush-2.jpg           🔴 FARHAN
  □ /public/images/projects/ayush-3.jpg           🔴 FARHAN
  □ /public/images/projects/mediscan-1.jpg        🔴 FARHAN
  □ /public/images/projects/mediscan-2.jpg        🔴 FARHAN
  □ /public/images/projects/mediscan-3.jpg        🔴 FARHAN
  □ /public/images/projects/dudedice-1.jpg        🔴 FARHAN
  □ /public/images/projects/dudedice-2.jpg        🔴 FARHAN
  □ /public/images/projects/dudedice-3.jpg        🔴 FARHAN
  □ /public/images/projects/alumni-1.jpg          🔴 FARHAN
  □ /public/images/projects/alumni-2.jpg          🔴 FARHAN
  □ /public/images/projects/alumni-3.jpg          🔴 FARHAN
  □ /public/images/projects/ibm-1.jpg             🔴 FARHAN
  □ /public/images/projects/ibm-2.jpg             🔴 FARHAN
  □ /public/images/projects/ibm-3.jpg             🔴 FARHAN

ENVIRONMENT VARIABLES
  □ NEXT_PUBLIC_EMAILJS_SERVICE_ID                🔴 FARHAN (emailjs.com)
  □ NEXT_PUBLIC_EMAILJS_TEMPLATE_ID              🔴 FARHAN (emailjs.com)
  □ NEXT_PUBLIC_EMAILJS_PUBLIC_KEY               🔴 FARHAN (emailjs.com)

GAME CONTENT (Farhan reviews, Antigravity drafts)
  □ portfolioData.ts coin facts approved          🔴 FARHAN review
  □ portfolioData.ts popup copy approved          🔴 FARHAN review
  □ Bowser win screen copy approved               🔴 FARHAN review
```

**TOTAL ASSETS:**
- 🔴 Farhan provides: 36 items (33 screenshots + photo + resume ✅ + EmailJS keys)
- 🟡 Antigravity downloads: 10 files (5 sprites + 5 audio BGM)
- 🟢 Antigravity builds: Everything else (icons, SVGs, code, tilemaps, SFX)

---

## 3.4 PLACEHOLDER SYSTEM — HOW IT WORKS

Every asset has a placeholder that looks intentional, not broken. Antigravity implements this on Day 1 so the entire site is always demo-able.

```typescript
// ProjectImage component — auto-switches between placeholder and real
interface ProjectImageProps {
  project: string;  // e.g., 'kavach'
  index: 1 | 2 | 3;
  alt: string;
}

export function ProjectImage({ project, index, alt }: ProjectImageProps) {
  const src = `/images/projects/${project}-${index}.jpg`;
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Render placeholder — project-specific gradient
    return (
      <div className="project-placeholder" data-project={project}>
        <span>{project.toUpperCase()}</span>
        <span>Screenshot {index}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}
// When Farhan adds the real image → onError never fires → real image shows
// Zero code change needed. Just drop the file in the right place.
```

---

*Tech Stack + Asset Requirements — Portfolio V3 "Farhan's World"*
*farhanbuilds.in · Farhan Sayed · Mumbai*
*Document version 1.0 — For Antigravity reference*
