<?php

use App\Jobs\SyncOrdersStatusJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new SyncOrdersStatusJob)->everyFiveMinutes();
