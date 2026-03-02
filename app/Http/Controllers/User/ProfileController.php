<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ProfileUpdateRequest;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $pendingRequests = $user->profileUpdateRequests()
            ->where('status', 'pending')
            ->get();

        return response()->json([
            'user' => $user,
            'pending_requests' => $pendingRequests,
        ]);
    }

    public function requestUpdate(Request $request)
    {
        $validated = $request->validate([
            'field' => 'required|in:name,address,position,bio,phone,avatar,password',
            'new_value' => 'required',
        ]);

        $user = $request->user();
        $oldValue = $user->{$validated['field']} ?? null;

        $profileRequest = ProfileUpdateRequest::create([
            'user_id' => $user->id,
            'field' => $validated['field'],
            'old_value' => $oldValue,
            'new_value' => $validated['new_value'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Update request submitted for admin approval',
            'request' => $profileRequest,
        ], 201);
    }
}
