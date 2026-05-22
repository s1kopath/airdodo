<?php

namespace App\Console\Commands;

use App\Services\FlightScraperService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('flights:scrape')]
#[Description('Sync flight schedules from AeroDataBox (live) with static-data fallback')]
class ScrapeFlights extends Command
{
    public function handle(FlightScraperService $scraper): int
    {
        $this->info('Syncing flights: AeroDataBox (live) → static fallback...');

        $results = $scraper->run();

        $this->table(['Source', 'Count'], [
            ['live (AeroDataBox)', $results['scraped']],
            ['static fallback', $results['static']],
            ['layers failed',   $results['skipped']],
        ]);

        $this->info('Done.');

        return Command::SUCCESS;
    }
}
