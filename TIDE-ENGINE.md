# SendIt Fishing v2 — Test Matrix & Failure Results

**Honesty:** This environment statically verifies code and runs the **pure compute pipeline headless** (DOM stubbed). It cannot drive real iPhone Safari / Android Chrome / live mobile networks — those rows are **Manual** and must be run before release. Nothing is faked.

---

## Build verification (done here)
| Check | Result |
|---|---|
| JS syntax (`node --check`) | ✅ Pass |
| CSS var typo fixed | ✅ Pass |
| All `console.*` gated behind `?debug=true` | ✅ Pass (3 calls, all in `DebugService` under `if (AppState.debug)`) |
| No external CDN/script/style dependency | ✅ Pass (self-contained) |
| Headless core pipeline (buildData→score→species→tide→planner) | ✅ 10/10 locations, 0 failures |
| Species Mode retunes score + advice | ✅ Pass (reason injected; Perth→Salmon vs Sydney→Tailor, location-driven) |
| Advice Engine output (bait/rig/summary) | ✅ Pass |
| 11 species ranked | ✅ Pass |
| 7-day solunar windows populated | ✅ Pass (`solWeek.majors ≥ 7`) |
| Confidence ∈ {High,Medium,Low} | ✅ Pass |

## Phase 10 — test locations (headless pipeline, estimate path)
All passed with a valid score (3–99), 11 species, tide extrema ≥2, 7 daily, populated bite windows, ≥1 reason + warnings:
Sydney Harbour · Newcastle · Wollongong · Swansea · Lake Macquarie · The Entrance · Port Kembla · Botany Bay · Gold Coast QLD · Perth WA. **My Location** = GPS path (Manual — needs a device).

> Note: the headless run used the **offline estimate** (synth weather) to prove the worst-case path never throws and still produces advice. With live weather the scores vary by wind/pressure/swell as designed (verified separately by feeding a live-shaped `current` object → confidence High).

## Phase 11 — failure tests (logic trace)
| # | Scenario | Expected | Path | Status |
|---|---|---|---|---|
| 1 | Tide API unavailable | engine, labelled "on-device", score unaffected | `TideService.fetchLive`→reason→engine | ✅ traced |
| 2 | Weather API unavailable (both) | cached → last-known → estimate → "No live data" | `LocationService.load` chain | ✅ traced |
| 3 | Geocoder unavailable | empty suggestions, no crash | `GeocodingService.search`→[] | ✅ traced |
| 4 | GPS denied | "Location permission denied" toast, keep current | `LocationService.gps` err | ✅ traced |
| 5 | No internet | cached/estimate render; SW serves shell | load chain + SW | ✅ traced |
| 6 | Stale cache | rendered with "Saved …" + refresh upgrades | render(stale) + phase2 | ✅ traced |
| 7 | Wrong cache location | per-coordinate keys prevent cross-read | `CacheService.key` | ✅ traced |
| 8 | Rapid location switching | older responses discarded | `loadSeq` guard | ✅ traced |
| 9 | Hard refresh on GH Pages | latest HTML (network-first) | `sw.js` | ✅ traced |
| 10 | Old service worker | caches purged on activate | `sw.js` activate | ✅ traced |
| 11 | iPhone Safari | safe-area, theme, share | CSS env() insets | Manual |
| 12 | iPhone PWA mode | standalone launch + offline | manifest + SW | Manual |
| 13 | Android Chrome | install, GPS, back | manifest + SW | Manual |
| 14 | Empty API response | `current` missing → null → fallback | guards in services | ✅ traced |
| 15 | Malformed API response | try/catch per fetch → null → fallback | service catches | ✅ traced |
| 16 | Slow network | two-phase: score fast, tide upgrades | phased load | ✅ traced |
| 17 | localStorage unavailable | `CacheService` try/catch → defaults | safe get/set | ✅ traced |
| 18 | Mobile small screen | single-column, fluid cards, no overflow | responsive CSS | ✅ (design) / Manual confirm |

## v2.2 — Themes / Settings / Ping / Back button (headless, 8/8 pass)
| Check | Result |
|---|---|
| Theme default = dark | ✅ |
| Set Fun → persists | ✅ |
| Set Light → persists | ✅ |
| Junk theme value → falls back to dark | ✅ |
| Connection ping returns all 5 sources | ✅ |
| Simulated down source reported `blocked`, others `ok` | ✅ |
| Core pipeline still healthy (Sydney + Perth) after additions | ✅ |
| JS syntax re-validated; console calls still 3, all debug-gated | ✅ |
| SW cache bumped `sendit-v2-1` → `sendit-v2-2` | ✅ |

**Manual (device):** Light/Fun contrast on real screens; Android Chrome Back closes the Settings sheet (not the app); ping reflects real firewall/offline state.

## v3 — Tide engine + catch-data flywheel (40 automated checks, 0 failures)

**Harmonic fit & regional engine (15/15)** — synthetic known tide:
| Check | Result |
|---|---|
| Fit returns valid (n≥24, plausible M2, low RMS) | ✅ |
| Recovers Z0 / M2 / S2 / K1 amplitudes (±2–4 cm) | ✅ |
| RMS < 0.02 m | ✅ |
| Predicts 2 days ahead < 5 cm error | ✅ |
| Fitted extrema sane (count + heights) | ✅ |
| Region detect: NSW semidiurnal / Perth diurnal-micro / Broome macro | ✅ |
| Regional amps differ Sydney vs Perth (M2 vs K1 dominance) | ✅ |
| coldExtrema prefers cached fit, else regional | ✅ |

**Catch-data calibration (8/8):**
| Check | Result |
|---|---|
| Off by default | ✅ |
| No adjustment under 8 catches (shrinkage) | ✅ |
| Learns user run-out preference; run-in scores lower | ✅ |
| Blank ("no fish") sessions excluded from positive count | ✅ |
| Bounded ±12 even at 100% concentration | ✅ |
| vectorFrom maps conditions → buckets correctly | ✅ |
| Calibration OFF → no catch-log reason in score | ✅ |
| Pipeline healthy + 11 species + calib.n with calibration ON | ✅ |

**Regression (17/17):** themes dark/light/fun + junk→dark; pipeline across 11 locations **including Broome (macro-tidal)**; species-mode tuning; connection ping with a simulated down source. JS syntax valid; console calls = 3, all `?debug=true`-gated; SW bumped to `sendit-v2-3`.

## Recommended pre-release manual pass
1. Deploy to GitHub Pages; open desktop Chrome `?debug=true` → confirm Debug panel + live source badges.
2. Test Sydney + Newcastle + Lake Macquarie + Perth → confirm tide shows **Live** where Open-Meteo Marine has a cell, **On-device** (labelled) where it doesn't.
3. Add to Home Screen on iPhone + Android; airplane-mode → confirm offline launch + engine tides + cached conditions.
4. Switch spots rapidly → confirm no stale overwrite (loadSeq).
5. Toggle Species Mode through all 11 → confirm score + advice retune.
