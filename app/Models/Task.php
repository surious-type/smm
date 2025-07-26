<?php

namespace App\Models;

use App\Enums\PostType;
use App\Enums\StrategyType;
use App\Enums\TaskStatus;
use App\Observers\TaskObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
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

    protected function strategyType(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                return match ($value) {
                    SimpleStrategy::class => StrategyType::SIMPLE,
                    SmartStrategy::class  => StrategyType::SMART,
                    default => null,
                };
            },
            set: function (StrategyType|string $value) {
                $type = $value instanceof StrategyType ? $value : StrategyType::from($value);
                return match ($type) {
                    StrategyType::SIMPLE => SimpleStrategy::class,
                    StrategyType::SMART  => SmartStrategy::class,
                };
            }
        );
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

    public function recalculateStatus(): void
    {
        $posts = $this->posts;
        $allDoneOrError = $posts->every(fn($p) => in_array($p->status, ['DONE', 'ERROR']));

        if ($allDoneOrError && $posts->count() > 0) {
            if ($posts->contains(fn($p) => $p->status === 'DONE')) {
                $this->update(['status' => 'ERROR']);
            } else {
                $this->update(['status' => 'DONE']);
            }
        }
    }
}
