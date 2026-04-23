<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use App\Models\Order;
use App\Models\Passenger;
use App\Models\Payment;
use App\Services\ItineraryPdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'flight_id'  => 'required|exists:flights,id',
            'date'       => 'required|date|after_or_equal:today',
            'passengers' => 'required|integer|min:1|max:9',
        ]);

        $flight = Flight::with(['airline', 'origin', 'destination'])->findOrFail($request->flight_id);

        return Inertia::render('PassengerForm', [
            'flight'     => $flight,
            'date'       => $request->date,
            'passengers' => (int) $request->passengers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'flight_id'            => 'required|exists:flights,id',
            'travel_date'          => 'required|date|after_or_equal:today',
            'contact_name'         => 'required|string|max:100',
            'contact_email'        => 'required|email',
            'contact_phone'        => 'nullable|string|max:20',
            'passengers'           => 'required|array|min:1',
            'passengers.*.type'    => 'required|in:adult,child,infant',
            'passengers.*.title'   => 'nullable|string|max:10',
            'passengers.*.first_name'        => 'required|string|max:100',
            'passengers.*.last_name'         => 'required|string|max:100',
            'passengers.*.date_of_birth'     => 'required|date',
            'passengers.*.nationality'       => 'required|string|size:2',
            'passengers.*.passport_number'   => 'nullable|string|max:20',
            'passengers.*.passport_expiry'   => 'nullable|date',
        ]);

        $order = Order::create([
            'reference'     => strtoupper(Str::random(8)),
            'flight_id'     => $request->flight_id,
            'user_id'       => auth()->id(),
            'travel_date'   => $request->travel_date,
            'contact_name'  => $request->contact_name,
            'contact_email' => $request->contact_email,
            'contact_phone' => $request->contact_phone,
            'status'        => 'approved',
        ]);

        foreach ($request->passengers as $p) {
            Passenger::create(array_merge($p, ['order_id' => $order->id]));
        }

        // Auto-generate PDF
        $pdfService = app(ItineraryPdfService::class);
        $order->load(['flight.airline', 'flight.origin', 'flight.destination', 'passengers']);
        $path = $pdfService->generate($order);
        $order->update(['pdf_path' => $path]);

        return redirect()->route('orders.status', $order->reference);
    }

    public function payment(string $reference)
    {
        $order = Order::with(['flight.airline', 'flight.origin', 'flight.destination', 'passengers'])
            ->where('reference', $reference)
            ->firstOrFail();

        return Inertia::render('Payment', [
            'order'        => $order,
            'bkash_number' => config('app.bkash_number', '01XXXXXXXXX'),
            'amount'       => config('app.itinerary_price', 300),
        ]);
    }

    public function submitPayment(Request $request, string $reference)
    {
        $request->validate([
            'txn_id'        => 'required|string|max:50',
            'sender_number' => 'required|string|max:20',
        ]);

        $order = Order::where('reference', $reference)->firstOrFail();

        Payment::create([
            'order_id'      => $order->id,
            'method'        => 'bkash',
            'txn_id'        => $request->txn_id,
            'sender_number' => $request->sender_number,
            'amount'        => config('app.itinerary_price', 300),
            'status'        => 'pending',
        ]);

        $order->update(['status' => 'payment_submitted']);

        return redirect()->route('orders.status', $reference);
    }

    public function status(string $reference)
    {
        $order = Order::with(['flight.airline', 'flight.origin', 'flight.destination', 'passengers', 'payment'])
            ->where('reference', $reference)
            ->firstOrFail();

        return Inertia::render('OrderStatus', compact('order'));
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
