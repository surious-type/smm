<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\OrderStatus; // если используешь Enum‑класс

return new class extends Migration
{
    public function up(): void
    {
        /*
         |---------------------------------------------------------------
         | orders — реальные заявки, которые очередь шлёт в SMM‑панель
         |---------------------------------------------------------------
         */
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('post_id')
                ->constrained('posts')
                ->cascadeOnDelete();

            $table->unsignedInteger('service_id');
            $table->unsignedInteger('quantity');

            $table->timestamp('run_at')->nullable();
            $table->string('external_id')->nullable();

            $table->enum('status', ['CREATED','SENT','DONE','ERROR'])
                ->default('CREATED');

            $table->timestamps();

            $table->index(['status', 'run_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
