<?php

namespace App\Console\Commands;

use App\Services\FlightScraperService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('flights:scrape')]
#[Description('Scrape flight schedules from airline sites (Guzzle → Panther → Static fallback)')]
class ScrapeFlights extends Command
{
    public function handle(FlightScraperService $scraper): int
    {
        $this->info('Starting flight scraper with 3-level fallback chain...');

        $results = $scraper->run();

        $this->table(['Source', 'Count'], [
            ['scraped (live)',  $results['scraped']],
            ['static fallback', $results['static']],
            ['sources failed',  $results['skipped']],
        ]);

        $this->info('Done.');

        return Command::SUCCESS;
    }
}
