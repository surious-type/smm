<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class SmartStrategy extends Model
{
    protected $fillable = [
        'qty_from', 'qty_to',
        'first_hour_pct', 'first_hour_service',
        'remainder_hours', 'remainder_service',
    ];

    public function tasks(): MorphMany
    {
        return $this->morphMany(Task::class, 'strategy');
    }
}
