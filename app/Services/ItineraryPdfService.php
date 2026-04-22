<?php

namespace App\Services;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class ItineraryPdfService
{
    public function generate(Order $order): string
    {
        $pdf  = $this->buildPdf($order);
        $path = "itineraries/{$order->reference}.pdf";

        storage_path("app/{$path}");
        $pdf->save(storage_path("app/{$path}"));

        return $path;
    }

    public function stream(Order $order): Response
    {
        return $this->buildPdf($order)->stream("itinerary-{$order->reference}.pdf");
    }

    private function buildPdf(Order $order): \Barryvdh\DomPDF\PDF
    {
        return Pdf::loadView('pdf.itinerary', compact('order'))
            ->setPaper('a4', 'portrait');
    }
}
