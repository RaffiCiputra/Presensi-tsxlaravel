<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->boolean('face_verified')
                ->default(false)
                ->after('photo_path');

            $table->float('face_score')
                ->nullable()
                ->after('face_verified');

            $table->string('location')
                ->nullable()
                ->after('face_score');
        });
    }

    public function down(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropColumn(['face_verified', 'face_score', 'location']);
        });
    }
};
