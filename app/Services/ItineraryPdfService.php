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
        $fullPath = storage_path("app/{$path}");

        if (!file_exists(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0775, true);
        }

        $pdf->save($fullPath);

        return $path;
    }

    public function stream(Order $order): Response
    {
        return $this->buildPdf($order)->download("itinerary-{$order->reference}.pdf");
    }

    private function buildPdf(Order $order): \Barryvdh\DomPDF\PDF
    {
        return Pdf::loadView('pdf.itinerary', compact('order'))
            ->setPaper('a4', 'portrait');
    }
}
