<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'nik' => '1234567890',
                'position' => 'Administrator',
            ]
        );

        User::updateOrCreate(
            ['email' => 'alice@example.com'],
            [
                'name' => 'Alice Johnson',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'nik' => '0987654321',
                'position' => 'Senior Developer',
                'phone' => '+1234567890',
                'address' => '123 Main St, San Francisco',
            ]
        );
    }
}
