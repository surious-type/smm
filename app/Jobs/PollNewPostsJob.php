<?php

namespace App\Jobs;

use App\Enums\TaskStatus;
use App\Services\TaskService;
use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\{ShouldQueue};
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PollNewPostsJob implements ShouldQueue
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

        if ($task->last_message_id) {
            $taskService->handleNew($task);
        } else {
            $last = $taskService->getLastMessageId($task);
            $task->update([
                'last_message_id' => $last,
                'status' => TaskStatus::STARTED->value,
            ]);
        }

        if ($task->end_at && now()->lt($task->end_at)) {
            self::dispatch($task->id)->delay(now()->addMinute());
        } else {
            $task->update(['status' => TaskStatus::DONE->value]);
        }
    }
}
