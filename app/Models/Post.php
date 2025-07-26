<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'task_id',
        'message_id',
        'published_at',
        'status',
    ];

    protected $casts = [
        'message_id' => 'integer',
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

    public function recalculateStatus(): void
    {
        $orders = $this->orders;
        $allDoneOrError = $orders->every(fn($p) => in_array($p->status, ['DONE', 'ERROR']));

        if ($allDoneOrError) {
            if ($orders->contains(fn($p) => $p->status === OrderStatus::ERROR)) {
                $this->update(['status' => 'ERROR']);
            } else {
                $this->update(['status' => 'DONE']);
            }
            $this->task->recalculateStatus();
        }
    }
}
