<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    /** @use HasFactory<\Database\Factories\MenuFactory> */
    use HasFactory;


    protected $fillable = [
        'created_by',
        'date',
    ];


    protected $casts = [
        'date' => 'date', // Garante que a coluna 'date' seja uma instância Carbon
    ];


    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function menu_items(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'menu_id');
    }
}
