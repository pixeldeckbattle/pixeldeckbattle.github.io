# PixelDeck Forge — handoff

Owner's own character / UI maker app for Pixeldeck Battle (separate from the game; not deployed to pdb). Talk to the owner in Thai.

## v2 (15 Oct 2026): APK only, bare app
- Owner wants an APK, not a web artifact, and a bare app: no built-in Claude-drawn models. All art comes from GPT. Flow: Forge shows GPT prompts (copy button each) → owner makes images in GPT → adds them in Forge → exports → sends to Claude.
- The old artifact (claude.ai/artifact/2Aa5UdgZ8nxo8yp23vWtPQ, v1 with 100,000 procedural models) is retired; do not republish.
- Source: `forge/forge.html` (full page, no build). `node forge/build_assets.js` writes `forge/apk/app/src/main/assets/www/index.html` (swaps web font + cdn JSZip for local `silkscreen.ttf` + `jszip.min.js`).
- Android shell: `forge/apk` (Java WebView, minSdk 29, no AndroidX). Bridge `window.Android`: begin/chunk/end (save to Download/PixelDeckForge via MediaStore, base64 chunks), share(id), copy(text). File inputs via onShowFileChooser (multi-select).
- Build: `.github/workflows/forge-apk.yml` on push to forge/** → Gradle 8.9 / AGP 8.5.2 → signed with `forge/apk/forge.jks` (pass in workflow; keystore committed because the session can't set repo secrets) → GitHub Release `forge-v1.<run>` with `PixelDeckForge-v1.<run>.apk`. versionCode = run number, so new APKs install over old ones.
- Test: `node forge/build_assets.js && node forge/test_forge.js <folder of part PNGs> [outdir]` (Playwright at /opt/npm-tools, fake Android bridge).

## What the app has
- Tab คำสั่ง AI: ChatGPT / Gemini switch (Gemini prompts ask for a flat magenta FF00FF background + attached style and template images). Style reference forge/pixeldeck_style.png (8 game sprites, inlined by build_assets as window.STYLE_URI). 50 prompts (body/head/hair/hat/weapon × 10), each self-contained, 16-bit pixel art, 1024² transparent, positions in %; template PNG (pixeldeck_template.png) to attach in GPT.
- Position standard (GUIDE): neck 47%/41%, head box 33–64% × 14–44%, hand/grip 62%/58% (weapon pivot), feet 97%.
- Tab ชิ้นส่วน: 5 layers (1_body 2_head 3_hair 4_hat(+none) 5_weapon), "+ เพิ่มรูป" per layer, per-picture nudge (dx, dy, scale), auto-place for body (neck x + feet, height 41→97%) and head (fit head box), stage guides overlay. Background removal = flood fill from the edges (solid or checkerboard), keeps inner colours. Pack persists: blobs in IndexedDB, layout in localStorage.
- ZIP import: parts pack (pack.json offsets restore), anim folders, numbered frames; also PNG frames / sprite sheet / single image.
- Export: preview sheet (12 random combos with guides — for Claude to check alignment), parts ZIP + pack.json (offsets + measured % boxes), game pack ZIP, strip PNG, GIF, frames ZIP; scales 1/16…1× for big images.
- UI maker (button/panel/HP bar/badge/slot).

## Next
- Owner tests the APK, makes the 50 GPT parts, sends the preview PNG / parts ZIP → check alignment, tune auto-place or prompts.
