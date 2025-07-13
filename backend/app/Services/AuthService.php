<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function register(array $data)
    {
        try {
            Log::info('AuthService register data:', $data);
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
                'user' => $user->only(['id', 'name', 'email', 'role']),
            ];
        } catch (Exception $e) {
            Log::error('Erro ao registrar usuário: ' . $e->getMessage());
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

            $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'message' => 'Login realizado com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->only(['id', 'name', 'email', 'role']),
            ];
        } catch (ValidationException $e) {
            throw $e;
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
