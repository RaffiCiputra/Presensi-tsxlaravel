<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('event_at');
            $table->integer('notify_before')->default(30);
            $table->string('staff_name')->nullable();
            $table->string('created_by')->nullable();
            $table->boolean('reminder_sent')->default(false);
            $table->timestamps();

            $table->index('event_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_events');
    }
};
