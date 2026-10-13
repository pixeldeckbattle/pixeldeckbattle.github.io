# Pixeldeck Battle — handoff for a new Claude session

Live build: **b178** (13 Oct 2026). Talk to the owner (Toey) in Thai, never call them "ต้อย". The game name stays English; the in-game credit is "PixelDeckBattle".

## Where things are
- Game source (single file): `src/game.src.html`. Admin page source: `tools/admin.src.html`.
- Published sites: remote `origin` = seeker6131/pixeldeck, remote `pdb` = pixeldeckbattle/pixeldeckbattle.github.io (the real game URL).
- Firestore rules reference: `firestore.rules` (OWNER_EMAIL stays a placeholder — never commit the real address). The owner pastes rules into the Firebase console themselves.
- GDD: Claude Docs project `98dc7285-97f9-44f7-8e3c-0186f59dbe8f`, tab node `ac85a622-c911`; the build table header row is block `m4v3m846h9s.28807` (insert a 3-cell row after it: build · date · what changed) and the intro line holds "โค้ดบิลด์ bNNN".
- In-chat test copy: Artifact https://claude.ai/artifact/Enf7gNXFm7S4srkv2z8JPR (publish the built game file there).

## Release workflow
1. Work dir: copy `src/game.src.html` → `<work>/bit8-clash.html`, `tools/admin.src.html` → `<work>/admin.src.html`, `tools/FB_CFG.json` → `<work>/FB_CFG.json`.
2. Edit with small python patches (assert each anchor appears once). Bump `const BUILD='bNNN'`.
3. Syntax: extract the biggest `<script>` and `node --check` it.
4. Tests: `python3 tools/mkt_page.py` (run from work dir) writes `_t.html`; `node t121.js` must show 0 errors, `node t142.js` must print 13 `"inside":true`. Chromium at `/opt/pw-browsers/chromium`. Online tests: replace `const FB_CFG=null;` with `let FB_CFG={t:1};` in `_t.html` and route gstatic to `tools/fbmock.js`.
5. From the work dir: `python3 tools/deploy.py` (writes index.html, version.json, admin.html). Copy sources back to `src/` and `tools/`. Delete `_t.html`.
6. Commit (author Claude <noreply@anthropic.com>), `git push origin HEAD` and `git push pdb HEAD:refs/heads/main`. Never force-push.
7. Update the GDD and the in-game guide (`guide()` SEC tabs) for every change.

## Standing rules from the owner
- Every update also updates the GDD and the in-game "วิธีเล่น".
- Build only on an explicit order ("ทำเลย / ลุย / ปล่อย / แก้เลย"); advice questions get answers only.
- Weigh the developer's revenue side when advising.
- Text for them to copy/post: no tables (code blocks / bullets). GPT art prompts: one self-contained block per image.
- Limited cards must stay the strongest (at least ~3% over SuperLegend). Dev account must hold every new thing at max (`devGrant`).
- Prefer admin-side fixes over forcing players to reload.
- Never handle secrets (Thunder API key, service-account JSON, card numbers, 2FA codes).

## State of the game (b178)
- Stages 1–1100. Chapter 2 (501–1100): 6 realms `RLM`, monsters `x11..x65`, maps `bg/r11..r62`, realm rules, lords every 100, stage stars + star chests, realm crystals `S.rs` (💠 ผลึกอาณาจักร).
- Stars 6–10 for L/SL/LT (`STAR_C2`, badges `ui/st6..st10.webp`), skill 4 at 10 stars (`SK4`, `SK4E`, `cast4`, icons `ic/s4*.webp`), skill-4 Lv 2–3.
- Glacius Rex `h28` (Limited tank): only the first 3 players to clear stage 1100 (Firestore `firsts/s1100`), later ones get 💠10.
- VIP: every active VIP (gifted, arena, bought) gets Auto x3, 10 h offline farm with amulet/card/crystal drops, crystal x1.5, plus Exp/Gold x2.
- b178: diamond ledger `S.ld` (same shape as the Gold ledger `S.lg`): `ld(key,±n)` at every diamond change, untagged changes booked as `unk` in `save()`; started by `ldInit(0)` when the lobby opens. Admin Finance tab shows the economy card (Gold + diamond sources/uses, in/out per day, status สมดุล/เริ่มเฟ้อ/เฟ้อ/ฝืด). New diamond sources or sinks must call `ld()` and get a label in admin `LDI`/`LDO`.
- b177: diamond market CLOSED by the owner (tab removed, popup off, VIP/guide lines removed). `dmRefundAll()` in the lobby cancels the player's own open `dmo` orders once and refunds them, and collects `dmpay`. The dm code and rules are kept so it can come back.
- (history) Diamond market (b176): Market → 💎 tab, `dmView()`. Firestore `dmo` orders, `dmpay` maker payouts (`{order}_{q left}`), `dmt` trades, `dmc/{yyyymmdd}` 15-min candles. Price 1,000–2,000 (shop ceiling), any diamond sellable, stage 30, 100/day each way (VIP 200), tax 5% (VIP 3%); `CFG.dm` overrides from admin Switches. Tests `tools/t176*.js`. Admin Players tab has an economy card.
- Market: Buy / Sell / History modes. History reads Firestore `trades/` (buyer writes it after a purchase, best-effort; rule block in `firestore.rules`). Test: `tools/t175.js`.
- Balance sim: `tools/simc2.js` (Chapter 2), `tools/simst.js` (stages 1–500).

## Open / noted for later
- Team presets; relax room / card-flex; party boss; weekly world boss; market reference price.
- Clearer skill-4 wording in game ("ใช้ได้ตั้งแต่รอบ 3 · ใช้แล้วพัก 5 รอบ") — offered, not ordered.
- Slip top-up outside 17:00–00:00: offered either queueing slips or a big warning — not ordered.
