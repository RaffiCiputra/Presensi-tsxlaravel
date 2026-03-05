<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\FaceRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FaceRegistrationController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        // Validasi: untuk sekarang kita terima image biasa
        $request->validate([
            'photo' => 'required|image|max:4096',
        ]);

        // Simpan foto ke storage sebagai referensi (opsional tapi berguna)
        $photoPath = $request->file('photo')->store('face-registration', 'public');

        // SEMENTARA: kita anggap "face_encoding" = path foto
        // Nanti bisa kamu ganti dengan encoding vector dari face-api.js / CompreFace / dst.
        $fakeEncoding = $photoPath;

        // Update atau buat baru record face_registration
        $faceRegistration = FaceRegistration::updateOrCreate(
            ['user_id' => $user->id],
            [
                'face_encoding' => $fakeEncoding,
                'registered_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Face registered successfully',
            'data'    => $faceRegistration,
        ], 201);
    }
}
