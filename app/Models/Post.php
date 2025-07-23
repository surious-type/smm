<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'task_id',
        'message_id',
        'published_at',
        'total_orders',
        'done_orders',
        'failed_orders',
    ];

    protected $casts = [
        'message_id' => 'integer',
        'total_orders' => 'integer',
        'done_orders' => 'integer',
        'failed_orders' => 'integer',
        'published_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function getLinkAttribute(): string
    {
        return rtrim($this->task->channel_link, '/') . '/' . $this->message_id;
    }

    public function getIsCompletedAttribute(): bool
    {
        return $this->done_orders + $this->failed_orders >= $this->total_orders;
    }
}
