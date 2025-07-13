<?php

namespace App\Services;

use App\Models\MenuItem;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class MenuItemService
{
    public function index()
    {
        try {
            return MenuItem::all();
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao retornar os itens do cardápio: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            return MenuItem::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao buscar o item do cardápio: " . $e->getMessage());
        }
    }

    public function store(array $data)
    {
        DB::beginTransaction();
        try {
            $menuItem = MenuItem::create($data);
            DB::commit();
            return $menuItem;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao criar item do cardápio: " . $e->getMessage());
        }
    }

    public function update(array $data, $id)
    {
        DB::beginTransaction();
        try {
            $menuItem = MenuItem::findOrFail($id);
            $menuItem->update($data);
            DB::commit();
            return $menuItem;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao atualizar item do cardápio: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $menuItem = MenuItem::findOrFail($id);
            $menuItem->delete();
            DB::commit();
            return true;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao deletar item do cardápio: " . $e->getMessage());
        }
    }
}
