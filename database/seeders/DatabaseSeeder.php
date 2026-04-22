<?php

namespace Database\Seeders;

use App\Models\Airport;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@airdodo.com'], [
            'name'     => 'Admin',
            'password' => bcrypt('admin123'),
            'is_admin' => true,
        ]);

        $airports = [
            // Bangladesh — domestic
            ['iata_code' => 'DAC', 'name' => 'Hazrat Shahjalal International Airport', 'city' => 'Dhaka',        'country' => 'BD', 'timezone' => 'Asia/Dhaka'],
            ['iata_code' => 'CGP', 'name' => 'Shah Amanat International Airport',      'city' => 'Chittagong',   'country' => 'BD', 'timezone' => 'Asia/Dhaka'],
            ['iata_code' => 'ZYL', 'name' => 'Osmani International Airport',           'city' => 'Sylhet',       'country' => 'BD', 'timezone' => 'Asia/Dhaka'],
            ['iata_code' => 'JSR', 'name' => 'Jashore Airport',                        'city' => 'Jashore',      'country' => 'BD', 'timezone' => 'Asia/Dhaka'],
            ['iata_code' => 'RJH', 'name' => 'Shah Makhdum Airport',                   'city' => 'Rajshahi',     'country' => 'BD', 'timezone' => 'Asia/Dhaka'],
            ['iata_code' => 'CXB', 'name' => "Cox's Bazar Airport",                    'city' => "Cox's Bazar",  'country' => 'BD', 'timezone' => 'Asia/Dhaka'],
            ['iata_code' => 'BZL', 'name' => 'Barisal Airport',                        'city' => 'Barisal',      'country' => 'BD', 'timezone' => 'Asia/Dhaka'],

            // Middle East
            ['iata_code' => 'DXB', 'name' => 'Dubai International Airport',            'city' => 'Dubai',        'country' => 'AE', 'timezone' => 'Asia/Dubai'],
            ['iata_code' => 'AUH', 'name' => 'Abu Dhabi International Airport',        'city' => 'Abu Dhabi',    'country' => 'AE', 'timezone' => 'Asia/Dubai'],
            ['iata_code' => 'SHJ', 'name' => 'Sharjah International Airport',          'city' => 'Sharjah',      'country' => 'AE', 'timezone' => 'Asia/Dubai'],
            ['iata_code' => 'DOH', 'name' => 'Hamad International Airport',            'city' => 'Doha',         'country' => 'QA', 'timezone' => 'Asia/Qatar'],
            ['iata_code' => 'KWI', 'name' => 'Kuwait International Airport',           'city' => 'Kuwait City',  'country' => 'KW', 'timezone' => 'Asia/Kuwait'],
            ['iata_code' => 'MCT', 'name' => 'Muscat International Airport',           'city' => 'Muscat',       'country' => 'OM', 'timezone' => 'Asia/Muscat'],
            ['iata_code' => 'RUH', 'name' => 'King Khalid International Airport',      'city' => 'Riyadh',       'country' => 'SA', 'timezone' => 'Asia/Riyadh'],
            ['iata_code' => 'JED', 'name' => 'King Abdulaziz International Airport',   'city' => 'Jeddah',       'country' => 'SA', 'timezone' => 'Asia/Riyadh'],
            ['iata_code' => 'BAH', 'name' => 'Bahrain International Airport',          'city' => 'Manama',       'country' => 'BH', 'timezone' => 'Asia/Bahrain'],

            // South & Southeast Asia
            ['iata_code' => 'KUL', 'name' => 'Kuala Lumpur International Airport',     'city' => 'Kuala Lumpur', 'country' => 'MY', 'timezone' => 'Asia/Kuala_Lumpur'],
            ['iata_code' => 'SIN', 'name' => 'Singapore Changi Airport',               'city' => 'Singapore',    'country' => 'SG', 'timezone' => 'Asia/Singapore'],
            ['iata_code' => 'BKK', 'name' => 'Suvarnabhumi Airport',                   'city' => 'Bangkok',      'country' => 'TH', 'timezone' => 'Asia/Bangkok'],
            ['iata_code' => 'DEL', 'name' => 'Indira Gandhi International Airport',    'city' => 'New Delhi',    'country' => 'IN', 'timezone' => 'Asia/Kolkata'],
            ['iata_code' => 'CCU', 'name' => 'Netaji Subhas Chandra Bose International Airport', 'city' => 'Kolkata', 'country' => 'IN', 'timezone' => 'Asia/Kolkata'],
            ['iata_code' => 'CMB', 'name' => 'Bandaranaike International Airport',     'city' => 'Colombo',      'country' => 'LK', 'timezone' => 'Asia/Colombo'],
            ['iata_code' => 'KTM', 'name' => 'Tribhuvan International Airport',        'city' => 'Kathmandu',    'country' => 'NP', 'timezone' => 'Asia/Kathmandu'],

            // East Asia
            ['iata_code' => 'CAN', 'name' => 'Guangzhou Baiyun International Airport', 'city' => 'Guangzhou',   'country' => 'CN', 'timezone' => 'Asia/Shanghai'],
            ['iata_code' => 'KUL', 'name' => 'Kuala Lumpur International Airport',     'city' => 'Kuala Lumpur', 'country' => 'MY', 'timezone' => 'Asia/Kuala_Lumpur'],

            // Europe & Americas
            ['iata_code' => 'LHR', 'name' => 'Heathrow Airport',                       'city' => 'London',       'country' => 'GB', 'timezone' => 'Europe/London'],
            ['iata_code' => 'YYZ', 'name' => 'Toronto Pearson International Airport',  'city' => 'Toronto',      'country' => 'CA', 'timezone' => 'America/Toronto'],
            ['iata_code' => 'JFK', 'name' => 'John F. Kennedy International Airport',  'city' => 'New York',     'country' => 'US', 'timezone' => 'America/New_York'],
            ['iata_code' => 'FRA', 'name' => 'Frankfurt Airport',                      'city' => 'Frankfurt',    'country' => 'DE', 'timezone' => 'Europe/Berlin'],
            ['iata_code' => 'CDG', 'name' => 'Charles de Gaulle Airport',              'city' => 'Paris',        'country' => 'FR', 'timezone' => 'Europe/Paris'],
            ['iata_code' => 'MXP', 'name' => 'Milan Malpensa Airport',                 'city' => 'Milan',        'country' => 'IT', 'timezone' => 'Europe/Rome'],
        ];

        foreach ($airports as $airport) {
            Airport::firstOrCreate(['iata_code' => $airport['iata_code']], $airport);
        }

        $this->call(FlightSeeder::class);
    }
}
