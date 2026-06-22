# Phase 3 — API Research

**Selection priorities (in order):** Free → No key → Browser-safe (CORS) → Good AU coverage → Reliable → Works on GitHub Pages (static, no proxy) → Enough usage for a public app.
**Hard rules honoured:** no fake data; every API limitation is stated plainly.

---

## Summary recommendation table

| Concern | Chosen primary | Backups | Key? | Browser-safe / CORS | GitHub Pages (no backend)? | AU coverage |
|---|---|---|---|---|---|---|
| Weather + wind | **MET Norway Locationforecast 2.0** | Open-Meteo Forecast → wttr.in | No | Yes | ✅ | Global incl. AU |
| Tides | **Open-Meteo Marine** (`sea_level_height_msl`, `cell_selection=sea`) | BOM via austides proxy → TideTurtle → **on-device harmonic engine** | No | Yes | ✅ | Open ocean good; **inshore limited** → engine floor |
| Swell / SST | **Open-Meteo Marine** (`wave_*`, `sea_surface_temperature`) | — (optional) | No | Yes | ✅ | Coastal AU |
| Moon / sun / solunar | **Computed locally in JS** (no API) | — | No | n/a | ✅ | Global, exact |
| Pressure / rain | From the weather provider above | synth neutral | No | Yes | ✅ | — |
| Geocoding (search) | **Open-Meteo Geocoding** (`countryCode=AU`) | — | No | Yes | ✅ | AU place names |
| Reverse geocoding (GPS→name) | **OSM Nominatim** | falls back to "My Location" | No | Yes (usage policy) | ✅ | Global |
| Map tiles | **OpenStreetMap** tiles (Leaflet) | — | No | Yes | ✅ | Global |
| Live nearby POIs | **OSM Overpass** | curated 113-spot DB | No | Yes | ✅ | Global |

---

## Per-API detail

### MET Norway — Locationforecast 2.0 (weather + wind) ✅ primary
- **Endpoint:** `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=..&lon=..`
- **Free / key:** Free, **no key**. Requires a descriptive `User-Agent` (SendIt sends one).
- **CORS / GitHub Pages:** Yes / Yes. **Limits:** fair-use; cache & don't hammer (SendIt caches + 15-min refresh). Tends to work on locked-down corporate networks → tried **first**.
- **AU coverage:** Global. **Risk:** UA/CORS could be blocked on some networks → Open-Meteo retry covers it.

### Open-Meteo — Forecast API (weather + wind) ✅ backup
- **Endpoint:** `https://api.open-meteo.com/v1/forecast?...` (temp, wind, gusts, pressure, weather_code, daily, UV, sunrise/sunset).
- **Free / key:** Free, **no key**. **Limitation (stated plainly):** the free tier is for **non-commercial use, ~10,000 requests/day**. A commercial public SendIt at scale would need an Open-Meteo paid plan or self-hosting.
- **CORS / GitHub Pages:** Yes / Yes. Top-notch accuracy (ECMWF/DWD/NOAA blend).

### wttr.in (weather) ✅ last-resort backup
- **Endpoint:** `https://wttr.in/{lat},{lon}?format=j1`. Free, no key, CORS-open. **Limit:** community service, can rate-limit; 3-day/3-hourly only. Used only if both above fail.

### Open-Meteo — Marine API (tides + swell + SST) ✅ primary tide/swell
- **Endpoints:** `https://marine-api.open-meteo.com/v1/marine?...&hourly=sea_level_height_msl&cell_selection=sea` (tide) and `...&current=wave_height,wave_period,wave_direction,sea_surface_temperature` (swell/SST).
- **Free / key:** Free, no key, CORS-open, GitHub-Pages-OK.
- **Limitation (critical, stated):** tides/currents are modelled on an **~0.08° (~8 km), ocean-only grid**; Open-Meteo's own docs say accuracy is **limited at coasts, "not suitable for coastal navigation, does not replace your nautical almanac."** So **harbours/estuaries/lakes** (most NSW shore spots) often have **no usable cell** → SendIt uses `cell_selection=sea` + ocean-nudge, then BOM, then the engine.

### BOM via austides proxy (tides) ✅ AU authority backup
- **Endpoints:** `https://austides.vercel.app/v1/stations` + `/stations/{id}/tides?date=YYYY-MM-DD`.
- **Free / key:** Free, no key, CORS-open. Serves Bureau-of-Meteorology-style High/Low + heights for NSW standard ports (Fort Denison, Newcastle, Swansea, Port Kembla, Botany Bay, Patonga, Ettalong…).
- **Limitations (stated):** **Third-party community proxy** — could disappear or rate-limit (a reliability dependency outside our control). BOM publishes only ~7 days ahead. **BOM's own API is "not for use by 3rd parties"**, which is exactly why a free proxy + an on-device model exist. Cold path ~16s → station list pre-warmed at boot, 32s background budget.

### TideTurtle (tides) ✅ secondary backup
- **Endpoint:** `https://tideturtle.com/api/v1/tides?lat=..&lon=..`. Free, no key, CORS-open, global. **Limit:** community endpoint; defensive parsing used (schema not guaranteed).

### On-device harmonic tide engine (tides) ✅ guaranteed floor — NO API
- Equilibrium synthesis of **M2/S2/K1/O1** anchored to real Moon/Sun hour angles, scaled to Sydney/Fort Denison planes. Real metre heights, correct spring/neap + diurnal inequality, **valid NSW-wide for decades with zero network**. Fact-checked vs Fort Denison (spring ≈1.55 m new moon, neap ≈0.79 m quarter). **This is why tides never "fail"** — always labelled *modelled*, never *official*.

### Moon / sun / solunar — local JS ✅ no API
- Synodic moon age/phase/illumination; NOAA low-precision sun times; moon-altitude transits → solunar majors/minors. Exact, offline, free, forever.

### Open-Meteo Geocoding (search) ✅
- `https://geocoding-api.open-meteo.com/v1/search?name=..&countryCode=AU`. Free, no key, CORS-open. AU place/suburb/beach/postcode search.

### OSM Nominatim (reverse geocode) ✅ with care
- `https://nominatim.openstreetmap.org/reverse?...`. Free, no key, CORS-open. **Limit:** strict usage policy (1 req/s, must identify) — used only on a GPS tap, fails gracefully to "My Location".

### OpenStreetMap tiles + Overpass (map / POIs) ✅ with care
- Leaflet + `tile.openstreetmap.org`; Overpass (`overpass-api.de`, fallback `overpass.kumi.systems`) for live ramps/jetties/beaches. **Limit:** public fair-use; Overpass can throttle → curated 113-spot DB is the offline guarantee.

---

## Final API choices (the stack SendIt ships with)

1. **Weather/Wind:** MET Norway → Open-Meteo → wttr.in → cached last-good.
2. **Tides:** Open-Meteo Marine (`cell_selection=sea`) → BOM/austides → TideTurtle → cached live → **on-device harmonic engine** → neutral.
3. **Swell/SST:** Open-Meteo Marine (optional; omitted gracefully).
4. **Moon/Sun/Solunar/Pressure-trend:** local JS, no network.
5. **Search:** Open-Meteo Geocoding (AU). **Reverse:** Nominatim. **Map/POIs:** OSM tiles + Overpass, curated DB fallback.

**All free, all no-key, all browser-safe, all GitHub-Pages-deployable with zero backend or proxy of our own.** The only honest caveats: Open-Meteo free = non-commercial/usage-capped; austides/TideTurtle are third-party proxies; inshore marine-tide cells are sparse (engine covers it).
