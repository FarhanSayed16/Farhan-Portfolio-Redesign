# Mobile Modern-Site Polish Plan (MX)

Scope: `/` on phones (`ModernPortfolioShell` → `ModernSite standalone`).
Desktop IE / Time Machine / Nokia / `/connectQR` must not change.

## Why it still feels wrong (root causes, from the 3 screenshots + code)

| Symptom | Root cause |
| --- | --- |
| Scroll feels heavy, laggy, "not native" | The page is **not** the scroller. `.mps-root` is `position: fixed` and `.bv-modern` is an inner `overflow-y: auto` box. Nested scrollers lose Chrome-Android's compositor fast path, kill URL-bar collapse, and re-run layout on every frame. |
| Frames drop while scrolling | `backdrop-filter: blur(40px) saturate(200%)` in 21 places (dock, cards, contact). Each blurred layer is re-rasterized per frame on a mid-range GPU. |
| Long scroll gets progressively janky | `.bv-modern-atmosphere` is `position: absolute; inset: 0` → one paint layer as tall as the **whole document** (~8000px) with a 60px grid. |
| Dock floats mid-screen over "Mumbai, India" / project card | `.bv-floating-dock-container` is `absolute; bottom: 24px` inside a viewport-height box, i.e. an overlay that sits on top of content, *plus* the shell already has its own bottom bar → two competing bottom chromes. |
| Portrait looks like an oval, not the circular frame | `.bv-portrait-ring` keeps its desktop aspect while the frame is forced to `border-radius: 50%`. |
| Random red diamonds + stray lines between sections | `LaserDivider`'s traveling beam + HUD diamond are desktop-scale decoration; at 390px they read as glitches. |
| Data-heavy first paint | Marquee is `display: none` on mobile but still **rendered** → ~52 `cdn.simpleicons.org` requests on a phone network. |
| GitHub row still busy | 182 `motion.button` nodes (framer instances) for a strip nobody hovers on touch. |

## Work items

- **MX-1 — Make the document the scroller (biggest win).**
  Standalone: `.mps-root` static, `html/body` scroll unlocked, `ModernSite` viewport `height: auto; overflow: visible`, `.bv-modern` no inner scroll, `useScroll()` tracks window. Native scrolling + URL-bar collapse + no nested-scroll jank.

- **MX-2 — One bottom chrome.**
  Hide `FloatingDock` on standalone. The shell's bottom bar becomes the real nav: Work / Skills / Awards / Contact + "Nokia" pill, `position: fixed`, safe-area aware, active item tracked with a single `IntersectionObserver`. Content gets bottom padding so nothing hides under it.

- **MX-3 — Paint budget.**
  Standalone: no `backdrop-filter`; atmosphere becomes `position: fixed` (viewport-sized); `content-visibility: auto` + `contain-intrinsic-size` on sections so offscreen ones cost nothing; laser beam/diamond replaced by a hairline; marquee not rendered at all; GitHub compact cells are plain buttons (no framer).

- **MX-4 — Layout/typography pass.**
  Circular portrait with a matching ring, SIH card under the photo, tighter hero CTA pair, section rhythm (28px), project card fits 390px, contact block full-width buttons.

- **MX-5 — Verify.** `eslint` on touched files + `scripts/check-mobile-modern.mjs`.

## Follow-up (2026-07-29) — scroll + SIH regression

- Desktop SIH leaked via unscoped `.bv-portrait-sih` — removed; caption overrides are standalone-only; SIH is on-image again for both modes.
- Mobile scroll: document unlock flaky on Android → fixed `.mps-root` scrollport again (same as `/connectQR`).
- Mobile hero: tighter, Syne/Outfit type, SIH pill on photo.

## Status — MX-1…MX-5 done

| Item | Result |
| --- | --- |
| MX-1 | Phone scrolls inside fixed `.mps-root` (`overflow-y: auto`, touch pan-y). |
| MX-2 | `FloatingDock` is `!standalone` only. Shell owns a fixed `.mps-nav`: Work / Skills / Awards / Contact + Nokia pill, active item from one `IntersectionObserver`, `padding-bottom` on the content so the footer clears it. |
| MX-3 | `backdrop-filter: none !important` for the whole standalone subtree; atmosphere is `position: fixed` (viewport-sized); `contain: layout paint style` per section; laser beam + diamond hidden (hairline stays); marquee **not rendered** (saves ~52 icon requests); compact GitHub cells are plain buttons instead of 180 framer instances. |
| MX-4 | Circular portrait + matching radial ring, SIH card under the photo, `.bv-cta-row` as a 2-up 48px grid (the old rule targeted a class that doesn't exist), 26px section rhythm, showcase card stacked with prev/next in a row under it instead of overhanging, full-width contact buttons. |
| MX-5 | `eslint` clean on touched files (also made the GitHub fallback grid seeded — it was impure and could hydrate mismatched), `tsc --noEmit` clean, both smoke scripts pass. |

**Rejected:** `content-visibility: auto` on sections. It skips layout for offscreen content and estimates size, so a jump from the hero to Contact lands in the wrong place and then shifts — unacceptable now that the bottom nav is the primary navigation. `contain: layout paint style` gives most of the paint win with no size guessing.

## Guardrails

Everything is scoped to `.bv-modern-viewport--standalone` / `.mps-*` or gated behind the `standalone` prop, so the desktop browser window keeps Lenis, custom cursor, dock, marquee, laser beams.
