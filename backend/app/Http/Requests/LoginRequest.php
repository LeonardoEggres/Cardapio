<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'O email é obrigatório.',
            'email.string' => 'O email deve ser um texto.',
            'email.email' => 'Por favor, insira um endereço de email válido.',

            'password.required' => 'A senha é obrigatória.',
            'password.string' => 'A senha deve ser um texto.',
        ];
    }
}
