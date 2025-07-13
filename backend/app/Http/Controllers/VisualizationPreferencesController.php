<?php

namespace App\Http\Controllers;

use App\Models\Visualization_preference;
use App\Http\Requests\StoreVisualization_preferenceRequest;
use App\Http\Requests\UpdateVisualization_preferenceRequest;
use App\Models\Menu;
use App\Services\VisualizationPreferenceService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VisualizationPreferencesController extends Controller
{
    protected $visualizationPreferenceService;

    public function __construct(VisualizationPreferenceService $visualizationPreferenceService)
    {
        $this->visualizationPreferenceService = $visualizationPreferenceService;
    }

    public function index(): JsonResponse
    {
        try {
            $prefs = $this->visualizationPreferenceService->index();
            return response()->json($prefs, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao listar preferências: ' . $e->getMessage()], 400);
        }
    }

    public function store(StoreVisualization_preferenceRequest $request): JsonResponse
    {
        try {
            $preference = $this->visualizationPreferenceService->store($request->validated());
            return response()->json([
                'message' => 'Preferência de visualização cadastrada com sucesso!',
                'data' => $preference
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao salvar preferência: ' . $e->getMessage()], 400);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $preference = $this->visualizationPreferenceService->show($id);
            return response()->json($preference, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Preferência não encontrada.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar preferência: ' . $e->getMessage()], 400);
        }
    }

    public function update(UpdateVisualization_preferenceRequest $request, $id): JsonResponse
    {
        try {
            $updated = $this->visualizationPreferenceService->update($request->validated(), $id);
            return response()->json([
                'message' => 'Preferência atualizada com sucesso!',
                'data' => $updated
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Preferência não encontrada para atualização.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar: ' . $e->getMessage()], 400);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->visualizationPreferenceService->destroy($id);
            return response()->json(['message' => 'Preferência excluída com sucesso!'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Preferência não encontrada para exclusão.'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao excluir: ' . $e->getMessage()], 400);
        }
    }

    public function menuByDay(?string $date = null)
    {
        $date = $date ? Carbon::parse($date)->format('Y-m-d') : Carbon::today()->format('Y-m-d');
        $menu = Menu::with('menu_items')
            ->whereDate('date', $date)
            ->first();

        if (!$menu) {
            return response()->json(null, 200);
        }

        return response()->json($menu, 200);
    }

    public function menuByWeek(?string $startDate = null)
    {
        $date = $startDate ? Carbon::parse($startDate) : Carbon::today();
        $startOfWeek = $date->copy()->startOfWeek(Carbon::MONDAY)->format('Y-m-d');
        $endOfWeek = $date->copy()->endOfWeek(Carbon::FRIDAY)->format('Y-m-d');

        $menus = Menu::with('menu_items')
            ->whereBetween('date', [$startOfWeek, $endOfWeek])
            ->orderBy('date')
            ->get();

        return response()->json($menus, 200);
    }
}
