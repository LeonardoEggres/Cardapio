<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Define se o usuário (neste caso, um convidado) pode fazer esta requisição.
     * Para registro, geralmente é true, pois qualquer um pode se registrar.
     */
    public function authorize(): bool
    {
        return true; // Permitir que usuários não autenticados (convidados) façam esta requisição
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string',
                Password::min(8)
                    ->mixedCase() // Pelo menos uma letra maiúscula e uma minúscula
                    ->numbers()   // Pelo menos um número
                    ->symbols(),  // Pelo menos um símbolo
                'confirmed' // Requer um campo password_confirmation que deve ser idêntico
            ],
            // A role pode ser definida pelo frontend ou fixada no backend
            // Se for enviada pelo frontend, você pode validar:
            'role' => ['required', 'string', 'in:student,nutricionist'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório.',
            'name.string' => 'O nome deve ser um texto.',
            'name.max' => 'O nome não pode ter mais de :max caracteres.',

            'email.required' => 'O email é obrigatório.',
            'email.string' => 'O email deve ser um texto.',
            'email.email' => 'Por favor, insira um endereço de email válido.',
            'email.max' => 'O email não pode ter mais de :max caracteres.',
            'email.unique' => 'Este email já está cadastrado.',

            'password.required' => 'A senha é obrigatória.',
            'password.min' => 'A senha deve ter no mínimo :min caracteres.',
            'password.mixed_case' => 'A senha deve conter letras maiúsculas e minúsculas.',
            'password.numbers' => 'A senha deve conter pelo menos um número.',
            'password.symbols' => 'A senha deve conter pelo menos um símbolo.',
            'password.confirmed' => 'A confirmação da senha não corresponde.',

            'role.required' => 'A função (role) é obrigatória.',
            'role.in' => 'A função deve ser "student" ou "nutricionist".',
        ];
    }
}
