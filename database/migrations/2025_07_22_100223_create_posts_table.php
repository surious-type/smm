<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')
                ->constrained('tasks')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('message_id');
            $table->timestamp('published_at')->nullable();

            $table->unsignedInteger('total_orders')->default(0);
            $table->unsignedInteger('done_orders')->default(0);
            $table->unsignedInteger('failed_orders')->default(0);

            $table->timestamps();

            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
