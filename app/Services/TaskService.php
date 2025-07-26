<?php

namespace App\Services;

use App\Enums\PostType;
use App\Enums\TaskStatus;
use App\Jobs\PollNewPostsJob;
use App\Models\Task;
use App\Services\Api\TelegramClient;

readonly class TaskService
{
    public function __construct(
        private StrategyService $strategyService,
        private TelegramClient  $apiClient,
        private PostService     $postService,
    )
    {
    }

    public function create(array $data): Task
    {
        $strategy_type = $data['strategy_type'];
        $strategy = $data['strategy'];
        $strategy = $this->strategyService->create($strategy_type, $strategy);
        return Task::create([
            ...$data,
            'strategy_id' => $strategy->id,
            'status' => TaskStatus::CREATED->value,
        ]);
    }

    /**
     * @throws \Exception
     */
    public function initializeTask(Task $task): void
    {
        switch ($task->post_type) {
            case PostType::NEW:
                PollNewPostsJob::dispatch($task->id);
                break;

            case PostType::EXISTING:
                $this->handleExisting($task);
                $task->update(['status' => TaskStatus::STARTED->value]);
                break;

            default:
                throw new \Exception("Неподдерживаемый тип задачи");
        }
    }

    private function handleExisting(Task $task)
    {
        $posts = $this->apiClient->mockFetchPostsLatest(
            $task->channel_link,
            $task->count_post
        );

        foreach ($posts as $item) {
            $this->postService->create($task, $item);
        }
    }

    public function handleNew(Task $task)
    {
        $posts = $this->apiClient->mockFetchPostsSince(
            $task->channel_link,
            $task->last_message_id
        );

        foreach ($posts as $item) {
            $this->postService->create($task, $item);
        }

        $task->update([
            'last_message_id' => max(
                $task->last_message_id,
                $this->getMaxMessageIdForPosts($posts)
            ),
        ]);
    }

    private function getMaxMessageIdForPosts(array $posts): int
    {
        return collect($posts)->max('id');
    }

    public function getLastMessageId(Task $task)
    {
        $posts = $this->apiClient->mockFetchPostsLatest(
            $task->channel_link,
            1
        );
        if (empty($posts)) {
            PollNewPostsJob::dispatch($task->id)->delay(now()->addMinute());
        }
        return $this->getMaxMessageIdForPosts($posts);
    }
}
