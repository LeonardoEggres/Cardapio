<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Services\MenuItemService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class MenuItemsController extends Controller
{
    protected $menuItemService;

    public function __construct(MenuItemService $menuItemService)
    {
        $this->menuItemService = $menuItemService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $menuItems = $this->menuItemService->index();
            return response()->json($menuItems, 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMenuItemRequest $request): JsonResponse
    {
        try {
            $menuItem = $this->menuItemService->store($request->validated());
            return response()->json([
                'message' => 'Item do cardápio cadastrado com sucesso!',
                'data' => $menuItem
            ], 201);
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
            $menuItem = $this->menuItemService->show($id);
            return response()->json($menuItem, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Item do cardápio não encontrado.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMenuItemRequest $request, $id): JsonResponse
    {
        try {
            $menuItem = $this->menuItemService->update($request->validated(), $id);
            return response()->json([
                'message' => 'Item do cardápio atualizado com sucesso!',
                'data' => $menuItem
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Item do cardápio não encontrado para atualização.'], 404);
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
            $this->menuItemService->destroy($id);
            return response()->json(['message' => 'Item do cardápio excluído com sucesso!'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Item do cardápio não encontrado para exclusão.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
