<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample regular user
        User::updateOrCreate(
            ['email' => 'user@airdodo.com'],
            [
                'name'     => 'John Doe',
                'password' => Hash::make('user123'),
                'is_admin' => false,
                'active'   => true,
            ]
        );

        // Sample inactive user
        User::updateOrCreate(
            ['email' => 'inactive@airdodo.com'],
            [
                'name'     => 'Inactive User',
                'password' => Hash::make('user123'),
                'is_admin' => false,
                'active'   => false,
            ]
        );
    }
}
