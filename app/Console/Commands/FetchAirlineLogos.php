<?php

namespace App\Console\Commands;

use App\Services\AirlineLogoService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('airlines:fetch-logos {--force : Re-download even for airlines that already have a logo}')]
#[Description('Download airline logos to local storage and populate airlines.logo_url')]
class FetchAirlineLogos extends Command
{
    public function handle(AirlineLogoService $logos): int
    {
        $this->info('Fetching airline logos to local storage…');

        $stored = $logos->fetchMissing((bool) $this->option('force'));

        $this->info("Done — stored {$stored} logo(s).");

        return Command::SUCCESS;
    }
}
