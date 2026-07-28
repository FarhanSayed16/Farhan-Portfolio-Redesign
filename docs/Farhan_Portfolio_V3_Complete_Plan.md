# FARHAN SAYED — PORTFOLIO V3
# "Farhan's World" — Complete Build Plan
### Retro OS Desktop + Retro Phone Mobile + Super Mario Game
**farhanbuilds.in · Brand New Project**

---

## THE CONCEPT IN ONE LINE

> A portfolio that doesn't feel like a portfolio.
> Desktop users get a full retro OS. Mobile users get a retro Nokia phone.
> Hidden inside both: the actual, authentic Super Mario Bros game —
> same sprites, same tilesets, same feel — where info popups about Farhan
> appear as an overlay layer when you hit coins, blocks, and bosses.
> Audio is synthesized (Web Audio API) + CC0 chiptune — copyright-safe.

---

## WHY THIS WORKS

- **Recruiters spend 7 seconds on a portfolio.** This one, they'll spend 20 minutes.
- **Nostalgia is the most powerful emotional hook.** Windows 95 + the actual Mario game = instant childhood memory for anyone who grew up in the 90s/2000s — your target audience (senior devs, international recruiters, Germany admissions panels).
- **Authenticity matters.** A "Mario-inspired" clone feels cheap. The real sprites, the real sounds, the real feel is what creates the gut-punch memory. The game is untouched — Farhan's info rides on top of it as a separate UI layer.
- **Gamification = engagement.** People don't leave a game halfway through. They'll discover your achievements without realizing they're reading a resume.
- **Zero competition.** No other developer in India has this. This becomes your story.

---

## DEVICE DETECTION LOGIC

```
User visits farhanbuilds.in
         │
         ▼
   Detect device type
         │
    ┌────┴────┐
    │         │
Desktop     Mobile
(≥1024px)  (<768px)
    │         │
    ▼         ▼
Retro OS   Retro Phone
(Win95/XP) (Nokia 3310)
    │         │
    └────┬────┘
         │
      Tablet (768–1023px)
         │
         ▼
  Choice screen:
  "Switch to Desktop View?"
  or continue in phone mode
```

```typescript
// Detection hook
function useDeviceMode(): 'desktop' | 'mobile' | 'tablet' {
  const width = window.innerWidth;
  if (width >= 1024) return 'desktop';
  if (width < 768) return 'mobile';
  return 'tablet';
}
```

---

---

# PART A — DESKTOP EXPERIENCE
## Retro OS (Windows 95 / XP Nostalgia)

---

## A1. BOOT SEQUENCE

When the user first lands on `farhanbuilds.in` on desktop, they see a boot screen.

**Boot sequence (10–15 seconds, skippable):**

```
[Screen 1 — Black, 2s]
  FARHAN BIOS v2025
  Copyright (C) Farhan Sayed
  Mumbai, India

  Checking RAM... 8GB OK
  Checking SIH Trophy... FOUND ✓
  Checking Coffee Supply... CRITICAL ⚠
  Loading Genius... 100%

[Screen 2 — Windows-style loading bar, 3s]
  ████████████████████░░░░  82%
  Starting Farhan OS...

[Screen 3 — Login screen, 2s]
  👤 Farhan Sayed
  [ Click to Enter ]

[Screen 4 — Desktop appears with startup sound]
```

**Tech:** Pure CSS animations + typewriter effect. "Click to skip" button in corner. Plays a custom startup chime (Web Audio API — simple synthesized beep, no copyright issues).

---

## A2. THE DESKTOP

Once booted, user sees a full OS desktop environment.

### Wallpaper
- Dark theme: Deep navy/black with a subtle grid pattern
- Center: Small Farhan logo / monogram watermark
- Bottom right corner: `farhanbuilds.in` in small pixel font
- OR: Classic sunset/hills silhouette in a retro pixel art style

### Taskbar (Bottom)

```
[🪟 START]  [📁 Explorer] [🎮 Game] [🌐 Browser]    ----    [🔊] [📶] [🔋] [🕐 3:47 PM]
```

- Left: Start button (opens Start Menu)
- Center: Running app icons (updates as windows open)
- Right: System tray — speaker icon, WiFi icon, clock (shows real time)
- Height: 40px, background `#c0c0c0` (Win95 gray) or `#2a2a4a` (dark XP)

### Start Menu (click Start button)

```
┌──────────────────────────────────────┐
│  👤 Farhan Sayed                     │
│     Full Stack Developer             │
├──────────────────────────────────────┤
│  📄 Resume                          │
│  📁 Projects          ►             │ → submenu: all 11 projects
│  🧠 Skills            ►             │ → submenu: skill categories
│  🏆 Achievements      ►             │ → submenu: awards
│  💼 Experience        ►             │ → submenu: internships
│  📞 Contact Me                      │
├──────────────────────────────────────┤
│  🎮 Farhan's World.exe              │ → opens Mario game
│  🌐 farhanbuilds.in                 │ → opens browser window
├──────────────────────────────────────┤
│  ⚙️  System Info                    │ → fun "About This PC" modal
│  🔴 Shut Down                       │ → goodbye animation
└──────────────────────────────────────┘
```

### Desktop Icons (arranged on the desktop)

```
🗂️ Projects          📄 Resume.pdf         📝 About Me.txt
(folder)             (opens resume)        (notepad window)

🏆 Achievements      💼 Experience         🧠 Skills.exe
(zip folder)         (timeline app)        (skills explorer)

🎮 Farhan's          🌐 Browser.exe        📞 Contact.lnk
   World.exe         (fake browser)        (shortcut)

🗑️ Recycle Bin       💡 README.txt
(easter egg)         (fun intro file)
```

Each icon is **double-clickable** and opens a **window**.

---

## A3. WINDOWS SYSTEM

Every piece of content opens in a draggable, resizable, minimizable window — exactly like a real OS.

**Window anatomy:**
```
┌─────────────────────────────────────────────────────────┐
│  🗂️ Projects                            [─] [□] [✕]   │  ← Title bar
├─────────────────────────────────────────────────────────┤
│  File  Edit  View  Help                                 │  ← Menu bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│   [Window content here]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Window behaviors:**
- Drag by title bar
- Resize from edges/corners
- Minimize → goes to taskbar
- Maximize → fills screen (with restore)
- Close → window disappears
- Multiple windows can be open simultaneously
- Z-index updates on click (active window comes to front)
- Windows open with a quick scale-in animation

---

## A4. EACH WINDOW — CONTENT SPEC

---

### 📝 README.txt (Auto-opens on first boot)

Styled as a classic Windows Notepad. Monospace font. Plain text.

```
Welcome to FARHAN OS v2025
==========================

Hello! I'm Farhan Sayed — a Full Stack Developer,
AI Builder, and SIH 2025 National Winner from Mumbai.

This desktop is my portfolio. Explore it like you
would your own computer.

QUICK START:
  → Double-click "About Me.txt" to learn about me
  → Open "Projects" folder to see my work
  → Run "Farhan's World.exe" to play my game
  → Click "Resume.pdf" to download my CV

KEYBOARD SHORTCUTS:
  [F1]    Open Start Menu
  [F2]    Launch Farhan's World game
  [ESC]   Close current window
  [?]     Show help

P.S. Try right-clicking the desktop 😏

— Farhan Sayed
  farhan@farhanbuilds.in
  github.com/FarhanSayed16
```

---

### 📝 About Me.txt (Notepad)

```
FARHAN SAYED — FULL STACK DEVELOPER & AI BUILDER
=================================================

PERSONAL INFO:
  Name     : Farhan Sayed
  Location : Mumbai, India
  Education: MCA — VSIT, Mumbai (2024–2026)
             B.Sc. IT — VSIT, Mumbai (2023–2026)
  Email    : farhan@farhanbuilds.in
  GitHub   : github.com/FarhanSayed16
  LinkedIn : linkedin.com/in/farhansayed16

BIO:
  I'm a full stack developer and AI builder who builds
  civic tech platforms, AI systems, and IoT solutions
  that solve real problems at scale.

  SIH 2025 National Winner. Open Group International
  Finalist. CSI President. MechNova 1st Place.

  I don't just write code — I ship products that matter.

CURRENTLY:
  → Building DudeDice (premium menswear brand)
  → Exploring Germany MS (Summer 2027)
  → Grinding DSA for FAANG prep
  → Open to full-time roles & freelance

FUN FACTS:
  → Coffee consumed while coding: ∞
  → Bugs fixed at 2 AM: too many to count
  → Times said "just one more feature": 847
```

---

### 🗂️ Projects Folder (File Explorer)

A two-panel file explorer window (like Windows Explorer).

**Left panel:** Folder tree
```
📁 Projects
  ├── 🏆 SIH 2025 Winners
  │     └── 📁 Kavach
  ├── 🌍 International
  │     └── 📁 GovBuy
  ├── 🤖 AI & ML
  │     ├── 📁 JalSevak
  │     ├── 📁 AI Recruitment
  │     └── 📁 IBM Chatbot
  ├── 🏙️ Civic Tech
  │     └── 📁 SwachhCity
  ├── 🛒 E-Commerce
  │     └── 📁 DudeDice
  ├── 🏥 Healthcare
  │     └── 📁 MediScan
  ├── 🤖 Robotics
  │     └── 📁 EcoSweep
  ├── 🏛️ Government
  │     └── 📁 AYUSH Portal
  └── 👥 Campus
        └── 📁 Alumni Connect
```

**Right panel:** When a project folder is clicked, shows:
```
PROJECT: KAVACH
═══════════════════════════════════════
Type      : Application
Category  : IoT + Civic Tech
Status    : ✅ DEPLOYED — SIH WINNER

  ┌─────────────────────────────────┐
  │  [Project screenshot]           │
  └─────────────────────────────────┘

Description:
  AI + IoT platform for disaster preparedness
  across schools and colleges nationwide.
  Built for and endorsed by Govt of Punjab,
  Ministry of Education.

Tech Stack : IoT (ESP32) · Next.js · Flutter
             Socket.io · Redis · MongoDB · Firebase

Achievement: 🏆 SIH 2025 NATIONAL WINNER
             Grand Finale, Govt of Punjab

[  View on GitHub  ]  [  Live Demo  ]
```

---

### 📄 Resume.pdf

Opens a full-screen PDF viewer window (iframe of the actual PDF). Has a download button in the title bar. Simple, clean.

---

### 🏆 Achievements (Zip Folder)

When opened, plays a small "extracting..." animation, then shows a grid of achievement "files":

```
🏆 SIH_2025_Winner.award
🌍 OpenGroup_Finalist.award
🥇 MechNova_1st.award
🥇 Internal_SIH_2025.award
🥈 SIH_2024_Finalist.award
🥉 CSI_Ideathon_3rd.award
🎓 CSI_President.award
🤝 IEEE_Member.award
```

Double-clicking any `.award` file opens a certificate-style popup with the full achievement details.

---

### 💼 Experience (Custom App)

Styled as a custom Timeline application. Shows a vertical timeline (like a retro task manager).

Each entry: Company logo (if available), role, dates, one-line description. Clicking an entry expands it with full details.

---

### 🧠 Skills.exe (Custom App)

Opens a window with a visual skill tree — like an old Windows "Program Manager" or a classic RPG skill tree.

Skills grouped into tabs at the top:
```
[ Frontend ] [ Backend ] [ AI/ML ] [ IoT ] [ Database ] [ Tools ]
```

Each skill appears as an icon with a pixel art representation and proficiency bar.

---

### 🌐 Browser.exe (Fake Browser)

A browser window that shows a simple single-page about Farhan — styled like a mid-2000s website (Comic Sans NEVER, but fun retro web 1.0 vibes). Has fake address bar showing `farhanbuilds.in`. Clicking the address bar and typing different "URLs" shows different content:

```
farhanbuilds.in/projects   → all projects
farhanbuilds.in/contact    → contact form
farhanbuilds.in/blog       → fun "blog posts" (actually facts about Farhan)
github.com/FarhanSayed16   → redirects to real GitHub
```

---

### 📞 Contact.lnk

Opens a contact window styled as an old Outlook/email compose window:

```
┌─────────────────────────────────────────┐
│  New Message                 [─][□][✕] │
├─────────────────────────────────────────┤
│  From:    recruiter@yourcompany.com     │
│  To:      farhan@farhanbuilds.in        │
│  Subject: [                           ] │
├─────────────────────────────────────────┤
│                                         │
│  [                                    ] │
│  [        Message body here           ] │
│  [                                    ] │
│                                         │
│  [Attach Resume]      [Send Message]    │
└─────────────────────────────────────────┘
```

Submitting sends a real email via EmailJS or Resend API.

---

### ⚙️ System Info (About This PC)

```
FARHAN OS — SYSTEM INFORMATION
================================
Processor  : Full Stack Brain™ 3.0 GHz (6 cores)
Memory     : 8GB Caffeine RAM
Storage    : 11 Projects, 67+ Skills, 33+ Certs
GPU        : Creative Vision Pro
Network    : Connected to GitHub, LinkedIn
OS Version : Farhan OS 2025 Build 24.06
Uptime     : 22 years (and counting)

[  OK  ]
```

---

### 🗑️ Recycle Bin (Easter Egg)

Opening it shows:
```
📄 imposter_syndrome.exe     [Deleted 2023]
📄 tutorial_hell.mp4         [Deleted 2024]
📄 giving_up.txt             [Deleted 2022]
📄 settling_for_less.doc     [Deleted 2021]
📄 fear_of_failure.zip       [In Progress...]
```

---

### 💡 README.txt → Right-click Desktop

Right-clicking the desktop shows a context menu:
```
  View          ►
  Sort By       ►
  Refresh
  ─────────────
  New           ►
  ─────────────
  About Farhan
  Hire Farhan   ← opens contact window
  ─────────────
  Properties
```

---

## A5. DESKTOP VISUAL STYLE

### Color Palette (Retro OS Dark Theme)

```
OS Background:    #0A0A1A   (very dark navy — NOT Win95 gray)
Taskbar:          #1A1A2E   (dark navy)
Window Chrome:    #16213E   (window title bar, borders)
Window Body:      #0F3460   (slightly lighter dark)
Active Title:     linear-gradient(90deg, #00D4FF, #7B2FFF)
Inactive Title:   #4a4a6a
Button Normal:    #2a2a4a
Button Hover:     #3a3a6a
Text Primary:     #E8F4F8
Text Muted:       #8899AA
Icon Glow:        #00D4FF
```

### Typography

```
OS Labels:        'Press Start 2P' (Google Fonts — pixel font)
Window Titles:    'Space Grotesk' (familiar but clean)
Content:          'Space Grotesk'
Notepad/Terminal: 'JetBrains Mono'
Pixel UI labels:  'Press Start 2P'
```

### Icon Style

All desktop icons are **pixel art style** — 48×48px retro icons. Can use:
- Free pixel art icon packs (many available on itch.io under CC license)
- Custom SVG icons with a pixel-ized feel
- Simple emoji rendered in pixel-art containers

---

---

# PART B — SUPER MARIO GAME
## "Farhan's World" — Accessible from both Desktop & Mobile

---

## B1. THE CONCEPT

A fully playable, **authentic Super Mario Bros (NES World 1)** running in the browser via **Phaser.js 3**. The game is identical to the original — same sprites, same physics, same sounds, same backgrounds, same enemies. **Nothing is changed inside the game itself.**

The only addition is a **React overlay layer** that sits on top of the Phaser canvas. When certain game events happen (coins collected, question blocks hit, boss defeated), the overlay fires a popup — pausing the game for 2–3 seconds — showing Farhan's portfolio info, then dismissing and resuming. The game never knows about the portfolio. The portfolio layer never touches the game.

**Scope: World 1 only. Three levels: 1-1, 1-2, and 1-3 (Bowser castle).**

**The tagline:** *"Collect coins. Unlock skills. Beat Bowser. Hire the developer."*

---

## B2. TECH STACK FOR THE GAME

```
Game Engine:    Phaser.js 3 (phaser.io — free, MIT license)
Language:       TypeScript
Sprites:        Original Super Mario Bros NES sprite sheets
                → spriters-resource.com → "Super Mario Bros (NES)"
                → Download: Mario, Luigi, Goombas, Koopas, Bowser,
                  question blocks, brick blocks, pipes, coins, flags
Tilesets:       Original SMB NES tilesets (overworld, underground, castle)
                → same source as sprites above
Audio:          Synthesized via Web Audio API (no Nintendo files needed)
                → SFX (jump, coin, stomp, powerup, die): generated
                  procedurally using oscillators — square/triangle waves
                → Background music: CC0-licensed chiptune tracks from
                  opengameart.org (search "mario style" or "chiptune
                  platformer") — loaded via Howler.js
                → This approach is fully copyright-safe and sounds
                  nearly identical to the original NES audio
Physics:        Phaser Arcade Physics (built-in, replicates SMB physics)
Tilemaps:       Tiled Map Editor (free) → export JSON → Phaser loads
Integration:    React wrapper component that mounts the Phaser canvas
Overlay layer:  Pure React — sits above canvas, fired by Phaser events
```

**Why Phaser.js:**
- Battle-tested HTML5 game framework used by thousands of games
- Built-in physics, input handling, sprite animation, tilemap loading
- TypeScript support natively
- Renders to HTML5 Canvas — works everywhere, no plugins
- Phaser's Arcade Physics can replicate SMB's jump arc and gravity accurately
- Huge community, exhaustive docs, used in commercial browser games

**On using original Nintendo sprites:**
Sprites and tilesets only — no Nintendo audio files are used anywhere. Audio is synthesized or sourced from CC0 libraries (see B7). For the sprites and tilesets: this is a personal, non-commercial portfolio — not distributed as a standalone game, not monetized. Fan-game usage of Nintendo visual assets at this scale is universally tolerated and Nintendo has no history of pursuing personal developer portfolios. The standard practice across thousands of indie dev portfolios worldwide.

---

## B3. GAME STRUCTURE

### Scope: World 1 Only — Three Levels

```
WORLD 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1-1 (Overworld)  →  1-2 (Underground)  →  1-3 (Castle / Bowser)

  Authentic original SMB World 1 layout and level design.
  All backgrounds, platforms, enemies, pipes exactly as in NES original.
  Portfolio info appears as a React overlay — game is UNCHANGED.
```

---

### LEVEL 1-1 — Overworld (The Classic)

**Everything:** Exactly the original SMB 1-1. Overworld background, green pipes, Goombas, breakable bricks, question blocks, flagpole at the end.

**Portfolio overlay triggers (fires on top of game, game pauses briefly):**

| Trigger | What Fires |
|---------|-----------|
| First coin collected | `"🪙 Fun Fact: Farhan started coding at 16 in Mumbai!"` |
| 10 coins collected | `"🪙 Fun Fact: SIH 2025 National Winner — Project Lead!"` |
| 20 coins collected | `"🪙 Fun Fact: Led 120+ members as CSI President!"` |
| First Question Block hit | Skill popup: `"❓ SKILL UNLOCKED: React.js — Frontend"` |
| Second Question Block hit | Skill popup: `"❓ SKILL UNLOCKED: Node.js — Backend"` |
| Third Question Block hit | Skill popup: `"❓ SKILL UNLOCKED: Python — AI & ML"` |
| Mushroom grabbed | Project card: `"🍄 PROJECT: Kavach — SIH 2025 National Winner"` |
| Star grabbed | Achievement flash: `"⭐ SIH 2025 NATIONAL WINNER — Govt of Punjab"` |
| Flagpole reached | Level clear popup: `"🏁 LEVEL CLEAR! 3 Projects Shipped in 2024 alone."` |

**Popup style (React overlay, not part of Phaser):**
```
  ╔══════════════════════════════════════╗
  ║  ❓ SKILL UNLOCKED                  ║
  ║  ─────────────────────────────────  ║
  ║  React.js                           ║
  ║  Category: Frontend Development     ║
  ║  Used in: Kavach, SwachhCity,       ║
  ║           DudeDice, AYUSH Portal    ║
  ║                                     ║
  ║  [ Keep Playing → ]                 ║
  ╚══════════════════════════════════════╝
  (auto-dismisses in 3s, or press any key)
```

---

### LEVEL 1-2 — Underground (The Grind)

**Everything:** Exactly the original SMB 1-2. Underground background, the infamous long underground run, hidden warp zone at the end.

**Portfolio overlay triggers:**

| Trigger | What Fires |
|---------|-----------|
| Level start | Brief intro: `"Underground — Where the real work happens."` |
| First coin | `"🪙 6 internships completed. 0 days wasted."` |
| 10 coins | `"🪙 33+ certifications. Google Cloud, IBM, TCS iON."` |
| 20 coins | `"🪙 Open Group International Finalist — GovBuy"` |
| Question Block 1 | Skill popup: `"❓ SKILL: FastAPI — Backend"` |
| Question Block 2 | Skill popup: `"❓ SKILL: Flutter — Cross-Platform"` |
| Question Block 3 | Skill popup: `"❓ SKILL: ESP32/IoT — Embedded Systems"` |
| Question Block 4 | Skill popup: `"❓ SKILL: PostgreSQL + PostGIS — Databases"` |
| Mushroom grabbed | Project card: `"🍄 PROJECT: JalSevak — AI Coastal Intelligence"` |
| Star grabbed | Achievement flash: `"⭐ MECHN0VA 1ST PLACE — Terrain Robot 2025"` |
| Warp Zone entered | `"🌀 Warp Zone! Shortcut to the Castle... if you dare."` |
| Flagpole reached | Level clear: `"🏁 LEVEL CLEAR! 67+ technologies mastered."` |

---

### LEVEL 1-3 — Castle (Bowser / Final Boss)

**Everything:** Exactly the original SMB 1-3 castle level. Dark castle interior, lava pits, Bowser on the bridge, axe to cut the bridge.

**Portfolio overlay triggers:**

| Trigger | What Fires |
|---------|-----------|
| Level start | `"The castle. The final test. Sound familiar?"` |
| First coin | `"🪙 Built DudeDice — a real live e-commerce brand."` |
| 10 coins | `"🪙 MCA @ VSIT. B.Sc. IT. Still learning every day."` |
| Question Block 1 | Skill popup: `"❓ SKILL: TensorFlow / PyTorch — ML"` |
| Question Block 2 | Skill popup: `"❓ SKILL: Docker + WebSockets — DevOps"` |
| Mushroom grabbed | Project card: `"🍄 PROJECT: EcoSweep — Autonomous Terrain Robot"` |
| Star grabbed | Achievement flash: `"⭐ OPEN GROUP INTERNATIONAL FINALIST"` |
| Bowser approached | Brief pause: `"Bowser. Every developer has one."` |
| Bowser defeated (axe hit) | **MAJOR popup — see below** |

**Bowser defeat popup (the final payoff):**
```
  ╔══════════════════════════════════════════╗
  ║   🏆 WORLD 1 COMPLETE!                  ║
  ║                                          ║
  ║   FARHAN SAYED                           ║
  ║   Full Stack Developer · AI Builder      ║
  ║   Mumbai, India                          ║
  ║   ─────────────────────────────────────  ║
  ║   🏆 SIH 2025 National Winner            ║
  ║   🌍 Open Group International Finalist   ║
  ║   🥇 MechNova 1st Place · 2025           ║
  ║   🎓 CSI President — 120+ members        ║
  ║   💼 6 Internships Completed             ║
  ║   📦 11 Projects Shipped                 ║
  ║   🧠 67+ Technologies Mastered           ║
  ║   ─────────────────────────────────────  ║
  ║                                          ║
  ║   Think this developer can help you?     ║
  ║                                          ║
  ║   [  ✉ HIRE FARHAN  ]  [  Play Again  ] ║
  ╚══════════════════════════════════════════╝
```

"HIRE FARHAN" opens the Contact window (desktop) or Contact screen (phone).

---

## B4. GAME MECHANICS MAPPED TO PORTFOLIO INFO

The game itself is 100% original SMB. The overlay layer intercepts Phaser events and renders React popups on top. Here is the complete trigger map:

| Game Event | Overlay Fires | Pause? |
|-----------|--------------|--------|
| Coin collected (milestones: 1, 10, 20) | Fun fact about Farhan | No — shows as toast, 2s |
| Question Block hit | Skill unlocked card | Yes — 3s, any key to dismiss |
| Mushroom grabbed | Project card (name, stack, one-liner) | Yes — 3s |
| Star grabbed | Achievement spotlight banner | No — 4s overlay banner |
| Fire Flower grabbed | "FIRE SKILLS — AI/ML Unlocked" + skill list | Yes — 3s |
| 1-Up Mushroom grabbed | Surprise fun fact | No — 3s toast |
| Warp Zone entered (1-2) | "Shortcut taken — just like Farhan ships fast" | Yes — 2s |
| Flagpole reached | Level clear card — brief stats | Yes — 4s |
| Game Over | "Even the best fall. Farhan gets back up." + retry | Yes — full screen |
| Bowser defeated | **Full portfolio summary + Hire button** | Yes — full screen |
| Play Again (after win) | Resets to 1-1, overlay triggers reset too | — |

**Overlay appearance rules:**
- Toasts: top-right corner, non-blocking, auto-dismiss
- Cards: centered modal, semi-transparent dark bg over game, blur effect
- Full screen: complete takeover with Mario-style pixel border
- All overlays use `Press Start 2P` font to match the game aesthetic
- Dismiss: any key, Space, or the dismiss button

---

## B5. GAME HUD (HEADS UP DISPLAY)

```
┌──────────────────────────────────────────────────────────┐
│ FARHAN  ×03    SCORE: 008450    WORLD 1-1    TIME: 287   │
│ ████████░░  Lives remaining                              │
└──────────────────────────────────────────────────────────┘
```

**Easter egg:** The "FARHAN" name in the HUD slowly animates to spell "HIRE ME" when score exceeds 9999.

---

## B6. CONTROLS

**Desktop:**
```
Arrow Keys / WASD    → Move left/right
Space / Up Arrow     → Jump
Z / X                → Run / Fire (when powered up)
Enter                → Pause / Select in popups
ESC                  → Exit game (back to desktop)
```

**Mobile (in phone version):**
```
On-screen D-pad (left side)   → Move
Jump button (right side)      → A button
Run button (right side)       → B button
```

---

## B7. AUDIO STRATEGY

Use **synthesized audio** via Web Audio API — no Nintendo audio files needed, avoiding copyright:

```typescript
// Generate Mario-like beeps procedurally
const audioCtx = new AudioContext();

function playJumpSound() {
  const osc = audioCtx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
  // ... connect and play
}

// Background music: simple 8-bit melody composed with Web Audio API
// OR use free chiptune music from OpenGameArt.org (CC license)
```

**Free music source:** `opengameart.org` — hundreds of CC-licensed 8-bit tracks. Search "mario style" or "chiptune platformer."

---

---

# PART C — MOBILE EXPERIENCE
## Retro Nokia Phone (3310 Style)

---

## C1. THE CONCEPT

On mobile, the entire `farhanbuilds.in` experience is presented inside a **pixel-perfect Nokia 3310 frame**. The phone IS the portfolio. Navigation happens via the virtual buttons.

---

## C2. THE PHONE FRAME

```
         ┌─────────────────────┐
         │  ╔═════════════╗   │
         │  ║             ║   │
         │  ║  SCREEN     ║   │
         │  ║  (content)  ║   │
         │  ║             ║   │
         │  ╚═════════════╝   │
         │                     │
         │   Nokia  3310       │
         │                     │
         │     ┌───┐  ┌───┐   │
         │     │ ◄ │  │ ► │   │
         │  ┌──┴───┴──┴───┴──┐│
         │  │    [SELECT]    ││
         │  └────────────────┘│
         │  ┌──┐ ┌──┐ ┌──┐   │
         │  │1 │ │2 │ │3 │   │
         │  ├──┤ ├──┤ ├──┤   │
         │  │4 │ │5 │ │6 │   │
         │  ├──┤ ├──┤ ├──┤   │
         │  │7 │ │8 │ │9 │   │
         │  ├──┤ ├──┤ ├──┤   │
         │  │* │ │0 │ │# │   │
         │  └──┘ └──┘ └──┘   │
         └─────────────────────┘
```

**Phone SVG/CSS:** The phone body is a detailed CSS/SVG illustration. The screen area is a real `<div>` with content rendered inside it.

---

## C3. PHONE SCREEN CONTENT

### Boot Screen
```
 FARHAN OS
 ─────────
 Nokia 3310
 (Farhan Edition)

 Loading...
 ████░░░░░░
```

### Main Menu
```
 FARHAN SAYED
 ─────────────
 > 1. Profile
   2. Projects
   3. Skills
   4. Achievements
   5. Contact
   0. Play Game
 ─────────────
 [Select]  [Back]
```

Arrow keys / D-pad navigate up/down. Number keys jump directly to that menu item.

### Screen Style
- Green-tinted monochrome (Nokia classic)
- Pixel font: `Press Start 2P` or `Silkscreen`
- Amber/green glow effect on screen
- Scanline CSS overlay for authenticity
- Screen dimensions: approx 280×220px at phone scale

---

## C4. EACH MENU SCREEN

**1. Profile**
```
 FARHAN SAYED
 ─────────────
 Age: 22
 City: Mumbai, IN
 Edu: MCA @ VSIT

 Builder. Winner.
 Developer. Founder.

 [←Back]  [More→]
```

**2. Projects (sub-menu)**
```
 PROJECTS (11)
 ─────────────
 > 1. Kavach 🏆
   2. JalSevak
   3. SwachhCity
   4. GovBuy 🌍
   5. DudeDice
   [↓ more...]
 ─────────────
 [Select]  [Back]
```

Selecting a project → project detail screen with name, one-liner, tech stack (scrollable via d-pad).

**3. Skills**
```
 SKILLS (67+)
 ─────────────
 > FRONTEND
   React, Next.js
   Flutter, Svelte

 [←] [Select] [→]
 ─────────────────
 Press # for All
```

**4. Achievements**
```
 ACHIEVEMENTS
 ─────────────
 🏆 SIH 2025 WIN
 🌍 OpenGroup FIN
 🥇 MechNova 1st
 🥇 Internal SIH
 🥉 CSI Ideathon
 ─────────────────
 [Select]  [Back]
```

**5. Contact**
```
 CONTACT FARHAN
 ─────────────────
 Email:
 farhan@farhan
 builds.in

 GitHub: Farhan16
 LinkedIn: farhan
 sayed16

 [Call] = open email
```

**0. Play Game**
```
 FARHAN'S WORLD
 ─────────────────
 A mobile-friendly
 version of the
 Mario game!

 High Score: 0

 [Start Game]
 [Back]
```

The mobile Mario game is a simplified, touch-friendly version with on-screen controls.

---

## C5. MOBILE GAME VERSION

A **simplified, touch-first** Mario game (same Phaser.js engine):
- Smaller viewport
- Bigger touch targets
- Virtual D-pad on left, Jump+Run buttons on right
- Same info-reveal mechanic but fewer levels (World 1 only on mobile, full game on desktop)
- Tap tutorial shown on first play

---

## C6. PHONE INTERACTIONS

| Button | Action |
|--------|--------|
| D-pad up/down | Navigate menu / scroll content |
| D-pad left/right | Switch between categories |
| Center SELECT | Confirm / open item |
| Left soft key | Back |
| Right soft key | Options / shortcut |
| Number keys 1–9 | Jump to menu item |
| `*` key | Toggle sound on/off |
| `#` key | View all items in current category |

---

## C7. TABLET EXPERIENCE

On tablet (768–1023px), show a choice screen:

```
  ┌─────────────────────────────────────────┐
  │                                         │
  │   🖥️              📱                   │
  │                                         │
  │  Desktop View    Mobile View            │
  │  (Full OS)      (Nokia Phone)           │
  │                                         │
  │  Recommended     Recommended            │
  │  for tablets     for portrait           │
  │  landscape       mode                   │
  │                                         │
  │  [ Choose Desktop ]  [ Choose Phone ]   │
  │                                         │
  │  (choice is remembered)                 │
  └─────────────────────────────────────────┘
```

Store choice in `localStorage` — user isn't asked again on return visits.

---

---

# PART D — TECH STACK & ARCHITECTURE

---

## D1. FULL TECH STACK

```
Framework:         Next.js 15 (App Router)
Language:          TypeScript
Styling:           Tailwind CSS + CSS custom properties
Animations:        Framer Motion (window open/close, transitions)
Game Engine:       Phaser.js 3 (imported as npm package)
Game Audio:        Howler.js + Web Audio API
State:             React Context + useReducer (OS window state)
Email:             EmailJS or Resend API (contact form)
Fonts:             Space Grotesk (body) + Press Start 2P (pixel UI)
                   + JetBrains Mono (terminal/code) — Google Fonts
Icons:             Custom pixel SVGs + Lucide React
Deployment:        Vercel
Domain:            farhanbuilds.in
```

---

## D2. PROJECT STRUCTURE

```
farhan-portfolio-v3/
├── public/
│   ├── game/
│   │   ├── sprites/             ← Mario sprite sheets (open source)
│   │   ├── tilesets/            ← Level tiles
│   │   ├── audio/               ← CC0 chiptune music (opengameart.org)
│   │   └── maps/                ← Phaser tilemap JSON files
│   ├── images/
│   │   ├── farhan.jpg
│   │   └── projects/
│   ├── icons/                   ← Pixel art desktop icons (SVG)
│   └── resume.pdf
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             ← Device detection → routes to OS or Phone
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── desktop/             ← Desktop OS components
│   │   │   ├── BootScreen.tsx
│   │   │   ├── Desktop.tsx          ← Main OS shell
│   │   │   ├── Taskbar.tsx
│   │   │   ├── StartMenu.tsx
│   │   │   ├── WindowManager.tsx    ← Manages open windows state
│   │   │   ├── Window.tsx           ← Base draggable window
│   │   │   └── windows/
│   │   │       ├── AboutWindow.tsx
│   │   │       ├── ProjectsWindow.tsx
│   │   │       ├── ResumeWindow.tsx
│   │   │       ├── SkillsWindow.tsx
│   │   │       ├── ExperienceWindow.tsx
│   │   │       ├── AchievementsWindow.tsx
│   │   │       ├── ContactWindow.tsx
│   │   │       ├── BrowserWindow.tsx
│   │   │       ├── SystemInfoWindow.tsx
│   │   │       └── RecycleBinWindow.tsx
│   │   │
│   │   ├── mobile/              ← Nokia phone components
│   │   │   ├── PhoneFrame.tsx
│   │   │   ├── PhoneScreen.tsx
│   │   │   ├── PhoneKeypad.tsx
│   │   │   └── screens/
│   │   │       ├── MenuScreen.tsx
│   │   │       ├── ProfileScreen.tsx
│   │   │       ├── ProjectsScreen.tsx
│   │   │       ├── SkillsScreen.tsx
│   │   │       ├── AchievementsScreen.tsx
│   │   │       └── ContactScreen.tsx
│   │   │
│   │   ├── game/                ← Phaser Mario game
│   │   │   ├── GameWrapper.tsx      ← React wrapper that mounts Phaser
│   │   │   ├── GameOverlay.tsx      ← Info popups over the game
│   │   │   └── phaser/
│   │   │       ├── main.ts          ← Phaser game config + init
│   │   │       ├── scenes/
│   │   │       │   ├── BootScene.ts
│   │   │       │   ├── PreloadScene.ts
│   │   │       │   ├── Level1_1.ts      ← Overworld
│   │   │       │   ├── Level1_2.ts      ← Underground
│   │   │       │   ├── Level1_3.ts      ← Castle / Bowser boss
│   │   │       │   └── WinScene.ts      ← Full portfolio summary + hire
│   │   │       ├── objects/
│   │   │       │   ├── Player.ts
│   │   │       │   ├── Enemy.ts
│   │   │       │   ├── QuestionBlock.ts
│   │   │       │   ├── InfoBlock.ts  ← Custom block that shows info
│   │   │       │   └── Boss.ts
│   │   │       └── data/
│   │   │           └── portfolioData.ts  ← Maps game events → info
│   │   │
│   │   └── shared/
│   │       └── TabletChoice.tsx     ← Desktop/phone choice screen
│   │
│   ├── context/
│   │   ├── WindowContext.tsx        ← OS window state management
│   │   └── PhoneContext.tsx         ← Phone screen navigation state
│   │
│   ├── hooks/
│   │   ├── useDeviceMode.ts         ← Device detection
│   │   ├── useDraggable.ts          ← Window dragging logic
│   │   ├── useResizable.ts          ← Window resizing logic
│   │   ├── useClock.ts              ← OS clock logic
│   │   └── useLocalStorage.ts
│   │
│   └── content/                     ← UNTOUCHED — all JSON data
│       ├── projects.json
│       ├── skills.json
│       ├── experience.json
│       ├── achievements.json
│       ├── certifications.json
│       └── ...
```

---

## D3. KEY IMPLEMENTATION NOTES

### Window Manager (OS)
```typescript
// Context stores all window state
interface WindowState {
  id: string;
  title: string;
  component: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

// Actions: OPEN, CLOSE, MINIMIZE, MAXIMIZE, RESTORE,
//          FOCUS, MOVE, RESIZE
```

### Draggable Windows
```typescript
// useDraggable hook — mousedown on title bar → track mouse delta
// → update window position in context
// Touch support for tablet desktop mode
```

### Phaser in React
```typescript
// GameWrapper.tsx
useEffect(() => {
  const game = new Phaser.Game(config);
  // Bridge: game dispatches events → React listens → shows overlays
  game.events.on('showPortfolioInfo', (data) => {
    setInfoPopup(data);  // React state → shows GameOverlay
  });
  return () => game.destroy(true);
}, []);
```

### Info Reveal Bridge
```typescript
// portfolioData.ts — maps game triggers to portfolio content
export const COIN_FACTS = [
  "Started coding at 16 in Mumbai!",
  "Won SIH 2025 as project lead!",
  "Led 120+ members as CSI President!",
  // ...
];

export const QUESTION_BLOCK_SKILLS = [
  { name: "React", category: "Frontend" },
  { name: "FastAPI", category: "Backend" },
  // ...all from skills.json
];

// In game scene:
this.events.emit('showPortfolioInfo', {
  type: 'achievement',
  data: ACHIEVEMENTS[currentAchievement]
});
```

---

## D4. OPEN-SOURCE RESOURCES FOR THE GAME

| Resource | Source | License |
|----------|--------|---------|
| Mario sprite sheets | `spriters-resource.com` → "Super Mario Bros (NES)" | Fan-use (non-commercial portfolio) |
| Mario tilesets (overworld, underground, castle) | `spriters-resource.com` → same search | Fan-use (non-commercial portfolio) |
| Background music (chiptune) | `opengameart.org` search "mario style chiptune" | CC0 ✅ |
| SFX (jump, coin, stomp, die, powerup) | Synthesized via Web Audio API — no file needed | No license required ✅ |
| Phaser.js | `phaser.io` | MIT License ✅ |
| Howler.js | `howlerjs.com` | MIT License ✅ |
| Tiled Map Editor | `mapeditor.org` | GPL / Free ✅ |

**Audio is 100% copyright-safe:** All SFX are procedurally synthesized (Web Audio API oscillators). Background music is CC0-licensed from opengameart.org. Zero Nintendo audio files used anywhere in the project. Sprites and tilesets are the only Nintendo-sourced assets, used strictly for a personal non-commercial portfolio.

---

---

# PART E — BUILD PLAN

---

## E1. BUILD ORDER (3–4 Weeks)

### Week 1 — Foundation + Desktop OS Core
```
Day 1:  New Next.js project setup + design tokens + fonts
        Device detection hook + routing logic
        BootScreen component (animated)

Day 2:  Desktop shell (Desktop.tsx + Taskbar.tsx)
        WindowManager context + Window base component
        Desktop icons grid

Day 3:  Draggable windows (useDraggable hook)
        Minimize/Maximize/Close behavior
        Window z-index management (focus on click)

Day 4:  StartMenu component + right-click context menu
        README.txt and About Me.txt windows (Notepad)
        System Info modal

Day 5:  Projects window (file explorer with tree + detail panel)
        Resume window (PDF viewer)
        Achievements window (zip extract animation + cards)
```

### Week 2 — Desktop Windows + Mobile Phone
```
Day 6:  Skills window (tab-based grid from skills.json)
        Experience window (timeline)
        Contact window (email compose form + EmailJS)

Day 7:  Browser window (fake browser with URL routing)
        Recycle Bin (easter egg content)
        Taskbar running apps + clock

Day 8:  Nokia phone frame (CSS/SVG illustration)
        PhoneScreen + navigation context
        Boot sequence for phone

Day 9:  All 6 phone menu screens (Profile, Projects, Skills,
        Achievements, Contact, Game)
        D-pad + number key navigation
        Pixel font + scanline screen effect

Day 10: Tablet choice screen
        localStorage preference memory
        Responsive final pass for all viewports
```

### Week 3 — Mario Game
```
Day 11: Phaser.js setup + React wrapper (GameWrapper.tsx)
        PreloadScene (load all assets)
        BootScene + WorldMap scene

Day 12: Player character (movement, jump, physics)
        Basic level tilemap (Level 1-1)
        Collision detection + camera follow

Day 13: Enemies (Goomba/Bug logic + stomp mechanic)
        Question blocks (break + reveal mechanic)
        Coin collection + HUD

Day 14: Info overlay system (GameOverlay.tsx)
        portfolioData.ts bridge
        Achievement popups + project cards in game

Day 15: Levels 1-2, 1-3 (boss fight basic)
        Boss defeat → achievement unlock flow
        Game Over screen + Win screen
```

### Week 4 — Game Polish + Full Integration
```
Day 16: All info reveals wired to real portfolioData.ts
        (all 3 levels fully populated with Farhan's real data)
        WinScene — full portfolio summary + Hire button
        Game Over screen polish

Day 17: Mobile game version (touch controls — on-screen D-pad)
        Audio: Web Audio API SFX synthesis complete
               + CC0 chiptune BGM loaded via Howler.js
        Volume toggle (mute/unmute button in game HUD)

Day 18: Full integration testing (game in desktop OS window + Nokia phone)
        "HIRE FARHAN" button in WinScene → wired to ContactWindow / phone contact screen
        Phaser game dynamic import confirmed (only loads when game window opened)
        Performance audit (game + OS running together)

Day 19: Framer Motion polish (window open/close/minimize animations)
        Easter eggs complete (recycle bin, HUD "HIRE ME" easter egg)
        Cross-browser testing (Chrome, Firefox, Safari, Edge)

Day 20: Vercel deployment + farhanbuilds.in domain setup
        Lighthouse audit + performance fixes
        Final QA pass + launch
```

---

## E2. WHAT YOU (FARHAN) NEED TO PROVIDE

```
✅ Already available in content/ JSON files:
   - All project data (11 projects)
   - All skills (67+)
   - Experience (5 entries)
   - Achievements
   - Certifications (33+)

📸 Need to provide:
   - Profile photo (farhan.jpg)
   - Project screenshots (3 per project = 33 images)
   - Resume PDF (already exists ✅)

🎮 Game customization decisions:
   - Which fun facts go in coin reveals? (draft list already in B3 — confirm or edit)
   - Should Mario character look like you? (optional: custom sprite with cap)
   - Any specific easter eggs you want hidden beyond the ones already planned?
   Note: Audio approach is locked — synthesized SFX + CC0 chiptune BGM. No decision needed.
```

---

## E3. PERFORMANCE CONSIDERATIONS

```
Phaser game:      Load game assets only when game window is opened
                  (dynamic import, not on page load)
Desktop OS:       Window content lazy-loaded when window opens
Phone screens:    All lightweight — text only, instant
Images:           All project screenshots lazy loaded
Fonts:            Press Start 2P is small (pixel font, few characters)
Target:           Lighthouse 85+ (game makes 90+ difficult)
```

---

## E4. THE ONE-LINE BRIEF FOR ANTIGRAVITY

> "Build a portfolio where desktop users get a fully functional retro OS
> (Windows 95 dark theme) with draggable windows, a start menu, and all
> portfolio content inside the windows — plus a playable Super Mario game
> accessible as 'Farhan's World.exe'. Mobile users get a Nokia 3310 phone
> with button navigation and a touch-friendly game. Tablet users choose.
> Stack: Next.js 15 + TypeScript + Tailwind + Phaser.js + Framer Motion.
> All content from src/content/ JSON files."

---

*Portfolio V3 Complete Plan — "Farhan's World"*
*farhanbuilds.in · Farhan Sayed · Mumbai*
*Plan version 2.0 — All contradictions resolved. Ready for Antigravity.*
