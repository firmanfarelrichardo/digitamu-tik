<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Guest Routes (Sisi Tamu)
Route::name('guest.')->group(function () {
    Route::get('/', [GuestController::class, 'index'])->name('index');
    Route::get('/janji-temu', [GuestController::class, 'createJanji'])->name('janji-temu.create');
    Route::post('/janji-temu', [GuestController::class, 'storeJanji'])->name('janji-temu.store');
    Route::get('/peminjaman', [GuestController::class, 'createPinjam'])->name('peminjaman.create');
    Route::post('/peminjaman', [GuestController::class, 'storePinjam'])->name('peminjaman.store');
});

// Auth Routes
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
    Route::get('/user', [AuthController::class, 'user'])->name('user')->middleware('auth');
});

// Admin Routes (Protected)
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    // User Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
});
