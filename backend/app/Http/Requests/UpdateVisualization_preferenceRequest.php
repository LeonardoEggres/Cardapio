<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\VisualizationPreference; // <-- ESTA LINHA É CRÍTICA E ESTAVA FALTANDO NA SUA VERSÃO

class UpdateVisualization_preferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $preference = $this->route('visualization_preference');

        // <-- ESTE BLOCO DE VERIFICAÇÃO TAMBÉM É CRÍTICO E ESTAVA FALTANDO
        // Verifica se a preferência foi realmente encontrada e é uma instância do modelo.
        // Se não for, significa que a preferência com o ID fornecido não existe no banco de dados.
        // Retornar false aqui resultará em um 403 Forbidden, em vez de um erro 500.
        if (!$preference instanceof VisualizationPreference) {
            return false;
        }

        // Lógica de autorização:
        // O usuário autenticado deve ser o proprietário da preferência
        // OU o usuário autenticado deve ser um 'admin'
        // OU o usuário autenticado deve ser um 'student'
        return $this->user()->id == $preference->user_id ||
               $this->user()->role === 'admin' ||
               $this->user()->role === 'student';
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
