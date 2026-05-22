<?php

namespace App\Services;

use App\Models\Airline;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Downloads airline logos once and caches them on the local "public" disk
 * (storage/app/public/airlines/{CODE}.png), so the app serves logos itself
 * instead of calling an external CDN on every page view.
 *
 * `logo_url` is stored as a host-relative path ("/storage/airlines/XX.png")
 * so it works regardless of APP_URL / domain. Requires `php artisan storage:link`.
 */
class AirlineLogoService
{
    /** Source CDN (keyed by IATA code); 200px for crisp retina display. */
    private const SOURCE = 'https://pics.avs.io/200/200/';

    private const DIR = 'airlines';

    /** Fetch logos for airlines that don't have one yet (or all, with $force). Returns count stored. */
    public function fetchMissing(bool $force = false): int
    {
        $query = Airline::query()->whereNotNull('code');
        if (! $force) {
            $query->whereNull('logo_url');
        }

        $stored = 0;
        foreach ($query->get() as $airline) {
            if ($this->fetch($airline)) {
                $stored++;
            }
        }

        return $stored;
    }

    /** Download and store one airline's logo; set its logo_url. Returns true on success. */
    public function fetch(Airline $airline): bool
    {
        if (! $airline->code) {
            return false;
        }

        try {
            $resp = Http::timeout(15)->get(self::SOURCE.$airline->code.'.png');

            // Skip non-200s and tiny/blank placeholders.
            if (! $resp->successful() || strlen($resp->body()) < 500) {
                Log::debug("AirlineLogo: no usable logo for {$airline->code} (HTTP {$resp->status()}, ".strlen($resp->body())."B)");
                return false;
            }

            $path = self::DIR.'/'.$airline->code.'.png';
            Storage::disk('public')->put($path, $resp->body());

            // Host-relative path so it resolves on any domain.
            $airline->update(['logo_url' => '/storage/'.$path]);

            return true;
        } catch (\Throwable $e) {
            Log::warning("AirlineLogo: failed for {$airline->code}: ".$e->getMessage());
            return false;
        }
    }
}
