<?php

namespace App\Services\Scrapers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;

/**
 * Fallback Level 1: plain HTTP + DomCrawler for server-rendered airline pages.
 */
class GuzzleScraper
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'timeout'         => 15,
            'connect_timeout' => 10,
            'headers'         => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
                'Accept'     => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            ],
        ]);
    }

    /** @return ScrapedFlight[] */
    public function scrape(string $url, callable $parser): array
    {
        try {
            $response = $this->client->get($url);
            $html     = (string) $response->getBody();
            $crawler  = new Crawler($html);

            return $parser($crawler) ?? [];
        } catch (GuzzleException $e) {
            Log::warning("GuzzleScraper failed for {$url}: " . $e->getMessage());
            return [];
        }
    }
}
