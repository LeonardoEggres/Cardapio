<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Importar para relações

class Visualization_preference extends Model
{
    /** @use HasFactory<\Database\Factories\VisualizationPreferenceFactory> */
    use HasFactory;

    /**
     * O nome da tabela associada ao modelo.
     * Necessário se o nome da classe não segue a convenção de camelCase para o nome da tabela.
     *
     * @var string
     */
    protected $table = 'visualization_preferences';

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'view_type',
    ];

    /**
     * Obtenha o usuário ao qual esta preferência pertence.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
