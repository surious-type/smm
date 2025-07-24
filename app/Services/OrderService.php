<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\StrategyType;
use App\Models\Order;
use App\Models\Post;
use App\Models\Task;

class OrderService
{
    public function create(Task $task, Post $post)
    {
        $strategy = $task->strategy;

        if ($task->strategy_type === StrategyType::SIMPLE) {
            Order::create([
                'post_id' => $post->id,
                'service_id' => $strategy->service_id,
                'quantity' => $strategy->quantity,
                'run_at' => now(),
                'status' => OrderStatus::CREATED->value,
            ]);
        } else {
            $avg = intdiv($strategy->qty_from + $strategy->qty_to, 2);
            $firstQty = (int)round($avg * $strategy->first_hour_pct / 100);
            $secondQty = $avg - $firstQty;

            Order::create([
                'post_id' => $post->id,
                'service_id' => $strategy->first_hour_service,
                'quantity' => $firstQty,
                'run_at' => now(),
                'status' => OrderStatus::CREATED->value,
            ]);

            Order::create([
                'post_id' => $post->id,
                'service_id' => $strategy->remainder_service,
                'quantity' => $secondQty,
                'run_at' => now()->addHours($strategy->remainder_hours),
                'status' => OrderStatus::CREATED->value,
            ]);
        }

    }
}
