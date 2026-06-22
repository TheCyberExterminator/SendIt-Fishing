# SendIt Fishing AU 🎣

**Should I send it today?** A free, offline-first Aussie fishing forecast PWA — tides, weather, wind, moon, solunar bite windows, species advice, a weekend planner and a local catch log. No signup, no ads, no API keys, no backend.

*Made by **Shadi Soltan** · Security Operations.*

> This folder **is the website root.** Upload its contents to a GitHub repo and turn on Pages — that's it.

---

## What's here
| File | What it is |
|---|---|
| `index.html` | The entire app — one self-contained file (HTML + CSS + JS, no external scripts). |
| `sw.js` | Service worker (offline shell, cache `sendit-v2-3`). |
| `manifest.webmanifest` | PWA manifest (installable; icons inline). |
| `.nojekyll` | Tells GitHub Pages to serve files as-is. |
| `docs/` | Build notes, tide-engine deep-dive, test results, market/API research, spot & rig guides. (Optional — not needed to run.) |

## Deploy to GitHub Pages — option A (no command line)
1. On GitHub: **New repository** → name it e.g. `sendit-fishing` → **Create**.
2. On the repo page: **Add file → Upload files**.
3. Drag in **`index.html`, `sw.js`, `manifest.webmanifest`, `.nojekyll`** (and the `docs` folder if you want it) → **Commit changes**.
4. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `/ (root)` → Save.**
5. Wait ~1 minute, then open **`https://<your-username>.github.io/sendit-fishing/`**.

## Deploy to GitHub Pages — option B (git CLI)
```bash
cd github-upload                       # this folder
git init && git add -A
git commit -m "SendIt Fishing"
git branch -M main
git remote add origin https://github.com/<you>/sendit-fishing.git
git push -u origin main
# then: repo → Settings → Pages → Source: main / root
```

## After it's live
- **Install it:** open the URL on your phone → *Add to Home Screen* (iPhone Safari / Android Chrome). It then works offline.
- **Diagnostics:** add `?debug=true` to the URL (or long-press the score) for the developer panel.
- **Settings (⚙):** Dark / Light / Fun themes, wind units, the *Learn from my catches* toggle, and a **Connection test** that pings each data source.

## Free data sources (all no-key, browser-safe)
Open-Meteo Forecast (+ MET Norway backup) · Open-Meteo Marine tides/swell · a **data-driven on-device harmonic tide engine** (fits constituents from the live series; works offline) · BoM via the free austides proxy (unofficial backup) · Open-Meteo Geocoding · OSM Nominatim reverse-geocode · moon & solunar computed on-device. See `docs/TIDE-ENGINE.md` and `docs/03-API-RESEARCH.md`.

## Honest limitations
Tides are **predictions** (live-modelled / fitted / regional engine — always labelled; engine heights are relative to mean sea level). Open-Meteo's free tier is **non-commercial / ~10k requests-a-day**. The catch-log tuning is **personal and on-device** (no backend), so it's a personal calibration, not population learning. All your data stays on your device.

*Safety beats the catch. Check the Bureau of Meteorology before any low-tide rock or breakwall session. Wear a PFD. Never turn your back on the sea.*
