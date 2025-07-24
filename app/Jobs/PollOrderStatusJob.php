<?php

namespace App\Jobs;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\Api\PanelService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class PollOrderStatusJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $orderId) {}

    /**
     * Execute the job.
     */
    public function handle(PanelService $service): void
    {
        $order = Order::findOrFail($this->orderId);

        if (!$order->external_id) return;

        $status = $service->getOrderStatus($order);

        if (in_array($status, ['Pending', 'In progress'])) {
            PollOrderStatusJob::dispatch($order->id)->delay(now()->addMinute());
        } elseif ($status === 'Completed' || $status === 'Partial') {
            $order->update(['status' => OrderStatus::DONE->value]);
        } elseif (in_array($status, ['Error', 'Canceled'])) {
            $order->update(['status' => OrderStatus::ERROR->value]);
        }

    }
}
