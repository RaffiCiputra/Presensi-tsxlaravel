<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $todayAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->get();

        $checkInToday = $todayAttendance->where('type', 'in')->first();
        $checkOutToday = $todayAttendance->where('type', 'out')->first();

        return response()->json([
            'user' => $user,
            'has_checked_in' => (bool) $checkInToday,
            'has_checked_out' => (bool) $checkOutToday,
            'check_in_time' => $checkInToday?->time,
            'check_out_time' => $checkOutToday?->time,
        ]);
    }
}
