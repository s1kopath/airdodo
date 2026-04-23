<?php

namespace App\Http\Controllers;

use App\Services\PassportOcrService;
use Illuminate\Http\Request;

class OcrController extends Controller
{
    public function scan(Request $request, PassportOcrService $ocr)
    {
        $request->validate([
            'text' => 'required|string',
        ]);

        \Illuminate\Support\Facades\Log::info('[OCR] Received text for parsing: ' . substr($request->text, 0, 100) . '...');
        $result = $ocr->extractDetails($request->text);

        return response()->json($result);
    }
}
