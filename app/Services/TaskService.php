<?php

namespace App\Services;

use App\Enums\PostType;
use App\Enums\TaskStatus;
use App\Models\Task;
use App\Services\Telegram\ApiClient;

readonly class TaskService
{
    public function __construct(
        private StrategyService $strategyService,
        private ApiClient $apiClient,
        private PostService $postService,
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
        // todo вызывать из обсёрвера, чтобы не замораживать поток
        switch ($task->post_type) {
            case PostType::NEW->value:
                // todo что если постов в канале нет
                $post = $this->apiClient->mockFetchPostsLatest($task->channel_link, 1);
                $task->update(['last_message_id' => $post->id]);
                app(NewPostObserverService::class)->attach($task);
                $task->update(['status' => TaskStatus::STARTED->value]);
                break;
            case PostType::EXISTING->value:
                // todo что если постов меньше, (или запрошу отрицательное количество)
                $this->handleExisting($task);
                $task->update(['status' => TaskStatus::STARTED->value]);
                break;
            default:
                throw new \Exception("Тип задачи не определён");
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

    private function handleNew(Task $task)
    {
        $posts = $this->apiClient->mockFetchPostsSince(
            $task->channel_link,
            $task->last_message_id
        );

        foreach ($posts as $item) {
            $this->postService->create($task, $item);
        }
    }
}
