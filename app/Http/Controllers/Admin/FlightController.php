<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use App\Services\FlightScraperService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlightController extends Controller
{
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
            'static'      => $allFlights->whereIn('source', ['static'])->count(),
            'scraped'     => $allFlights->whereIn('source', ['scraped'])->count(),
            'ota'         => $allFlights->whereIn('source', ['sharetrip', 'gozayaan', 'tripsatisfy'])->count(),
            'last_synced' => $allFlights->whereNotNull('scraped_at')->max('scraped_at'),
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

        return Inertia::render('Admin/Flights', [
            'flights'  => $flights,
            'stats'    => $stats,
            'airlines' => $airlines,
            'filters'  => $request->only('search', 'source', 'airline'),
        ]);
    }

    public function toggleActive(Flight $flight)
    {
        $flight->update(['is_active' => ! $flight->is_active]);

        return back()->with('success', "Flight {$flight->flight_number} " . ($flight->is_active ? 'activated' : 'deactivated') . '.');
    }

    public function sync(FlightScraperService $scraper)
    {
        try {
            $result = $scraper->run();
            $total  = ($result['scraped'] ?? 0) + ($result['ota'] ?? 0) + ($result['static'] ?? 0);

            return back()->with('success', "Sync complete — {$total} flights updated ({$result['scraped']} live, {$result['ota']} OTA, {$result['static']} static).");
        } catch (\Throwable $e) {
            return back()->with('error', 'Sync failed: ' . $e->getMessage());
        }
    }
}
