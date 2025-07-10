<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVisualization_preferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // O usuário autenticado pode atualizar sua própria preferência de visualização.
        // Ou um administrador pode atualizar para outro usuário.
        // Pega a preferência de visualização pelo ID da rota para verificar o user_id associado.
        $preference = $this->route('visualization_preference'); // Assume que o parâmetro de rota é 'visualization_preference'

        return $this->user()->id == $preference->user_id || $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'sometimes|exists:users,id',
            'view_type' => 'sometimes|in:day,week',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.exists' => 'O usuário especificado não existe.',
            'view_type.in' => 'O tipo de visualização deve ser "day" ou "week".',
        ];
    }
}
