<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
{
    DB::statement("DROP VIEW IF EXISTS presensi");
    DB::statement("DROP TABLE IF EXISTS presensi");

    DB::statement("
        CREATE VIEW presensi AS
        SELECT 
            a.user_id,
            u.name,
            u.nik,
            u.position,
            a.date,
            MAX(CASE WHEN a.type='in' THEN a.time END) AS time_in,
            MAX(CASE WHEN a.type='out' THEN a.time END) AS time_out
        FROM attendance a
        JOIN users u ON u.id = a.user_id       
        GROUP BY a.user_id, u.name, u.nik, u.position, a.date
        ORDER BY a.date DESC, u.name ASC
    ");
}

    public function down(): void
{
    DB::statement("DROP VIEW IF EXISTS presensi");
}
};
