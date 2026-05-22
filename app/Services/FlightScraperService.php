<?php

namespace App\Services;

use App\Models\Airline;
use App\Models\Airport;
use App\Models\Flight;
use App\Services\Scrapers\AeroDataBoxScraper;
use App\Services\Scrapers\ScrapedFlight;
use App\Services\Scrapers\StaticFlightData;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Builds the flight catalogue from two cPanel-friendly layers:
 *   1. Live  — AeroDataBox API (plain HTTP + JSON, no browser needed)
 *   2. Static — curated fallback data that fills any routes the API didn't cover
 *
 * (The old Guzzle/Panther HTML scrapers and speculative OTA endpoints were
 * removed: the airline sites are JS SPAs and the OTA hosts never resolved, so
 * neither could ever work on shared hosting.)
 */
class FlightScraperService
{
    /** Cache key holding the timestamp of the last completed sync run. */
    public const LAST_SYNCED_KEY = 'flights.last_synced_at';

    public function __construct(
        private AeroDataBoxScraper $aerodatabox,
        private StaticFlightData $static,
    ) {}

    public function run(): array
    {
        $results = ['scraped' => 0, 'static' => 0, 'skipped' => 0];

        // Level 1: live data from AeroDataBox.
        try {
            $live = $this->aerodatabox->scrapeAll();

            if (! empty($live)) {
                $results['scraped'] = $this->persist($live, 'scraped');
            } else {
                $results['skipped']++;
                Log::warning('AeroDataBox returned no flights; relying on static data.');
            }
        } catch (\Throwable $e) {
            $results['skipped']++;
            Log::error('AeroDataBox sync failed: '.$e->getMessage());
        }

        // Level 2: static data fills anything still missing.
        $results['static'] = $this->persist($this->static->get(), 'static', onlyIfMissing: true);

        // Record that a sync completed, even when only static data loaded —
        // so "Last Synced" reflects the run, not just whether live data arrived.
        Cache::forever(self::LAST_SYNCED_KEY, now()->toIso8601String());

        return $results;
    }

    /** @param ScrapedFlight[] $flights */
    private function persist(array $flights, string $source, bool $onlyIfMissing = false): int
    {
        $saved = 0;

        foreach ($flights as $f) {
            $airline = Airline::firstOrCreate(
                ['code' => $f->airlineCode],
                ['name' => $this->airlineName($f->airlineCode), 'is_active' => true]
            );

            $origin = Airport::where('iata_code', $f->origin)->first();
            $dest   = Airport::where('iata_code', $f->destination)->first();

            if (!$origin || !$dest) {
                Log::debug("Skipping flight {$f->flightNumber}: unknown airport {$f->origin} or {$f->destination}");
                continue;
            }

            $exists = Flight::where('flight_number', $f->flightNumber)
                ->where('origin_id', $origin->id)
                ->where('destination_id', $dest->id)
                ->exists();

            if ($exists && $onlyIfMissing) {
                continue;
            }

            Flight::updateOrCreate(
                ['flight_number' => $f->flightNumber, 'origin_id' => $origin->id, 'destination_id' => $dest->id],
                [
                    'airline_id'       => $airline->id,
                    'aircraft_type'    => $f->aircraftType,
                    'departure_time'   => $f->departureTime,
                    'arrival_time'     => $f->arrivalTime,
                    'duration_hours'   => $f->durationHours,
                    'duration_minutes' => $f->durationMinutes,
                    'operates_on'      => $f->operatesOn,
                    'cabin_class'      => $f->cabinClass,
                    'source'           => $source,
                    'scraped_at'       => $source === 'scraped' ? now() : null,
                    'is_active'        => true,
                ]
            );

            $saved++;
        }

        return $saved;
    }

    // -------------------------------------------------------------------------
    // Airline code → full name map
    // -------------------------------------------------------------------------

    private function airlineName(string $code): string
    {
        return [
            'BG' => 'Biman Bangladesh Airlines',
            'BS' => 'US-Bangla Airlines',
            'VQ' => 'Novoair',
            'RX' => 'Regent Airways',
            'EK' => 'Emirates',
            'FZ' => 'flydubai',
            'QR' => 'Qatar Airways',
            'EY' => 'Etihad Airways',
            'G9' => 'Air Arabia',
            'KU' => 'Kuwait Airways',
            'WY' => 'Oman Air',
            'SV' => 'Saudia',
            'GF' => 'Gulf Air',
            'MH' => 'Malaysia Airlines',
            'AK' => 'AirAsia',
            'SQ' => 'Singapore Airlines',
            'TG' => 'Thai Airways',
            'AI' => 'Air India',
            '6E' => 'IndiGo',
            'UL' => 'SriLankan Airlines',
            'CZ' => 'China Southern',
        ][$code] ?? $code;
    }
}
