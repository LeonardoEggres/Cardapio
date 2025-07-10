<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVisualization_preferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // O usuário autenticado pode criar sua própria preferência de visualização.
        // Ou um administrador pode criar para outro usuário (se aplicável).
        return $this->user()->id == $this->input('user_id') || $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id|unique:visualization_preferences,user_id',
            'view_type' => 'required|in:day,week',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'O ID do usuário é obrigatório.',
            'user_id.exists' => 'O usuário especificado não existe.',
            'user_id.unique' => 'Este usuário já possui uma preferência de visualização.',
            'view_type.required' => 'O tipo de visualização é obrigatório.',
            'view_type.in' => 'O tipo de visualização deve ser "day" ou "week".',
        ];
    }
}
