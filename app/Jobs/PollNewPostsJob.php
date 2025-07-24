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
        private readonly Task $task,
        private readonly TaskService $taskService,
    ) {}

    public function handle(): void {
        $this->taskService->handleNew($this->task);

        self::dispatch($this->task)
            ->delay(now()->addMinute());
    }

    public function uniqueId(): string
    {
        return "poll_new_posts_for_task_{$this->task->id}";
    }
}
