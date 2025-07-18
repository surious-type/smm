<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth'])->group(function () {
    Route::apiResource('users', UserController::class);
});

require __DIR__.'/auth.php';
