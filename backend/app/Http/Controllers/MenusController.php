<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MenusController extends Controller
{
    public function index()
    {
        $menus = Menu::with('menu_items')->orderBy('date', 'desc')->get();
        return response()->json($menus);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date', Rule::unique('menus', 'date')],
        ]);

        $menu = new Menu();
        $menu->date = $validated['date'];
        $menu->created_by = $request->user()->id;
        $menu->save();

        return response()->json(['data' => $menu], 201);
    }

    public function show(Menu $menu)
    {
        $menu->load('menu_items', 'creator');
        return response()->json($menu);
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'date' => ['sometimes', 'date', Rule::unique('menus', 'date')->ignore($menu->id)],
        ]);

        if (isset($validated['date'])) {
            $menu->date = $validated['date'];
        }
        $menu->save();

        return response()->json(['data' => $menu]);
    }

    public function destroy(Menu $menu)
    {
        $menu->menu_items()->delete();
        $menu->delete();

        return response()->json(['message' => 'Menu apagado com sucesso.']);
    }
}
