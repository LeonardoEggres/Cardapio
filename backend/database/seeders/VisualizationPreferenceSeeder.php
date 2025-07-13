<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Visualization_preference;
use App\Models\VisualizationPreference;
use Illuminate\Database\Seeder;

class VisualizationPreferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        $viewTypes = ['day', 'week'];

        foreach ($users as $user) {
            VisualizationPreference::factory()->create([
                'user_id' => $user->id,
                'view_type' => $viewTypes[array_rand($viewTypes)],
            ]);
        }
    }
}

