# PixelDeck Forge — handoff

Owner's own character / UI maker app for Pixeldeck Battle (separate from the game; not deployed to pdb).

- Live: Claude artifact https://claude.ai/artifact/2Aa5UdgZ8nxo8yp23vWtPQ (private to the owner). Source: `forge/forge.html` (publish this file to that URL; declares the `downloads` capability).
- Single file, no build. JSZip 3.10.1 from cdnjs. Test: `node forge/test_forge.js` from `forge/` (Playwright at /opt/npm-tools, routes jszip to /opt/npm-tools/node_modules/jszip).

## What it has (v1, 15 Oct 2026)
- Library of 100,000 unique procedural pixel models (ids 1–100000 → bijection `(id*2654435761+12345) mod N` over 10 part radices; N = 755,827,200; `idOf` inverts).
- Editor: build, skin, hair style/colour, hat, armour, armour palette, cape, 12 weapons, eyes; rank aura (Rare/Legend/SL/Limited).
- Animation engine: idle walk run attack skill cast hit death victory; attack depends on weapon kind (slash / heavy+smash / thrust / bow shoot / cast). 4–16 frames. 10 effects (slash, smash, thrust, arrow, orb, circle, hit, heal, buff, shield), colour override.
- Import: ZIP (numbered frames · anim folders idle/walk/... · parts pack folders with optional pack.json {"pivot":[x,y]}; folder containing "weapon" rotates in attacks; default pivot 62%/58% of image), PNG frames, sprite sheet (cols×rows), single image (app animates by transforms). Background key-out from top-left colour, auto-center frames.
- Export: strip PNG, GIF (own encoder), frames ZIP, game pack ZIP (anim folders + sheet.png + meta.json + portrait.png), batch up to 100 ids.
- UI maker: button / panel / HP bar / rank badge / slot, PNG export.

## Owner's plan (decided)
- ~100,000 models must be GPT's art, not Claude's: GPT draws PARTS — 5 folders × 10 (1_body, 2_head, 3_hair, 4_hat, 5_weapon) = 100,000 combos — then zips them; import as parts pack. 50 prompts were given in chat (square, transparent, positions in %: neck 47%/41%, hand 62%/58%, head box 33–64% w × 14–44% h, feet at 97% h).
- Waiting on: the owner's 50-part ZIP from GPT → test alignment in the app, fix offsets if parts drift.
- Later: wrap as APK (like V-Tune via GitHub Actions); maybe a per-layer offset editor if GPT parts don't line up.
