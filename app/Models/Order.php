<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Observers\OrderObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

#[ObservedBy([OrderObserver::class])]
class Order extends Model
{
    protected $fillable = [
        'post_id',
        'service_id',
        'quantity',
        'run_at',
        'external_id',
        'status',
    ];

    protected $casts = [
        'service_id' => 'integer',
        'quantity' => 'integer',
        'run_at' => 'datetime',
        'status' => OrderStatus::class,
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function panel(): HasOneThrough
    {
        return $this->hasOneThrough(
            Panel::class,
            Task::class,
            'id',
            'id',
            'post_id',
            'panel_id'
        );
    }
}
