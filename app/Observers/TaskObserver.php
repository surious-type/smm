<?php

namespace App\Observers;

use App\Jobs\TaskJob;
use App\Models\Task;

readonly class TaskObserver
{
    public function created(Task $task): void
    {
        TaskJob::dispatch($task->id);
    }

    public function deleted(Task $task): void
    {
        //
    }
}
