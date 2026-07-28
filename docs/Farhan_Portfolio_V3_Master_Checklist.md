# FARHAN SAYED — PORTFOLIO V3
# MASTER CHECKLIST (EXECUTION TRACKER)
### Companion to [`Farhan_Portfolio_V3_Master_Plan.md`](./Farhan_Portfolio_V3_Master_Plan.md)
**Rule:** Mark items `[x]` only when verified. A phase is complete only when every box under it is `[x]` **and** the phase Exit Criteria block is `[x]`.

**Status legend**
- `[x]` not started
- `[x]` in progress (optional manual note in Status column — use comments in PRs)
- `[x]` done & verified

**How to use**
1. Start Phase 01. Do not skip foundation phases.
2. After each sub-phase, tick its boxes.
3. At phase end, tick Exit Criteria.
4. Update the Progress Summary table at the top after each phase.

---

## Progress Summary

| Phase | Name | Status |
|------:|------|--------|
| 01 | Project Bootstrap & Repository Structure | [x] |
| 02 | Design System, Tokens & Fonts | [x] |
| 03 | Device Detection, Routing & App Shell | [x] |
| 04 | Desktop Boot Sequence | [x] |
| 05 | Desktop Shell (Wallpaper, Icons, Layout) | [x] |
| 06 | Window Manager Core | [x] |
| 07 | Taskbar, Start Menu & System Tray | [x] |
| 08 | Desktop Context Menu & Global Shortcuts | [x] |
| 09 | Core Content Windows (README, About, System, Recycle) | [x] |
| 10 | Projects Explorer Window | [x] |
| 11 | Skills, Experience, Achievements, Certs, Resume | [x] |
| 12 | Browser.exe, Contact & Email Integration | [x] |
| 13 | Nokia Phone Frame & Navigation Core | [x] |
| 14 | Nokia Portfolio Screens | [x] |
| 15 | Tablet Choice Polish & Cross-Surface QA Gate | [x] |
| 16 | Phaser Bootstrap, Bridge & Game Wrapper | [x] |
| 17 | Game Assets Pipeline | [x] |
| 18 | Core Gameplay (Player, 1-1, Enemies, Items) | [x] |
| 19 | Levels 1-2, 1-3 (Boss), Win Flow | [x] |
| 20 | Portfolio Overlay System + Game Audio | [x] |
| 21 | Mobile Game Controls & Dual-Surface Game QA | [x] |
| 22 | Visual Polish, Icons, Favicons, Motion Pass | [x] |
| 23 | Content Enrichment & Real Assets | [x] |
| 24 | Deployment, Domain, Final QA & Launch | [x] |

**Overall:** `22 / 24` phases complete

---

# PHASE 01 — Project Bootstrap & Repository Structure

### 01.1 — Initialize Next.js application
- [x] Next.js 15 App Router project created
- [x] TypeScript enabled (strict mode ON)
- [x] Tailwind CSS 3 configured
- [x] ESLint `next/core-web-vitals` working
- [x] `npm run dev` succeeds
- [x] `npm run build` succeeds

### 01.2 — Install runtime dependencies
- [x] `framer-motion` installed
- [x] `phaser` installed
- [x] `howler` + `@types/howler` installed
- [x] `@emailjs/browser` installed
- [x] `lucide-react` installed
- [x] No unnecessary UI component library added

### 01.3 — Scaffold directory tree
- [x] `public/game/sprites|tilesets|audio|maps` created
- [x] `public/images/projects` created
- [x] `public/icons` created
- [x] `src/app` with `layout.tsx`, `page.tsx`, `globals.css`
- [x] `src/components/desktop` (+ `windows/`)
- [x] `src/components/mobile` (+ `screens/`)
- [x] `src/components/game` (+ `phaser/` stubs)
- [x] `src/components/shared`
- [x] `src/context`, `src/hooks`, `src/lib` created
- [x] Content path decided (`data/content` wired in)

### 01.4 — Wire content JSON into the app
- [x] Content loader imports `site.json`
- [x] Content loader imports `about.json`
- [x] Content loader imports `projects.json`
- [x] Content loader imports `skills.json`
- [x] Content loader imports `experience.json`
- [x] Content loader imports `achievements.json`
- [x] Content loader imports `certifications.json`
- [x] Content loader imports `testimonials.json`
- [x] Content loader imports `volunteering.json`
- [x] Content loader imports `research.json`
- [x] TypeScript interfaces exist for core content shapes

### 01.5 — Env + ignore hygiene
- [x] `.env.example` with EmailJS keys documented
- [x] `.env.local` gitignored
- [x] `.next` and `node_modules` gitignored

### Phase 01 Exit Criteria
- [x] Dev + build succeed
- [x] Content loader returns real JSON data
- [x] No secrets committed

---

# PHASE 02 — Design System, Tokens & Fonts

### 02.1 — CSS custom properties
- [x] OS background / taskbar / window / window-body tokens
- [x] Title active/inactive + border + button tokens
- [x] Cyan / violet / gold / text / text-muted tokens
- [x] Nokia green / body / screen tokens

### 02.2 — Google fonts via `next/font`
- [x] Space Grotesk → `--font-body`
- [x] JetBrains Mono → `--font-mono`
- [x] Press Start 2P → `--font-pixel`
- [x] Font variables applied on root layout

### 02.3 — Tailwind theme extensions
- [x] Font families mapped
- [x] Brand colors mapped
- [x] `scanlines` keyframe
- [x] Boot/cursor or wallpaper motion keyframe(s)

### 02.4 — Shared base styles
- [x] Full-viewport shell reset
- [x] Window scrollbar styling
- [x] Utility classes (`.font-pixel`, `.font-mono`, `.os-button`, `.scanlines`)

### 02.5 — Metadata shell
- [x] Document title from site branding
- [x] Meta description set
- [x] Temporary favicon placeholder present

### Phase 02 Exit Criteria
- [x] Tokens used by a visible demo element
- [x] All three fonts render
- [x] Tab title shows Farhan branding

---

# PHASE 03 — Device Detection, Routing & App Shell

### 03.1 — `useDeviceMode`
- [x] Returns `desktop` for width ≥ 1024
- [x] Returns `mobile` for width < 768
- [x] Returns `tablet` for 768–1023
- [x] Resize listener works
- [x] SSR/hydration flash prevented or mitigated

### 03.2 — `useLocalStorage`
- [x] Persist tablet preference key
- [x] Read preference on load without crash when empty

### 03.3 — Root `page.tsx` orchestration
- [x] Desktop routes to OS pipeline
- [x] Mobile routes to Phone pipeline
- [x] Tablet routes to choice unless preference set

### 03.4 — `TabletChoice`
- [x] Desktop View option
- [x] Mobile/Phone View option
- [x] Choice saved to localStorage
- [x] Returning visit skips choice when preference exists

### 03.5 — Routing UX baseline
- [x] Choice controls keyboard-focusable
- [x] No unwanted page-level horizontal scroll

### Phase 03 Exit Criteria
- [x] Breakpoint routing verified on resize
- [x] Tablet preference survives reload
- [x] No persistent wrong-shell flash on desktop

---

# PHASE 04 — Desktop Boot Sequence

### 04.1 — `BootScreen` shell
- [x] BIOS screen with joke system checks
- [x] Loading bar “Starting Farhan OS…”
- [x] Login card “Click to Enter”
- [x] Handoff to Desktop after login

### 04.2 — Timing + skip
- [x] Full sequence ~10–15s if not skipped
- [x] Skip control always visible
- [x] Skip never leaves blank/stuck state

### 04.3 — Startup chime
- [x] Synthesized Web Audio chime
- [x] Respects mute if preference already set

### 04.4 — First-boot flags
- [x] Flag exists for README auto-open later

### Phase 04 Exit Criteria
- [x] Skip verified
- [x] Login → desktop verified
- [x] Chime behavior verified (or muted)

---

# PHASE 05 — Desktop Shell (Wallpaper, Icons, Layout)

### 05.1 — `Desktop.tsx`
- [x] Full viewport desktop under taskbar reservation
- [x] Dark navy + grid wallpaper
- [x] `farhanbuilds.in` watermark

### 05.2 — Desktop icon assets
- [x] Projects folder icon
- [x] Resume.pdf icon
- [x] About Me.txt icon
- [x] Achievements.zip icon
- [x] Experience icon
- [x] Skills.exe icon
- [x] Farhan's World.exe icon
- [x] Browser.exe icon
- [x] Contact.lnk icon
- [x] Recycle Bin icon
- [x] README.txt icon
- [x] System Info icon (if shown on desktop or Start-only — tick either path)

### 05.3 — Icon grid behavior
- [x] Single-click selects
- [x] Double-click opens (dispatches open window)
- [x] Labels readable

### 05.4 — Icon placement
- [x] Default layout does not collide with taskbar
- [x] Usable on 1366×768 and 1920×1080

### Phase 05 Exit Criteria
- [x] All planned icons visible
- [x] Double-click open action fires

---

# PHASE 06 — Window Manager Core

### 06.1 — `WindowContext` + reducer
- [x] WindowState fields implemented
- [x] OPEN / CLOSE / MINIMIZE / MAXIMIZE / RESTORE
- [x] FOCUS / MOVE / RESIZE actions

### 06.2 — `Window.tsx` chrome
- [x] Title bar + controls (− □ ✕)
- [x] Active vs inactive title styles
- [x] Framer Motion open/close animation
- [x] Content slot renders child app

### 06.3 — `useDraggable`
- [x] Title-bar drag works
- [x] Clamped so window stays reachable
- [x] Touch drag works (tablet desktop)

### 06.4 — `useResizable`
- [x] Edge/corner resize works
- [x] Min size enforced (~280×200)

### 06.5 — Focus & Z-index
- [x] Click focuses and raises z-index
- [x] Only one active title at a time

### Phase 06 Exit Criteria
- [x] Two+ windows move/resize without stuck drag
- [x] Maximize respects taskbar
- [x] Close/minimize/reopen clean

---

# PHASE 07 — Taskbar, Start Menu & System Tray

### 07.1 — `Taskbar.tsx`
- [x] Start button
- [x] Running app buttons (focus/restore)
- [x] Tray volume mute toggle
- [x] Tray decorative connectivity/battery (optional visuals OK)
- [x] Live clock area

### 07.2 — `useClock`
- [x] Updates every second
- [x] Readable local time format

### 07.3 — `StartMenu.tsx`
- [x] Header avatar + name + role
- [x] Resume / Projects / Skills / Achievements / Experience / Contact entries
- [x] Farhan's World.exe entry
- [x] Browser entry
- [x] System Info entry
- [x] Shut Down entry

### 07.4 — Start menu submenus / deep opens
- [x] Projects list can open Projects focused on an id (or equivalent)
- [x] Other entries open correct windows

### 07.5 — Shut Down flow
- [x] Goodbye/curtains animation
- [x] Restart back to boot available

### Phase 07 Exit Criteria
- [x] Every Start item opens correct target
- [x] Running apps mirror window state
- [x] Clock live; mute toggle works

---

# PHASE 08 — Desktop Context Menu & Global Shortcuts

### 08.1 — Desktop context menu
- [x] Opens on right-click desktop
- [x] About Farhan opens About
- [x] Hire Farhan opens Contact
- [x] Click-away / Esc closes menu

### 08.2 — Keyboard shortcuts
- [x] `F1` Start Menu
- [x] `F2` Launch game
- [x] `Esc` closes focused window / menus first
- [x] `?` opens Help/README

### 08.3 — Focus traps
- [x] Start Menu closes correctly
- [x] Context menu does not brick UI

### Phase 08 Exit Criteria
- [x] Shortcuts verified with a window open
- [x] Context menu Hire/About verified

---

# PHASE 09 — Core Content Windows

### 09.1 — README.txt
- [x] Notepad monospace UI
- [x] Quick start + shortcuts listed
- [x] Auto-opens once after first boot

### 09.2 — About Me.txt
- [x] Bio from content
- [x] Timeline rendered
- [x] Social links clickable

### 09.3 — System Info
- [x] Fun PC stats shown
- [x] Counts derived from JSON where possible

### 09.4 — Recycle Bin
- [x] Easter-egg deleted files list
- [x] At least one “In Progress…” gag

### Phase 09 Exit Criteria
- [x] README auto-open behavior verified
- [x] About shows live data
- [x] System Info + Recycle Bin launch correctly

---

# PHASE 10 — Projects Explorer Window

### 10.1 — Two-panel explorer
- [x] Left folder tree / category list
- [x] Right detail panel

### 10.2 — Project detail
- [x] Title, tagline, role, award
- [x] Short description
- [x] Problem/solution/impact graceful when missing
- [x] Tech chips
- [x] Repo/Demo buttons handle null URLs

### 10.3 — Project images
- [x] `ProjectImage` component
- [x] Gradient placeholder on missing image
- [x] Layout stable when image missing

### 10.4 — Deep-link open
- [x] Open with `projectId` selects that project

### Phase 10 Exit Criteria
- [x] All projects selectable
- [x] Featured + archived reachable
- [x] Missing images never crash UI

---

# PHASE 11 — Skills, Experience, Achievements, Certs, Resume

### 11.1 — Skills.exe
- [x] Categories from `skills.json`
- [x] Skills listed per category

### 11.2 — Experience timeline
- [x] All experience entries shown
- [x] Expand/detail works

### 11.3 — Achievements zip UI
- [x] Extracting animation (short)
- [x] Award cards grid
- [x] Detail popup on click

### 11.4 — Certifications
- [x] List with issuer/date
- [x] External verify links open new tab
- [x] Long list not drowning UI (collapse / featured-first / sort)

### 11.5 — Resume.pdf
- [x] Viewer for `/resume.pdf`
- [x] Download control
- [x] Missing PDF empty state

### 11.6 — Volunteering / Testimonials / Research
- [x] Reachable without 404 (window or About subsection)
- [x] Safe empty states if content thin

### Phase 11 Exit Criteria
- [x] Skills / Experience / Achievements / Resume from desktop + Start
- [x] Cert links work
- [x] Resume empty state OK if PDF absent

---

# PHASE 12 — Browser.exe, Contact & Email Integration

### 12.1 — Fake Browser chrome
- [x] Address bar
- [x] Back / forward history stack
- [x] Refresh behavior

### 12.2 — Internal fake routes
- [x] Home content
- [x] `/projects` content
- [x] `/contact` content
- [x] `/blog` fun facts content
- [x] GitHub host opens real GitHub (new tab)

### 12.3 — Contact compose window
- [x] From / To / Subject / Body fields
- [x] Attach Resume decorative control
- [x] Send Message CTA

### 12.4 — EmailJS wiring
- [x] Sends when env vars present
- [x] Fallback (mailto / message) when env missing

### 12.5 — Validation & feedback
- [x] Required field validation
- [x] Success state
- [x] Error state

### Phase 12 Exit Criteria
- [x] Fake URLs switch content
- [x] Contact tested with and without EmailJS
- [x] Mailto/fallback works without keys

---

# PHASE 13 — Nokia Phone Frame & Navigation Core

### 13.1 — `PhoneFrame`
- [x] Body, bezel, speaker, branding visuals
- [x] Soft keys + D-pad + number pad visuals
- [x] Centered with safe margins on mobile

### 13.2 — `PhoneScreen`
- [x] Content overlay region
- [x] Green tint + scanlines + glow

### 13.3 — `PhoneContext`
- [x] currentScreen + history + selectedIndex
- [x] navigate / back / move / select actions

### 13.4 — `PhoneKeypad` mapping
- [x] D-pad navigation
- [x] SELECT confirms
- [x] Soft key Back
- [x] Number jump-to-item
- [x] `*` mute toggle hook
- [x] `#` show-all hook where used

### 13.5 — Phone boot
- [x] Boot screen → Main Menu

### Phase 13 Exit Criteria
- [x] Buttons drive screen state
- [x] Back pops history
- [x] Looks correct at ~375–430px width

---

# PHASE 14 — Nokia Portfolio Screens

### 14.1 — Main Menu
- [x] Profile / Projects / Skills / Achievements / Contact / Play Game
- [x] Cursor highlight
- [x] Number shortcuts

### 14.2 — Profile
- [x] Identity snapshot
- [x] Short bio readable on screen size

### 14.3 — Projects
- [x] List with awards marked
- [x] Detail screen with tech + description

### 14.4 — Skills
- [x] Category browse left/right or equivalent

### 14.5 — Achievements
- [x] List + detail on select

### 14.6 — Contact
- [x] Email / GitHub / LinkedIn shown
- [x] Open email / call action works

### 14.7 — Game launcher
- [x] Title + Start Game
- [x] High score from localStorage (even if 0)

### Phase 14 Exit Criteria
- [x] Every menu path reachable and backable
- [x] Content sourced from same JSON as desktop
- [x] Overflow handled via D-pad scroll

---

# PHASE 15 — Tablet Choice Polish & Cross-Surface QA Gate

### 15.1 — Tablet choice polish
- [x] Clear labels / recommendations
- [x] Preference remember verified
- [x] Preference reset path exists OR documented as Start-over via localStorage clear

### 15.2 — Desktop-on-tablet
- [x] Touch drag windows
- [x] Start/icon hit targets usable

### 15.3 — Mobile landscape
- [x] Frame scales
- [x] Keypad usable / SELECT not clipped

### 15.4 — Manual demo script (pre-game)
- [x] Boot OS → open ≥5 windows
- [x] Phone menu full tour
- [x] Notes captured for remaining bugs

### Phase 15 Exit Criteria
- [x] Desktop + mobile + tablet paths manually validated
- [x] No critical layout bugs on Chrome desktop + mobile

---

# PHASE 16 — Phaser Bootstrap, Bridge & Game Wrapper

### 16.1 — Dynamic import
- [x] Phaser not required on initial page import path
- [x] Loads only when game opens

### 16.2 — `GameWrapper.tsx`
- [x] Mounts into container
- [x] Destroys game on unmount
- [x] Platform + size props wired

### 16.3 — `GameBridge`
- [x] showOverlay / hideOverlay callbacks
- [x] game over / win callbacks
- [x] overlay-dismissed / play-again / mobile-input events

### 16.4 — `createGame` factory
- [x] 768×480, pixelArt true
- [x] Arcade physics gravity configured
- [x] Scale FIT
- [x] Scene list registered (even if stubs)

### 16.5 — Dual mounts
- [x] Desktop: Farhan's World.exe window hosts game
- [x] Phone: game mounts in screen region

### Phase 16 Exit Criteria
- [x] Open/close game twice without duplicate contexts/leaks
- [x] Spot-check: Phaser not in initial main bundle

---

# PHASE 17 — Game Assets Pipeline

### 17.1 — Sprites decision locked
- [x] Decision recorded: custom Farhan-branded **or** approved fan sprites
- [x] Filenames documented for code keys

### 17.2 — Sprite sheets present
- [x] Player sheet
- [x] Enemies sheet
- [x] Items sheet
- [x] Tiles sheet
- [x] HUD elements (if separate)
- [x] frameWidth/frameHeight noted in code/comments

### 17.3 — Tilemaps
- [x] `level_1_1.json`
- [x] `level_1_2.json`
- [x] `level_1_3.json`
- [x] Ground collides property set
- [x] MarioSpawn object present per level
- [x] Q-blocks with portfolioIndex where needed
- [x] Flagpole / Warp / BowserSpawn / Axe objects as required

### 17.4 — BGM files
- [x] overworld ogg+mp3
- [x] underground ogg+mp3
- [x] castle ogg+mp3
- [x] victory ogg+mp3
- [x] gameover ogg+mp3
- [x] CC0 / safe license confirmed

### 17.5 — Placeholders allowed
- [x] If finals missing, temporary assets load without 404
- [x] Swap path requires no API change

### Phase 17 Exit Criteria
- [x] Preload reaches 100% without 404
- [x] Filenames match Phaser keys

---

# PHASE 18 — Core Gameplay (Player, Level 1-1, Enemies, Items)

### 18.1 — Boot + Preload scenes
- [x] Loading bar
- [x] Animations registered (player walk/jump/die, enemy, coin, Q-block)

### 18.2 — `BaseLevel`
- [x] HUD (name, lives, score, world, time)
- [x] Timer countdown
- [x] Pause/resume with overlay bridge

### 18.3 — Player
- [x] Move left/right
- [x] Variable jump
- [x] Run modifier
- [x] Camera follow
- [x] Fall death

### 18.4 — Level 1-1
- [x] Collisions work
- [x] Flagpole completes level

### 18.5 — Enemies + items
- [x] Goomba stomp / damage
- [x] Coins collect
- [x] Question blocks bump + spawn
- [x] Mushroom power-up basic state

### 18.6 — Desktop input
- [x] Arrows/WASD
- [x] Jump keys
- [x] Run key
- [x] Esc exits to OS

### Phase 18 Exit Criteria
- [x] Finish 1-1 without softlock
- [x] Death + retry works
- [x] Physics feel acceptable (tunable later OK)

---

# PHASE 19 — Levels 1-2, 1-3 (Boss), Win Flow

### 19.1 — Level 1-2
- [x] Underground look + BGM
- [x] Warp trigger
- [x] Progress to 1-3

### 19.2 — Level 1-3
- [x] Castle hazards (lava)
- [x] Bowser present
- [x] Axe overlap works
- [x] Bridge collapse sequence

### 19.3 — Boss → win payload
- [x] Major overlay emitted
- [x] Transition to WinScene

### 19.4 — WinScene + Play Again
- [x] Victory BGM
- [x] Hire Farhan → Contact (desktop + phone)
- [x] Play Again resets to 1-1 cleanly

### 19.5 — Game Over
- [x] Overlay + retry when lives = 0

### Phase 19 Exit Criteria
- [x] Full 1-1 → 1-2 → 1-3 → Win path tested
- [x] Hire CTA opens Contact both surfaces
- [x] Play Again reset verified

---

# PHASE 20 — Portfolio Overlay System + Game Audio

### 20.1 — `portfolioData.ts`
- [x] Coin facts per level
- [x] Q-block skills per level
- [x] Mushroom projects per level
- [x] Star achievements per level
- [x] Level-clear copy
- [x] Bowser win summary copy

### 20.2 — `GameOverlay.tsx`
- [x] fact
- [x] skill
- [x] project
- [x] achievement
- [x] level-clear
- [x] game-over
- [x] win (+ hire / play again)

### 20.3 — Triggers wired
- [x] Coin milestones
- [x] Q-block hits
- [x] Mushroom / star / fireflower
- [x] Warp
- [x] Flag
- [x] Death
- [x] Boss defeat

### 20.4 — SFXSynth
- [x] jump / coin / block / stomp
- [x] powerup / die / flagpole
- [x] gameover / boss sounds
- [x] No Nintendo audio files in repo

### 20.5 — BGM via Howler/Phaser
- [x] Per-level loop
- [x] Pause on overlay
- [x] Mute sync with OS / phone

### 20.6 — HUD easter egg
- [x] High score → “HIRE ME” name easter egg

### Phase 20 Exit Criteria
- [x] Each overlay type seen in a playtest
- [x] Mute stops SFX + BGM
- [x] Audio license-safe

---

# PHASE 21 — Mobile Game Controls & Dual-Surface Game QA

### 21.1 — Touch controls
- [x] D-pad left/right
- [x] A jump
- [x] B run
- [x] Inputs reach Phaser via bridge

### 21.2 — Overlay on small screen
- [x] Text readable
- [x] Buttons tappable

### 21.3 — Pause / exit
- [x] Exit to phone menu without freeze
- [x] Game destroys cleanly

### 21.4 — Performance
- [x] Playable on mid-tier phone
- [x] Deliberate simplifications commented if any

### 21.5 — Parity
- [x] Overlays work on phone
- [x] Win hire path works on phone
- [x] Mute works on phone
- [x] Restart works on phone

### Phase 21 Exit Criteria
- [x] Level 1-1 completable on real phone
- [x] Exit returns to menu cleanly

---

# PHASE 22 — Visual Polish, Icons, Favicons, Motion Pass

### 22.1 — Favicons / final icons
- [x] `favicon.ico`
- [x] `favicon.svg`
- [x] `apple-touch-icon.png`
- [x] Desktop icon set final pass

### 22.2 — Motion consistency
- [x] Window open/close/minimize
- [x] Start Menu animation
- [x] Phone screen transitions
- [x] Game overlay motion

### 22.3 — Micro-interactions
- [x] Icon hover effects (game + recycle at minimum)
- [x] Button pressed states
- [x] Boot cursor / type effect polish

### 22.4 — Empty / loading / error UI
- [x] Missing resume
- [x] Missing screenshots
- [x] EmailJS failure messaging

### 22.5 — Easter eggs reviewed
- [x] Recycle Bin
- [x] HUD HIRE ME
- [x] Right-click Hire
- [x] Any extra eggs documented

### Phase 22 Exit Criteria
- [x] No lorem in chrome UI
- [x] Favicon visible in tab
- [x] Motion does not trap focus

---

# PHASE 23 — Content Enrichment & Real Assets (Deferred OK)

### 23.1 — Canonical identity
- [ ] Single email decision applied everywhere
- [ ] Education line consistent
- [ ] Taglines consistent (site / About / phone / meta)

### 23.2 — Projects completeness
- [ ] Missing problem/solution/impact filled or accepted
- [ ] Public repo/demo URLs added where available
- [ ] Real screenshots dropped with correct filenames
  - [ ] kavach 1–3
  - [ ] swachhcity 1–3
  - [ ] ecosweep 1–3
  - [ ] govbuy 1–3
  - [ ] recruitment 1–3
  - [ ] jalsevak 1–3
  - [ ] ayush 1–3
  - [ ] mediscan 1–3
  - [ ] dudedice 1–3
  - [ ] alumni 1–3
  - [ ] ibm 1–3

### 23.3 — Profile + resume
- [ ] Profile photo in place
- [ ] Final resume PDF in `/public/resume.pdf`

### 23.4 — Certifications curation
- [ ] Featured shortlist for UI
- [ ] Full list still accessible

### 23.5 — Testimonials policy
- [ ] Real quotes kept **or** section hidden

### 23.6 — Game copy approval
- [ ] `portfolioData.ts` facts approved
- [ ] Project popup copy approved
- [ ] Bowser win copy approved

### 23.7 — EmailJS production
- [ ] Keys in `.env.local`
- [ ] Keys in Vercel
- [ ] Real test email received

### Phase 23 Exit Criteria
- [ ] No critical public content contradictions
- [ ] Contact delivers mail in production config
- [ ] Featured projects screenshots accepted (real or explicit placeholders)

---

# PHASE 24 — Deployment, Domain, Final QA & Launch

### 24.1 — Vercel
- [ ] Repo connected
- [ ] Next.js preset
- [ ] Production deploy succeeds

### 24.2 — Domain
- [ ] `farhanbuilds.in` DNS pointed
- [ ] `www` handled if required
- [ ] HTTPS works

### 24.3 — Production env
- [ ] EmailJS vars set
- [ ] Production Contact test sent

### 24.4 — Cross-browser QA
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Edge desktop
- [ ] Safari desktop (if available)
- [ ] iOS Safari / Chrome mobile

### 24.5 — Performance
- [ ] Lighthouse run on landing/boot path
- [ ] Phaser not in initial JS confirmed
- [ ] First-load blockers fixed

### 24.6 — Full regression script
- [ ] Boot → open 8+ windows
- [ ] Phone full tour
- [ ] Play Level 1-1 minimum
- [ ] Win/hire or Contact path
- [ ] Shortcuts + mute + tablet preference

### 24.7 — Launch
- [ ] Production smoke test signed off
- [ ] Release tagged (optional)
- [ ] Post-launch monitor Contact + asset 404s for 24–48h

### Phase 24 Exit Criteria
- [ ] HTTPS live on farhanbuilds.in
- [ ] Desktop + mobile + game smoke tests pass on production
- [ ] This checklist Phase 24 fully `[x]`

---

## Global non-negotiables (tick at end of project)

- [ ] Desktop users get Farhan OS (not a conventional scroll site as primary)
- [ ] Mobile users get Nokia phone primary experience
- [ ] Tablet users get choice + memory
- [ ] Game is playable (World 1, 3 levels) with portfolio overlays
- [ ] Hire / Contact path exists from OS, phone, and game win
- [ ] Audio strategy copyright-safe (synthesized SFX + CC0 BGM)
- [ ] Content JSON remains source of truth
- [ ] Placeholders never crash production UI
- [ ] Master Plan Phase Exit Criteria all satisfied

---

## Quick reference — key files to create during execution

| Area | Key files |
|------|-----------|
| App entry | `src/app/layout.tsx`, `page.tsx`, `globals.css` |
| Content | `src/lib/content.ts` + types; `data/content/*.json` |
| OS state | `src/context/WindowContext.tsx` |
| OS UI | `Desktop.tsx`, `Taskbar.tsx`, `StartMenu.tsx`, `Window.tsx`, `BootScreen.tsx` |
| OS apps | `src/components/desktop/windows/*` |
| Phone | `PhoneFrame.tsx`, `PhoneScreen.tsx`, `PhoneKeypad.tsx`, `PhoneContext.tsx`, `screens/*` |
| Game React | `GameWrapper.tsx`, `GameOverlay.tsx` |
| Game Phaser | `phaser/main.ts`, `bridge/GameBridge.ts`, `scenes/*`, `audio/SFXSynth.ts`, `data/portfolioData.ts` |
| Assets | `public/icons/*`, `public/game/**`, `public/images/**`, `public/resume.pdf` |

---

*Master Checklist — Portfolio V3 “Farhan's World”*  
*farhanbuilds.in · Farhan Sayed · Mumbai*  
*Document version 1.0 — mirrors Master Plan 24 phases*
