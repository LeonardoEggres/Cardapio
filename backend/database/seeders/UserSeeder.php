<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Nutricionista Teste',
            'email' => 'nutri@example.com',
            'password' => Hash::make('password'),
            'role' => 'nutricionist',
            'email_verified_at' => now(),
        ]);

        User::factory()->count(10)->create([
            'role' => 'student',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}
