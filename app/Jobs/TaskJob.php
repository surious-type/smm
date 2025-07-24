<?php
namespace App\Jobs;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TaskJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private int $taskId) {}

    public function handle(TaskService $taskService): void
    {
        $task = Task::findOrFail($this->taskId);

        if ($task->status === TaskStatus::CREATED) {
            $taskService->initializeTask($task);
        }
    }
}
