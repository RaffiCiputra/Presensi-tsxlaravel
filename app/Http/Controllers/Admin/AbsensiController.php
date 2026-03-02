<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Query langsung tanpa view
            $query = "
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
            ";

            $params = [];

            if ($request->has('start_date')) {
                $query .= " WHERE a.date >= ?";
                $params[] = $request->start_date;
            }

            if ($request->has('end_date')) {
                if (count($params) > 0) {
                    $query .= " AND a.date <= ?";
                } else {
                    $query .= " WHERE a.date <= ?";
                }
                $params[] = $request->end_date;
            }

            $query .= " GROUP BY a.user_id, u.name, u.nik, u.position, a.date ORDER BY a.date DESC";

            $presensi = DB::select($query, $params);

            $workStartTime = Setting::get('work_start_time', '08:00:00');

            $presensi = array_map(function ($item) use ($workStartTime) {
                if (!$item->time_in) {
                    $item->status = 'absent';
                } elseif ($item->time_in <= $workStartTime) {
                    $item->status = 'on_time';
                } else {
                    $item->status = 'late';
                }
                return $item;
            }, $presensi);

            return response()->json($presensi);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function export()
    {
        try {
            $presensi = DB::select("
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
                ORDER BY a.date DESC
            ");

            $workStartTime = Setting::get('work_start_time', '08:00:00');

            $csv = "NIK,Name,Position,Date,Check In,Check Out,Status\n";

            foreach ($presensi as $item) {
                $status = !$item->time_in ? 'Absent' : ($item->time_in <= $workStartTime ? 'On Time' : 'Late');

                $csv .= sprintf(
                    "%s,%s,%s,%s,%s,%s,%s\n",
                    $item->nik ?? '-',
                    $item->name,
                    $item->position ?? '-',
                    $item->date,
                    $item->time_in ?? '-',
                    $item->time_out ?? '-',
                    $status
                );
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="absensi_export_'.now()->format('Y-m-d').'.csv"',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
