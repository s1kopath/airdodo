<?php

namespace App\Services\Scrapers;

class ScrapedFlight
{
    public function __construct(
        public readonly string $airlineCode,
        public readonly string $flightNumber,
        public readonly string $origin,
        public readonly string $destination,
        public readonly string $departureTime,
        public readonly string $arrivalTime,
        public readonly int $durationHours,
        public readonly int $durationMinutes,
        public readonly array $operatesOn,
        public readonly string $aircraftType = '',
        public readonly string $cabinClass = 'Economy',
        public readonly string $source = 'scraped',
    ) {}
}
