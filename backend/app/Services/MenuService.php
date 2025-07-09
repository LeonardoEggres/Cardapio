<?php

namespace App\Services;

use App\Models\Menu;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB; // Adicionado para transações

class MenuService
{
    public function index()
    {
        try {
            return Menu::all(); // Retorna a coleção de Models diretamente
        } catch (Exception $e) {
            // Lança uma exceção genérica para ser tratada no Controller
            throw new Exception("Ocorreu um erro ao retornar os cardápios: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            return Menu::findOrFail($id); // Retorna o Model ou lança ModelNotFoundException
        } catch (ModelNotFoundException $e) {
            throw $e; // Relança a exceção para o Controller
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao buscar o cardápio: " . $e->getMessage());
        }
    }

    public function store(array $data)
    {
        DB::beginTransaction();
        try {
            $menu = Menu::create($data); // Retorna o Model criado
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
            $menu->update($data); // Retorna true/false ou lança exceção
            DB::commit();
            return $menu; // Retorna o Model atualizado
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
            $menu->delete(); // Retorna true/false
            DB::commit();
            return true; // Indica sucesso na exclusão
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao deletar cardápio: " . $e->getMessage());
        }
    }
}
