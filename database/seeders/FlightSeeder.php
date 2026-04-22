<?php

namespace Database\Seeders;

use App\Services\FlightScraperService;
use Illuminate\Database\Seeder;

class FlightSeeder extends Seeder
{
    public function run(FlightScraperService $scraper): void
    {
        $this->command->info('Seeding flights via scraper (static fallback active)...');
        $results = $scraper->run();
        $this->command->info("Scraped: {$results['scraped']} | Static: {$results['static']} | Failed sources: {$results['skipped']}");
    }
}
