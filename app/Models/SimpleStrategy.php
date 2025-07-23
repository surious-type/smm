<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class SimpleStrategy extends Model
{
    protected $fillable = ['service_id', 'quantity'];

    public function tasks(): MorphMany
    {
        return $this->morphMany(Task::class, 'strategy');
    }
}
