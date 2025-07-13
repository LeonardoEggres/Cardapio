<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Importar para relações

class VisualizationPreference extends Model
{
    /** @use HasFactory<\Database\Factories\VisualizationPreferenceFactory> */
    use HasFactory;


    protected $table = 'visualization_preferences';


    protected $fillable = [
        'user_id',
        'view_type',
    ];

     public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
