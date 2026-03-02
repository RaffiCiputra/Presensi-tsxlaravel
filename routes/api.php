<?php

use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\Auth\AuthController;

// Admin
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\AbsensiController as AdminAbsensi;
use App\Http\Controllers\Admin\CashFlowController as AdminCashFlow;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\SettingController;

// User
use App\Http\Controllers\User\DashboardController as UserDashboard;
use App\Http\Controllers\User\CheckInController;
use App\Http\Controllers\User\CheckOutController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\CashFlowController as UserCashFlow;
use App\Http\Controllers\User\RiwayatAbsenController;

// ============================================
// PUBLIC ROUTES
// ============================================
Route::post('/login', [AuthController::class, 'login']);

// ============================================
// PROTECTED ROUTES (Authenticated Users)
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Events - semua user bisa lihat event
    Route::get('/events', [AdminEventController::class, 'index']);
    Route::get('/events/upcoming', [AdminEventController::class, 'upcoming']);

    // User boleh update reminder_sent (dipakai CalendarReminder)
    Route::put('/events/{id}', [AdminEventController::class, 'update']);

    // ============================================
    // ADMIN ROUTES
    // ============================================
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboard::class, 'index']);

        // User Management
        Route::apiResource('users', UserManagementController::class);

        // Attendance Management
        Route::get('/absensi', [AdminAbsensi::class, 'index']);
        Route::get('/absensi/export', [AdminAbsensi::class, 'export']);

        // Cash Flow Management
        Route::get('/cash-flow', [AdminCashFlow::class, 'index']);
        Route::get('/cash-flow/export', [AdminCashFlow::class, 'export']);

        // Event/Calendar Management (dipakai admin/kalender.tsx)
        Route::post('/events', [AdminEventController::class, 'store']);
        Route::put('/events/{id}', [AdminEventController::class, 'update']);
        Route::delete('/events/{id}', [AdminEventController::class, 'destroy']);
        Route::get('/events/stats', [AdminEventController::class, 'stats']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
    });

    // ============================================
    // USER ROUTES
    // ============================================
    Route::middleware('role:user')->prefix('user')->group(function () {
        // Dashboard
        Route::get('/dashboard', [UserDashboard::class, 'index']);

        // Attendance
        Route::post('/check-in', [CheckInController::class, 'store']);
        Route::post('/check-out', [CheckOutController::class, 'store']);
        Route::get('/riwayat-absen', [RiwayatAbsenController::class, 'index']);

        // Profile
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::post('/profile/request-update', [ProfileController::class, 'requestUpdate']);

        // Cash Flow
        Route::get('/cash-flow', [UserCashFlow::class, 'index']);
        Route::post('/cash-flow', [UserCashFlow::class, 'store']);
    });
});
