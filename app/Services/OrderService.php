<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\StrategyType;
use App\Models\Order;
use App\Models\Panel;
use App\Models\Post;
use App\Models\Task;
use App\Services\Api\PanelService;

readonly class OrderService
{
    public function __construct(
        private PanelService $panelService,
    )
    {
    }

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

    public function syncOrdersStatus()
    {
        $orders = Order::where('status', OrderStatus::SENT)
            ->with(['post.task.panel'])
            ->get();

        $ordersByPanel = $orders->groupBy(fn(Order $order) => $order->post->task->panel_id);

        foreach ($ordersByPanel as $panelId => $orders) {
            /** @var Panel $panel */
            $panel = Panel::find($panelId);

            // Получить список external_id для заказов этой панели
            $externalIds = $orders->pluck('external_id')->filter()->unique()->values();

            // Пакетная обработка (по 100, если нужно)
            foreach ($externalIds->chunk(100) as $batch) {
                // В реальном сервисе — запрос к API панели
                $statuses = $this->panelService->getOrdersStatus($panel, $batch->all());

                foreach ($orders as $order) {
                    $status = $statuses[$order->external_id] ?? null;
                    $mapped = $this->panelService->mapPanelStatus($status);
                    $order->update(['status' => $mapped]);
                }
            }
        }
    }
}
