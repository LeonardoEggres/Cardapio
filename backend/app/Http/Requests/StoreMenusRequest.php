<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'date' => 'required|date|unique:menus,date',
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'A data do cardápio é obrigatória.',
            'date.date' => 'A data deve ser uma data válida.',
            'date.unique' => 'Já existe um cardápio para esta data.',
        ];
    }
}
