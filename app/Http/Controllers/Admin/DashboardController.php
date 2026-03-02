<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = date('Y-m-d');
        
        return response()->json([
            'stats' => [
                'total_users' => DB::table('users')->where('role', 'user')->count(),
                'present_today' => DB::table('attendance')->where('date', $today)->where('type', 'in')->distinct('user_id')->count('user_id'),
                'total_income' => (float) DB::table('cash_flow')->where('type', 'income')->sum('amount'),
                'total_expense' => (float) DB::table('cash_flow')->where('type', 'expense')->sum('amount'),
                'balance' => (float) (DB::table('cash_flow')->where('type', 'income')->sum('amount') - DB::table('cash_flow')->where('type', 'expense')->sum('amount')),
            ],
            'recent_attendance' => [],
        ]);
    }
}
