<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Apenas o próprio usuário ou um administrador pode atualizar o usuário.
        // Assumindo que a rota passa o ID do usuário como 'user'.
        // Ou o usuário logado está atualizando a si mesmo.
        return $this->user()->id == $this->route('user') || $this->user()->role === 'admin'; // Adapte sua lógica de role
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Pega o ID do usuário da rota para ignorar na validação unique do email.
        $userId = $this->route('user');

        return [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'sometimes|in:student,nutricionist', // Apenas admin pode mudar o role
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Este e-mail já está em uso por outro usuário.',
            'password.min' => 'A senha deve ter no mínimo :min caracteres.',
            'password.confirmed' => 'A confirmação de senha não corresponde.',
            'role.in' => 'O papel deve ser "student" ou "nutricionist".',
        ];
    }
}
