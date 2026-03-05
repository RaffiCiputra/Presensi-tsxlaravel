<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckOutController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user  = $request->user();
            $today = now()->toDateString();

            // Validasi
            $request->validate([
                'face_verified' => 'nullable|boolean',
                'face_score'    => 'nullable|numeric',
                'photo'         => 'nullable|image|max:2048',
                'location'      => 'nullable|string|max:255',
            ]);

            if ($request->has('face_verified') && ! $request->boolean('face_verified')) {
                return response()->json([
                    'message' => 'Face verification failed.',
                ], 422);
            }

            // Sudah check-out?
            $existingOut = DB::table('attendance')
                ->where('user_id', $user->id)
                ->where('date', $today)
                ->where('type', 'out')
                ->first();

            if ($existingOut) {
                return response()->json([
                    'message' => 'You have already checked out today.',
                ], 400);
            }

            // Wajib sudah check-in
            $existingIn = DB::table('attendance')
                ->where('user_id', $user->id)
                ->where('date', $today)
                ->where('type', 'in')
                ->first();

            if (! $existingIn) {
                return response()->json([
                    'message' => 'No check-in record found for today.',
                ], 404);
            }

            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('attendance', 'public');
            }

            $attendance = Attendance::create([
                'user_id'      => $user->id,
                'type'         => 'out',
                'date'         => $today,
                'time'         => now()->toTimeString(),
                'photo_path'   => $photoPath,
                'face_verified'=> $request->boolean('face_verified', false),
                'face_score'   => $request->input('face_score'),
                'location'     => $request->input('location'),
            ]);

            return response()->json([
                'message'    => 'Checked out successfully.',
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
