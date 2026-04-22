<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Flight;
use App\Models\Passenger;
use App\Services\ItineraryPdfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['flight.airline', 'flight.origin', 'flight.destination', 'payment'])
            ->withCount('passengers')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('contact_name', 'like', "%{$search}%")
                  ->orWhere('contact_email', 'like', "%{$search}%")
                  ->orWhere('contact_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(30)->withQueryString();

        return Inertia::render('Admin/Orders', [
            'orders'  => $orders,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['flight.airline', 'flight.origin', 'flight.destination', 'passengers', 'payment']);

        return Inertia::render('Admin/OrderDetail', ['order' => $order]);
    }

    public function edit(Order $order)
    {
        $order->load(['flight.airline', 'flight.origin', 'flight.destination', 'passengers', 'payment']);
        $flights = Flight::with(['airline', 'origin', 'destination'])->where('is_active', true)->get();

        return Inertia::render('Admin/OrderEdit', [
            'order'   => $order,
            'flights' => $flights,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'contact_name'  => 'required|string|max:100',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string|max:20',
            'travel_date'   => 'required|date',
            'status'        => 'required|in:pending,payment_submitted,approved,rejected,cancelled',
            'admin_note'    => 'nullable|string|max:500',
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
            'travel_date'   => $request->travel_date,
            'status'        => $request->status,
            'admin_note'    => $request->admin_note,
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

        return redirect()->route('admin.orders.show', $order)->with('success', 'Order updated.');
    }

    public function approve(Request $request, Order $order, ItineraryPdfService $pdf)
    {
        $order->load(['flight.airline', 'flight.origin', 'flight.destination', 'passengers']);

        $path = $pdf->generate($order);

        $order->update(['status' => 'approved', 'pdf_path' => $path]);
        $order->payment?->update(['status' => 'verified', 'verified_at' => now()]);

        return back()->with('success', "Order {$order->reference} approved and PDF generated.");
    }

    public function reject(Request $request, Order $order)
    {
        $request->validate(['admin_note' => 'nullable|string|max:500']);

        $order->update(['status' => 'rejected', 'admin_note' => $request->admin_note]);
        $order->payment?->update(['status' => 'rejected']);

        return back()->with('success', "Order {$order->reference} rejected.");
    }

    public function download(Order $order, ItineraryPdfService $pdf)
    {
        $order->load(['flight.airline', 'flight.origin', 'flight.destination', 'passengers']);

        if ($order->status !== 'approved') {
            abort(404);
        }

        return $pdf->stream($order);
    }
}
