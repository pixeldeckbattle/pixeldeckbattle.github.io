# PixelDeck Studio (was PixelDeck Forge) — handoff

Owner's own Android app (APK only) for laying out Pixeldeck Battle's screens before Claude builds them into the real game. Talk to the owner in Thai.

## Decided with the owner (15 Oct 2026)
- Part-based character maker dropped: the game uses full-frame sprite sheets, not parts. Owner wants an editor to arrange/compose every game screen freely ("Custom in the app, then send to Claude"), premium like a world-class game tool. A GPT-sheet cutter for new cards (studio idea 1) comes later.

## How it works
- `forge/capture/capture.js` (Playwright, run from repo root after `tools/mkt_page.py` built `_t.html`): opens the real game at 915×412 (phone landscape), visits 23 screens (lobby, prep, teampop, battle, result, coll, zoom, shop, amtab, fusehub, pvp, tower, quests, afk, mail, topup, exg, profile, invite, settings, guide, market, troom), freezes timers/animations, and saves per screen: `ref.jpg` (as seen), `bg.jpg` (background only), one transparent PNG per element + `screen.json` (box, selector path, data-act/key, text, font, bg image). Popups (#ov / #zoom) are captured as their own layers over the dimmed screen. Output: `forge/apk/app/src/main/assets/www/screens/` (committed). Re-run when the game UI changes.
- Editor: `forge/studio.html` (single file). `node forge/build_assets.js` writes www/index.html, screens/data.js (all screen.json) and copies the game's art folders (ic ic2 ui am rk art cards spr fx bg fnt) to www/game/ + game/manifest.js (git-ignored; CI rebuilds it).
- Android shell `forge/apk` (Java WebView): serves assets/www at https://studio.pixeldeck.app/ via shouldInterceptRequest (same origin, so canvases export). Bridge window.Android: begin/chunk/end (save to Download/PixelDeckForge), share(id), copy(text). Package id com.pixeldeck.forge (installs over Forge).
- Build: .github/workflows/forge-apk.yml on push to forge/** → release forge-v1.<run> with PixelDeckForge-v1.<run>.apk. Keystore forge/apk/forge.jks committed.
- Test locally: `cd forge/apk/app/src/main/assets/www && python3 -m http.server 8765`, then Playwright against http://localhost:8765/index.html with a fake window.Android.

## Editor features
Canvas with pinch/wheel zoom and pan; tap/alpha hit-test select; drag move with smart guides (snap to other layers' edges/centres and the stage) and optional grid; 8 handles resize (corners keep aspect), rotate knob (snaps 45°); multi-select (toggle mode, marquee, shift); long-press/right-click context menu; undo/redo (120 steps per screen); copy/paste across screens; align/distribute; z-order; lock/hide; layers panel; inspector (X/Y/W/H/rot/opacity/flip, text font/size/colour/gradient/stroke/shadow, box/button fill/gradient/border/radius/gloss + presets, sprite row/fps); asset library (captured parts of every screen, game icons/UI/amulets/ranks/card art/cards/maps, animated card sprites spr/ 252×204 cells rows idle/ready/attack/front, animated fx strips, own uploads in IndexedDB); swap image; background swap/hide; before/after compare slider; play mode; per-layer and per-screen notes to Claude; autosave (IndexedDB 'pdstudio').
- Export "ส่งให้ Claude": ZIP with layout.json (all layers, stage px, change list with original selector/data-act and old→new boxes), changes_th.txt (Thai list), <id>_compare.jpg (before|after), <id>_after.png, my_images/. Re-open a ZIP with the rail's open-file button.

## When the owner sends a layout ZIP
Read changes_th.txt + compare images, map each change by selector/data-act to src/game.src.html CSS/markup (stage is 915×412 CSS px), keep other screen sizes working, follow the game's release workflow (HANDOFF.md).
