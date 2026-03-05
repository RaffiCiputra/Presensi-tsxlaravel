<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\AbsensiController as AdminAbsensi;
use App\Http\Controllers\Admin\CashFlowController as AdminCashFlow;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\User\DashboardController as UserDashboard;
use App\Http\Controllers\User\CheckInController;
use App\Http\Controllers\User\CheckOutController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\CashFlowController as UserCashFlow;
use App\Http\Controllers\User\RiwayatAbsenController;
use App\Http\Controllers\User\FaceRegistrationController;

// ─── PUBLIC ───────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ─── PROTECTED ────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Events — dibaca oleh admin & user
    // ✅ FIX: Route statis (/upcoming) didaftarkan sebelum route dinamis (/{id})
    Route::get('/events', [AdminEventController::class, 'index']);
    Route::get('/events/upcoming', [AdminEventController::class, 'upcoming']);
    Route::put('/events/{id}', [AdminEventController::class, 'update']); // user: hanya reminder_sent

    // ─── ADMIN ────────────────────────────────────────────
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index']);
        Route::apiResource('users', UserManagementController::class);

        Route::get('/absensi', [AdminAbsensi::class, 'index']);
        Route::get('/absensi/export', [AdminAbsensi::class, 'export']);

        Route::get('/cash-flow', [AdminCashFlow::class, 'index']);
        Route::post('/cash-flow', [AdminCashFlow::class, 'store']);
        Route::get('/cash-flow/export', [AdminCashFlow::class, 'export']);

        // ✅ FIX: /events/stats didaftarkan PERTAMA sebelum /events/{id}
        Route::get('/events/stats', [AdminEventController::class, 'stats']);
        Route::post('/events', [AdminEventController::class, 'store']);
        Route::put('/events/{id}', [AdminEventController::class, 'update']);
        Route::delete('/events/{id}', [AdminEventController::class, 'destroy']);

        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
    });

    // ─── USER ─────────────────────────────────────────────
    Route::middleware('role:user')->prefix('user')->group(function () {
        Route::get('/dashboard', [UserDashboard::class, 'index']);

        Route::post('/check-in', [CheckInController::class, 'store']);
        Route::post('/check-out', [CheckOutController::class, 'store']);
        Route::get('/riwayat-absen', [RiwayatAbsenController::class, 'index']);

        Route::get('/profile', [ProfileController::class, 'show']);
        Route::post('/profile/request-update', [ProfileController::class, 'requestUpdate']);

        Route::get('/cash-flow', [UserCashFlow::class, 'index']);
        Route::post('/cash-flow', [UserCashFlow::class, 'store']);

        // 🔹 Face Registration endpoint untuk user
        Route::post('/face-register', [FaceRegistrationController::class, 'store']);
    });
});
