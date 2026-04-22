<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use App\Models\Flight;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlightController extends Controller
{
    public function index()
    {
        $airports = Airport::orderBy('country')->orderBy('city')->get(['id', 'iata_code', 'name', 'city', 'country']);

        return Inertia::render('Home', compact('airports'));
    }

    public function search(Request $request)
    {
        $request->validate([
            'origin'      => 'required|exists:airports,iata_code',
            'destination' => 'required|exists:airports,iata_code|different:origin',
            'date'        => 'required|date|after_or_equal:today',
            'passengers'  => 'required|integer|min:1|max:9',
        ]);

        $date      = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek; // 0=Sun..6=Sat

        $origin = Airport::where('iata_code', $request->origin)->first();
        $dest   = Airport::where('iata_code', $request->destination)->first();

        $flights = Flight::with(['airline', 'origin', 'destination'])
            ->where('origin_id', $origin->id)
            ->where('destination_id', $dest->id)
            ->where('is_active', true)
            ->get()
            ->filter(fn ($f) => $f->operatesOn($dayOfWeek))
            ->values();

        $airports = Airport::orderBy('country')->orderBy('city')->get(['id', 'iata_code', 'name', 'city', 'country']);

        return Inertia::render('FlightList', [
            'flights'     => $flights,
            'origin'      => $origin,
            'destination' => $dest,
            'date'        => $request->date,
            'passengers'  => (int) $request->passengers,
            'airports'    => $airports,
        ]);
    }
}
