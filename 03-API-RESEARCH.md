# Phase 2 — Market Research

**Method:** App Store / Google Play listings, official feature pages, and 2025–26 roundup reviews (Cast & Spear, Master Fishing Mag, West Marine, Kayak Base), retrieved live. Facts are grounded in those sources; where a figure is from a store listing it's noted. **No branding, icons, UI or protected content is copied — only patterns are learned and improved.**

---

## Competitor scorecard

| App | Best for | Pricing | Key strength | Key weakness |
|---|---|---|---|---|
| **Fishbrain** | Catch-log + social + spots | Free w/ ads; **Pro IAP ~US$5.99–$79.99**; #8 top-grossing Sports (iOS) | Huge crowd data (20M+ catches), BiteTime/BiteScore forecast, Fish ID (300+ species), depth maps (Garmin/C-MAP, US/CA) | Subscription "too high for casual users", "inaccurate location/mapping", bugs, spot-privacy worries (per app-review aggregators). US-centric regulations/depth maps. |
| **FishAngler** | Free social logbook + forecast | Free | Solunar + weather + maps + logbook with no paywall on basics | Smaller community; AU local intel thin |
| **Navionics (Boating)** | Marine charts / navigation | Paid subscription (chart plans) | Best-in-class bathymetry, safe routes, offline charts | Navigation tool, not a bite predictor; cost; overkill for shore anglers |
| **WillyWeather** | AU weather + tides + swell | Free site w/ ads; **WillyWeather+** removes ads; **paid API (~A$1.20/mo+ usage)** | **BoM-grade AU tides/swell/wind/UV across 17,000+ locations**, the AU gold standard | Tides/marine behind the paid API; not fishing-scored; BoM data "not for use by 3rd parties" directly |
| **Fishing Points** | Tides + solunar + offline marks | Free + premium IAP | Tide graphs, solunar bite windows, offline GPS marks, weather | Forecast is generic; less AU-specific local knowledge |
| **Tides Near Me** | Fast tide glance | Free + IAP | Clean "next tide + countdown" UX; widgets | Tide-only; no weather/score/species |
| **Windy** | Wind/weather visualisation | Free + premium | Beautiful multi-model wind/wave maps, pros trust it | Not fishing-specific; no bite score, tides secondary |
| **BassForecast** | US bass bite forecast | Paid subscription | Species-specific (bass) AI bite rating, weather-driven | US bass only; irrelevant to AU saltwater |
| **FishTrack** | Offshore SST / chlorophyll | Paid | Satellite SST/colour breaks for bluewater | Offshore/charter niche; not shore/estuary |
| **My Tide Times** | Tide tables | Free + IAP | Simple global tide tables | Tide-only, ad-heavy |
| **Solunar/ Deluxe apps** | Solunar tables | Free/cheap | Major/minor period tables | Solunar-only, dated UX |

## Patterns worth borrowing (improved, not copied)

1. **A single bite-quality number** (Fishbrain BiteScore, BassForecast rating) → SendIt keeps **one 0–100 SendIt Score**, but makes it **explained** (factor chips) instead of a black box.
2. **"Next tide + countdown"** (Tides Near Me) → SendIt already has Now/Next + countdown; keep it on the hero-adjacent tide card.
3. **BiteTime windows** (Fishbrain) → SendIt's **solunar majors/minors + dawn/dusk**, now surfaced as a **single Best Bite Window** on the hero (the borrowed improvement).
4. **Logbook with conditions auto-snapshot + PBs** (Fishbrain/FishAngler) → SendIt keeps this, local-only/private (a differentiator vs Fishbrain's privacy complaints).
5. **Per-species bait/lure recs** (Fishbrain "Top Baits") → SendIt has NSW-specific baits + rigs per species/spot (deeper local credibility).
6. **AU tide authority** (WillyWeather/BoM) → SendIt can't redistribute BoM directly, so it uses free proxies + an **on-device harmonic engine** as the guaranteed floor, clearly labelled.
7. **Offline marine charts** (Navionics) → out of scope/free-tier; SendIt substitutes curated named spots + OSM map.

## What SendIt can do better than all of them

| Gap in the market | SendIt's wedge |
|---|---|
| Scores are **black boxes** | **Explained** score — every factor shown (solunar, wind, barometer, moon, swell, low-light). |
| Forecasts are **generic / US-centric** | **AU-specific**: 113 NSW spots, NSW baits, warm-water (thermal outlet) + current "pressure water" intelligence nobody surfaces well. |
| Best apps **cost money / push subscriptions** | **Free, no signup, no ads, no paid key.** |
| Tide apps **need signal** | **Works fully offline** (harmonic engine + cached conditions) — beaches have bad reception. |
| Social apps have **privacy concerns** | **Local-only data** — catch log + spots never leave the device. |
| Most apps **bury safety** | **Loud, honest safety warnings** (wind/swell/storm/UV/cold water) baked into the score card. |
| None answer the **actual decision** | One question, front and centre: **"Should I send it today?"** |

## Positioning statement

> SendIt Fishing is the **free, offline-first, Aussie** fishing forecast that answers one question — *should I send it today?* — with an **explained** SendIt Score, real tides, local NSW spot/species/bait intelligence, and honest safety calls. No signup, no ads, no paywall.
