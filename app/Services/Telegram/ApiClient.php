<?php

namespace App\Services\Telegram;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;

/**
 * Клиент для работы со сторонним API Telegram-постов.
 */
readonly class ApiClient
{
    public function __construct(
        private string $baseUrl,
        private string $apiToken
    )
    {
    }

    /**
     * @throws RequestException
     * @throws ConnectionException
     */
    public function fetchPostsLatest(string $channelLink, int $count): array
    {
        $response = Http::withToken($this->apiToken)
            ->get("$this->baseUrl/posts/latest", [
                'channel_link' => $channelLink,
                'limit' => $count,
            ])
            ->throw()
            ->json();

        return $response['data'] ?? [];
    }

    /**
     * @throws RequestException
     * @throws ConnectionException
     */
    public function fetchPostsSince(string $channelLink, int $sinceMessageId): array
    {
        $response = Http::withToken($this->apiToken)
            ->get("$this->baseUrl/posts", [
                'channel_link' => $channelLink,
                'since_id' => $sinceMessageId,
            ])
            ->throw()
            ->json();

        return $response['data'] ?? [];
    }

    public function mockFetchPostsLatest(string $channelLink, int $count): array
    {
        $now = Carbon::now();
        $posts = [];
        for ($i = 0; $i < $count; $i++) {
            $posts[] = [
                'id' => 1000 + $i,
                'date' => $now->subMinutes($i)->toIso8601String(),
            ];
        }
        return $posts;
    }

    public function mockFetchPostsSince(string $channelLink, int $sinceMessageId): array
    {
        $now = Carbon::now();
        $startId = $sinceMessageId + 1;
        $count = 5;
        $posts = [];
        for ($i = 0; $i < $count; $i++) {
            $posts[] = [
                'id' => $startId + $i,
                'date' => $now->subMinutes($i)->toIso8601String(),
            ];
        }
        return $posts;
    }
}
