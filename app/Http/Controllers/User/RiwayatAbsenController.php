<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Setting;

class RiwayatAbsenController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $workStartTime = Setting::get('work_start_time', '08:00:00');

        $rows = DB::select("
            SELECT
                a.user_id,
                a.date,
                MAX(CASE WHEN a.type = 'in'  THEN a.time END) AS time_in,
                MAX(CASE WHEN a.type = 'out' THEN a.time END) AS time_out
            FROM attendance a
            WHERE a.user_id = ?
            GROUP BY a.user_id, a.date
            ORDER BY a.date DESC
        ", [$user->id]);

        $records = array_map(function ($item) use ($workStartTime) {
            if (!$item->time_in) {
                $item->status = 'absent';
            } elseif ($item->time_in <= $workStartTime) {
                $item->status = 'on_time';
            } else {
                $item->status = 'late';
            }
            return $item;
        }, $rows);

        return response()->json($records);
    }
}
