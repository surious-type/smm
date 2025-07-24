<?php

namespace App\Services\Api;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PanelService
{
    public function placeOrder(Order $order): ?string
    {
        $panel = $order->post->task->panel;

        $params = [
            'key'     => $panel->api_key,
            'action'  => 'add',
            'service' => $order->service_id,
            'quantity'=> $order->quantity,
            'link'    => $order->post->link,
        ];

        $response = Http::timeout(30)->post($panel->base_url, $params);
        $data = $response->json();

        if ($response->successful() && isset($data['order'])) {
            return $data['order']; // Вернули внешний id
        }

        Log::error("Panel API add order error: ".json_encode($data));
        return null;
    }

    public function getOrderStatus(Order $order): ?string
    {
        $panel = $order->post->task->panel;

        $params = [
            'key'    => $panel->api_key,
            'action' => 'status',
            'order'  => $order->external_id,
        ];

        $response = Http::timeout(30)->post($panel->base_url, $params);
        $data = $response->json();

        if ($response->successful() && isset($data['status'])) {
            return $data['status'];
        }

        Log::error("Panel API status error: ".json_encode($data));
        return null;
    }
}

