<?php

namespace App\Services;

use App\Models\Visualization_preference; // Use o Model correto
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB; // Adicionado para transações

class VisualizationPreferenceService
{
    public function index()
    {
        try {
            return Visualization_preference::all();
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao retornar as preferências de visualização: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            return Visualization_preference::findOrFail($id);
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
            $preference = Visualization_preference::create($data);
            DB::commit();
            return $preference;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao criar preferência de visualização: " . $e->getMessage());
        }
    }

    public function update(array $data, $id)
    {
        DB::beginTransaction();
        try {
            $preference = Visualization_preference::findOrFail($id);
            $preference->update($data);
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
            $preference = Visualization_preference::findOrFail($id);
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
}
