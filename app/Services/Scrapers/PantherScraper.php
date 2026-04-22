<?php

namespace App\Services\Scrapers;

use Facebook\WebDriver\Exception\WebDriverException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Panther\Client as PantherClient;

/**
 * Fallback Level 2: headless Chrome via Symfony Panther for JS-rendered pages.
 */
class PantherScraper
{
    /** @return ScrapedFlight[] */
    public function scrape(string $url, callable $parser): array
    {
        $client = null;

        try {
            $client  = PantherClient::createChromeClient(null, [
                '--headless',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ]);

            $crawler = $client->request('GET', $url);
            $client->waitFor('body', 10);

            return $parser($crawler) ?? [];
        } catch (WebDriverException|\Exception $e) {
            Log::warning("PantherScraper failed for {$url}: " . $e->getMessage());
            return [];
        } finally {
            $client?->quit();
        }
    }
}
