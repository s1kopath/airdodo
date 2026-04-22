<?php

namespace App\Services;

use App\Models\Airline;
use App\Models\Airport;
use App\Models\Flight;
use App\Services\Scrapers\GuzzleScraper;
use App\Services\Scrapers\OtaApiScraper;
use App\Services\Scrapers\PantherScraper;
use App\Services\Scrapers\ScrapedFlight;
use App\Services\Scrapers\StaticFlightData;
use Illuminate\Support\Facades\Log;

class FlightScraperService
{
    public function __construct(
        private GuzzleScraper $guzzle,
        private PantherScraper $panther,
        private StaticFlightData $static,
        private OtaApiScraper $ota,
    ) {}

    public function run(): array
    {
        $results = ['scraped' => 0, 'ota' => 0, 'static' => 0, 'skipped' => 0];

        // Level 1 & 2: airline website scrapers (Guzzle → Panther fallback)
        foreach ($this->targets() as $target) {
            $flights = [];

            if ($target['guzzle_url'] ?? null) {
                $flights = $this->guzzle->scrape($target['guzzle_url'], $target['parser']);
            }

            if (empty($flights) && ($target['panther_url'] ?? null)) {
                Log::info("Falling back to Panther for {$target['name']}");
                $flights = $this->panther->scrape($target['panther_url'], $target['parser']);
            }

            if (!empty($flights)) {
                $saved = $this->persist($flights, 'scraped');
                $results['scraped'] += $saved;
            } else {
                $results['skipped']++;
                Log::warning("All scrapers failed for {$target['name']}, will use static data.");
            }
        }

        // Level 3: OTA API scrapers (ShareTrip, GoZayaan, TripSatisfy)
        foreach ($this->ota->scrapeAll() as ['source' => $source, 'flights' => $flights]) {
            if (!empty($flights)) {
                $saved = $this->persist($flights, $source, onlyIfMissing: true);
                $results['ota'] += $saved;
                Log::info("OTA [{$source}]: persisted {$saved} flights.");
            }
        }

        // Level 4: Static data fills anything still missing
        $staticFlights = $this->static->get();
        $saved = $this->persist($staticFlights, 'static', onlyIfMissing: true);
        $results['static'] += $saved;

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
                    'scraped_at'       => in_array($source, ['scraped', 'sharetrip', 'gozayaan', 'tripsatisfy']) ? now() : null,
                    'is_active'        => true,
                ]
            );

            $saved++;
        }

        return $saved;
    }

    private function targets(): array
    {
        return [
            [
                'name'        => 'Biman Bangladesh',
                'guzzle_url'  => 'https://www.bimanair.com/flight-schedule',
                'panther_url' => 'https://www.bimanair.com/flight-schedule',
                'parser'      => fn ($crawler) => $this->parseBiman($crawler),
            ],
            [
                'name'        => 'US-Bangla Airlines',
                'guzzle_url'  => 'https://www.usbair.com/flight-schedule',
                'panther_url' => 'https://www.usbair.com/flight-schedule',
                'parser'      => fn ($crawler) => $this->parseUSBangla($crawler),
            ],
            [
                'name'        => 'Novoair',
                'guzzle_url'  => 'https://www.flynovoair.com/flight-schedule',
                'panther_url' => 'https://www.flynovoair.com/flight-schedule',
                'parser'      => fn ($crawler) => $this->parseNovoair($crawler),
            ],
        ];
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

    // -------------------------------------------------------------------------
    // Per-airline HTML parsers
    // -------------------------------------------------------------------------

    private function parseBiman($crawler): array
    {
        $flights = [];

        try {
            $crawler->filter('.flight-schedule-row, tr.schedule-item')->each(function ($row) use (&$flights) {
                $cols = $row->filter('td');
                if ($cols->count() < 6) return;

                $flightNo = trim($cols->eq(0)->text());
                $origin   = trim($cols->eq(1)->text());
                $dest     = trim($cols->eq(2)->text());
                $dep      = trim($cols->eq(3)->text());
                $arr      = trim($cols->eq(4)->text());
                $days     = $this->parseDayString(trim($cols->eq(5)->text()));

                [$dh, $dm] = $this->calcDuration($dep, $arr);
                $flights[] = new ScrapedFlight('BG', $flightNo, $origin, $dest, $dep, $arr, $dh, $dm, $days, source: 'scraped');
            });
        } catch (\Exception $e) {
            Log::debug('Biman parser error: ' . $e->getMessage());
        }

        return $flights;
    }

    private function parseUSBangla($crawler): array
    {
        $flights = [];

        try {
            $crawler->filter('.schedule-table tbody tr, table.flight-table tr')->each(function ($row) use (&$flights) {
                $cols = $row->filter('td');
                if ($cols->count() < 5) return;

                $flightNo = trim($cols->eq(0)->text());
                $origin   = trim($cols->eq(1)->text());
                $dest     = trim($cols->eq(2)->text());
                $dep      = trim($cols->eq(3)->text());
                $arr      = trim($cols->eq(4)->text());
                $days     = $cols->count() > 5 ? $this->parseDayString(trim($cols->eq(5)->text())) : [0,1,2,3,4,5,6];

                [$dh, $dm] = $this->calcDuration($dep, $arr);
                $flights[] = new ScrapedFlight('BS', $flightNo, $origin, $dest, $dep, $arr, $dh, $dm, $days, source: 'scraped');
            });
        } catch (\Exception $e) {
            Log::debug('US-Bangla parser error: ' . $e->getMessage());
        }

        return $flights;
    }

    private function parseNovoair($crawler): array
    {
        $flights = [];

        try {
            $crawler->filter('.novoair-schedule tr, .schedule-row')->each(function ($row) use (&$flights) {
                $cols = $row->filter('td');
                if ($cols->count() < 5) return;

                $flightNo = trim($cols->eq(0)->text());
                $origin   = trim($cols->eq(1)->text());
                $dest     = trim($cols->eq(2)->text());
                $dep      = trim($cols->eq(3)->text());
                $arr      = trim($cols->eq(4)->text());

                [$dh, $dm] = $this->calcDuration($dep, $arr);
                $flights[] = new ScrapedFlight('VQ', $flightNo, $origin, $dest, $dep, $arr, $dh, $dm, [0,1,2,3,4,5,6], source: 'scraped');
            });
        } catch (\Exception $e) {
            Log::debug('Novoair parser error: ' . $e->getMessage());
        }

        return $flights;
    }

    private function parseDayString(string $str): array
    {
        $map  = ['Su' => 0, 'Mo' => 1, 'Tu' => 2, 'We' => 3, 'Th' => 4, 'Fr' => 5, 'Sa' => 6];
        $days = [];
        foreach ($map as $abbr => $num) {
            if (stripos($str, $abbr) !== false) {
                $days[] = $num;
            }
        }
        return $days ?: [0,1,2,3,4,5,6];
    }

    private function calcDuration(string $dep, string $arr): array
    {
        try {
            $d = \Carbon\Carbon::createFromFormat('H:i', $dep);
            $a = \Carbon\Carbon::createFromFormat('H:i', $arr);
            if ($a->lt($d)) $a->addDay();
            $mins = $d->diffInMinutes($a);
            return [intdiv($mins, 60), $mins % 60];
        } catch (\Exception) {
            return [0, 0];
        }
    }
}
