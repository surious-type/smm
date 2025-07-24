<?php

namespace App\Observers;

use App\Models\Task;
use App\Services\TaskService;

readonly class TaskObserver
{
    public function __construct(
        private TaskService $taskService,
    )
    {
    }

    public function created(Task $task): void
    {
        $this->taskService->initializeTask($task);
    }

    public function deleted(Task $task): void
    {
        //
    }
}
