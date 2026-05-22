# Flight Data Sync — AeroDataBox API Setup

AirDodo pulls live flight schedules from the **AeroDataBox API** (via RapidAPI) and
falls back to a curated static dataset for anything the API doesn't cover. AeroDataBox
is plain HTTP + JSON with a single API-key header, so it works on cPanel shared hosting.

> **Why not Amadeus?** Amadeus shut down its free Self-Service API portal (new signups
> paused, existing keys disabled on **17 July 2026**), so we moved to AeroDataBox, which
> has open registration and a free tier.

This guide covers getting your free API key, configuring it, and running the sync.

---

## 1. Get a free AeroDataBox key (via RapidAPI)

1. Create a free account at **https://rapidapi.com** (sign up with email or Google/GitHub).
2. Open the AeroDataBox API page: **https://rapidapi.com/aedbx-aedbx/api/aerodatabox**
3. Click **Subscribe to Test** (or **Pricing**) and choose the **Basic — $0.00/month** plan
   (free tier, ~600 requests/month, no card required for Basic).
4. Back on the **Endpoints** tab, look at the code panel on the right under
   **Header Parameters**. Copy the value of **`X-RapidAPI-Key`** — that long string is
   your API key.

> The host stays `aerodatabox.p.rapidapi.com` for all RapidAPI users — you only need the key.

---

## 2. Configure the key

Edit your **`.env`** file (never commit it) and fill in the key:

```dotenv
AERODATABOX_API_KEY=your_x_rapidapi_key_here
AERODATABOX_API_HOST=aerodatabox.p.rapidapi.com
AERODATABOX_BASE_URL=https://aerodatabox.p.rapidapi.com
```

Then refresh the config cache:

```bash
php artisan config:clear
# or, in production:  php artisan config:cache
```

> ⚠️ If you run `php artisan config:cache`, do it **after** editing `.env`. Cached config
> ignores later `.env` edits until you re-cache or clear.

---

## 3. Run the sync

**From the admin UI:** open **Admin → Flights** and click **Sync**. You'll see
`Sync complete — N live (AeroDataBox) + M static flights updated.`

**From the command line:**

```bash
php artisan flights:scrape
```

```
+--------------------+-------+
| Source             | Count |
+--------------------+-------+
| live (AeroDataBox) |  46   |   ← flights read from the live airport board
| static fallback    |   3   |   ← curated rows added for routes the board missed
| layers failed      |   0   |   ← 1 here means the API was skipped (key missing/invalid)
+--------------------+-------+
```

- `live (AeroDataBox) > 0` → key works and data is flowing.
- `layers failed = 1` and `live = 0` → key missing/invalid or quota exhausted (see Troubleshooting).

---

## 4. Automate it on cPanel (daily cron)

In cPanel → **Cron Jobs**, add a daily job using the **full path** to PHP 8.3 and `artisan`
(adjust paths to your account):

```
0 2 * * *  /usr/local/bin/php /home/USERNAME/public_html/artisan flights:scrape >/dev/null 2>&1
```

Common cPanel PHP 8.3 binary path:

```
/opt/cpanel/ea-php83/root/usr/bin/php
```

> The project already registers `flights:scrape` to run daily at 02:00 via Laravel's
> scheduler ([routes/console.php](../routes/console.php)). The direct daily cron above is
> simpler and lighter for shared hosting; alternatively run the scheduler with a
> per-minute cron: `* * * * * /usr/local/bin/php .../artisan schedule:run >/dev/null 2>&1`.

---

## 5. How it works (quick reference)

- **Auth:** one header, `X-RapidAPI-Key`. No OAuth, no tokens.
- **Fetch:** instead of querying per route, it reads the full **departures + arrivals
  board** of each hub (Dhaka by default) in two 12-hour windows — covering every
  destination in ~2 calls/day. — [AeroDataBoxScraper](../app/Services/Scrapers/AeroDataBoxScraper.php)
  - Endpoint: `GET /flights/airports/iata/{DAC}/{fromLocal}/{toLocal}?direction=Both&withLeg=true`
  - Departure/arrival times are stored in **local** time; flight **duration** is computed
    from the UTC timestamps (so it's correct across time zones).
- **Persist:** mapped to `source = scraped`, stamped with `scraped_at` — this drives the
  "Live Scraped" and "Last Synced" cards. — [FlightScraperService](../app/Services/FlightScraperService.php)
- **Fallback:** [StaticFlightData](../app/Services/Scrapers/StaticFlightData.php) tops up
  any missing routes (insert-if-missing only).

### Scanning more hubs / quota

- Add airports to the `HUBS` constant in
  [AeroDataBoxScraper.php](../app/Services/Scrapers/AeroDataBoxScraper.php) (e.g. `['DAC','CGP']`).
  Each hub = 2 more calls per sync.
- The free Basic plan allows ~600 requests/month. A daily one-hub sync uses ~60/month.
  AeroDataBox bills some endpoints in "units," so watch your usage on the RapidAPI dashboard
  if you add hubs or sync more often.
- Destination airports are **auto-created** from the API response (it includes IATA, name,
  country, and timezone), so new routes appear automatically — no manual airport seeding
  needed. Rows where the API omits the IATA code are skipped (static data covers those).

---

## 6. Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| `layers failed = 1`, `live = 0` | Key not set/invalid. Check `.env`, then `php artisan config:clear`. |
| Log: `AeroDataBox ... HTTP 401/403` | Wrong key, or your RapidAPI plan doesn't include the airport-schedule endpoint. |
| Log: `AeroDataBox rate-limited` (429) | Monthly quota exhausted, or too many calls/second. Sync less often or reduce hubs. |
| Log: `AERODATABOX_API_KEY not set` | The key in `.env` is empty. |
| "Last Synced: Never" after a run | Should no longer happen — the run timestamp is recorded even with 0 live results. If it persists, confirm the `cache` table exists (`php artisan migrate`). |

### Using API.market instead of RapidAPI (optional)

AeroDataBox is also on [API.market](https://api.market/store/aedbx/aerodatabox). If you use
that instead, set `AERODATABOX_BASE_URL` to its gateway and adjust the auth header in
[AeroDataBoxScraper::fetchBoard()](../app/Services/Scrapers/AeroDataBoxScraper.php)
(API.market uses `x-magicapi-key` rather than `X-RapidAPI-Key`).

Logs are in `storage/logs/laravel.log` — search for `AeroDataBox`.
