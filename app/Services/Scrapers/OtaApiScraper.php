<?php

namespace App\Services\Scrapers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Attempts to pull live flight data from OTA search APIs.
 * ShareTrip, GoZayaan, and TripSatisfy are JS-heavy SPAs; we probe their
 * underlying HTTP APIs with common BD route pairs. Any response that cannot
 * be parsed is silently skipped — static data fills the gaps.
 */
class OtaApiScraper
{
    /** BD routes we search on OTAs (origin → destination pairs) */
    private const ROUTES = [
        ['DAC', 'DXB'], ['DAC', 'DOH'], ['DAC', 'AUH'], ['DAC', 'KWI'],
        ['DAC', 'MCT'], ['DAC', 'RUH'], ['DAC', 'JED'], ['DAC', 'KUL'],
        ['DAC', 'SIN'], ['DAC', 'BKK'], ['DAC', 'LHR'],
        ['DXB', 'DAC'], ['DOH', 'DAC'], ['KUL', 'DAC'],
    ];

    /** @return array{source: string, flights: ScrapedFlight[]}[] */
    public function scrapeAll(): array
    {
        $results = [];

        $results[] = ['source' => 'sharetrip', 'flights' => $this->scrapeShareTrip()];
        $results[] = ['source' => 'gozayaan',  'flights' => $this->scrapeGoZayaan()];
        $results[] = ['source' => 'tripsatisfy','flights' => $this->scrapeTripSatisfy()];

        return $results;
    }

    /** @return ScrapedFlight[] */
    private function scrapeShareTrip(): array
    {
        $flights = [];
        $date    = now()->addDays(7)->format('Y-m-d');

        foreach (self::ROUTES as [$origin, $dest]) {
            try {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Content-Type'  => 'application/json',
                        'Accept'        => 'application/json',
                        'Origin'        => 'https://sharetrip.net',
                        'Referer'       => 'https://sharetrip.net/',
                        'User-Agent'    => 'Mozilla/5.0 (compatible; AirDodo/1.0)',
                    ])
                    ->post('https://api.sharetrip.net/api/v1/b2c/flight/search', [
                        'adult'         => 1,
                        'child'         => 0,
                        'infant'        => 0,
                        'type'          => 'oneway',
                        'class'         => 'Economy',
                        'originCode'    => $origin,
                        'destinationCode' => $dest,
                        'depart'        => $date,
                    ]);

                if ($response->successful()) {
                    $parsed = $this->parseShareTripResponse($response->json(), $origin, $dest);
                    $flights = array_merge($flights, $parsed);
                    Log::info("ShareTrip: got " . count($parsed) . " flights for {$origin}→{$dest}");
                }
            } catch (\Throwable $e) {
                Log::debug("ShareTrip scrape failed for {$origin}→{$dest}: " . $e->getMessage());
            }
        }

        return $flights;
    }

    /** @return ScrapedFlight[] */
    private function scrapeGoZayaan(): array
    {
        $flights = [];
        $date    = now()->addDays(7)->format('Y-m-d');

        foreach (self::ROUTES as [$origin, $dest]) {
            try {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Accept'        => 'application/json',
                        'Origin'        => 'https://gozayaan.com',
                        'Referer'       => 'https://gozayaan.com/',
                        'User-Agent'    => 'Mozilla/5.0 (compatible; AirDodo/1.0)',
                        'x-api-key'     => '',
                    ])
                    ->get('https://api.gozayaan.com/api/v1/flights', [
                        'from'   => $origin,
                        'to'     => $dest,
                        'date'   => $date,
                        'adults' => 1,
                        'class'  => 'Economy',
                    ]);

                if ($response->successful()) {
                    $parsed = $this->parseGoZayaanResponse($response->json(), $origin, $dest);
                    $flights = array_merge($flights, $parsed);
                    Log::info("GoZayaan: got " . count($parsed) . " flights for {$origin}→{$dest}");
                }
            } catch (\Throwable $e) {
                Log::debug("GoZayaan scrape failed for {$origin}→{$dest}: " . $e->getMessage());
            }
        }

        return $flights;
    }

    /** @return ScrapedFlight[] */
    private function scrapeTripSatisfy(): array
    {
        $flights = [];
        $date    = now()->addDays(7)->format('Y-m-d');

        foreach (self::ROUTES as [$origin, $dest]) {
            try {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Accept'        => 'application/json',
                        'Origin'        => 'https://www.tripsatisfy.com',
                        'Referer'       => 'https://www.tripsatisfy.com/',
                        'User-Agent'    => 'Mozilla/5.0 (compatible; AirDodo/1.0)',
                    ])
                    ->get('https://api.tripsatisfy.com/v1/flights/search', [
                        'origin'        => $origin,
                        'destination'   => $dest,
                        'departureDate' => $date,
                        'adults'        => 1,
                        'cabinClass'    => 'economy',
                    ]);

                if ($response->successful()) {
                    $parsed = $this->parseTripSatisfyResponse($response->json(), $origin, $dest);
                    $flights = array_merge($flights, $parsed);
                    Log::info("TripSatisfy: got " . count($parsed) . " flights for {$origin}→{$dest}");
                }
            } catch (\Throwable $e) {
                Log::debug("TripSatisfy scrape failed for {$origin}→{$dest}: " . $e->getMessage());
            }
        }

        return $flights;
    }

    // -------------------------------------------------------------------------
    // Per-OTA response parsers
    // All parsers return [] on unexpected structure — never throw.
    // -------------------------------------------------------------------------

    /** @return ScrapedFlight[] */
    private function parseShareTripResponse(?array $json, string $origin, string $dest): array
    {
        if (empty($json)) return [];

        $flights = [];

        // ShareTrip response shape (best-effort; structure may vary by API version)
        $items = $json['data']['results'] ?? $json['results'] ?? $json['flights'] ?? [];

        foreach ($items as $item) {
            try {
                $segments = $item['segments'] ?? $item['itineraries'][0]['segments'] ?? [];
                if (empty($segments)) continue;

                $seg          = $segments[0];
                $airlineCode  = $seg['marketingCarrier'] ?? $seg['airline'] ?? '';
                $flightNumber = ($airlineCode . ($seg['flightNumber'] ?? $seg['flightNo'] ?? ''));
                $dep          = substr($seg['departureTime'] ?? $seg['departure'] ?? '', 11, 5);
                $arr          = substr($seg['arrivalTime']   ?? $seg['arrival']   ?? '', 11, 5);
                $aircraft     = $seg['equipment'] ?? $seg['aircraftType'] ?? '';

                if (!$airlineCode || !$flightNumber || !$dep || !$arr) continue;

                [$dh, $dm] = $this->calcDuration($dep, $arr);
                $flights[] = new ScrapedFlight(
                    $airlineCode, $flightNumber, $origin, $dest,
                    $dep, $arr, $dh, $dm,
                    [0,1,2,3,4,5,6], $aircraft, 'Economy', 'sharetrip'
                );
            } catch (\Throwable) {
                continue;
            }
        }

        return $flights;
    }

    /** @return ScrapedFlight[] */
    private function parseGoZayaanResponse(?array $json, string $origin, string $dest): array
    {
        if (empty($json)) return [];

        $flights = [];
        $items   = $json['data'] ?? $json['flights'] ?? $json['results'] ?? [];

        foreach ($items as $item) {
            try {
                $airlineCode  = $item['airline_code'] ?? $item['carrier'] ?? '';
                $flightNumber = $item['flight_number'] ?? $item['flightNo'] ?? '';
                $dep          = substr($item['departure_time'] ?? $item['dep_time'] ?? '', 0, 5);
                $arr          = substr($item['arrival_time']   ?? $item['arr_time'] ?? '', 0, 5);
                $aircraft     = $item['aircraft_type'] ?? '';

                if (!$airlineCode || !$flightNumber || !$dep || !$arr) continue;

                [$dh, $dm] = $this->calcDuration($dep, $arr);
                $flights[] = new ScrapedFlight(
                    $airlineCode, $flightNumber, $origin, $dest,
                    $dep, $arr, $dh, $dm,
                    [0,1,2,3,4,5,6], $aircraft, 'Economy', 'gozayaan'
                );
            } catch (\Throwable) {
                continue;
            }
        }

        return $flights;
    }

    /** @return ScrapedFlight[] */
    private function parseTripSatisfyResponse(?array $json, string $origin, string $dest): array
    {
        if (empty($json)) return [];

        $flights = [];
        $items   = $json['flights'] ?? $json['data']['flights'] ?? $json['results'] ?? [];

        foreach ($items as $item) {
            try {
                $airlineCode  = $item['carrier_code'] ?? $item['airline'] ?? '';
                $flightNumber = $item['flight_number'] ?? '';
                $dep          = substr($item['departure'] ?? '', 0, 5);
                $arr          = substr($item['arrival']   ?? '', 0, 5);
                $aircraft     = $item['aircraft'] ?? '';

                if (!$airlineCode || !$flightNumber || !$dep || !$arr) continue;

                [$dh, $dm] = $this->calcDuration($dep, $arr);
                $flights[] = new ScrapedFlight(
                    $airlineCode, $flightNumber, $origin, $dest,
                    $dep, $arr, $dh, $dm,
                    [0,1,2,3,4,5,6], $aircraft, 'Economy', 'tripsatisfy'
                );
            } catch (\Throwable) {
                continue;
            }
        }

        return $flights;
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
