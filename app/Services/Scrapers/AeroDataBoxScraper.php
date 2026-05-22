<?php

namespace App\Services\Scrapers;

use App\Models\Airport;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Pulls real flight schedules from the AeroDataBox API (via RapidAPI).
 *
 * Plain HTTP + JSON with a single API-key header, so it runs anywhere PHP runs
 * — including cPanel shared hosting. Instead of querying per route, it reads the
 * full departures + arrivals board of each hub airport (Dhaka by default), which
 * covers every destination in just a couple of calls and conserves the free quota.
 *
 * Get a free key at https://rapidapi.com/aedbx-aedbx/api/aerodatabox →
 * set AERODATABOX_API_KEY in .env.
 */
class AeroDataBoxScraper
{
    /** Hub airports whose full schedule boards we scan (IATA). */
    private const HUBS = ['DAC'];

    /** @return ScrapedFlight[] */
    public function scrapeAll(): array
    {
        if (! $this->configured()) {
            Log::warning('AeroDataBoxScraper: AERODATABOX_API_KEY not set — skipping live fetch.');
            return [];
        }

        // Use a near-future weekday so we get scheduled (not just live) flights.
        $day     = now()->addDays(2)->format('Y-m-d');
        $windows = [['T00:00', 'T11:59'], ['T12:00', 'T23:59']]; // 12h max per call
        $flights = [];

        foreach (self::HUBS as $hub) {
            foreach ($windows as [$from, $to]) {
                $board = $this->fetchBoard($hub, $day.$from, $day.$to);
                if ($board === null) {
                    continue;
                }

                // In departures[] the hub is the origin; in arrivals[] it's the destination.
                foreach (($board['departures'] ?? []) as $f) {
                    $this->collect($flights, $this->mapFlight($f, $hub, isDeparture: true));
                }
                foreach (($board['arrivals'] ?? []) as $f) {
                    $this->collect($flights, $this->mapFlight($f, $hub, isDeparture: false));
                }
            }
        }

        Log::info('AeroDataBox: mapped '.count($flights).' unique flights.');

        return array_values($flights);
    }

    private function collect(array &$flights, ?ScrapedFlight $f): void
    {
        if ($f) {
            // Dedupe identical flight number + route across windows/boards.
            $flights[$f->flightNumber.$f->origin.$f->destination] = $f;
        }
    }

    private function configured(): bool
    {
        return (bool) config('services.aerodatabox.key');
    }

    /** @return array{departures?: array, arrivals?: array}|null */
    private function fetchBoard(string $hub, string $fromLocal, string $toLocal): ?array
    {
        $base = rtrim((string) config('services.aerodatabox.base_url'), '/');

        try {
            $resp = Http::withHeaders([
                    'X-RapidAPI-Key'  => config('services.aerodatabox.key'),
                    'X-RapidAPI-Host' => config('services.aerodatabox.host'),
                ])
                ->timeout(25)
                ->retry(2, 500, throw: false)
                ->get("{$base}/flights/airports/iata/{$hub}/{$fromLocal}/{$toLocal}", [
                    'direction'      => 'Both',
                    'withLeg'        => 'true',
                    'withCancelled'  => 'false',
                    'withCodeshared' => 'false',
                    'withCargo'      => 'false',
                    'withPrivate'    => 'false',
                    'withLocation'   => 'false',
                ]);

            if ($resp->status() === 429) {
                Log::warning("AeroDataBox rate-limited on {$hub} {$fromLocal}; quota may be exhausted.");
                return null;
            }

            if (! $resp->successful()) {
                Log::warning("AeroDataBox {$hub} {$fromLocal}: HTTP {$resp->status()} ".substr($resp->body(), 0, 300));
                return null;
            }

            return $resp->json();
        } catch (\Throwable $e) {
            Log::warning("AeroDataBox {$hub} {$fromLocal} failed: ".$e->getMessage());
            return null;
        }
    }

    /**
     * Map one AeroDataBox board entry (withLeg=true) to a ScrapedFlight, or null if unusable.
     *
     * The board omits the `airport` object for the hub's own movement, so the hub is
     * supplied explicitly: in departures[] it's the origin, in arrivals[] the destination.
     * The opposite airport is auto-created if we don't already know it.
     */
    private function mapFlight(array $f, string $hub, bool $isDeparture): ?ScrapedFlight
    {
        if (($f['isCargo'] ?? false) === true) {
            return null;
        }

        $depMov = $f['departure'] ?? null;
        $arrMov = $f['arrival'] ?? null;
        if (! $depMov || ! $arrMov) {
            return null;
        }

        // The non-hub airport carries the IATA code; skip if it's missing (low-quality rows).
        $otherAirport = $isDeparture ? ($arrMov['airport'] ?? []) : ($depMov['airport'] ?? []);
        $otherIata    = $this->ensureAirport($otherAirport);
        if (! $otherIata) {
            return null;
        }

        $origin = $isDeparture ? $hub : $otherIata;
        $dest   = $isDeparture ? $otherIata : $hub;

        $code   = $f['airline']['iata'] ?? null;
        $number = isset($f['number']) ? str_replace(' ', '', (string) $f['number']) : null;
        if (! $code || ! $number) {
            return null;
        }

        $depTime = $this->localTime($depMov['scheduledTime']['local'] ?? null);
        $arrTime = $this->localTime($arrMov['scheduledTime']['local'] ?? null);
        if (! $depTime || ! $arrTime) {
            return null;
        }

        [$dh, $dm] = $this->duration(
            $depMov['scheduledTime']['utc'] ?? null,
            $arrMov['scheduledTime']['utc'] ?? null,
        );

        return new ScrapedFlight(
            airlineCode:     $code,
            flightNumber:    $number,
            origin:          $origin,
            destination:     $dest,
            departureTime:   $depTime,
            arrivalTime:     $arrTime,
            durationHours:   $dh,
            durationMinutes: $dm,
            operatesOn:      [0, 1, 2, 3, 4, 5, 6],
            aircraftType:    (string) ($f['aircraft']['model'] ?? ''),
            cabinClass:      'Economy',
            source:          'scraped',
        );
    }

    /**
     * Ensure an airport from the API exists in our table; return its IATA code (or null).
     * AeroDataBox gives us iata/name/countryCode/timeZone, enough to create it on the fly.
     */
    private function ensureAirport(array $airport): ?string
    {
        $iata = $airport['iata'] ?? null;
        if (! $iata) {
            return null;
        }

        Airport::firstOrCreate(
            ['iata_code' => $iata],
            [
                'name'     => $airport['name'] ?? $iata,
                'city'     => $airport['name'] ?? $iata,
                'country'  => strtoupper(substr((string) ($airport['countryCode'] ?? 'XX'), 0, 2)),
                'timezone' => $airport['timeZone'] ?? 'UTC',
            ]
        );

        return $iata;
    }

    /** Extract local clock time "HH:MM" from an AeroDataBox timestamp. */
    private function localTime(?string $ts): ?string
    {
        if (! $ts) {
            return null;
        }

        try {
            return Carbon::parse($ts)->format('H:i');
        } catch (\Throwable) {
            return null;
        }
    }

    /** Flight duration from the two UTC timestamps → [hours, minutes]. */
    private function duration(?string $depUtc, ?string $arrUtc): array
    {
        if (! $depUtc || ! $arrUtc) {
            return [0, 0];
        }

        try {
            $mins = intdiv(abs(Carbon::parse($arrUtc)->timestamp - Carbon::parse($depUtc)->timestamp), 60);
            return [intdiv($mins, 60), $mins % 60];
        } catch (\Throwable) {
            return [0, 0];
        }
    }
}
