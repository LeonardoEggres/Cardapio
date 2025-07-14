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
        $preference = $this->route('visualization_preference');
        return $this->user()->id == $preference->user_id || $this->user()->role === 'admin' || $this->user()->role === 'student'; 
    }

    public function rules(): array
    {
        return [
            'view_type' => 'required|in:day,week',
        ];
    }

    public function messages(): array
    {
        return [
            'view_type.in' => 'O tipo de visualização deve ser "day" ou "week".',
        ];
    }
}
