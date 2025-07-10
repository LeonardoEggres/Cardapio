<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Apenas nutricionistas podem atualizar cardápios
        return $this->user()->role === 'nutricionist';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Pega o ID do menu da rota para ignorar na validação unique da data.
        $menuId = $this->route('menu'); // 'menu' é o nome do parâmetro na rota, ex: /menus/{menu}

        return [
            'date' => [
                'sometimes', // Permite que a data não seja enviada se não for para ser atualizada
                'date',
                Rule::unique('menus', 'date')->ignore($menuId),
            ],
            // Adicione outras regras para os campos do menu, se houver
        ];
    }

    public function messages(): array
    {
        return [
            'date.date' => 'A data deve ser uma data válida.',
            'date.unique' => 'Já existe um cardápio para esta data.',
        ];
    }
}
