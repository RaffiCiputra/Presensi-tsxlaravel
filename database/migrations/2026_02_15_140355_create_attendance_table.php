<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('type', ['in', 'out']);
            $table->date('date');
            $table->time('time');
            $table->string('photo_path')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index(['user_id', 'date', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance');
    }
};
