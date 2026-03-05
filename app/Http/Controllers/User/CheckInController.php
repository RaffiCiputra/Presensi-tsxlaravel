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
            $user  = $request->user();
            $today = now()->toDateString();

            // Cek apakah sudah check-in hari ini
            $existing = DB::table('attendance')
                ->where('user_id', $user->id)
                ->where('date', $today)
                ->where('type', 'in')
                ->first();

            if ($existing) {
                return response()->json([
                    'message' => 'You have already checked in today',
                ], 400);
            }

            // Validate input
            $request->validate([
                'photo'         => 'nullable|image|max:2048',
                'face_verified' => 'nullable|boolean',
                'face_score'    => 'nullable|numeric',
                'location'      => 'nullable|string|max:255',
            ]);

            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('attendance', 'public');
            }

            $attendance = Attendance::create([
                'user_id'      => $user->id,
                'type'         => 'in',
                'date'         => $today,
                'time'         => now()->toTimeString(),
                'photo_path'   => $photoPath,
                'face_verified'=> $request->boolean('face_verified', false),
                'face_score'   => $request->input('face_score'),
                'location'     => $request->input('location'),
            ]);

            return response()->json([
                'message'    => 'Checked in successfully',
                'attendance' => $attendance,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line'  => $e->getLine(),
            ], 500);
        }
    }
}
