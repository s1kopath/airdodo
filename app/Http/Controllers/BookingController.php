<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Passenger;
use App\Services\ItineraryPdfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function lookup()
    {
        return Inertia::render('MyBookings/Lookup');
    }

    public function search(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $orders = Order::with(['flight.airline', 'flight.origin', 'flight.destination', 'payment'])
            ->withCount('passengers')
            ->where('contact_email', $request->email)
            ->latest()
            ->get();

        return Inertia::render('MyBookings/List', [
            'orders' => $orders,
            'email'  => $request->email,
        ]);
    }

    public function show(string $reference)
    {
        $order = Order::with(['flight.airline', 'flight.origin', 'flight.destination', 'passengers', 'payment'])
            ->where('reference', $reference)
            ->firstOrFail();

        return Inertia::render('MyBookings/Show', ['order' => $order]);
    }

    public function edit(string $reference)
    {
        $order = Order::with(['flight.airline', 'flight.origin', 'flight.destination', 'passengers'])
            ->where('reference', $reference)
            ->firstOrFail();

        if (! in_array($order->status, ['pending', 'payment_submitted'])) {
            return redirect()->route('bookings.show', $reference)
                ->with('error', 'This booking can no longer be edited.');
        }

        return Inertia::render('MyBookings/Edit', ['order' => $order]);
    }

    public function update(Request $request, string $reference)
    {
        $order = Order::with('passengers')
            ->where('reference', $reference)
            ->firstOrFail();

        if (! in_array($order->status, ['pending', 'payment_submitted'])) {
            return redirect()->route('bookings.show', $reference)
                ->with('error', 'This booking can no longer be edited.');
        }

        $request->validate([
            'contact_name'  => 'required|string|max:100',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string|max:20',
            'passengers'    => 'required|array|min:1',
            'passengers.*.id'              => 'required|exists:passengers,id',
            'passengers.*.type'            => 'required|in:adult,child,infant',
            'passengers.*.title'           => 'nullable|string|max:10',
            'passengers.*.first_name'      => 'required|string|max:100',
            'passengers.*.last_name'       => 'required|string|max:100',
            'passengers.*.date_of_birth'   => 'required|date',
            'passengers.*.nationality'     => 'required|string|size:2',
            'passengers.*.passport_number' => 'nullable|string|max:20',
            'passengers.*.passport_expiry' => 'nullable|date',
        ]);

        $order->update([
            'contact_name'  => $request->contact_name,
            'contact_email' => $request->contact_email,
            'contact_phone' => $request->contact_phone,
        ]);

        foreach ($request->passengers as $p) {
            Passenger::where('id', $p['id'])->where('order_id', $order->id)->update([
                'type'            => $p['type'],
                'title'           => $p['title'] ?? null,
                'first_name'      => $p['first_name'],
                'last_name'       => $p['last_name'],
                'date_of_birth'   => $p['date_of_birth'],
                'nationality'     => $p['nationality'],
                'passport_number' => $p['passport_number'] ?? null,
                'passport_expiry' => $p['passport_expiry'] ?? null,
            ]);
        }

        return redirect()->route('bookings.show', $reference)->with('success', 'Booking updated.');
    }

    public function download(string $reference, ItineraryPdfService $pdf)
    {
        $order = Order::with(['flight.airline', 'flight.origin', 'flight.destination', 'passengers'])
            ->where('reference', $reference)
            ->where('status', 'approved')
            ->firstOrFail();

        return $pdf->stream($order);
    }
}
