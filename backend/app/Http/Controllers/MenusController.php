<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenusRequest;
use App\Http\Requests\UpdateMenusRequest;
use App\Models\Menu;
use App\Services\MenuService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse; // Adicionado para type-hinting

class MenusController extends Controller
{
    protected $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $menus = Menu::with('menu_items')->get(); // <-- aqui o ajuste
            return response()->json($menus, 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMenusRequest $request): JsonResponse
    {
        try {
            $menu = $this->menuService->store($request->validated());
            return response()->json([
                'message' => 'Cardápio cadastrado com sucesso!',
                'data' => $menu
            ], 201); // 201 Created
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $menu = $this->menuService->show($id);
            return response()->json($menu, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Cardápio não encontrado.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMenusRequest $request, $id): JsonResponse
    {
        try {
            $menu = $this->menuService->update($request->validated(), $id);
            return response()->json([
                'message' => 'Cardápio atualizado com sucesso!',
                'data' => $menu
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Cardápio não encontrado para atualização.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->menuService->destroy($id);
            return response()->json(['message' => 'Cardápio excluído com sucesso!'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Cardápio não encontrado para exclusão.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
