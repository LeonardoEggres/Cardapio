<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Visualization_preference; // Use o nome exato do seu modelo: Visualization_preference
use App\Models\VisualizationPreference;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VisualizationPreferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all(); // Pega todos os usuários criados

        $viewTypes = ['day', 'week'];

        foreach ($users as $user) {
            // Cria uma preferência de visualização para cada usuário
            VisualizationPreference::factory()->create([
                'user_id' => $user->id,
                'view_type' => $viewTypes[array_rand($viewTypes)], // Atribui aleatoriamente 'day' ou 'week'
            ]);
        }
    }
}
