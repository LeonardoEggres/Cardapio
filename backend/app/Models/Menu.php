<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Importar para relações
use Illuminate\Database\Eloquent\Relations\HasMany; // Importar para relações

class Menu extends Model
{
    /** @use HasFactory<\Database\Factories\MenuFactory> */
    use HasFactory;

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'created_by',
        'date',
    ];

    /**
     * Os atributos que devem ser convertidos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date', // Garante que a coluna 'date' seja uma instância Carbon
    ];

    /**
     * Obtenha o usuário que criou este menu.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Obtenha os itens de menu para este menu.
     */
    public function menu_items(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'menu_id');
    }
}
