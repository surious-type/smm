<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('simple_strategies', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('service_id');
            $table->unsignedInteger('quantity');
            $table->timestamps();
        });

        Schema::create('smart_strategies', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('qty_from');
            $table->unsignedInteger('qty_to');
            $table->unsignedTinyInteger('first_hour_pct');
            $table->unsignedInteger('first_hour_service');
            $table->unsignedTinyInteger('remainder_hours');
            $table->unsignedInteger('remainder_service');
            $table->timestamps();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('channel_link');
            $table->enum('post_type', ['NEW', 'EXISTING']);

            $table->unsignedBigInteger('last_message_id')->nullable();    // для NEW
            $table->timestamp('end_at')->nullable();    // для NEW
            $table->integer('count_post')->nullable(); // для EXISTING

            $table->enum('status', ['CREATED', 'STARTED', 'DONE', 'ERROR'])->default('CREATED');

            $table->unsignedBigInteger('strategy_id');
            $table->enum('strategy_type', ['SIMPLE', 'SMART']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('smart_strategies');
        Schema::dropIfExists('simple_strategies');
    }
};
