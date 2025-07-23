<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Task;
use Illuminate\Support\Carbon;

readonly class PostService
{
    public function __construct(
        private OrderService $orderService,
    )
    {
    }

    public function create(Task $task, $item)
    {
        $post = Post::create([
            'task_id' => $task->id,
            'message_id' => $item['id'],
            'published_at' => Carbon::parse($item['date'] ?? now()),
        ]);

        $this->orderService->create($task, $post);
    }
}
