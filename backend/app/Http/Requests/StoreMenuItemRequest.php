// app/Http/Requests/StoreMenuItemRequest.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Apenas nutricionistas podem criar itens de cardápio
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
            'menu_id' => 'required|exists:menus,id',
            'type' => 'required|in:café,almoço,janta',
            'description' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'menu_id.required' => 'O ID do cardápio é obrigatório.',
            'menu_id.exists' => 'O cardápio selecionado não existe.',
            'type.required' => 'O tipo de refeição é obrigatório.',
            'type.in' => 'O tipo de refeição deve ser "café", "almoço" ou "janta".',
            'description.required' => 'A descrição do item é obrigatória.',
            'description.string' => 'A descrição deve ser um texto.',
            'description.max' => 'A descrição não pode exceder :max caracteres.',
        ];
    }
}

