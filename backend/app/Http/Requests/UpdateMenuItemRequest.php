// app/Http/Requests/UpdateMenuItemRequest.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Apenas nutricionistas podem atualizar itens de cardápio
        return $this->user()->role === 'nutricionist';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'menu_id' => 'sometimes|exists:menus,id',
            'type' => 'sometimes|in:café,almoço,janta',
            'description' => 'sometimes|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'menu_id.exists' => 'O cardápio selecionado não existe.',
            'type.in' => 'O tipo de refeição deve ser "café", "almoço" ou "janta".',
            'description.string' => 'A descrição deve ser um texto.',
            'description.max' => 'A descrição não pode exceder :max caracteres.',
        ];
    }
}
