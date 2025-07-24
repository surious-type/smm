<?php

namespace App\Jobs;

use App\Services\TaskService;
use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\{ShouldQueue, ShouldBeUnique};
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PollNewPostsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly int $taskId,
    )
    {
    }

    public function handle(TaskService $taskService): void
    {
        $task = Task::findOrFail($this->taskId);

        $taskService->handleNew($task);

        self::dispatch($task->id)->delay(now()->addMinute());
    }

    public function uniqueId(): string
    {
        return "poll_new_posts_for_task_$this->taskId";
    }
}
