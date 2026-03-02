<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add role column
        if (!Schema::hasColumn('users', 'role')) {
            DB::statement("ALTER TABLE users ADD COLUMN role VARCHAR(10) CHECK (role IN ('admin', 'user')) DEFAULT 'user' NOT NULL");
        }
        
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'nik')) {
                $table->string('nik')->unique()->nullable()->after('name');
            }
            if (!Schema::hasColumn('users', 'position')) {
                $table->string('position')->nullable()->after('nik');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable()->after('address');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('bio');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['nik', 'position', 'phone', 'address', 'bio', 'avatar'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
        
        if (Schema::hasColumn('users', 'role')) {
            DB::statement("ALTER TABLE users DROP COLUMN role");
        }
    }
};
