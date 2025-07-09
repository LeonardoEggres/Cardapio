<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB; // Adicionado para transações
use Illuminate\Support\Facades\Hash; // Para hash da senha

class UserService
{
    public function index()
    {
        try {
            return User::all();
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao retornar os usuários: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            return User::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            throw new Exception("Ocorreu um erro ao buscar o usuário: " . $e->getMessage());
        }
    }

    public function store(array $data)
    {
        DB::beginTransaction();
        try {
            // Garante que a senha seja hashed antes de criar o usuário
            $data['password'] = Hash::make($data['password']);
            $user = User::create($data);
            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao criar usuário: " . $e->getMessage());
        }
    }

    public function update(array $data, $id)
    {
        DB::beginTransaction();
        try {
            $user = User::findOrFail($id);
            // Hashing da nova senha se ela for fornecida
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }
            $user->update($data);
            DB::commit();
            return $user;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao atualizar usuário: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $user = User::findOrFail($id);
            $user->delete();
            DB::commit();
            return true;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Erro ao deletar usuário: " . $e->getMessage());
        }
    }

    // Métodos auxiliares, se ainda forem necessários aqui
    public function isStudent(User $user): bool
    {
        return $user->role === 'student';
    }

    public function isNutritionist(User $user): bool
    {
        return $user->role === 'nutricionist';
    }
}
