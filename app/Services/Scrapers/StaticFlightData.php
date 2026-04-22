<?php

namespace App\Services\Scrapers;

/**
 * Curated static schedule data for Bangladesh routes.
 * Covers domestic, Middle East, SE Asia, South Asia, East Asia, Europe & Americas.
 * Used as fallback when live scrapers return nothing.
 */
class StaticFlightData
{
    /** @return ScrapedFlight[] */
    public function get(): array
    {
        return array_merge(
            $this->domestic(),
            $this->middleEast(),
            $this->southeastAsia(),
            $this->southAsia(),
            $this->eastAsia(),
            $this->europeAmericas(),
        );
    }

    /** @return ScrapedFlight[] */
    private function domestic(): array
    {
        return [
            // ── DAC ↔ CGP (Chittagong) ─────────────────────────────────────────
            new ScrapedFlight('BG', 'BG437', 'DAC', 'CGP', '07:00', '08:05', 1,  5, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BG', 'BG439', 'DAC', 'CGP', '12:30', '13:35', 1,  5, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BG', 'BG436', 'CGP', 'DAC', '08:45', '09:50', 1,  5, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BG', 'BG438', 'CGP', 'DAC', '14:30', '15:35', 1,  5, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BS', 'BS101', 'DAC', 'CGP', '06:00', '07:05', 1,  5, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BS', 'BS103', 'DAC', 'CGP', '10:30', '11:35', 1,  5, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BS', 'BS102', 'CGP', 'DAC', '08:00', '09:05', 1,  5, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ811', 'DAC', 'CGP', '09:00', '10:05', 1,  5, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ813', 'DAC', 'CGP', '16:00', '17:05', 1,  5, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ812', 'CGP', 'DAC', '11:00', '12:05', 1,  5, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),

            // ── DAC ↔ ZYL (Sylhet) ────────────────────────────────────────────
            new ScrapedFlight('BG', 'BG431', 'DAC', 'ZYL', '08:00', '08:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BG', 'BG433', 'DAC', 'ZYL', '15:30', '16:20', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BG', 'BG432', 'ZYL', 'DAC', '10:00', '10:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BS', 'BS111', 'DAC', 'ZYL', '07:00', '07:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BS', 'BS112', 'ZYL', 'DAC', '09:00', '09:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ801', 'DAC', 'ZYL', '11:00', '11:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ802', 'ZYL', 'DAC', '13:00', '13:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),

            // ── DAC ↔ JSR (Jashore) ───────────────────────────────────────────
            new ScrapedFlight('BG', 'BG421', 'DAC', 'JSR', '08:30', '09:20', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BG', 'BG422', 'JSR', 'DAC', '10:00', '10:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BS', 'BS121', 'DAC', 'JSR', '07:30', '08:20', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BS', 'BS122', 'JSR', 'DAC', '09:00', '09:50', 0, 50, [0,1,2,3,4,5,6], 'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ821', 'DAC', 'JSR', '14:00', '14:50', 0, 50, [0,2,4,6],        'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ822', 'JSR', 'DAC', '16:00', '16:50', 0, 50, [0,2,4,6],        'ATR 72-600',      'Economy', 'static'),

            // ── DAC ↔ RJH (Rajshahi) ─────────────────────────────────────────
            new ScrapedFlight('BG', 'BG441', 'DAC', 'RJH', '09:00', '10:00', 1,  0, [0,2,3,5,6],     'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BG', 'BG442', 'RJH', 'DAC', '10:45', '11:45', 1,  0, [0,2,3,5,6],     'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BS', 'BS131', 'DAC', 'RJH', '08:00', '09:00', 1,  0, [1,3,4,6],       'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BS', 'BS132', 'RJH', 'DAC', '09:45', '10:45', 1,  0, [1,3,4,6],       'ATR 72-600',      'Economy', 'static'),

            // ── DAC ↔ CXB (Cox's Bazar) ──────────────────────────────────────
            new ScrapedFlight('BG', 'BG461', 'DAC', 'CXB', '08:00', '09:15', 1, 15, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BG', 'BG463', 'DAC', 'CXB', '14:30', '15:45', 1, 15, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BG', 'BG462', 'CXB', 'DAC', '10:00', '11:15', 1, 15, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BS', 'BS141', 'DAC', 'CXB', '07:00', '08:15', 1, 15, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('BS', 'BS142', 'CXB', 'DAC', '09:00', '10:15', 1, 15, [0,1,2,3,4,5,6], 'Boeing 737-800',  'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ831', 'DAC', 'CXB', '11:00', '12:15', 1, 15, [0,2,4,6],        'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ832', 'CXB', 'DAC', '13:00', '14:15', 1, 15, [0,2,4,6],        'ATR 72-600',      'Economy', 'static'),

            // ── DAC ↔ BZL (Barisal) ──────────────────────────────────────────
            new ScrapedFlight('BS', 'BS151', 'DAC', 'BZL', '08:30', '09:15', 0, 45, [0,2,4,6],        'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('BS', 'BS152', 'BZL', 'DAC', '10:00', '10:45', 0, 45, [0,2,4,6],        'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ841', 'DAC', 'BZL', '13:00', '13:45', 0, 45, [1,3,5],          'ATR 72-600',      'Economy', 'static'),
            new ScrapedFlight('VQ', 'VQ842', 'BZL', 'DAC', '14:30', '15:15', 0, 45, [1,3,5],          'ATR 72-600',      'Economy', 'static'),
        ];
    }

    /** @return ScrapedFlight[] */
    private function middleEast(): array
    {
        return [
            // ── DAC ↔ DXB (Dubai) ────────────────────────────────────────────
            new ScrapedFlight('EK', 'EK585', 'DAC', 'DXB', '01:30', '05:00', 5, 30, [0,1,2,3,4,5,6], 'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('EK', 'EK586', 'DXB', 'DAC', '07:35', '14:05', 4, 30, [0,1,2,3,4,5,6], 'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('BG', 'BG047', 'DAC', 'DXB', '02:00', '05:30', 5, 30, [0,2,4,6],        'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG049', 'DAC', 'DXB', '23:59', '03:30', 5, 31, [1,3,5],          'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG048', 'DXB', 'DAC', '07:00', '13:30', 4, 30, [0,2,4,6],        'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BS', 'BS341', 'DAC', 'DXB', '08:30', '12:00', 5, 30, [0,2,4,6],        'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BS', 'BS343', 'DAC', 'DXB', '20:00', '23:30', 5, 30, [1,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BS', 'BS342', 'DXB', 'DAC', '14:00', '20:30', 4, 30, [0,2,4,6],        'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('FZ', 'FZ571', 'DAC', 'DXB', '05:00', '08:30', 5, 30, [0,1,3,5],        'Boeing 737 MAX',   'Economy', 'static'),
            new ScrapedFlight('FZ', 'FZ572', 'DXB', 'DAC', '10:10', '16:40', 4, 30, [0,1,3,5],        'Boeing 737 MAX',   'Economy', 'static'),

            // ── DAC ↔ DOH (Doha) ─────────────────────────────────────────────
            new ScrapedFlight('QR', 'QR637', 'DAC', 'DOH', '02:30', '05:30', 5,  0, [0,1,2,3,4,5,6], 'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('QR', 'QR638', 'DOH', 'DAC', '08:05', '15:05', 5,  0, [0,1,2,3,4,5,6], 'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('BG', 'BG027', 'DAC', 'DOH', '03:30', '07:00', 5, 30, [1,3,5],          'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG028', 'DOH', 'DAC', '09:00', '16:30', 5, 30, [1,3,5],          'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BS', 'BS331', 'DAC', 'DOH', '04:00', '07:30', 5, 30, [0,2,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BS', 'BS332', 'DOH', 'DAC', '09:30', '17:00', 5, 30, [0,2,5],          'Boeing 737-800',   'Economy', 'static'),

            // ── DAC ↔ AUH (Abu Dhabi) ────────────────────────────────────────
            new ScrapedFlight('EY', 'EY241', 'DAC', 'AUH', '03:00', '06:10', 5, 10, [0,2,4,6],        'Airbus A330-300',  'Economy', 'static'),
            new ScrapedFlight('EY', 'EY242', 'AUH', 'DAC', '08:30', '15:40', 5, 10, [0,2,4,6],        'Airbus A330-300',  'Economy', 'static'),
            new ScrapedFlight('G9', 'G9526', 'DAC', 'AUH', '22:00', '01:10', 5, 10, [1,3,5,6],        'Airbus A320',      'Economy', 'static'),
            new ScrapedFlight('G9', 'G9527', 'AUH', 'DAC', '02:30', '09:40', 5, 10, [0,2,4,5],        'Airbus A320',      'Economy', 'static'),

            // ── DAC → SHJ (Sharjah) ──────────────────────────────────────────
            new ScrapedFlight('G9', 'G9528', 'DAC', 'SHJ', '20:30', '00:00', 5, 30, [0,2,3,6],        'Airbus A320',      'Economy', 'static'),
            new ScrapedFlight('G9', 'G9529', 'SHJ', 'DAC', '01:30', '08:00', 4, 30, [0,2,3,6],        'Airbus A320',      'Economy', 'static'),

            // ── DAC ↔ KWI (Kuwait City) ──────────────────────────────────────
            new ScrapedFlight('KU', 'KU381', 'DAC', 'KWI', '23:00', '03:30', 5, 30, [0,2,5],          'Airbus A330-200',  'Economy', 'static'),
            new ScrapedFlight('KU', 'KU382', 'KWI', 'DAC', '05:00', '12:30', 5, 30, [0,2,5],          'Airbus A330-200',  'Economy', 'static'),
            new ScrapedFlight('BG', 'BG021', 'DAC', 'KWI', '02:00', '06:30', 4, 30, [1,4,6],          'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG022', 'KWI', 'DAC', '08:30', '15:00', 4, 30, [1,4,6],          'Boeing 787-8',     'Economy', 'static'),

            // ── DAC ↔ MCT (Muscat) ───────────────────────────────────────────
            new ScrapedFlight('WY', 'WY151', 'DAC', 'MCT', '03:00', '06:30', 4, 30, [1,3,5,6],        'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('WY', 'WY152', 'MCT', 'DAC', '08:00', '13:30', 3, 30, [1,3,5,6],        'Boeing 737-800',   'Economy', 'static'),

            // ── DAC ↔ RUH (Riyadh) ───────────────────────────────────────────
            new ScrapedFlight('SV', 'SV804', 'DAC', 'RUH', '22:30', '02:00', 5, 30, [0,1,3,5],        'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('SV', 'SV805', 'RUH', 'DAC', '04:00', '11:30', 5, 30, [0,1,3,5],        'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('BG', 'BG031', 'DAC', 'RUH', '01:00', '05:30', 4, 30, [2,4,6],          'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG032', 'RUH', 'DAC', '07:00', '13:30', 4, 30, [2,4,6],          'Boeing 787-8',     'Economy', 'static'),

            // ── DAC ↔ JED (Jeddah) ───────────────────────────────────────────
            new ScrapedFlight('SV', 'SV806', 'DAC', 'JED', '23:00', '04:30', 6, 30, [0,3,5],          'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('SV', 'SV807', 'JED', 'DAC', '06:30', '15:00', 6, 30, [0,3,5],          'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('BG', 'BG033', 'DAC', 'JED', '02:00', '07:30', 5, 30, [1,4],            'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG034', 'JED', 'DAC', '09:30', '17:00', 5, 30, [1,4],            'Boeing 787-8',     'Economy', 'static'),

            // ── DAC ↔ BAH (Bahrain) ──────────────────────────────────────────
            new ScrapedFlight('GF', 'GF229', 'DAC', 'BAH', '02:30', '06:00', 5, 30, [0,2,5],          'Airbus A330-300',  'Economy', 'static'),
            new ScrapedFlight('GF', 'GF230', 'BAH', 'DAC', '08:30', '16:00', 5, 30, [0,2,5],          'Airbus A330-300',  'Economy', 'static'),
        ];
    }

    /** @return ScrapedFlight[] */
    private function southeastAsia(): array
    {
        return [
            // ── DAC ↔ KUL (Kuala Lumpur) ─────────────────────────────────────
            new ScrapedFlight('BG', 'BG085', 'DAC', 'KUL', '00:05', '06:25', 4, 20, [1,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BG', 'BG086', 'KUL', 'DAC', '08:00', '10:20', 4, 20, [1,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BS', 'BS321', 'DAC', 'KUL', '05:00', '11:20', 4, 20, [0,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BS', 'BS322', 'KUL', 'DAC', '13:00', '15:20', 4, 20, [0,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('MH', 'MH196', 'DAC', 'KUL', '22:30', '04:45', 4, 15, [0,2,4,6],        'Airbus A330-300',  'Economy', 'static'),
            new ScrapedFlight('MH', 'MH197', 'KUL', 'DAC', '06:15', '08:30', 4, 15, [0,2,4,6],        'Airbus A330-300',  'Economy', 'static'),

            // ── DAC ↔ SIN (Singapore) ────────────────────────────────────────
            new ScrapedFlight('BG', 'BG087', 'DAC', 'SIN', '01:00', '08:10', 5, 10, [0,2,4],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BG', 'BG088', 'SIN', 'DAC', '10:00', '13:10', 5, 10, [0,2,4],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('SQ', 'SQ447', 'DAC', 'SIN', '22:00', '05:10', 5, 10, [0,2,4,6],        'Airbus A350-900',  'Economy', 'static'),
            new ScrapedFlight('SQ', 'SQ448', 'SIN', 'DAC', '08:35', '11:45', 5, 10, [0,2,4,6],        'Airbus A350-900',  'Economy', 'static'),
            new ScrapedFlight('BS', 'BS361', 'DAC', 'SIN', '06:00', '13:10', 5, 10, [1,4,6],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BS', 'BS362', 'SIN', 'DAC', '15:00', '18:10', 5, 10, [1,4,6],          'Boeing 737-800',   'Economy', 'static'),

            // ── DAC ↔ BKK (Bangkok) ──────────────────────────────────────────
            new ScrapedFlight('BG', 'BG091', 'DAC', 'BKK', '01:30', '06:00', 3, 30, [0,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BG', 'BG092', 'BKK', 'DAC', '07:30', '09:00', 3, 30, [0,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('TG', 'TG322', 'DAC', 'BKK', '22:30', '03:00', 3, 30, [1,4,6],          'Airbus A330-300',  'Economy', 'static'),
            new ScrapedFlight('TG', 'TG323', 'BKK', 'DAC', '05:00', '06:30', 3, 30, [1,4,6],          'Airbus A330-300',  'Economy', 'static'),
        ];
    }

    /** @return ScrapedFlight[] */
    private function southAsia(): array
    {
        return [
            // ── DAC ↔ DEL (New Delhi) ─────────────────────────────────────────
            new ScrapedFlight('BG', 'BG211', 'DAC', 'DEL', '08:00', '10:05', 2,  5, [0,2,4,6],        'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BG', 'BG212', 'DEL', 'DAC', '11:05', '13:10', 2,  5, [0,2,4,6],        'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('AI', 'AI238', 'DAC', 'DEL', '09:30', '11:35', 2,  5, [1,3,5,6],        'Airbus A321',      'Economy', 'static'),
            new ScrapedFlight('AI', 'AI239', 'DEL', 'DAC', '12:30', '14:35', 2,  5, [1,3,5,6],        'Airbus A321',      'Economy', 'static'),
            new ScrapedFlight('6E', '6E1302', 'DAC', 'DEL', '06:30', '08:35', 2,  5, [0,1,2,3,4,5,6], 'Airbus A320neo',   'Economy', 'static'),
            new ScrapedFlight('6E', '6E1303', 'DEL', 'DAC', '14:00', '16:05', 2,  5, [0,1,2,3,4,5,6], 'Airbus A320neo',   'Economy', 'static'),

            // ── DAC ↔ CCU (Kolkata) ───────────────────────────────────────────
            new ScrapedFlight('BG', 'BG221', 'DAC', 'CCU', '08:30', '09:30', 1,  0, [0,1,2,3,4,5,6], 'ATR 72-600',       'Economy', 'static'),
            new ScrapedFlight('BG', 'BG222', 'CCU', 'DAC', '10:30', '11:30', 1,  0, [0,1,2,3,4,5,6], 'ATR 72-600',       'Economy', 'static'),
            new ScrapedFlight('AI', 'AI235', 'DAC', 'CCU', '07:30', '08:30', 1,  0, [0,2,4,6],        'ATR 72-600',       'Economy', 'static'),
            new ScrapedFlight('AI', 'AI236', 'CCU', 'DAC', '09:30', '10:30', 1,  0, [0,2,4,6],        'ATR 72-600',       'Economy', 'static'),

            // ── DAC ↔ CMB (Colombo) ───────────────────────────────────────────
            new ScrapedFlight('UL', 'UL175', 'DAC', 'CMB', '01:30', '04:30', 3,  0, [0,2,4,6],        'Airbus A320',      'Economy', 'static'),
            new ScrapedFlight('UL', 'UL176', 'CMB', 'DAC', '06:00', '09:00', 3,  0, [0,2,4,6],        'Airbus A320',      'Economy', 'static'),
            new ScrapedFlight('BG', 'BG231', 'DAC', 'CMB', '02:00', '05:00', 3,  0, [1,3,5],          'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BG', 'BG232', 'CMB', 'DAC', '07:00', '10:00', 3,  0, [1,3,5],          'Boeing 737-800',   'Economy', 'static'),

            // ── DAC ↔ KTM (Kathmandu) ────────────────────────────────────────
            new ScrapedFlight('BG', 'BG241', 'DAC', 'KTM', '09:00', '10:30', 1, 30, [0,2,4,6],        'Boeing 737-800',   'Economy', 'static'),
            new ScrapedFlight('BG', 'BG242', 'KTM', 'DAC', '11:30', '13:00', 1, 30, [0,2,4,6],        'Boeing 737-800',   'Economy', 'static'),
        ];
    }

    /** @return ScrapedFlight[] */
    private function eastAsia(): array
    {
        return [
            // ── DAC ↔ CAN (Guangzhou) ─────────────────────────────────────────
            new ScrapedFlight('BG', 'BG251', 'DAC', 'CAN', '23:00', '05:30', 4, 30, [1,4,6],          'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG252', 'CAN', 'DAC', '08:00', '10:30', 4, 30, [1,4,6],          'Boeing 787-8',     'Economy', 'static'),
            new ScrapedFlight('CZ', 'CZ3069', 'DAC', 'CAN', '01:00', '07:30', 4, 30, [0,3,5],         'Boeing 777-300ER', 'Economy', 'static'),
            new ScrapedFlight('CZ', 'CZ3070', 'CAN', 'DAC', '10:00', '12:30', 4, 30, [0,3,5],         'Boeing 777-300ER', 'Economy', 'static'),
        ];
    }

    /** @return ScrapedFlight[] */
    private function europeAmericas(): array
    {
        return [
            // ── DAC ↔ LHR (London Heathrow) ──────────────────────────────────
            new ScrapedFlight('BG', 'BG201', 'DAC', 'LHR', '22:30', '06:05', 9, 35, [0,2,4,6],        'Boeing 787-9',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG202', 'LHR', 'DAC', '14:10', '06:10', 9, 0,  [0,2,4,6],        'Boeing 787-9',     'Economy', 'static'),

            // ── DAC ↔ FRA (Frankfurt) ─────────────────────────────────────────
            new ScrapedFlight('BG', 'BG207', 'DAC', 'FRA', '21:30', '06:00', 9, 30, [1,5],            'Boeing 787-9',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG208', 'FRA', 'DAC', '09:00', '01:00', 9, 0,  [1,5],            'Boeing 787-9',     'Economy', 'static'),

            // ── DAC → CDG (Paris Charles de Gaulle) ───────────────────────────
            new ScrapedFlight('BG', 'BG209', 'DAC', 'CDG', '20:00', '05:30', 10, 30, [3],             'Boeing 787-9',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG210', 'CDG', 'DAC', '09:00', '02:30', 10, 30, [4],             'Boeing 787-9',     'Economy', 'static'),

            // ── DAC ↔ YYZ (Toronto) ───────────────────────────────────────────
            new ScrapedFlight('BG', 'BG271', 'DAC', 'YYZ', '21:00', '06:00', 16, 0, [2,5],            'Boeing 787-9',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG272', 'YYZ', 'DAC', '09:00', '07:30', 16, 30,[2,5],            'Boeing 787-9',     'Economy', 'static'),

            // ── DAC → JFK (New York) ─────────────────────────────────────────
            new ScrapedFlight('BG', 'BG281', 'DAC', 'JFK', '22:00', '08:00', 17, 0, [0],              'Boeing 787-9',     'Economy', 'static'),
            new ScrapedFlight('BG', 'BG282', 'JFK', 'DAC', '11:00', '13:30', 16, 30,[1],              'Boeing 787-9',     'Economy', 'static'),
        ];
    }
}
