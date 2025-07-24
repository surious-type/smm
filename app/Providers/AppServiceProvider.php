<?php

namespace App\Providers;

use App\Http\Resources\UserResource;
use App\Services\Telegram\ApiClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ApiClient::class, function() {
            $cfg = config('services.telegram');
            return new ApiClient(
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
