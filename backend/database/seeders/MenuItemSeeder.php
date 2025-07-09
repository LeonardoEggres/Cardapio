<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = Menu::all(); // Pega todos os menus criados

        $types = ['café', 'almoço', 'janta'];

        foreach ($menus as $menu) {
            // Cria um item de menu para cada tipo para cada menu
            foreach ($types as $type) {
                MenuItem::factory()->create([
                    'menu_id' => $menu->id,
                    'type' => $type,
                    'description' => 'Exemplo de ' . $type . ' para o menu do dia ' . $menu->date->format('d/m/Y') . '.',
                ]);
            }
        }
    }
}
