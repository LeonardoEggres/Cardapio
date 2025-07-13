<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\User;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nutricionist = User::where('role', 'nutricionist')->first();

        if ($nutricionist) {
            for ($i = 0; $i < 5; $i++) {
                Menu::factory()->create([
                    'created_by' => $nutricionist->id,
                    'date' => now()->addDays($i)->format('Y-m-d'), 
                ]);
            }
        } else {
            $this->command->warn('Nenhum usuário nutricionista encontrado para criar menus. Execute UserSeeder primeiro.');
        }
    }
}

