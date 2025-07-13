<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\Visualization_preference; // Use o Model correto
use App\Models\VisualizationPreference;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB; // Adicionado para transações

class VisualizationPreferenceService
{
    public function index()
    {
        try {
            return VisualizationPreference::all();
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao retornar as preferências de visualização: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            return VisualizationPreference::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao buscar a preferência de visualização: " . $e->getMessage());
        }
    }

    public function store(array $data)
    {
        DB::beginTransaction();
        try {
            $preference = VisualizationPreference::create($data);
            DB::commit();
            return $preference;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao criar preferência de visualização: " . $e->getMessage());
        }
    }

    public function update(array $data, $id)
    {
        dd($data); // <--- ADICIONE ESTA LINHA
        DB::beginTransaction();
        try {
            $preference = VisualizationPreference::findOrFail($id);
            $preference->update([
                'user_id' => $data['user_id'],
                'view_type' => $data['view_type'],
            ]);
            DB::commit();
            return $preference;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao atualizar preferência de visualização: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $preference = VisualizationPreference::findOrFail($id);
            $preference->delete();
            DB::commit();
            return true;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao deletar preferência de visualização: " . $e->getMessage());
        }
    }

    public function getDailyMenu(?string $date = null)
    {
        $date = $date ? Carbon::parse($date)->format('Y-m-d') : Carbon::today()->format('Y-m-d');

        return Menu::whereDate('date', $date)->first();
    }

    public function getWeeklyMenu(?string $date = null)
    {
        $date = $date ? Carbon::parse($date) : Carbon::today();

        $startOfWeek = $date->copy()->startOfWeek(Carbon::MONDAY)->format('Y-m-d');

        $endOfWeek = $date->copy()->endOfWeek(Carbon::FRIDAY)->format('Y-m-d');

        return Menu::whereBetween('date', [$startOfWeek, $endOfWeek])->orderBy('date')->get();
    }
}
