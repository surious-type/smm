<?php

namespace App\Services\Observers;

use App\Models\Task;
use App\Jobs\PollNewPostsJob;

class NewPostObserverService
{
    public function attach(Task $task): void
    {
        PollNewPostsJob::dispatch($task)->delay(now()->addMinute());
    }
}
