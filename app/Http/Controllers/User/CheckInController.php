<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckInController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            $today = now()->toDateString();

            // Check existing check-in
            $existing = DB::table('attendance')
                ->where('user_id', $user->id)
                ->where('date', $today)
                ->where('type', 'in')
                ->first();

            if ($existing) {
                return response()->json([
                    'message' => 'You have already checked in today'
                ], 400);
            }

            // Validate photo if exists
            $request->validate([
                'photo' => 'nullable|image|max:2048'
            ]);

            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('attendance', 'public');
            }

            // Create attendance
            $attendance = Attendance::create([
                'user_id' => $user->id,
                'type' => 'in',
                'date' => $today,
                'time' => now()->toTimeString(),
                'photo_path' => $photoPath,
            ]);

            return response()->json([
                'message' => 'Checked in successfully',
                'attendance' => $attendance,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
