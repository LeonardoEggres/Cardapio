<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Encontra o usuário nutricionista para associar os menus
        $nutricionist = User::where('role', 'nutricionist')->first();

        if ($nutricionist) {
            // Cria 5 menus, cada um com uma data diferente a partir de hoje
            for ($i = 0; $i < 5; $i++) {
                Menu::factory()->create([
                    'created_by' => $nutricionist->id,
                    'date' => now()->addDays($i)->format('Y-m-d'), // Datas futuras para menus
                ]);
            }
        } else {
            // Mensagem de aviso caso o nutricionista não seja encontrado (UserSeeder deve rodar primeiro)
            $this->command->warn('Nenhum usuário nutricionista encontrado para criar menus. Execute UserSeeder primeiro.');
        }
    }
}
