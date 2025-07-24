<?php

namespace App\Observers;

use App\Enums\OrderStatus;
use App\Jobs\PollOrderStatusJob;
use App\Models\Order;
use App\Services\Api\PanelService;

readonly class OrderObserver
{
    public function __construct(
        private PanelService $panelService
    )
    {
    }

    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        $externalId = $this->panelService->placeOrder($order);
        if ($externalId) {
            $order->update([
                'status' => OrderStatus::SENT->value,
                'external_id' => $externalId,
            ]);
            PollOrderStatusJob::dispatch($order->id)->delay(now()->addMinute());
        } else {
            $order->update(['status' => OrderStatus::ERROR->value]);
        }
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->wasChanged('status') && in_array($order->status, ['DONE', 'ERROR'])) {
            $order->post->recalculateStatus();
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        //
    }
}
