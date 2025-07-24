<?php

namespace App\Providers;

use App\Http\Resources\UserResource;
use App\Services\Api\TelegramClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TelegramClient::class, function() {
            $cfg = config('services.telegram');
            return new TelegramClient(
                $cfg['base_url'],
                $cfg['api_token']
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        UserResource::withoutWrapping();
    }
}
