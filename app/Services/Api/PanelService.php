<?php

namespace App\Services\Api;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Panel;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PanelService
{
//    public function placeOrder(Order $order): ?string
//    {
//        $panel = $order->post->task->panel;
//
//        $params = [
//            'key'     => $panel->api_key,
//            'action'  => 'add',
//            'service' => $order->service_id,
//            'quantity'=> $order->quantity,
//            'link'    => $order->post->link,
//        ];
//
//        $response = Http::timeout(30)->post($panel->base_url, $params);
//        $data = $response->json();
//
//        if ($response->successful() && isset($data['order'])) {
//            return $data['order'];
//        }
//
//        Log::error("Panel API add order error: ".json_encode($data));
//        return null;
//    }

    public function placeOrder(Order $order): ?string
    {
        return (string)random_int(10000, 99999);
    }

//    public function getOrdersStatus(Panel $panel, array $externalIds)
//    {
//        $params = [
//            'key'    => $panel->api_key,
//            'action' => 'status',
//            'orders'  => $externalIds,
//        ];
//        $response = Http::timeout(30)->post($panel->base_url, $params);
//        $data = $response->json();
//        if ($response->successful()) {
//            return $data;
//        }
//        Log::error("Panel API get status for orders error: ".json_encode($data));
//        return null;
//    }

    public function getOrdersStatus(Panel $panel, array $externalIds): array
    {
        $possible = ['Pending', 'In progress', 'Completed', 'Partial', 'Error', 'Canceled'];
        $result = [];
        foreach ($externalIds as $id) {
            // Псевдослучайный статус
            $result[$id] = $possible[array_rand($possible)];
        }
        return $result;
    }

    public function mapPanelStatus(string $status): string
    {
        return match ($status) {
            'Completed', 'Partial' => OrderStatus::DONE->value,
            'Error', 'Canceled' => OrderStatus::ERROR->value,
            default => OrderStatus::SENT->value,
        };
    }
}
