<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class PassportOcrService
{
    /**
     * Extract details from raw OCR text.
     */
    public function extractDetails(string $text): array
    {
        $lines = explode("\n", $text);
        $mrzLines = $this->findMrzLines($lines);

        $data = [
            'success'         => true,
            'first_name'      => '',
            'last_name'       => '',
            'date_of_birth'   => '',
            'passport_number' => '',
            'nationality'     => 'BD',
            'raw_text'        => $text,
        ];

        if (count($mrzLines) >= 2) {
            $this->parseMrz($mrzLines, $data);
        } else {
            // Fallback to basic regex if MRZ not clear
            $this->fallbackExtraction($text, $data);
        }

        return $data;
    }

    private function findMrzLines(array $lines): array
    {
        $mrzLines = [];
        foreach ($lines as $line) {
            $clean = str_replace(' ', '', $line);
            // MRZ lines are usually 44 chars and contain many '<'
            if (strlen($clean) >= 30 && str_contains($clean, '<<<')) {
                $mrzLines[] = strtoupper($clean);
            }
        }
        return $mrzLines;
    }

    private function parseMrz(array $mrz, &$data): void
    {
        $line1 = $mrz[0];
        $line2 = $mrz[1];

        // Line 1: P<BGDNAME<<SURNAME<<<<<<<<<<<<<<<<<<<<<<<<<<
        if (str_starts_with($line1, 'P')) {
            $parts = explode('<<', substr($line1, 5));
            $data['last_name']  = str_replace('<', ' ', $parts[0] ?? '');
            $data['first_name'] = str_replace('<', ' ', $parts[1] ?? '');
        }

        // Line 2: PASSNO<8BGDYYMMDDM2701017<<<<<<<<<<<<<<06
        // Passport No: first 9 chars of line 2
        $data['passport_number'] = substr($line2, 0, 9);
        
        // DOB: chars 13-18 (YYMMDD)
        $dobRaw = substr($line2, 13, 6);
        if (is_numeric($dobRaw)) {
            $year = (int)substr($dobRaw, 0, 2);
            $year += ($year > date('y') ? 1900 : 2000);
            $data['date_of_birth'] = $year . '-' . substr($dobRaw, 2, 2) . '-' . substr($dobRaw, 4, 2);
        }

        // Nationality: chars 10-12
        $nat = substr($line2, 10, 3);
        if ($nat === 'BGD') $data['nationality'] = 'BD';
    }

    private function fallbackExtraction(string $text, &$data): void
    {
        // 1. Try to find name (common in visual zone)
        // Look for "Name" or "Given Name" or "Surname"
        if (preg_match('/(?:Name|Surname|Given Name)[:\s]+([A-Z\s<]+)/i', $text, $matches)) {
            $rawName = trim(str_replace('<', ' ', $matches[1]));
            $parts = explode(' ', $rawName);
            if (count($parts) > 1) {
                $data['last_name'] = array_shift($parts);
                $data['first_name'] = implode(' ', $parts);
            } else {
                $data['first_name'] = $rawName;
            }
        }

        // 2. Try to find Passport Number (Letter + 7-8 digits)
        if (preg_match('/[A-Z][0-9]{7,8}/i', $text, $matches)) {
            $data['passport_number'] = strtoupper($matches[0]);
        }

        // 3. Try to find DOB (DD MMM YYYY or YYYY-MM-DD or DD/MM/YYYY)
        // Match 10-01-1990 or 1990-01-10 or 10/01/1990
        if (preg_match('/(\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4})/', $text, $matches)) {
            try {
                $date = \Illuminate\Support\Carbon::parse($matches[1]);
                $data['date_of_birth'] = $date->format('Y-m-d');
            } catch (\Exception) {}
        }

        // 4. Try to find Nationality
        if (preg_match('/Nationality[:\s]+(BANGLADESH|BGD|BD)/i', $text, $matches)) {
            $data['nationality'] = 'BD';
        }
    }
}
