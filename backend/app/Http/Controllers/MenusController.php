<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class MenusController extends Controller
{
    public function index()
    {
        try {
            $menus = Menu::with('menu_items')->orderBy('date', 'desc')->get();
            return response()->json($menus);
        } catch (\Exception $e) {
            Log::error('Erro ao listar menus: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao listar menus: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'date' => ['required', 'date', Rule::unique('menus', 'date')],
            ]);

            $menu = new Menu();
            $menu->date = $validated['date'];
            $menu->created_by = $request->user()->id;
            $menu->save();

            return response()->json(['data' => $menu], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar menu: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao criar menu: ' . $e->getMessage()], 500);
        }
    }

    public function show(Menu $menu)
    {
        try {
            $menu->load('menu_items', 'creator');
            return response()->json($menu);
        } catch (\Exception $e) {
            Log::error('Erro ao mostrar menu: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao mostrar menu: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Menu $menu)
    {
        try {
            $validated = $request->validate([
                'date' => ['sometimes', 'date', Rule::unique('menus', 'date')->ignore($menu->id)],
            ]);

            if (isset($validated['date'])) {
                $menu->date = $validated['date'];
            }
            $menu->save();

            return response()->json(['data' => $menu]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar menu: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao atualizar menu: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Menu $menu)
    {
        Log::info('Método destroy chamado', ['menu_id' => $menu->id]);
        $user = \Illuminate\Support\Facades\Auth::user();
        Log::info('Usuário autenticado:', ['user' => $user]);
        if (!$user || $user->role !== 'nutricionist') {
            Log::warning('Usuário não autorizado para excluir menu', ['user' => $user]);
            return response()->json(['error' => 'Apenas nutricionistas podem excluir cardápios.'], 403);
        }

        $menu->delete();
        Log::info('Menu excluído com sucesso', ['menu_id' => $menu->id]);

        return response()->json(['message' => 'Menu apagado com sucesso.']);
    }
}

