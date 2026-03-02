<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find user
        $user = User::where('email', $request->email)->first();

        // Check user exists and password correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password. Please try again.'
            ], 401);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Return user data
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'nik' => $user->nik,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'position' => $user->position,
                'bio' => $user->bio,
                'address' => $user->address,
                'is_confirmed' => $user->is_confirmed,
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'nik' => $user->nik,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'position' => $user->position,
                'bio' => $user->bio,
                'address' => $user->address,
                'is_confirmed' => $user->is_confirmed,
                'created_at' => $user->created_at,
            ]
        ], 200);
    }
}
