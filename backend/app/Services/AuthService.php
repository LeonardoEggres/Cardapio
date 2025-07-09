<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Exception;

class AuthService
{
    public function register(array $data)
    {
        try {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'message' => 'Usuário registrado com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->only(['id', 'name', 'email', 'role']), // Retorna apenas dados seguros do usuário
            ];
        } catch (Exception $e) {
            throw new Exception("Erro ao registrar usuário: " . $e->getMessage());
        }
    }

    public function login(array $credentials)
    {
        try {
            $user = User::where('email', $credentials['email'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['As credenciais fornecidas estão incorretas.'],
                ]);
            }

            // Opcional: Revogar todos os tokens antigos do usuário ao fazer login para segurança
            $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'message' => 'Login realizado com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->only(['id', 'name', 'email', 'role']), // Retorna apenas dados seguros do usuário
            ];
        } catch (ValidationException $e) {
            throw $e; // Re-lança a exceção de validação para ser tratada pelo handler do Laravel ou pelo Controller
        } catch (Exception $e) {
            throw new Exception("Erro ao tentar login: " . $e->getMessage());
        }
    }

    public function logout(User $user)
    {
        try {
            $user->tokens()->delete();

            return [
                'message' => 'Logout realizado com sucesso!',
            ];
        } catch (Exception $e) {
            throw new Exception("Erro ao realizar logout: " . $e->getMessage());
        }
    }
}
