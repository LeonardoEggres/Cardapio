<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'type' => 'required|in:café,almoço,janta',
            'description' => 'required|string|max:1000',
        ]);

        $menuItem = MenuItem::create($validated);

        return response()->json(['data' => $menuItem], 201);
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'type' => 'required|in:café,almoço,janta',
            'description' => 'required|string|max:1000',
            'menu_id' => 'sometimes|exists:menus,id',
        ]);

        $menuItem->update($validated);

        return response()->json(['data' => $menuItem]);
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();

        return response()->json(['message' => 'Item do cardápio apagado com sucesso.']);
    }
}
