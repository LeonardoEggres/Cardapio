<?php

namespace App\Services;

use App\Models\Menu;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class MenuService
{
    public function index()
    {
        try {
            return Menu::with('menu_items')->get();
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao retornar os cardápios: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            return Menu::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao buscar o cardápio: " . $e->getMessage());
        }
    }

    public function store(array $data)
    {
        DB::beginTransaction();
        try {
            $menu = Menu::create($data);
            DB::commit();
            return $menu;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao criar cardápio: " . $e->getMessage());
        }
    }

    public function update(array $data, $id)
    {
        DB::beginTransaction();
        try {
            $menu = Menu::findOrFail($id);
            $menu->update($data);
            DB::commit();
            return $menu;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao atualizar cardápio: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $menu = Menu::findOrFail($id);
            $menu->delete();
            DB::commit();
            return true;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao deletar cardápio: " . $e->getMessage());
        }
    }
}
