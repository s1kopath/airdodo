<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use App\Services\FlightScraperService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class FlightController extends Controller
{
    /** Max number of manual (UI) syncs allowed per calendar day. */
    public const SYNC_DAILY_LIMIT = 2;

    public function index(Request $request)
    {
        $query = Flight::with(['airline', 'origin', 'destination'])->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('flight_number', 'like', "%{$s}%")
                  ->orWhereHas('airline', fn ($q2) => $q2->where('name', 'like', "%{$s}%")->orWhere('code', 'like', "%{$s}%"))
                  ->orWhereHas('origin', fn ($q2) => $q2->where('iata_code', 'like', "%{$s}%")->orWhere('city', 'like', "%{$s}%"))
                  ->orWhereHas('destination', fn ($q2) => $q2->where('iata_code', 'like', "%{$s}%")->orWhere('city', 'like', "%{$s}%"));
            });
        }

        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        if ($request->filled('airline')) {
            $query->whereHas('airline', fn ($q) => $q->where('code', $request->airline));
        }

        $flights = $query->paginate(25)->withQueryString();

        // Aggregate stats for the stats cards
        $allFlights = Flight::selectRaw('source, is_active, scraped_at')->get();

        $stats = [
            'total'       => $allFlights->count(),
            'active'      => $allFlights->where('is_active', true)->count(),
            'static'      => $allFlights->where('source', 'static')->count(),
            'scraped'     => $allFlights->where('source', 'scraped')->count(),
            'last_synced' => Cache::get(FlightScraperService::LAST_SYNCED_KEY)
                ?? $allFlights->whereNotNull('scraped_at')->max('scraped_at'),
        ];

        // Unique airline codes for the filter dropdown
        $airlines = Flight::with('airline')
            ->select('airline_id')
            ->distinct()
            ->get()
            ->map(fn ($f) => ['code' => $f->airline?->code, 'name' => $f->airline?->name])
            ->filter(fn ($a) => $a['code'])
            ->sortBy('name')
            ->values();

        $syncUsed = (int) Cache::get($this->syncCountKey(), 0);

        return Inertia::render('Admin/Flights', [
            'flights'  => $flights,
            'stats'    => $stats,
            'airlines' => $airlines,
            'filters'  => $request->only('search', 'source', 'airline'),
            'sync'     => [
                'used'      => $syncUsed,
                'limit'     => self::SYNC_DAILY_LIMIT,
                'remaining' => max(0, self::SYNC_DAILY_LIMIT - $syncUsed),
                'can_sync'  => $syncUsed < self::SYNC_DAILY_LIMIT,
            ],
        ]);
    }

    public function toggleActive(Flight $flight)
    {
        $flight->update(['is_active' => ! $flight->is_active]);

        return back()->with('success', "Flight {$flight->flight_number} " . ($flight->is_active ? 'activated' : 'deactivated') . '.');
    }

    public function sync(FlightScraperService $scraper)
    {
        $key  = $this->syncCountKey();
        $used = (int) Cache::get($key, 0);

        if ($used >= self::SYNC_DAILY_LIMIT) {
            return back()->with('error', "Daily sync limit reached ({$used}/" . self::SYNC_DAILY_LIMIT . '). Please try again tomorrow.');
        }

        // Reserve the slot up front so a failed run still counts against the API quota.
        Cache::put($key, $used + 1, now()->endOfDay());

        try {
            $result = $scraper->run();
            $live   = $result['scraped'] ?? 0;
            $static = $result['static'] ?? 0;
            $left   = self::SYNC_DAILY_LIMIT - ($used + 1);

            return back()->with('success', "Sync complete — {$live} live (AeroDataBox) + {$static} static flights updated. ({$left} sync" . ($left === 1 ? '' : 's') . ' left today.)');
        } catch (\Throwable $e) {
            return back()->with('error', 'Sync failed: ' . $e->getMessage());
        }
    }

    /** Cache key tracking how many manual syncs ran today (resets at local midnight). */
    private function syncCountKey(): string
    {
        return 'flights:sync_count:' . now()->toDateString();
    }
}
