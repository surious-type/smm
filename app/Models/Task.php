<?php

namespace App\Models;

use App\Enums\PostType;
use App\Enums\StrategyType;
use App\Enums\TaskStatus;
use App\Observers\TaskObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[ObservedBy([TaskObserver::class])]
class Task extends Model
{
    protected $fillable = [
        'channel_link',
        'post_type',
        'last_message_id',
        'end_at',
        'count_post',
        'status',
        'strategy_id',
        'strategy_type',
        'panel_id',
    ];

    protected $casts = [
        'post_type' => PostType::class,
        'status' => TaskStatus::class,
        'last_message_id' => 'integer',
        'count_post' => 'integer',
        'end_at' => 'datetime',
    ];

    public function strategy(): MorphTo
    {
        return $this->morphTo();
    }

    public function panel(): BelongsTo
    {
        return $this->belongsTo(Panel::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function isNew(): bool
    {
        return $this->post_type === PostType::NEW;
    }

    public function isExisting(): bool
    {
        return $this->post_type === PostType::EXISTING;
    }
}
