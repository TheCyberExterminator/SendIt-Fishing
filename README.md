SendIt Fishing AU 🎣
Should I send it today? A free, single-file, offline-first fishing forecast for Australian anglers. No backend. No paid APIs. No API keys. No signup. No ads. Drop it on GitHub Pages and go.


What it does
Answers one question — should I send it today? — with an explained SendIt Score (0–100) built from tides, weather, wind, rain, moon phase, solunar windows, barometric pressure, season, location, swell and low-light timing. Plus: Best Bite Window, 48-hour/7-day tides in metres, species probabilities, NSW bait + rig plans, loud safety warnings, 113 curated NSW spots, a local catch log, saved spots, share, GPS, dark/light, and full offline operation.

Files
File	What it is
index.html	The entire app — one self-contained file. Open it or host it.
sw.js	Service worker (PWA / offline shell, cache sendit-fishing-v1).
01-CURRENT-APP-REVIEW.md	Phase 1 — review of the base app (FishOS AU Lite).
02-MARKET-RESEARCH.md	Phase 2 — competitor analysis (Fishbrain, WillyWeather, Navionics, Fishing Points, Tides Near Me, Windy…).
03-API-RESEARCH.md	Phase 3 — every API, limits, CORS, GH-Pages fit, final choices.
04-PRODUCT-PLAN.md	Phase 4 — features, MVP/V2, what to build/remove.
05-ARCHITECTURE.md	Phase 5 — module map + rules.
06-DATA-FLOW.md	Phase 6 — end-to-end flow + per-step failure/fallback.
07-DATA-SHAPES.md	Phase 7 — normalised Location/Tide/Weather/Score/Species contracts.
08-FALLBACK-LOGIC.md	Phase 9 — tide/weather/location/score fallback chains.
09-LOGIC-REFERENCE.md	SendIt Score formula, tide/weather/location/cache/SW logic.
10-TEST-MATRIX.md	Phase 11 — test matrix (verified-static vs manual).
11-SCORES-SECURITY-RISKS.md	Phase 12 — security review, final scores, remaining risks.
FISHING-SPOTS.md	Deep spot research, Illawarra → Newcastle, cited.
RIG-GUIDE.md	Rig & knot setups by species and by location type.
Deploy to GitHub Pages
Put index.html and sw.js in a repo (root).
Settings → Pages → deploy from branch (root).
Open https://<you>.github.io/<repo>/ — installable on iPhone/Android.
Open with ?debug=true (or long-press the score) for the diagnostics panel.

Data sources (all free, no key, browser-safe)
Module	Primary	Backups	Floor
Weather + wind	MET Norway	Open-Meteo → wttr.in	cached last-good
Tides	Open-Meteo Marine (cell_selection=sea)	BOM/austides → TideTurtle (cached)	on-device harmonic engine
Swell / SST	Open-Meteo Marine	—	omit gracefully
Moon / solunar / sun	computed locally (no API)	—	—
Search / reverse / map	Open-Meteo Geocoding / Nominatim / OSM + Overpass	—	curated 113-spot DB
Honest limitations
Tides are predictions (model/astronomical) — no wind setup or storm surge. Use for bite timing; check the Bureau of Meteorology before any low-tide rock/breakwall session. Inland/no-coverage spots use the labelled on-device model.
The harmonic engine is NSW (Fort Denison) tuned — WA/QLD heights are indicative; the source chip always says which source is live.
Open-Meteo's free tier is non-commercial (~10k req/day); austides/TideTurtle are third-party proxies that could change.
Curated coordinates are approximate access points, not exact marks.
Parramatta River west of the Harbour Bridge carries a dioxin advisory — flagged release only. Power-station warm-water canals are closed 6 pm–6 am, 1 May–31 Aug (and being decommissioned).
All your data (catch log, spots, prefs) stays on your device — nothing is uploaded.
Safety beats the catch. Wear a PFD on rocks and in boats. Never turn your back on the sea.

What changed from the base (FishOS AU Lite → SendIt Fishing)
Rebrand + tagline; SendIt Score label; Best Bite Window on the hero; Aussie score wording (SEND IT 🚀 / Worth a crack / …); footer (Made by Shadi Soltan · Security Operations); normalised tide fields (ok/real/confidence/fallbackReason/provider); fresh sendit_ storage namespace + sendit-fishing-v1 SW cache; dead-branch removal. The proven compute core (tide engine, solunar, scoring, provider chains, two-phase loader) is unchanged — see 01-CURRENT-APP-REVIEW.md §7.
